export interface DirEntryInfo {
  name: string;
  path: string;
  is_dir: boolean;
}

export interface TreeNode {
  name: string;
  path: string;
  isDir: boolean;
  expanded: boolean;
  loaded: boolean;
  children: TreeNode[];
}

export interface OpenFile {
  path: string;
  name: string;
  language: string;
  originalContent: string;
  dirty: boolean;
}

export type PendingCreation = {
  parentPath: string;
  kind: "file" | "folder";
} | null;
