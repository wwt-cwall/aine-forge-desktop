import { Files, FolderOpen } from "lucide-react";
import { useWorkspace } from "../context/WorkspaceProvider";

export function ActivityBar() {
  const { openFolder } = useWorkspace();

  return (
    <div className="activity-bar">
      <button type="button" className="activity-icon active" title="Explorer">
        <Files size={22} />
      </button>
      <button type="button" className="activity-icon" title="Open Folder" onClick={() => void openFolder()}>
        <FolderOpen size={22} />
      </button>
    </div>
  );
}
