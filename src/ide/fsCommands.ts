import { invoke } from "@tauri-apps/api/core";
import { open, ask } from "@tauri-apps/plugin-dialog";
import type { DirEntryInfo } from "./types";

export function listDir(path: string): Promise<DirEntryInfo[]> {
  return invoke("list_dir", { path });
}

export function readTextFile(path: string): Promise<string> {
  return invoke("read_text_file", { path });
}

export function writeTextFile(path: string, contents: string): Promise<void> {
  return invoke("write_text_file", { path, contents });
}

export function createFile(parentDir: string, name: string): Promise<string> {
  return invoke("create_file", { parentDir, name });
}

export function createDir(parentDir: string, name: string): Promise<string> {
  return invoke("create_dir", { parentDir, name });
}

export function renamePath(path: string, newName: string): Promise<string> {
  return invoke("rename_path", { path, newName });
}

export function deletePath(path: string): Promise<void> {
  return invoke("delete_path", { path });
}

export async function pickFolder(): Promise<string | null> {
  const result = await open({ directory: true, multiple: false });
  if (!result) return null;
  return Array.isArray(result) ? result[0] ?? null : result;
}

export function confirmDelete(name: string, isDir: boolean): Promise<boolean> {
  return ask(`Are you sure you want to delete "${name}"? This cannot be undone.`, {
    title: `Delete ${isDir ? "Folder" : "File"}`,
    kind: "warning",
  });
}

export function confirmDiscardChanges(name: string): Promise<boolean> {
  return ask(`"${name}" has unsaved changes. Discard them?`, {
    title: "Unsaved Changes",
    kind: "warning",
  });
}

export function basename(path: string): string {
  const parts = path.split(/[/\\]/).filter(Boolean);
  return parts.length ? parts[parts.length - 1] : path;
}
