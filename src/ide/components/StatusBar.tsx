import { useWorkspace } from "../context/WorkspaceProvider";

export function StatusBar() {
  const { rootPath, openFiles, activePath } = useWorkspace();
  const activeFile = openFiles.find((f) => f.path === activePath);

  return (
    <div className="status-bar">
      <span>{rootPath ?? "No folder opened"}</span>
      <span>{activeFile ? activeFile.language : ""}</span>
    </div>
  );
}
