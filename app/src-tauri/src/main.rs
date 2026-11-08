// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;

use commands::{read_document_file, write_document_file, get_recovery_dir, get_system_info};

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            read_document_file,
            write_document_file,
            get_recovery_dir,
            get_system_info
        ])
        .run(tauri::generate_context!())
        .expect("error while running Wordo application");
}
