# Aine Forge Desktop

A desktop application built with Tauri, React, and TypeScript.

## Prerequisites

Before building this application, you need to install the following:

### Required Software

1. **Node.js** (version 18.x or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version`

2. **npm** (version 9.x or higher)
   - Comes with Node.js
   - Verify installation: `npm --version`

3. **Rust** (version 1.70 or higher)
   - Install from [rustup.rs](https://rustup.rs/)
   - Verify installation: `rustc --version`

### Platform-Specific Dependencies

#### Linux (Debian/Ubuntu)

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

#### macOS

```bash
xcode-select --install
```

#### Windows

- Install [Microsoft Visual Studio C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
- Install [WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) (usually pre-installed on Windows 11)

## Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/wwt-cwall/aine-forge-desktop.git
   cd aine-forge-desktop
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Run the application in development mode:

```bash
npm run tauri dev
```

This will:
- Build the Rust backend
- Start the Vite dev server
- Launch the desktop application with hot-reload enabled

### Building a Release Bundle

To build a production-ready release bundle:

```bash
npm run tauri build
```

This command will:
1. Build the frontend with optimizations
2. Compile the Rust backend in release mode
3. Create platform-specific installers

The built installers will be located in:
```
src-tauri/target/release/bundle/
```

Platform-specific outputs:
- **Windows**: `.msi` and `.exe` installers
- **macOS**: `.dmg` disk image and `.app` bundle
- **Linux**: `.deb`, `.AppImage`, and other formats

## Available Commands

```bash
npm run dev          # Start Vite dev server (frontend only)
npm run build        # Build frontend for production
npm run preview      # Preview production build
npm run tauri dev    # Run Tauri app in development mode
npm run tauri build  # Build production desktop app
```

## Project Structure

```
aine-forge-desktop/
├── src/                    # React frontend source code
├── src-tauri/             # Rust backend and Tauri configuration
│   ├── src/               # Rust source code
│   ├── Cargo.toml         # Rust dependencies
│   └── tauri.conf.json    # Tauri configuration
├── public/                # Static assets
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Node dependencies and scripts
```

## Technology Stack

- **Frontend**: React 19, TypeScript, Vite
- **Backend**: Rust, Tauri v2
- **Editor**: Monaco Editor
- **Icons**: Lucide React

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed development guidelines, code standards, and contribution workflow.

## Support

For questions, issues, or contributions, please reach out:

- **GitHub**: [@wwt-cwall](https://github.com/wwt-cwall)
- **Repository**: [aine-forge-desktop](https://github.com/wwt-cwall/aine-forge-desktop)
- **Issues**: [Report an issue](https://github.com/wwt-cwall/aine-forge-desktop/issues)

## Resources

- [Tauri Documentation](https://tauri.app/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Rust Documentation](https://www.rust-lang.org/learn)
