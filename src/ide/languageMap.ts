const EXTENSION_TO_LANGUAGE: Record<string, string> = {
  ts: "typescript",
  tsx: "typescript",
  js: "javascript",
  jsx: "javascript",
  mjs: "javascript",
  cjs: "javascript",
  json: "json",
  html: "html",
  htm: "html",
  css: "css",
  scss: "scss",
  less: "less",
  md: "markdown",
  markdown: "markdown",
  py: "python",
  rs: "rust",
  go: "go",
  java: "java",
  kt: "kotlin",
  c: "c",
  h: "c",
  cpp: "cpp",
  cc: "cpp",
  hpp: "cpp",
  cs: "csharp",
  php: "php",
  rb: "ruby",
  sh: "shell",
  bash: "shell",
  zsh: "shell",
  ps1: "powershell",
  sql: "sql",
  yaml: "yaml",
  yml: "yaml",
  toml: "ini",
  ini: "ini",
  xml: "xml",
  svg: "xml",
  vue: "html",
  swift: "swift",
  dockerfile: "dockerfile",
  txt: "plaintext",
};

const FILENAME_TO_LANGUAGE: Record<string, string> = {
  dockerfile: "dockerfile",
  makefile: "shell",
  ".gitignore": "plaintext",
  ".env": "plaintext",
};

export function languageForPath(path: string): string {
  const name = path.split(/[/\\]/).pop() ?? path;
  const lower = name.toLowerCase();
  if (FILENAME_TO_LANGUAGE[lower]) return FILENAME_TO_LANGUAGE[lower];

  const dotIndex = lower.lastIndexOf(".");
  if (dotIndex === -1 || dotIndex === 0) return "plaintext";
  const ext = lower.slice(dotIndex + 1);
  return EXTENSION_TO_LANGUAGE[ext] ?? "plaintext";
}
