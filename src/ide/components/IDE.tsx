import { ActivityBar } from "./ActivityBar";
import { Sidebar } from "./Sidebar";
import { EditorArea } from "./EditorArea";
import { StatusBar } from "./StatusBar";

export function IDE() {
  return (
    <div className="ide-root">
      <div className="ide-body">
        <ActivityBar />
        <Sidebar />
        <EditorArea />
      </div>
      <StatusBar />
    </div>
  );
}
