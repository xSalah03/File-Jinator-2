import { app, ipcMain, BrowserWindow, dialog } from "electron";
import * as fs from "fs/promises";
import * as path from "path";
import process from "node:process";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import __cjs_url__ from "node:url";
import __cjs_path__ from "node:path";
import __cjs_mod__ from "node:module";
const __filename = __cjs_url__.fileURLToPath(import.meta.url);
const __dirname = __cjs_path__.dirname(__filename);
const require2 = __cjs_mod__.createRequire(import.meta.url);
const EXTENSION_MAP = {
  "Documents": [".pdf", ".docx", ".doc", ".txt", ".xlsx", ".pptx", ".csv", ".rtf", ".odt"],
  "Images": [".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp", ".bmp", ".tiff", ".raw"],
  "Videos": [".mp4", ".mov", ".avi", ".mkv", ".wmv", ".flv"],
  "Audio": [".mp3", ".wav", ".flac", ".m4a", ".aac", ".ogg"],
  "Archives": [".zip", ".rar", ".7z", ".tar", ".gz"],
  "Code": [".js", ".ts", ".tsx", ".py", ".html", ".css", ".json", ".sh", ".cpp", ".java"],
  "Design": [".psd", ".ai", ".fig", ".sketch", ".xd"],
  "Others": []
  // Fallback category
};
class GeminiService {
  genAI;
  model;
  constructor(apiKey) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }
  async classifyFiles(fileNames) {
    const categories = Object.keys(EXTENSION_MAP).filter((cat) => cat !== "Others");
    const prompt = `
      You are a file organization assistant. Categorize the following list of file names into one of these categories: ${categories.join(", ")}.
      If a file doesn't fit into any, use 'Others'.
      Return ONLY a JSON object where keys are file names and values are the categories.
      
      Files to categorize:
      ${fileNames.join("\n")}
    `;
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      text = text.replace(/```json|```/g, "").trim();
      return JSON.parse(text);
    } catch (error) {
      console.error("Gemini classification failed:", error);
      return {};
    }
  }
}
const __filename$1 = fileURLToPath(import.meta.url);
const __dirname$1 = path.dirname(__filename$1);
dotenv.config({ path: path.join(app.getAppPath(), ".env.local") });
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1100,
    height: 800,
    minWidth: 900,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname$1, "../preload/electron-preload.mjs"),
      sandbox: false,
      contextIsolation: true
    },
    titleBarStyle: "hiddenInset",
    backgroundColor: "#0f172a",
    title: "File Janitor"
  });
  if (process.env.ELECTRON_RENDERER_URL) {
    const rendererUrl = process.env.ELECTRON_RENDERER_URL.endsWith("/") ? process.env.ELECTRON_RENDERER_URL : process.env.ELECTRON_RENDERER_URL + "/";
    console.log("Loading renderer from URL:", rendererUrl);
    mainWindow.loadURL(rendererUrl);
  } else {
    const indexPath = path.join(__dirname$1, "../renderer/index.html");
    console.log("Loading renderer from file:", indexPath);
    mainWindow.loadFile(indexPath);
  }
}
const handleSelectFolder = async () => {
  console.log("Main process: Handling select-folder request...");
  const result = await dialog.showOpenDialog({
    properties: ["openDirectory", "createDirectory"]
  });
  console.log("Main process: Dialog result:", result.canceled ? "Canceled" : result.filePaths[0]);
  return result.canceled ? null : result.filePaths[0];
};
const handleScanDirectory = async (_event, dirPath) => {
  const files = await fs.readdir(dirPath, { withFileTypes: true });
  const pendingMoves = [];
  const fileNames = files.filter((f) => f.isFile() && !f.name.startsWith(".")).map((f) => f.name);
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  let aiClassifications = {};
  if (apiKey && fileNames.length > 0) {
    console.log("Attempting AI classification for", fileNames.length, "files...");
    const gemini = new GeminiService(apiKey);
    aiClassifications = await gemini.classifyFiles(fileNames);
    console.log("AI classifications received:", aiClassifications);
  }
  for (const file of files) {
    if (file.isFile() && !file.name.startsWith(".")) {
      const ext = path.extname(file.name).toLowerCase();
      let category = aiClassifications[file.name] || "Others";
      if (category === "Others") {
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
const handleExecuteCleanup = async (_event, moves) => {
  for (const move of moves) {
    const destDir = path.dirname(move.fullDestinationPath);
    await fs.mkdir(destDir, { recursive: true });
    let finalPath = move.fullDestinationPath;
    try {
      await fs.access(finalPath);
      const ext = path.extname(move.fileName);
      const name = path.basename(move.fileName, ext);
      finalPath = path.join(destDir, `${name}_${Date.now()}${ext}`);
    } catch {
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
  ipcMain.handle("select-folder", handleSelectFolder);
  ipcMain.handle("scan-directory", handleScanDirectory);
  ipcMain.handle("execute-cleanup", handleExecuteCleanup);
  createWindow();
  app.on("activate", function() {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on("window-all-closed", function() {
  if (process.platform !== "darwin") app.quit();
});
