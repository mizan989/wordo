// Native Tauri 2 command implementations for Wordo
use std::collections::HashSet;
use std::fs;
use std::path::{Component, Path, PathBuf};
use std::sync::Mutex;
use serde::{Serialize, Deserialize};
use tauri::Manager;

#[cfg(target_os = "linux")]
use gtk::prelude::*;

#[cfg(not(target_os = "linux"))]
use tauri_plugin_dialog::DialogExt;

#[derive(Serialize, Deserialize)]
pub struct PlatformInfo {
    pub os: String,
    pub arch: String,
    pub app_version: String,
}

#[derive(Serialize, Deserialize)]
#[allow(dead_code)]
pub struct FilePayload {
    pub name: String,
    pub path: String,
    pub size: u64,
    pub content_base64: String,
}

/// Helper function to reliably normalize a path resolving '..' and '.'
pub fn normalize_path(path: &Path) -> Result<PathBuf, String> {
    // If the path itself exists (or is a symlink), inspect symlink metadata first
    if let Ok(meta) = fs::symlink_metadata(path) {
        if meta.file_type().is_symlink() {
            // Dangling or invalid symlinks must NOT be treated as non-existent regular files.
            // Canonicalization must succeed, resolving to the real target.
            return fs::canonicalize(path)
                .map_err(|e| format!("Cannot resolve symlink {}: {}", path.display(), e));
        }
    }

    if path.exists() {
        return fs::canonicalize(path).map_err(|e| format!("Failed to canonicalize path: {}", e));
    }

    // Resolve lexical '.' and '..' components
    let mut lexical = PathBuf::new();
    for component in path.components() {
        match component {
            Component::ParentDir => {
                lexical.pop();
            }
            Component::CurDir => {}
            _ => lexical.push(component),
        }
    }

    if let Ok(meta) = fs::symlink_metadata(&lexical) {
        if meta.file_type().is_symlink() {
            return fs::canonicalize(&lexical)
                .map_err(|e| format!("Cannot resolve symlink {}: {}", lexical.display(), e));
        }
    }

    if lexical.exists() {
        return fs::canonicalize(&lexical).map_err(|e| format!("Failed to canonicalize path: {}", e));
    }

    // For a path that doesn't exist yet, walk up until the nearest existing ancestor is found
    let mut ancestors = Vec::new();
    let mut current = lexical.as_path();
    while !current.exists() {
        // If an intermediate component exists as a broken symlink, abort
        if let Ok(meta) = fs::symlink_metadata(current) {
            if meta.file_type().is_symlink() {
                return Err(format!("Path contains broken symlink component: {}", current.display()));
            }
        }
        if let Some(file_name) = current.file_name() {
            ancestors.push(file_name);
        }
        match current.parent() {
            Some(parent) => current = parent,
            None => break,
        }
    }

    if current.exists() {
        let mut canon = fs::canonicalize(current)
            .map_err(|e| format!("Failed to canonicalize parent: {}", e))?;
        for part in ancestors.into_iter().rev() {
            canon.push(part);
        }
        Ok(canon)
    } else {
        Ok(lexical)
    }
}

/// Thread-safe security state maintaining explicitly authorized filesystem paths
pub struct SecurityState {
    pub authorized_paths: Mutex<HashSet<PathBuf>>,
    pub auth_file_path: PathBuf,
    pub recovery_dir: PathBuf,
}

impl SecurityState {
    pub fn new(app_data_dir: PathBuf) -> Self {
        let recovery_dir = app_data_dir.join("recovery");
        let auth_file_path = app_data_dir.join("authorized_paths.json");
        let mut set = HashSet::new();

        if let Ok(canon_rec) = normalize_path(&recovery_dir) {
            set.insert(canon_rec);
        } else {
            set.insert(recovery_dir.clone());
        }

        if auth_file_path.exists() {
            if let Ok(content) = fs::read_to_string(&auth_file_path) {
                if let Ok(paths) = serde_json::from_str::<Vec<PathBuf>>(&content) {
                    for p in paths {
                        if let Ok(canon) = normalize_path(&p) {
                            set.insert(canon);
                        } else {
                            set.insert(p);
                        }
                    }
                }
            }
        }

        Self {
            authorized_paths: Mutex::new(set),
            auth_file_path,
            recovery_dir,
        }
    }

    pub fn authorize(&self, path: &Path) -> Result<PathBuf, String> {
        let norm = normalize_path(path)?;
        let mut guard = self.authorized_paths.lock().map_err(|e| e.to_string())?;
        guard.insert(norm.clone());

        if let Some(parent) = self.auth_file_path.parent() {
            if !parent.exists() {
                let _ = fs::create_dir_all(parent);
            }
        }
        let list: Vec<PathBuf> = guard.iter().cloned().collect();
        if let Ok(json) = serde_json::to_string(&list) {
            let _ = fs::write(&self.auth_file_path, json);
            #[cfg(unix)]
            {
                use std::os::unix::fs::PermissionsExt;
                let _ = fs::set_permissions(&self.auth_file_path, fs::Permissions::from_mode(0o600));
            }
        }

        Ok(norm)
    }

    pub fn validate_path(&self, path: &Path) -> Result<PathBuf, String> {
        let norm = normalize_path(path)?;

        if let Ok(canon_rec) = normalize_path(&self.recovery_dir) {
            if norm.starts_with(&canon_rec) {
                return Ok(norm);
            }
        }

        let guard = self.authorized_paths.lock().map_err(|e| e.to_string())?;
        if guard.contains(&norm) {
            Ok(norm)
        } else {
            Err(format!("Access denied: path is not authorized: {}", path.display()))
        }
    }

    #[allow(dead_code)]
    pub fn is_authorized(&self, path: &Path) -> bool {
        self.validate_path(path).is_ok()
    }
}

/// Secure command to read file from disk (authorized paths only)
#[tauri::command]
pub fn read_document_file(state: tauri::State<'_, SecurityState>, path: String) -> Result<Vec<u8>, String> {
    let path_buf = PathBuf::from(&path);
    let norm = state.validate_path(&path_buf)?;
    if !norm.exists() {
        return Err(format!("File does not exist: {}", path));
    }
    // Verify target itself is not a symlink that bypassed canonicalization
    if let Ok(meta) = fs::symlink_metadata(&norm) {
        if meta.file_type().is_symlink() {
            return Err(format!("Access denied: target path is a symlink: {}", norm.display()));
        }
    }
    fs::read(&norm).map_err(|e| format!("Failed to read file: {}", e))
}

/// Secure command to write file to disk (authorized paths only)
#[tauri::command]
pub fn write_document_file(
    state: tauri::State<'_, SecurityState>,
    path: String,
    data: Vec<u8>,
) -> Result<(), String> {
    let path_buf = PathBuf::from(&path);
    let norm = state.validate_path(&path_buf)?;

    // Verify target itself is not a symlink that bypassed canonicalization
    if let Ok(meta) = fs::symlink_metadata(&norm) {
        if meta.file_type().is_symlink() {
            return Err(format!("Access denied: target path is a symlink: {}", norm.display()));
        }
    }

    if let Some(parent) = norm.parent() {
        if !parent.exists() {
            if let Ok(meta) = fs::symlink_metadata(parent) {
                if meta.file_type().is_symlink() {
                    return Err(format!("Access denied: parent directory is a symlink: {}", parent.display()));
                }
            }
            fs::create_dir_all(parent).map_err(|e| format!("Failed to create directories: {}", e))?;
        }
    }
    fs::write(&norm, data).map_err(|e| format!("Failed to write file: {}", e))
}

/// Platform-appropriate application recovery directory
#[tauri::command]
pub fn get_recovery_dir() -> Result<String, String> {
    let data_dir = dirs::data_dir()
        .ok_or_else(|| "Could not determine standard data directory".to_string())?
        .join("WordClient")
        .join("recovery");

    if !data_dir.exists() {
        fs::create_dir_all(&data_dir).map_err(|e| format!("Failed to create recovery dir: {}", e))?;
        #[cfg(unix)]
        {
            use std::os::unix::fs::PermissionsExt;
            let _ = fs::set_permissions(&data_dir, fs::Permissions::from_mode(0o700));
        }
    }

    Ok(data_dir.to_string_lossy().to_string())
}

/// Get native host platform information
#[tauri::command]
pub fn get_system_info() -> PlatformInfo {
    PlatformInfo {
        os: std::env::consts::OS.to_string(),
        arch: std::env::consts::ARCH.to_string(),
        app_version: env!("CARGO_PKG_VERSION").to_string(),
    }
}

/// Native file picker dialog with fully working window controls and transient parent hierarchy
#[tauri::command]
pub async fn pick_file_dialog(
    window: tauri::WebviewWindow,
    state: tauri::State<'_, SecurityState>,
    title: Option<String>,
    accept_types: Option<String>,
) -> Result<Option<String>, String> {
    #[cfg(target_os = "linux")]
    let selected_path: Option<String> = {
        let (tx, rx) = std::sync::mpsc::channel();
        let app = window.app_handle().clone();
        let win = window.clone();

        app.run_on_main_thread(move || {
            let parent = win.gtk_window().ok();
            let dialog_title = title.as_deref().unwrap_or("Open Document");

            let dialog = gtk::FileChooserDialog::with_buttons(
                Some(dialog_title),
                parent.as_ref().map(|w| w.upcast_ref::<gtk::Window>()),
                gtk::FileChooserAction::Open,
                &[
                    ("Cancel", gtk::ResponseType::Cancel),
                    ("Open", gtk::ResponseType::Accept),
                ],
            );

            dialog.set_modal(true);

            // Add filter based on accept_types (e.g., ".docx,.txt,.html")
            if let Some(types) = &accept_types {
                let extensions: Vec<&str> = types
                    .split(',')
                    .map(|s| s.trim().trim_start_matches('.'))
                    .filter(|s| !s.is_empty())
                    .collect();

                if !extensions.is_empty() {
                    let doc_filter = gtk::FileFilter::new();
                    doc_filter.set_name(Some(&format!("Supported Documents ({})", types)));
                    for ext in &extensions {
                        doc_filter.add_pattern(&format!("*.{}", ext));
                        doc_filter.add_pattern(&format!("*.{}", ext.to_uppercase()));
                    }
                    dialog.add_filter(doc_filter);
                }
            }

            let all_filter = gtk::FileFilter::new();
            all_filter.set_name(Some("All Files (*)"));
            all_filter.add_pattern("*");
            dialog.add_filter(all_filter);

            let response = dialog.run();
            let path = if response == gtk::ResponseType::Accept {
                dialog.filename().map(|p| p.to_string_lossy().to_string())
            } else {
                None
            };

            dialog.close();
            unsafe { dialog.destroy() };
            let _ = tx.send(path);
        })
        .map_err(|e| format!("Failed to run file chooser on main thread: {}", e))?;

        rx.recv().map_err(|e| format!("Failed to receive file chooser result: {}", e))?
    };

    #[cfg(not(target_os = "linux"))]
    let selected_path: Option<String> = {
        let mut builder = window.dialog().file();
        if let Some(t) = title {
            builder = builder.set_title(t);
        }
        if let Some(types) = accept_types {
            let exts: Vec<&str> = types
                .split(',')
                .map(|s| s.trim().trim_start_matches('.'))
                .filter(|s| !s.is_empty())
                .collect();
            builder = builder.add_filter("Documents", &exts);
        }
        let file = builder.blocking_pick_file();
        file.and_then(|f| f.into_path().ok()).map(|p| p.to_string_lossy().to_string())
    };

    if let Some(ref p) = selected_path {
        let _ = state.authorize(&PathBuf::from(p));
    }

    Ok(selected_path)
}

/// Native save file dialog with fully working window controls and transient parent hierarchy
#[tauri::command]
pub async fn save_file_dialog(
    window: tauri::WebviewWindow,
    state: tauri::State<'_, SecurityState>,
    title: Option<String>,
    default_path: Option<String>,
    filter_extension: Option<String>,
) -> Result<Option<String>, String> {
    #[cfg(target_os = "linux")]
    let selected_path: Option<String> = {
        let (tx, rx) = std::sync::mpsc::channel();
        let app = window.app_handle().clone();
        let win = window.clone();

        app.run_on_main_thread(move || {
            let parent = win.gtk_window().ok();
            let dialog_title = title.as_deref().unwrap_or("Save Document");

            let dialog = gtk::FileChooserDialog::with_buttons(
                Some(dialog_title),
                parent.as_ref().map(|w| w.upcast_ref::<gtk::Window>()),
                gtk::FileChooserAction::Save,
                &[
                    ("Cancel", gtk::ResponseType::Cancel),
                    ("Save", gtk::ResponseType::Accept),
                ],
            );

            dialog.set_modal(true);
            dialog.set_do_overwrite_confirmation(true);

            if let Some(ref path_str) = default_path {
                let p = std::path::Path::new(path_str);
                if let Some(parent_dir) = p.parent() {
                    if parent_dir.exists() && parent_dir.is_dir() {
                        dialog.set_current_folder(parent_dir);
                    }
                }
                if let Some(file_name) = p.file_name() {
                    dialog.set_current_name(&file_name.to_string_lossy());
                } else {
                    dialog.set_current_name(path_str);
                }
            }

            if let Some(ref ext) = filter_extension {
                let ext_clean = ext.trim().trim_start_matches('.');
                let filter = gtk::FileFilter::new();
                filter.set_name(Some(&format!("{0} Document (*.{0})", ext_clean.to_uppercase())));
                filter.add_pattern(&format!("*.{}", ext_clean));
                filter.add_pattern(&format!("*.{}", ext_clean.to_uppercase()));
                dialog.add_filter(filter);
            }

            let all_filter = gtk::FileFilter::new();
            all_filter.set_name(Some("All Files (*)"));
            all_filter.add_pattern("*");
            dialog.add_filter(all_filter);

            let response = dialog.run();
            let path = if response == gtk::ResponseType::Accept {
                dialog.filename().map(|p| p.to_string_lossy().to_string())
            } else {
                None
            };

            dialog.close();
            unsafe { dialog.destroy() };
            let _ = tx.send(path);
        })
        .map_err(|e| format!("Failed to run save dialog on main thread: {}", e))?;

        rx.recv().map_err(|e| format!("Failed to receive save dialog result: {}", e))?
    };

    #[cfg(not(target_os = "linux"))]
    let selected_path: Option<String> = {
        let mut builder = window.dialog().file();
        if let Some(t) = title {
            builder = builder.set_title(t);
        }
        if let Some(default) = default_path {
            builder = builder.set_file_name(default);
        }
        if let Some(ext) = filter_extension {
            let clean = ext.trim().trim_start_matches('.');
            builder = builder.add_filter("Document", &[clean]);
        }
        let file = builder.blocking_save_file();
        file.and_then(|f| f.into_path().ok()).map(|p| p.to_string_lossy().to_string())
    };

    if let Some(ref p) = selected_path {
        let _ = state.authorize(&PathBuf::from(p));
    }

    Ok(selected_path)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_path_normalization_and_security() {
        let temp_dir = std::env::temp_dir().join(format!(
            "wordo_audit_test_{}",
            std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_nanos()
        ));
        fs::create_dir_all(&temp_dir).unwrap();

        let state = SecurityState::new(temp_dir.clone());

        // 1. Path traversal attempting to escape
        let traversal = temp_dir.join("subdir/../../../../../../etc/passwd");
        assert!(!state.is_authorized(&traversal));

        // 2. Unauthorised file
        let unauthorized = temp_dir.join("secret.docx");
        assert!(!state.is_authorized(&unauthorized));

        // 3. Explicitly authorised file
        let legal_doc = temp_dir.join("document.docx");
        fs::write(&legal_doc, b"test docx data").unwrap();
        assert!(state.authorize(&legal_doc).is_ok());
        assert!(state.is_authorized(&legal_doc));

        // 4. Recovery directory paths
        let rec_file = state.recovery_dir.join("draft_123.json");
        assert!(state.is_authorized(&rec_file));

        // 5. New Save As path that does not exist yet
        let new_save_path = temp_dir.join("newly_created_folder/NewDocument.docx");
        assert!(state.authorize(&new_save_path).is_ok());
        assert!(state.is_authorized(&new_save_path));

        // 6. Dangling symlink test (cannot be read or written to bypass authorization)
        #[cfg(unix)]
        {
            use std::os::unix::fs::symlink;
            let unauth_target = temp_dir.join("unauth_target.txt");
            let dangling_link = temp_dir.join("dangling.docx");
            symlink(&unauth_target, &dangling_link).unwrap();

            // Dangling symlink cannot be normalized or authorized
            assert!(normalize_path(&dangling_link).is_err());
            assert!(!state.is_authorized(&dangling_link));

            // Broken symlink in ancestor directory
            let broken_dir_link = temp_dir.join("broken_dir");
            symlink(temp_dir.join("nonexistent_sub"), &broken_dir_link).unwrap();
            let broken_child = broken_dir_link.join("child.docx");
            assert!(normalize_path(&broken_child).is_err());
        }

        // 7. Symlink swapping TOCTOU attack test
        #[cfg(unix)]
        {
            use std::os::unix::fs::symlink;
            let legitimate_file = temp_dir.join("legit.docx");
            fs::write(&legitimate_file, b"legit content").unwrap();
            assert!(state.authorize(&legitimate_file).is_ok());
            assert!(state.is_authorized(&legitimate_file));

            // Secret sensitive file
            let sensitive_file = temp_dir.join("sensitive_secret.txt");
            fs::write(&sensitive_file, b"TOP_SECRET").unwrap();

            // Attacker swaps legit.docx with symlink to sensitive_file
            fs::remove_file(&legitimate_file).unwrap();
            symlink(&sensitive_file, &legitimate_file).unwrap();

            // When checked now, canonicalize resolves to sensitive_file which is NOT authorized!
            assert!(!state.is_authorized(&legitimate_file));
            assert!(state.validate_path(&legitimate_file).is_err());
        }

        let _ = fs::remove_dir_all(&temp_dir);
    }
}
