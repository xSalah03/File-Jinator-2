
import { FileMove, ElectronAPI } from '../../shared/types';
import { EXTENSION_MAP } from '../../shared/constants';

/**
 * This service simulates the Electron IPC for the browser demo.
 * In a real Electron app, this would be replaced by the preload.ts bridge.
 */
export const mockElectron: ElectronAPI = {
  selectFolder: async () => {
    // Simulate folder selection
    return '/Users/demo/Downloads/MessyFolder';
  },
  scanDirectory: async (dirPath: string) => {
    // Simulate random files
    const mockFiles = [
      'invoice_2023.pdf',
      'vacation_photo.jpg',
      'project_notes.txt',
      'backup_final.zip',
      'script_v1.ts',
      'logo_v2.png',
      'budget_spreadsheet.xlsx',
      'meeting_recording.mp4',
      'favicon.ico',
      'index.html',
      'style.css',
      'temp_data.csv'
    ];

    return mockFiles.map(fileName => {
      const ext = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
      let category = 'Others';

      for (const [cat, extensions] of Object.entries(EXTENSION_MAP)) {
        if (extensions.includes(ext)) {
          category = cat;
          break;
        }
      }

      return {
        fileName,
        sourcePath: `${dirPath}/${fileName}`,
        destinationFolder: category,
        fullDestinationPath: `${dirPath}/${category}/${fileName}`,
        extension: ext
      };
    });
  },
  executeCleanup: async (moves: FileMove[]) => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    return true;
  }
};
