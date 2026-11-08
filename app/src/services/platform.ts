// Platform abstraction service for Tauri 2 and browser environments.
import { saveAs } from 'file-saver';

export type PlatformType = 'linux' | 'windows' | 'macos' | 'web';
export interface OpenedFile {
  name: string;
  path?: string;
  content: string | ArrayBuffer;
  isBinary: boolean;
}

function tauriInvoke<T>(command: string, args?: Record<string, unknown>): Promise<T> {
  const invoke = (window as any).__TAURI__?.core?.invoke;
  if (typeof invoke !== 'function') throw new Error('Tauri desktop API is unavailable');
  return invoke(command, args);
}

function tauriDialog() {
  const dialog = (window as any).__TAURI__?.dialog;
  if (!dialog) throw new Error('Tauri dialog plugin is unavailable');
  return dialog;
}

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

  public static isDesktop(): boolean { return this.isTauriEnv(); }

  public static async openFileDialog(acceptTypes = '.docx,.txt,.html'): Promise<OpenedFile | null> {
    if (this.isTauriEnv()) {
      const extensions = acceptTypes.split(',').map((value) => value.trim().replace(/^\./, '')).filter(Boolean);
      const selected = await tauriDialog().open({ multiple: false, filters: [{ name: 'Documents', extensions }] });
      const path = Array.isArray(selected) ? selected[0] : selected;
      if (!path) return null;
      const bytes = await tauriInvoke<number[]>('read_document_file', { path });
      const binary = Uint8Array.from(bytes);
      const name = path.split(/[\\/]/).pop() || 'Document';
      const isBinary = name.toLowerCase().endsWith('.docx');
      return {
        name,
        path,
        content: isBinary ? binary.buffer.slice(binary.byteOffset, binary.byteOffset + binary.byteLength) : new TextDecoder().decode(binary),
        isBinary,
      };
    }

    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = acceptTypes;
      input.onchange = () => {
        const file = input.files?.[0];
        if (!file) return resolve(null);
        const isBinary = file.name.toLowerCase().endsWith('.docx');
        const reader = new FileReader();
        reader.onload = () => resolve({ name: file.name, content: reader.result as string | ArrayBuffer, isBinary });
        reader.onerror = () => resolve(null);
        if (isBinary) reader.readAsArrayBuffer(file);
        else reader.readAsText(file);
      };
      input.oncancel = () => resolve(null);
      input.click();
    });
  }

  public static async readDocument(path: string): Promise<OpenedFile> {
    const bytes = Uint8Array.from(await tauriInvoke<number[]>('read_document_file', { path }));
    const name = path.split(/[\\/]/).pop() || 'Document';
    const isBinary = name.toLowerCase().endsWith('.docx');
    return { name, path, content: isBinary ? bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) : new TextDecoder().decode(bytes), isBinary };
  }

  public static async saveFile(
    filename: string,
    data: Blob | string | Uint8Array,
    mimeType = 'application/octet-stream',
    destinationPath?: string,
  ): Promise<string | false> {
    try {
      const blob = data instanceof Blob ? data : new Blob([data as BlobPart], { type: mimeType });
      if (this.isTauriEnv()) {
        const path = destinationPath || await tauriDialog().save({ defaultPath: filename, filters: [{ name: 'Document', extensions: [filename.split('.').pop() || 'docx'] }] });
        if (!path) return false;
        const bytes = Array.from(new Uint8Array(await blob.arrayBuffer()));
        await tauriInvoke<void>('write_document_file', { path, data: bytes });
        return path;
      }

      if (typeof window !== 'undefined' && 'showSaveFilePicker' in window) {
        try {
          const extension = filename.split('.').pop() || 'docx';
          const handle = await (window as any).showSaveFilePicker({
            suggestedName: filename,
            types: [{ description: `${extension.toUpperCase()} File`, accept: { [mimeType]: [`.${extension}`] } }],
          });
          const writable = await handle.createWritable();
          await writable.write(blob);
          await writable.close();
          return filename;
        } catch (err: any) {
          if (err.name === 'AbortError') return false;
        }
      }
      saveAs(blob, filename);
      return filename;
    } catch (err) {
      console.error('Failed to save file:', err);
      throw err;
    }
  }

  public static minimizeWindow(): void {
    if (this.isTauriEnv()) void tauriInvoke('plugin:window|minimize');
  }
  public static toggleMaximizeWindow(): void {
    if (this.isTauriEnv()) void tauriInvoke('plugin:window|toggle_maximize');
    else if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
    else void document.exitFullscreen().catch(() => {});
  }
  public static closeWindow(): void {
    if (this.isTauriEnv()) void tauriInvoke('plugin:window|close');
    else if (window.confirm('Are you sure you want to exit Wordo? Unsaved work may be recovered next time.')) window.close();
  }
}
