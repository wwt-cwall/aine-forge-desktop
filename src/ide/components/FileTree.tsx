import { useState, type MouseEvent } from "react";
import { ChevronRight, ChevronDown, File as FileIcon, Folder, FolderOpen } from "lucide-react";
import type { TreeNode } from "../types";
import { useWorkspace } from "../context/WorkspaceProvider";
import { ContextMenu, type ContextMenuItem } from "./ContextMenu";
import { InlineInput } from "./InlineInput";

interface FileTreeProps {
  node: TreeNode;
  depth: number;
}

export function FileTree({ node, depth }: FileTreeProps) {
  const {
    activePath,
    pendingCreation,
    renamingPath,
    toggleExpand,
    openFile,
    startCreate,
    cancelCreate,
    submitCreate,
    startRename,
    cancelRename,
    submitRename,
    removeEntry,
  } = useWorkspace();
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);

  const isActive = node.path === activePath;
  const isRenaming = node.path === renamingPath;
  const showCreationInput = node.isDir && pendingCreation?.parentPath === node.path;

  function handleClick() {
    if (node.isDir) void toggleExpand(node);
    else void openFile(node.path, node.name);
  }

  function handleContextMenu(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setMenu({ x: e.clientX, y: e.clientY });
  }

  const menuItems: ContextMenuItem[] = node.isDir
    ? [
        { label: "New File", onClick: () => startCreate(node.path, "file") },
        { label: "New Folder", onClick: () => startCreate(node.path, "folder") },
        { label: "Rename", onClick: () => startRename(node.path), separatorBefore: true },
        {
          label: "Delete",
          onClick: () => void removeEntry(node.path, true, node.name),
          danger: true,
        },
      ]
    : [
        { label: "Rename", onClick: () => startRename(node.path) },
        {
          label: "Delete",
          onClick: () => void removeEntry(node.path, false, node.name),
          danger: true,
        },
      ];

  return (
    <div>
      <div
        className={`tree-row${isActive ? " active" : ""}`}
        style={{ paddingLeft: 8 + depth * 14 }}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
        {node.isDir ? (
          <>
            <span className="tree-chevron">
              {node.expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </span>
            {node.expanded ? <FolderOpen size={16} className="tree-icon" /> : <Folder size={16} className="tree-icon" />}
          </>
        ) : (
          <>
            <span className="tree-chevron" />
            <FileIcon size={16} className="tree-icon" />
          </>
        )}
        {isRenaming ? (
          <InlineInput
            initialValue={node.name}
            onSubmit={(value) => void submitRename(node.path, node.isDir, value)}
            onCancel={cancelRename}
          />
        ) : (
          <span className="tree-label">{node.name}</span>
        )}
      </div>

      {node.isDir && node.expanded && (
        <div>
          {showCreationInput && (
            <div className="tree-row" style={{ paddingLeft: 8 + (depth + 1) * 14 }}>
              <span className="tree-chevron" />
              {pendingCreation?.kind === "file" ? (
                <FileIcon size={16} className="tree-icon" />
              ) : (
                <Folder size={16} className="tree-icon" />
              )}
              <InlineInput onSubmit={(value) => void submitCreate(value)} onCancel={cancelCreate} />
            </div>
          )}
          {node.children.map((child) => (
            <FileTree key={child.path} node={child} depth={depth + 1} />
          ))}
        </div>
      )}

      {menu && (
        <ContextMenu x={menu.x} y={menu.y} items={menuItems} onClose={() => setMenu(null)} />
      )}
    </div>
  );
}
