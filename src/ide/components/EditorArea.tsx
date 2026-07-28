import { useWorkspace } from "../context/WorkspaceProvider";
import { EditorTabs } from "./EditorTabs";
import { MonacoEditor } from "./MonacoEditor";
import { WelcomeScreen } from "./WelcomeScreen";

export function EditorArea() {
  const { rootPath, openFiles, activePath, handleContentChange, saveFile } = useWorkspace();
  const activeFile = openFiles.find((f) => f.path === activePath);

  return (
    <div className="editor-area">
      <EditorTabs />
      {activeFile ? (
        <MonacoEditor
          path={activeFile.path}
          content={activeFile.originalContent}
          language={activeFile.language}
          onChange={handleContentChange}
          onSave={() => void saveFile(activeFile.path)}
        />
      ) : (
        <WelcomeScreen hasFolder={!!rootPath} />
      )}
    </div>
  );
}
