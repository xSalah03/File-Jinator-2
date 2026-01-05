# File Janitor 🧹

**File Janitor** is a premium, desktop-grade utility designed to organize cluttered directories with surgical precision. Built with Electron and React, it categorizes files into logical subfolders based on their extensions, providing a clean and structured workspace in seconds.

## ✨ Features

- **Standard-Compliant Architecture**: Organized using the industry-standard `src/main`, `src/renderer`, and `src/preload` layout.
- **Dry Run Capabilities**: Preview all file movements before any changes are made to your filesystem.
- **Premium UI/UX**: Built with Tailwind CSS, featuring modern gradients, micro-animations, and a responsive viewport-aware layout.
- **Safety First**: Implements safety checks to prevent overwriting existing files by appending timestamps to duplicates.
- **Internal Scrolling**: Large directories are easily manageable with a dedicated, scrollable organization queue.
- **AI Ready**: Foundation laid for content-aware organization using the Google Gemini API.

## 🛠️ Tech Stack

- **Framework**: [Electron](https://www.electronjs.org/)
- **Frontend**: [React 18](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [electron-vite](https://evite.netlify.app/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **API**: [Google Generative AI](https://ai.google.dev/) (Ready for future integration)

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- [npm](https://www.npmjs.com/)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone [your-repo-url]
    cd File-Jinator
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment**:
    Rename `.env.example` (or create a new one) to `.env.local` and add your API key:
    ```env
    GEMINI_API_KEY=your_actual_api_key_here
    ```

### Running the App

```bash
# Start development mode
npm run dev

# Build for production
npm run build

# Package for distribution
npm run pack
```

## 🏗️ Project Structure

```text
├── src/
│   ├── main/             # Electron main process logic
│   ├── preload/          # Secure IPC bridge
│   ├── renderer/         # React application and UI components
│   └── shared/           # Shared types and constants
├── out/                  # Build artifacts
├── electron.vite.config.ts # Core build configuration
└── package.json          # Main manifest
```

## 📄 License

This project is open-source and available under the MIT License.
