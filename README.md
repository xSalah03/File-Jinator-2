# File Janitor 🧹

**File Janitor** is a premium, AI-powered desktop utility designed to organize cluttered directories with surgical precision. Built with Electron and React, it uses Google Gemini to intelligently categorize files beyond simple extension matching, providing a clean and structured workspace in seconds.

## ✨ Features

- **AI-Powered Categorization**: Utilizes **Google Gemini 1.5 Flash** to analyze filenames and intelligently determine the best folder destination.
- **Dry Run Capabilities**: Preview all file movements and AI classifications before any changes are made to your filesystem.
- **Cross-Platform Support**: Native installers available for both **Windows (.exe)** and **macOS (.dmg)**.
- **Premium UI/UX**: A modern, dark-themed interface built with Tailwind CSS, featuring smooth micro-animations and responsive layouts.
- **Safety First**: Intelligent filename conflict resolution (timestamps) ensures no data is ever overwritten.
- **Industrial Layout**: Standardized `src/main`, `src/renderer`, and `src/preload` architecture for maximum stability.

## 💾 Download

Download the latest pre-built installers for Windows and macOS from the **[GitHub Releases](https://github.com/xSalah03/File-Jinator-2/releases)** page.

## 🛠️ Tech Stack

- **Framework**: [Electron](https://www.electronjs.org/)
- **Frontend**: [React 18](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [electron-vite](https://evite.netlify.app/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **AI Engine**: [Google Generative AI (Gemini)](https://ai.google.dev/)

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+ recommended)
- [npm](https://www.npmjs.com/)

### Installation & Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/xSalah03/File-Jinator-2.git
    cd File-Jinator-2
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **API Configuration**:
    Create a `.env.local` file in the root and add your Gemini API key:
    ```env
    GEMINI_API_KEY=your_api_key_here
    ```

### Development & Build

```bash
# Start development mode
npm run dev

# Build for production
npm run build

# Release to GitHub (Automated via Actions)
git tag v1.0.x
git push origin v1.0.x
```

## 🏗️ Project Structure

```text
├── src/
│   ├── main/             # Electron main process & Gemini Service
│   ├── preload/          # Secure IPC Bridge
│   ├── renderer/         # React application & UI
│   └── shared/           # Cross-process types & constants
├── .github/workflows/    # Automated Release CI/CD
├── electron.vite.config.ts # Build configuration
└── package.json          # Dependency manifest
```

---
*Organize your digital life with the power of AI.*
