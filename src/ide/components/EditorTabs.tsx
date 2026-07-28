import { X } from "lucide-react";
import { useWorkspace } from "../context/WorkspaceProvider";

export function EditorTabs() {
  const { openFiles, activePath, setActivePath, closeFile } = useWorkspace();

  if (!openFiles.length) return <div className="editor-tabs" />;

  return (
    <div className="editor-tabs">
      {openFiles.map((file) => (
        <div
          key={file.path}
          className={`editor-tab${file.path === activePath ? " active" : ""}${file.dirty ? " dirty" : ""}`}
          onClick={() => setActivePath(file.path)}
          title={file.path}
        >
          <span className="editor-tab-name">{file.name}</span>
          <span className="editor-tab-dot" />
          <button
            type="button"
            className="editor-tab-close"
            onClick={(e) => {
              e.stopPropagation();
              void closeFile(file.path);
            }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
