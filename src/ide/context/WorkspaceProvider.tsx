import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { OpenFile, PendingCreation, TreeNode } from "../types";
import { languageForPath } from "../languageMap";
import {
  basename,
  confirmDelete,
  confirmDiscardChanges,
  createDir,
  createFile,
  deletePath,
  listDir,
  pickFolder,
  readTextFile,
  renamePath,
  writeTextFile,
} from "../fsCommands";
import { disposeModel, getModelValue, renameModel } from "../components/MonacoEditor";

function mapTree(
  node: TreeNode,
  targetPath: string,
  updater: (node: TreeNode) => TreeNode,
): TreeNode {
  if (node.path === targetPath) return updater(node);
  if (!node.children.length) return node;
  return { ...node, children: node.children.map((child) => mapTree(child, targetPath, updater)) };
}

function isWithin(path: string, dirPath: string): boolean {
  return path === dirPath || path.startsWith(dirPath + "/") || path.startsWith(dirPath + "\\");
}

interface WorkspaceState {
  rootPath: string | null;
  tree: TreeNode | null;
  openFiles: OpenFile[];
  activePath: string | null;
  pendingCreation: PendingCreation;
  renamingPath: string | null;
  openFolder: () => Promise<void>;
  toggleExpand: (node: TreeNode) => Promise<void>;
  openFile: (path: string, name: string) => Promise<void>;
  closeFile: (path: string) => Promise<void>;
  setActivePath: (path: string) => void;
  handleContentChange: (path: string, value: string) => void;
  saveFile: (path: string) => Promise<void>;
  startCreate: (parentPath: string, kind: "file" | "folder") => void;
  cancelCreate: () => void;
  submitCreate: (name: string) => Promise<void>;
  startRename: (path: string) => void;
  cancelRename: () => void;
  submitRename: (path: string, isDir: boolean, newName: string) => Promise<void>;
  removeEntry: (path: string, isDir: boolean, name: string) => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceState | null>(null);

export function useWorkspace(): WorkspaceState {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used within WorkspaceProvider");
  return ctx;
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [rootPath, setRootPath] = useState<string | null>(null);
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([]);
  const [activePath, setActivePathState] = useState<string | null>(null);
  const [pendingCreation, setPendingCreation] = useState<PendingCreation>(null);
  const [renamingPath, setRenamingPath] = useState<string | null>(null);

  const refreshDir = useCallback(async (path: string) => {
    const entries = await listDir(path);
    setTree((prev) =>
      prev
        ? mapTree(prev, path, (node) => {
            const children = entries.map((e) => {
              const existing = node.children.find((c) => c.path === e.path);
              if (existing) return { ...existing, name: e.name, isDir: e.is_dir };
              return {
                name: e.name,
                path: e.path,
                isDir: e.is_dir,
                expanded: false,
                loaded: false,
                children: [],
              };
            });
            return { ...node, children, loaded: true, expanded: true };
          })
        : prev,
    );
  }, []);

  const openFolder = useCallback(async () => {
    const folder = await pickFolder();
    if (!folder) return;
    setRootPath(folder);
    setOpenFiles([]);
    setActivePathState(null);
    setTree({
      name: basename(folder),
      path: folder,
      isDir: true,
      expanded: true,
      loaded: false,
      children: [],
    });
    const entries = await listDir(folder);
    setTree({
      name: basename(folder),
      path: folder,
      isDir: true,
      expanded: true,
      loaded: true,
      children: entries.map((e) => ({
        name: e.name,
        path: e.path,
        isDir: e.is_dir,
        expanded: false,
        loaded: false,
        children: [],
      })),
    });
  }, []);

  const toggleExpand = useCallback(
    async (node: TreeNode) => {
      if (!node.isDir) return;
      if (!node.loaded) {
        await refreshDir(node.path);
        return;
      }
      setTree((prev) =>
        prev ? mapTree(prev, node.path, (n) => ({ ...n, expanded: !n.expanded })) : prev,
      );
    },
    [refreshDir],
  );

  const openFile = useCallback(async (path: string, name: string) => {
    setActivePathState(path);
    const alreadyOpen = openFiles.some((f) => f.path === path);
    if (alreadyOpen) return;
    const content = await readTextFile(path);
    setOpenFiles((prev) => {
      if (prev.some((f) => f.path === path)) return prev;
      return [
        ...prev,
        {
          path,
          name,
          language: languageForPath(path),
          originalContent: content,
          dirty: false,
        },
      ];
    });
  }, [openFiles]);

  const closeFile = useCallback(
    async (path: string) => {
      const file = openFiles.find((f) => f.path === path);
      if (!file) return;
      if (file.dirty) {
        const discard = await confirmDiscardChanges(file.name);
        if (!discard) return;
      }
      disposeModel(path);
      setOpenFiles((prev) => {
        const idx = prev.findIndex((f) => f.path === path);
        const next = prev.filter((f) => f.path !== path);
        if (activePath === path) {
          const fallback = next[idx] ?? next[idx - 1] ?? next[next.length - 1];
          setActivePathState(fallback ? fallback.path : null);
        }
        return next;
      });
    },
    [openFiles, activePath],
  );

  const setActivePath = useCallback((path: string) => {
    setActivePathState(path);
  }, []);

  const handleContentChange = useCallback((path: string, value: string) => {
    setOpenFiles((prev) => {
      const idx = prev.findIndex((f) => f.path === path);
      if (idx === -1) return prev;
      const isDirty = value !== prev[idx].originalContent;
      if (isDirty === prev[idx].dirty) return prev;
      const next = [...prev];
      next[idx] = { ...next[idx], dirty: isDirty };
      return next;
    });
  }, []);

  const saveFile = useCallback(async (path: string) => {
    const content = getModelValue(path);
    if (content === undefined) return;
    await writeTextFile(path, content);
    setOpenFiles((prev) => {
      const idx = prev.findIndex((f) => f.path === path);
      if (idx === -1) return prev;
      const next = [...prev];
      next[idx] = { ...next[idx], originalContent: content, dirty: false };
      return next;
    });
  }, []);

  const startCreate = useCallback((parentPath: string, kind: "file" | "folder") => {
    setPendingCreation({ parentPath, kind });
  }, []);

  const cancelCreate = useCallback(() => setPendingCreation(null), []);

  const submitCreate = useCallback(
    async (name: string) => {
      if (!pendingCreation || !name.trim()) {
        setPendingCreation(null);
        return;
      }
      const { parentPath, kind } = pendingCreation;
      setPendingCreation(null);
      try {
        const newPath =
          kind === "file" ? await createFile(parentPath, name) : await createDir(parentPath, name);
        await refreshDir(parentPath);
        if (kind === "file") {
          await openFile(newPath, name);
        }
      } catch (err) {
        console.error(err);
      }
    },
    [pendingCreation, refreshDir, openFile],
  );

  const startRename = useCallback((path: string) => setRenamingPath(path), []);
  const cancelRename = useCallback(() => setRenamingPath(null), []);

  const submitRename = useCallback(
    async (path: string, isDir: boolean, newName: string) => {
      setRenamingPath(null);
      if (!newName.trim() || newName === basename(path)) return;
      const parentPath = path.slice(0, path.length - basename(path).length - 1) || rootPath || "";
      try {
        const newPath = await renamePath(path, newName);
        if (!isDir) {
          const existingOpenFile = openFiles.find((f) => f.path === path);
          if (existingOpenFile) {
            renameModel(path, newPath, languageForPath(newPath));
            setOpenFiles((prev) =>
              prev.map((f) => (f.path === path ? { ...f, path: newPath, name: newName } : f)),
            );
            if (activePath === path) setActivePathState(newPath);
          }
        } else {
          setOpenFiles((prev) =>
            prev.map((f) =>
              isWithin(f.path, path)
                ? { ...f, path: newPath + f.path.slice(path.length) }
                : f,
            ),
          );
          if (activePath && isWithin(activePath, path)) {
            setActivePathState(newPath + activePath.slice(path.length));
          }
        }
        await refreshDir(parentPath);
      } catch (err) {
        console.error(err);
      }
    },
    [openFiles, activePath, rootPath, refreshDir],
  );

  const removeEntry = useCallback(
    async (path: string, isDir: boolean, name: string) => {
      const confirmed = await confirmDelete(name, isDir);
      if (!confirmed) return;
      const parentPath = path.slice(0, path.length - name.length - 1) || rootPath || "";
      try {
        await deletePath(path);
        const affected = openFiles.filter((f) => (isDir ? isWithin(f.path, path) : f.path === path));
        affected.forEach((f) => disposeModel(f.path));
        if (affected.length) {
          setOpenFiles((prev) => prev.filter((f) => !affected.some((a) => a.path === f.path)));
          if (activePath && affected.some((a) => a.path === activePath)) {
            const remaining = openFiles.filter((f) => !affected.some((a) => a.path === f.path));
            setActivePathState(remaining.length ? remaining[0].path : null);
          }
        }
        await refreshDir(parentPath);
      } catch (err) {
        console.error(err);
      }
    },
    [openFiles, activePath, rootPath, refreshDir],
  );

  const value = useMemo<WorkspaceState>(
    () => ({
      rootPath,
      tree,
      openFiles,
      activePath,
      pendingCreation,
      renamingPath,
      openFolder,
      toggleExpand,
      openFile,
      closeFile,
      setActivePath,
      handleContentChange,
      saveFile,
      startCreate,
      cancelCreate,
      submitCreate,
      startRename,
      cancelRename,
      submitRename,
      removeEntry,
    }),
    [
      rootPath,
      tree,
      openFiles,
      activePath,
      pendingCreation,
      renamingPath,
      openFolder,
      toggleExpand,
      openFile,
      closeFile,
      setActivePath,
      handleContentChange,
      saveFile,
      startCreate,
      cancelCreate,
      submitCreate,
      startRename,
      cancelRename,
      submitRename,
      removeEntry,
    ],
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}
