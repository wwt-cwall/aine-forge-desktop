import { FolderOpen } from "lucide-react";
import { useWorkspace } from "../context/WorkspaceProvider";

export function WelcomeScreen({ hasFolder }: { hasFolder: boolean }) {
  const { openFolder } = useWorkspace();

  return (
    <div className="welcome-screen">
      <h1>Aine Forge</h1>
      {hasFolder ? (
        <p>Select a file from the explorer to start editing.</p>
      ) : (
        <>
          <p>Open a folder to get started.</p>
          <button type="button" className="welcome-button" onClick={() => void openFolder()}>
            <FolderOpen size={16} />
            Open Folder
          </button>
        </>
      )}
    </div>
  );
}
