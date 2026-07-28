mod fs_commands;

use fs_commands::{create_dir, create_file, delete_path, list_dir, read_text_file, rename_path, write_text_file};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            list_dir,
            read_text_file,
            write_text_file,
            create_file,
            create_dir,
            rename_path,
            delete_path
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
