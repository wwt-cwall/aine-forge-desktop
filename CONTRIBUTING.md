# Contributing to Aine Forge Desktop

Thank you for your interest in contributing to Aine Forge Desktop! This document provides guidelines for contributing to this Tauri/React/TypeScript desktop application.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Building and Testing](#building-and-testing)
- [Submitting Changes](#submitting-changes)
- [Project Structure](#project-structure)

## Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Rust** 1.70 or higher (for Tauri backend)
- **System dependencies** for Tauri (varies by OS)

#### Platform-Specific Setup

**Linux:**
```bash
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev \
  build-essential \
  curl \
  wget \
  file \
  libxdo-dev \
  libssl-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev
```

**macOS:**
```bash
xcode-select --install
```

**Windows:**
- Install [Microsoft Visual Studio C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
- Install [WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)

### Installation

1. Fork and clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/aine-forge-desktop.git
   cd aine-forge-desktop
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run tauri dev
   ```

   This will:
   - Build the Rust backend
   - Start the Vite dev server
   - Launch the desktop application

### Available Commands

```bash
npm run dev          # Start Vite dev server (frontend only)
npm run build        # Build frontend for production
npm run preview      # Preview production build
npm run tauri dev    # Run Tauri app in development mode
npm run tauri build  # Build production desktop app
```

## Development Workflow

### Before You Start

1. Check existing issues or create a new one to discuss your proposed changes
2. Familiarize yourself with both the React frontend and Tauri backend
3. Review the project structure below

### Making Changes

1. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following our [code standards](#code-standards)

3. Test your changes:
   ```bash
   npm run tauri dev    # Test in development mode
   npm run build        # Verify frontend builds
   ```

4. Commit your changes with clear, descriptive messages:
   ```bash
   git commit -m "Add feature: description of what you added"
   ```

## Code Standards

### TypeScript (Frontend)

- **Strict mode**: TypeScript strict checks are enabled
- **Type safety**: Avoid `any` types; use proper type definitions
- **Interfaces**: Define props interfaces for all components
- **React 19**: Use modern React patterns and hooks

### React Components

- Use **functional components** with hooks
- Name component files in **PascalCase** (e.g., `Editor.tsx`)
- Keep components focused and single-purpose
- Use TypeScript for all component props

Example component:
```tsx
import { useState } from 'react'

interface EditorProps {
  initialContent?: string
  onSave?: (content: string) => void
}

function Editor({ initialContent = '', onSave }: EditorProps) {
  const [content, setContent] = useState(initialContent)
  
  return (
    <div className="editor">
      {/* Component content */}
    </div>
  )
}

export default Editor
```

### Rust (Backend)

- Follow **Rust standard conventions**
- Use `cargo fmt` to format code
- Use `cargo clippy` for linting
- Handle errors properly (avoid unwrap in production code)
- Document public APIs with doc comments

Example Tauri command:
```rust
#[tauri::command]
fn greet(name: &str) -> Result<String, String> {
    Ok(format!("Hello, {}!", name))
}
```

### Tauri Integration

- Use **Tauri APIs** for system interactions (file system, dialogs, etc.)
- Keep frontend/backend communication through commands
- Handle errors gracefully on both sides
- Use Tauri plugins when available

Example frontend Tauri call:
```typescript
import { invoke } from '@tauri-apps/api/core'

async function greetUser(name: string): Promise<string> {
  try {
    return await invoke<string>('greet', { name })
  } catch (error) {
    console.error('Failed to greet:', error)
    throw error
  }
}
```

## Building and Testing

### Development Testing

```bash
npm run tauri dev
```

This runs the app in development mode with:
- Hot module replacement for frontend changes
- Automatic Rust recompilation on backend changes
- DevTools available for debugging

### Production Build

```bash
npm run tauri build
```

This creates platform-specific installers in `src-tauri/target/release/bundle/`:
- **Windows**: `.msi` and `.exe` installers
- **macOS**: `.dmg` and `.app` bundle
- **Linux**: `.deb`, `.AppImage`, and other formats

### Frontend-Only Testing

```bash
npm run dev          # Start Vite dev server
npm run build        # Build frontend
npm run preview      # Preview production build
```

### Backend Testing

```bash
cd src-tauri
cargo test           # Run Rust tests
cargo clippy         # Run linter
cargo fmt            # Format code
```

## Submitting Changes

### Pull Request Process

1. **Test thoroughly**: 
   - Run `npm run tauri dev` and test all functionality
   - Build for production with `npm run tauri build`
   - Test on your target platform(s)

2. **Update documentation**: If you add features, update relevant docs

3. **Push your branch**: Push to your fork on GitHub

4. **Open a pull request**:
   - Use a clear, descriptive title
   - Reference any related issues
   - Describe what changed and why
   - Note which platforms you tested on
   - Include screenshots for UI changes

### Pull Request Checklist

- [ ] Code follows project conventions
- [ ] Frontend builds successfully (`npm run build`)
- [ ] Tauri app runs in dev mode (`npm run tauri dev`)
- [ ] Tauri app builds for production (`npm run tauri build`)
- [ ] Rust code formatted (`cargo fmt`)
- [ ] Rust code passes clippy (`cargo clippy`)
- [ ] Documentation updated if needed
- [ ] Commit messages are clear and descriptive
- [ ] Tested on relevant platform(s)

### Platform Testing

Ideally, test on:
- **Windows** 10/11
- **macOS** 12+ (Monterey or later)
- **Linux** (Ubuntu 22.04+ or equivalent)

If you can't test on all platforms, note which you tested in your PR description.

## Project Structure

This is a **Tauri v2** desktop application with:
- **React 19** frontend with TypeScript
- **Vite** for fast development and building
- **Rust** backend for native functionality
- **Monaco Editor** for code editing
- **Lucide React** for icons

### Directory Structure

```
aine-forge-desktop/
├── src/                    # React frontend
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # Entry point
│   └── ide/               # IDE-specific components
├── src-tauri/             # Rust backend
│   ├── src/               # Rust source code
│   │   └── lib.rs         # Main Rust library
│   ├── Cargo.toml         # Rust dependencies
│   ├── tauri.conf.json    # Tauri configuration
│   └── icons/             # App icons
├── public/                # Static assets
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Node dependencies
```

### Key Technologies

- **Frontend**: React 19, TypeScript, Vite, Monaco Editor
- **Backend**: Rust, Tauri v2
- **Plugins**: 
  - `@tauri-apps/plugin-dialog` - Native dialogs
  - `@tauri-apps/plugin-opener` - Open URLs/files

## Getting Help

- **Tauri Docs**: [https://tauri.app/](https://tauri.app/)
- **Issues**: Browse or create [GitHub issues](https://github.com/wwt-cwall/aine-forge-desktop/issues)
- **Discussions**: Use GitHub Discussions for questions
- **Discord**: Join the [Tauri Discord](https://discord.com/invite/tauri) for community help

## Common Tasks

### Adding a New Tauri Command

1. Define the command in `src-tauri/src/lib.rs`:
   ```rust
   #[tauri::command]
   fn my_command(arg: String) -> Result<String, String> {
       Ok(format!("Received: {}", arg))
   }
   ```

2. Register it in the builder:
   ```rust
   tauri::Builder::default()
       .invoke_handler(tauri::generate_handler![my_command])
       .run(tauri::generate_context!())
   ```

3. Call it from the frontend:
   ```typescript
   import { invoke } from '@tauri-apps/api/core'
   
   const result = await invoke<string>('my_command', { arg: 'value' })
   ```

### Adding a New Tauri Plugin

1. Add to `src-tauri/Cargo.toml`:
   ```toml
   [dependencies]
   tauri-plugin-name = "2"
   ```

2. Add to frontend `package.json`:
   ```json
   {
     "dependencies": {
       "@tauri-apps/plugin-name": "^2"
     }
   }
   ```

3. Register in `src-tauri/src/lib.rs`:
   ```rust
   tauri::Builder::default()
       .plugin(tauri_plugin_name::init())
   ```

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the project
- Show empathy towards other contributors

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to Aine Forge Desktop! 🚀
