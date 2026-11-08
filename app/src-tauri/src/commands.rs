// Native Tauri 2 command implementations for Wordo
use std::fs;
use std::path::PathBuf;
use serde::{Serialize, Deserialize};

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

/// Secure command to read file from disk
#[tauri::command]
pub fn read_document_file(path: String) -> Result<Vec<u8>, String> {
    let path_buf = PathBuf::from(&path);
    if !path_buf.exists() {
        return Err(format!("File does not exist: {}", path));
    }
    fs::read(&path_buf).map_err(|e| format!("Failed to read file: {}", e))
}

/// Secure command to write file to disk
#[tauri::command]
pub fn write_document_file(path: String, data: Vec<u8>) -> Result<(), String> {
    let path_buf = PathBuf::from(&path);
    if let Some(parent) = path_buf.parent() {
        if !parent.exists() {
            fs::create_dir_all(parent).map_err(|e| format!("Failed to create directories: {}", e))?;
        }
    }
    fs::write(&path_buf, data).map_err(|e| format!("Failed to write file: {}", e))
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
