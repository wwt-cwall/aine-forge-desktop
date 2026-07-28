import { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";
import "../monacoSetup";

monaco.editor.defineTheme("vscode-dark-plus", {
  base: "vs-dark",
  inherit: true,
  rules: [],
  colors: {
    "editor.background": "#1e1e1e",
  },
});

interface ModelEntry {
  model: monaco.editor.ITextModel;
}

const models = new Map<string, ModelEntry>();

function getOrCreateModel(path: string, content: string, language: string) {
  let entry = models.get(path);
  if (!entry) {
    const uri = monaco.Uri.file(path);
    const model = monaco.editor.createModel(content, language, uri);
    entry = { model };
    models.set(path, entry);
  }
  return entry.model;
}

export function disposeModel(path: string) {
  const entry = models.get(path);
  if (entry) {
    entry.model.dispose();
    models.delete(path);
  }
}

export function renameModel(oldPath: string, newPath: string, language: string) {
  const entry = models.get(oldPath);
  if (!entry) return;
  const content = entry.model.getValue();
  entry.model.dispose();
  models.delete(oldPath);
  const uri = monaco.Uri.file(newPath);
  const model = monaco.editor.createModel(content, language, uri);
  models.set(newPath, { model });
}

export function getModelValue(path: string): string | undefined {
  return models.get(path)?.model.getValue();
}

interface MonacoEditorProps {
  path: string;
  content: string;
  language: string;
  onChange: (path: string, value: string) => void;
  onSave: () => void;
}

export function MonacoEditor({ path, content, language, onChange, onSave }: MonacoEditorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const onChangeRef = useRef(onChange);
  const onSaveRef = useRef(onSave);
  onChangeRef.current = onChange;
  onSaveRef.current = onSave;

  useEffect(() => {
    if (!containerRef.current) return;
    const editor = monaco.editor.create(containerRef.current, {
      theme: "vscode-dark-plus",
      automaticLayout: true,
      fontSize: 13,
      minimap: { enabled: true },
    });
    editorRef.current = editor;

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      onSaveRef.current();
    });

    return () => {
      editor.dispose();
      editorRef.current = null;
    };
  }, []);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const model = getOrCreateModel(path, content, language);
    if (editor.getModel() !== model) {
      editor.setModel(model);
    }
    const disposable = model.onDidChangeContent(() => {
      onChangeRef.current(path, model.getValue());
    });
    return () => disposable.dispose();
  }, [path, content, language]);

  return <div ref={containerRef} className="monaco-container" />;
}
