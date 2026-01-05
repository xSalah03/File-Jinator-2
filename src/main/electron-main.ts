
import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as fs from 'fs/promises';
import * as path from 'path';
// Fix: Import process from node:process to resolve typing issues for platform property
import process from 'node:process';
// Fix: Import fileURLToPath to enable __dirname definition in ESM
import { fileURLToPath } from 'url';
import { FileMove } from '../shared/types';
import { EXTENSION_MAP } from '../shared/constants';

// Fix: Define __dirname for ESM compatibility as it is not available by default
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { GeminiService } from './services/gemini';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: path.join(app.getAppPath(), '.env.local') });

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1100,
    height: 800,
    minWidth: 900,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, '../preload/electron-preload.mjs'),
      sandbox: false,
      contextIsolation: true
    },
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#0f172a',
    title: 'File Janitor',
    icon: path.resolve(__dirname, '../../resources/icon.png')
  });

  // Set Dock icon for macOS
  if (process.platform === 'darwin') {
    app.dock.setIcon(path.resolve(__dirname, '../../resources/icon.png'));
  }

  // HMR for development or load static file for production
  if (process.env.ELECTRON_RENDERER_URL) {
    const rendererUrl = process.env.ELECTRON_RENDERER_URL.endsWith('/')
      ? process.env.ELECTRON_RENDERER_URL
      : process.env.ELECTRON_RENDERER_URL + '/';
    console.log('Loading renderer from URL:', rendererUrl);
    mainWindow.loadURL(rendererUrl);
  } else {
    const indexPath = path.join(__dirname, '../renderer/index.html');
    console.log('Loading renderer from file:', indexPath);
    mainWindow.loadFile(indexPath);
  }
}

const handleSelectFolder = async () => {
  console.log('Main process: Handling select-folder request...');
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory', 'createDirectory']
  });
  console.log('Main process: Dialog result:', result.canceled ? 'Canceled' : result.filePaths[0]);
  return result.canceled ? null : result.filePaths[0];
};

const handleScanDirectory = async (_event: any, dirPath: string): Promise<FileMove[]> => {
  const files = await fs.readdir(dirPath, { withFileTypes: true });
  const pendingMoves: FileMove[] = [];
  const fileNames = files.filter(f => f.isFile() && !f.name.startsWith('.')).map(f => f.name);

  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  let aiClassifications: Record<string, string> = {};

  if (apiKey && fileNames.length > 0) {
    console.log('Attempting AI classification for', fileNames.length, 'files...');
    const gemini = new GeminiService(apiKey);
    aiClassifications = await gemini.classifyFiles(fileNames);
    console.log('AI classifications received:', aiClassifications);
  }

  for (const file of files) {
    if (file.isFile() && !file.name.startsWith('.')) {
      const ext = path.extname(file.name).toLowerCase();
      let category = aiClassifications[file.name] || 'Others';

      // Fallback to extension map if AI failed or returned Others
      if (category === 'Others') {
        for (const [cat, exts] of Object.entries(EXTENSION_MAP)) {
          if (exts.includes(ext)) {
            category = cat;
            break;
          }
        }
      }

      pendingMoves.push({
        fileName: file.name,
        sourcePath: path.join(dirPath, file.name),
        destinationFolder: category,
        fullDestinationPath: path.join(dirPath, category, file.name),
        extension: ext
      });
    }
  }

  return pendingMoves;
};

const handleExecuteCleanup = async (_event: any, moves: FileMove[]) => {
  for (const move of moves) {
    const destDir = path.dirname(move.fullDestinationPath);

    // Ensure category folder exists
    await fs.mkdir(destDir, { recursive: true });

    let finalPath = move.fullDestinationPath;

    // Safety check: Avoid overwriting
    try {
      await fs.access(finalPath);
      // If we reach here, file exists - append timestamp
      const ext = path.extname(move.fileName);
      const name = path.basename(move.fileName, ext);
      finalPath = path.join(destDir, `${name}_${Date.now()}${ext}`);
    } catch {
      // File does not exist, safe to move
    }

    try {
      await fs.rename(move.sourcePath, finalPath);
    } catch (err) {
      console.error(`Failed to move ${move.fileName}:`, err);
    }
  }
  return true;
};

app.whenReady().then(() => {
  ipcMain.handle('select-folder', handleSelectFolder);
  ipcMain.handle('scan-directory', handleScanDirectory);
  ipcMain.handle('execute-cleanup', handleExecuteCleanup);

  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
