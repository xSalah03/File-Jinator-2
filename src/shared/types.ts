
export interface FileMove {
  fileName: string;
  sourcePath: string;
  destinationFolder: string;
  fullDestinationPath: string;
  extension: string;
  status?: 'pending' | 'success' | 'error';
}

export interface OrganizerConfig {
  sourceDirectory: string;
  extensionMap: Record<string, string[]>;
}

export interface ElectronAPI {
  selectFolder: () => Promise<string | null>;
  scanDirectory: (path: string) => Promise<FileMove[]>;
  executeCleanup: (moves: FileMove[]) => Promise<boolean>;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
