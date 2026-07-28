import { WorkspaceProvider } from "./ide/context/WorkspaceProvider";
import { IDE } from "./ide/components/IDE";
import "./ide/ide.css";

function App() {
  return (
    <WorkspaceProvider>
      <IDE />
    </WorkspaceProvider>
  );
}

export default App;
