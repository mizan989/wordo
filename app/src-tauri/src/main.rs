// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;

use commands::{
    get_recovery_dir, get_system_info, pick_file_dialog, read_document_file, save_file_dialog,
    write_document_file,
};
use tauri::Emitter;

#[tauri::command]
fn close_window(window: tauri::Window) {
    let _ = window.destroy();
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                api.prevent_close();
                let _ = window.emit("request-close", ());
            }
        })
        .invoke_handler(tauri::generate_handler![
            read_document_file,
            write_document_file,
            get_recovery_dir,
            get_system_info,
            pick_file_dialog,
            save_file_dialog,
            close_window,
        ])
        .run(tauri::generate_context!())
        .expect("error while running Wordo application");
}
