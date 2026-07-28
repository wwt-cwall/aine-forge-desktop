import { FilePlus, FolderPlus, RefreshCw } from "lucide-react";
import { useWorkspace } from "../context/WorkspaceProvider";
import { FileTree } from "./FileTree";
import { InlineInput } from "./InlineInput";

export function Sidebar() {
  const { rootPath, tree, pendingCreation, startCreate, cancelCreate, submitCreate, toggleExpand } =
    useWorkspace();

  if (!rootPath || !tree) {
    return (
      <div className="sidebar">
        <div className="sidebar-empty">No folder opened</div>
      </div>
    );
  }

  const showRootCreationInput = pendingCreation?.parentPath === rootPath;

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-title">{tree.name.toUpperCase()}</span>
        <div className="sidebar-actions">
          <button
            type="button"
            title="New File"
            className="icon-button"
            onClick={() => startCreate(rootPath, "file")}
          >
            <FilePlus size={15} />
          </button>
          <button
            type="button"
            title="New Folder"
            className="icon-button"
            onClick={() => startCreate(rootPath, "folder")}
          >
            <FolderPlus size={15} />
          </button>
          <button
            type="button"
            title="Refresh"
            className="icon-button"
            onClick={() => void toggleExpand({ ...tree, loaded: false })}
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>
      <div className="sidebar-tree">
        {showRootCreationInput && (
          <div className="tree-row" style={{ paddingLeft: 8 }}>
            <span className="tree-chevron" />
            <InlineInput onSubmit={(value) => void submitCreate(value)} onCancel={cancelCreate} />
          </div>
        )}
        <FileTree node={tree} depth={0} />
      </div>
    </div>
  );
}
