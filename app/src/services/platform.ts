// Platform abstraction service for Tauri 2 and Web environments
import { saveAs } from 'file-saver';

export type PlatformType = 'linux' | 'windows' | 'macos' | 'web';

export class PlatformService {
  private static isTauriEnv(): boolean {
    return typeof window !== 'undefined' && ('__TAURI_INTERNALS__' in window || '__TAURI__' in window);
  }

  public static getPlatform(): PlatformType {
    if (typeof navigator === 'undefined') return 'linux';
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('win')) return 'windows';
    if (ua.includes('mac')) return 'macos';
    if (ua.includes('linux')) return 'linux';
    return 'web';
  }

  public static isDesktop(): boolean {
    return this.isTauriEnv();
  }

  /**
   * Prompts the user to select a file from their local disk.
   */
  public static async openFileDialog(acceptTypes: string = '.docx,.txt,.html'): Promise<{ name: string; content: string | ArrayBuffer; isBinary: boolean } | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = acceptTypes;

      input.onchange = async (e: Event) => {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        if (!file) {
          resolve(null);
          return;
        }

        const isDocx = file.name.toLowerCase().endsWith('.docx');
        const reader = new FileReader();

        if (isDocx) {
          reader.onload = () => {
            resolve({
              name: file.name,
              content: reader.result as ArrayBuffer,
              isBinary: true,
            });
          };
          reader.readAsArrayBuffer(file);
        } else {
          reader.onload = () => {
            resolve({
              name: file.name,
              content: reader.result as string,
              isBinary: false,
            });
          };
          reader.readAsText(file);
        }
      };

      input.click();
    });
  }

  /**
   * Prompts the user to save a file to their local disk.
   */
  public static async saveFile(
    filename: string,
    data: Blob | string | Uint8Array,
    mimeType: string = 'application/octet-stream'
  ): Promise<boolean> {
    try {
      let blob: Blob;
      if (data instanceof Blob) {
        blob = data;
      } else if (typeof data === 'string') {
        blob = new Blob([data], { type: mimeType });
      } else {
        blob = new Blob([data as unknown as BlobPart], { type: mimeType });
      }

      // Check if modern File System Access API is available
      if (typeof window !== 'undefined' && 'showSaveFilePicker' in window) {
        try {
          const extension = filename.split('.').pop() || 'docx';
          const handle = await (window as any).showSaveFilePicker({
            suggestedName: filename,
            types: [
              {
                description: `${extension.toUpperCase()} File`,
                accept: { [mimeType]: [`.${extension}`] },
              },
            ],
          });
          const writable = await handle.createWritable();
          await writable.write(blob);
          await writable.close();
          return true;
        } catch (pickerErr: any) {
          // If user cancelled, return false; otherwise fallback to file-saver
          if (pickerErr.name === 'AbortError') return false;
        }
      }

      // Fallback save using file-saver
      saveAs(blob, filename);
      return true;
    } catch (err) {
      console.error('Failed to save file:', err);
      return false;
    }
  }

  /**
   * Desktop window controls (simulated in browser, native in Tauri)
   */
  public static minimizeWindow(): void {
    if (this.isTauriEnv()) {
      try {
        (window as any).__TAURI_INTERNALS__?.invoke('plugin:window|minimize');
      } catch (e) {
        console.log('Tauri minimize');
      }
    }
  }

  public static toggleMaximizeWindow(): void {
    if (this.isTauriEnv()) {
      try {
        (window as any).__TAURI_INTERNALS__?.invoke('plugin:window|toggle_maximize');
      } catch (e) {
        console.log('Tauri toggle maximize');
      }
    } else {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }
  }

  public static closeWindow(): void {
    if (this.isTauriEnv()) {
      try {
        (window as any).__TAURI_INTERNALS__?.invoke('plugin:window|close');
      } catch (e) {
        console.log('Tauri close');
      }
    } else {
      if (window.confirm('Are you sure you want to exit Word-Client? Any unsaved changes will be recovered on next launch.')) {
        window.close();
      }
    }
  }
}
