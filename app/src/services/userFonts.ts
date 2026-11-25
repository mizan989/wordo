// "Import my fonts": lets people add their own font files (for example a copy of their Windows Fonts
// folder) so documents that use Calibri, Cambria, Imprint MT Shadow and so on look exactly like in Word.
// Fonts are stored in this app's own browser storage (IndexedDB) on this computer and are never uploaded,
// never written to the repo and never part of the installer.
import { useSyncExternalStore } from 'react';
import { registerLineFactor } from './fontMetrics';

export interface UserFontInfo {
  family: string;
  styles: string[]; // Regular, Bold, Italic, Bold Italic
}

export interface ImportReport {
  added: number;
  replaced: number;
  families: string[];
  skipped: { file: string; reason: string }[];
}

interface UserFontRecord {
  id: string;
  family: string;
  bold: boolean;
  italic: boolean;
  fileName: string;
  size: number;
  lineFactor?: number;
  addedAt: number;
  data: ArrayBuffer;
}

interface FontMeta { family: string; bold: boolean; italic: boolean; lineFactor?: number }

// ---------------------------------------------------------------- font file parsing
const TAG = (v: DataView, o: number) => String.fromCharCode(v.getUint8(o), v.getUint8(o + 1), v.getUint8(o + 2), v.getUint8(o + 3));

/** Split a TrueType/OpenType collection (.ttc/.otc) into standalone font files. */
export function splitCollection(buf: ArrayBuffer): ArrayBuffer[] {
  const v = new DataView(buf);
  const src = new Uint8Array(buf);
  const count = v.getUint32(8);
  const fonts: ArrayBuffer[] = [];
  for (let i = 0; i < count; i++) {
    const off = v.getUint32(12 + 4 * i);
    const numTables = v.getUint16(off + 4);
    const tables: { rec: number; offset: number; length: number }[] = [];
    for (let k = 0; k < numTables; k++) {
      const rec = off + 12 + 16 * k;
      tables.push({ rec, offset: v.getUint32(rec + 8), length: v.getUint32(rec + 12) });
    }
    const headerSize = 12 + 16 * numTables;
    let total = headerSize;
    for (const t of tables) total += (t.length + 3) & ~3;
    const out = new Uint8Array(total);
    const ov = new DataView(out.buffer);
    out.set(src.subarray(off, off + 12), 0);
    let pos = headerSize;
    tables.forEach((t, k) => {
      const d = 12 + 16 * k;
      out.set(src.subarray(t.rec, t.rec + 8), d); // tag + checksum
      ov.setUint32(d + 8, pos);
      ov.setUint32(d + 12, t.length);
      out.set(src.subarray(t.offset, t.offset + t.length), pos);
      pos += (t.length + 3) & ~3;
    });
    fonts.push(out.buffer);
  }
  return fonts;
}

/** Read the family name, bold/italic flags and Word-style line height of a standalone TTF/OTF. */
export function parseFontMeta(buf: ArrayBuffer, fileName: string): FontMeta {
  const v = new DataView(buf);
  const numTables = v.getUint16(4);
  const tables = new Map<string, { offset: number; length: number }>();
  for (let k = 0; k < numTables; k++) {
    const rec = 12 + 16 * k;
    tables.set(TAG(v, rec), { offset: v.getUint32(rec + 8), length: v.getUint32(rec + 12) });
  }

  const names = new Map<number, string>();
  const nameTable = tables.get('name');
  if (nameTable) {
    const base = nameTable.offset;
    const count = v.getUint16(base + 2);
    const stringBase = base + v.getUint16(base + 4);
    const rank = (platform: number, language: number) =>
      platform === 3 && language === 0x409 ? 0 : platform === 3 ? 1 : platform === 0 ? 2 : platform === 1 ? 3 : 9;
    const best = new Map<number, number>();
    for (let i = 0; i < count; i++) {
      const r = base + 6 + 12 * i;
      const platform = v.getUint16(r), language = v.getUint16(r + 4), id = v.getUint16(r + 6);
      const length = v.getUint16(r + 8), offset = v.getUint16(r + 10);
      const rk = rank(platform, language);
      if (rk === 9 || (best.has(id) && best.get(id)! <= rk)) continue;
      const bytes = new Uint8Array(buf, stringBase + offset, length);
      let text = '';
      if (platform === 1) {
        for (const b of bytes) text += String.fromCharCode(b);
      } else {
        for (let j = 0; j + 1 < bytes.length; j += 2) text += String.fromCharCode((bytes[j] << 8) | bytes[j + 1]);
      }
      names.set(id, text.trim());
      best.set(id, rk);
    }
  }

  const os2 = tables.get('OS/2');
  const head = tables.get('head');
  const hhea = tables.get('hhea');
  const fsSelection = os2 && os2.length >= 64 ? v.getUint16(os2.offset + 62) : 0;
  const macStyle = head ? v.getUint16(head.offset + 44) : 0;
  const sub = names.get(2) || '';
  const bold = !!(fsSelection & 32) || !!(macStyle & 1) || /bold/i.test(sub);
  const italic = !!(fsSelection & 1) || !!(fsSelection & 512) || !!(macStyle & 2) || /italic|oblique/i.test(sub);

  let lineFactor: number | undefined;
  if (head && hhea) {
    const upm = v.getUint16(head.offset + 18);
    const sum = v.getInt16(hhea.offset + 4) - v.getInt16(hhea.offset + 6) + v.getInt16(hhea.offset + 8);
    if (upm > 0 && sum > 0) lineFactor = Math.round((sum / upm) * 10000) / 10000;
  }

  const family = (names.get(1) || names.get(16) || fileName.replace(/\.[^.]+$/, '')).trim();
  return { family, bold, italic, lineFactor };
}

const styleName = (bold: boolean, italic: boolean) => (bold && italic ? 'Bold Italic' : bold ? 'Bold' : italic ? 'Italic' : 'Regular');
const faceFamily = (family: string) => `"${family.replace(/["\\]/g, '')}"`;

// ---------------------------------------------------------------- storage (IndexedDB)
const DB_NAME = 'wordo-user-fonts';
const STORE = 'fonts';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: 'id' });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
const tx = async <T,>(mode: IDBTransactionMode, run: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> => {
  const db = await openDb();
  return new Promise<T>((resolve, reject) => {
    const t = db.transaction(STORE, mode);
    const req = run(t.objectStore(STORE));
    t.oncomplete = () => { db.close(); resolve(req.result); };
    t.onerror = () => { db.close(); reject(t.error); };
    t.onabort = () => { db.close(); reject(t.error); };
  });
};

// ---------------------------------------------------------------- service
type Listener = () => void;

class UserFontService {
  private records = new Map<string, Omit<UserFontRecord, 'data'>>();
  private faces = new Map<string, FontFace>();
  private listeners = new Set<Listener>();
  private snapshot: UserFontInfo[] = [];
  private initPromise: Promise<void> | null = null;

  subscribe = (l: Listener) => { this.listeners.add(l); return () => { this.listeners.delete(l); }; };
  getSnapshot = () => this.snapshot;

  private emit() {
    const byFamily = new Map<string, Set<string>>();
    this.records.forEach((r) => {
      if (!byFamily.has(r.family)) byFamily.set(r.family, new Set());
      byFamily.get(r.family)!.add(styleName(r.bold, r.italic));
    });
    const order = ['Regular', 'Bold', 'Italic', 'Bold Italic'];
    this.snapshot = Array.from(byFamily.entries())
      .map(([family, styles]) => ({ family, styles: order.filter((s) => styles.has(s)) }))
      .sort((a, b) => a.family.localeCompare(b.family));
    this.listeners.forEach((l) => l());
  }

  private async register(rec: UserFontRecord) {
    const old = this.faces.get(rec.id);
    if (old) document.fonts.delete(old);
    const face = new FontFace(faceFamily(rec.family), rec.data.slice(0), {
      weight: rec.bold ? '700' : '400',
      style: rec.italic ? 'italic' : 'normal',
    });
    await face.load();
    document.fonts.add(face);
    this.faces.set(rec.id, face);
    const { data, ...meta } = rec;
    this.records.set(rec.id, meta);
    if (rec.lineFactor) registerLineFactor(rec.family, rec.lineFactor);
  }

  /** Load every saved font. Safe to call more than once. */
  init(): Promise<void> {
    if (!this.initPromise) {
      this.initPromise = (async () => {
        try {
          const all = await tx<UserFontRecord[]>('readonly', (s) => s.getAll() as IDBRequest<UserFontRecord[]>);
          for (const rec of all) {
            try { await this.register(rec); } catch (e) { console.warn('[Wordo] Could not load saved font', rec.family, e); }
          }
        } catch (e) {
          console.warn('[Wordo] User fonts are unavailable:', e);
        }
        this.emit();
      })();
    }
    return this.initPromise;
  }

  async importFiles(files: File[], onProgress?: (done: number, total: number) => void): Promise<ImportReport> {
    await this.init();
    const report: ImportReport = { added: 0, replaced: 0, families: [], skipped: [] };
    const touched = new Set<string>();
    const fontFiles = files.filter((f) => /\.(ttf|otf|ttc|otc|woff2?|eot)$/i.test(f.name));
    let done = 0;
    for (const file of fontFiles) {
      try {
        if (/\.(woff2?|eot)$/i.test(file.name)) throw new Error('Only .ttf, .otf and .ttc files are supported');
        const buf = await file.arrayBuffer();
        const tag = buf.byteLength >= 4 ? TAG(new DataView(buf), 0) : '';
        let parts: ArrayBuffer[];
        if (tag === 'ttcf') parts = splitCollection(buf);
        else if (tag === 'OTTO' || tag === 'true' || tag === '\u0000\u0001\u0000\u0000') parts = [buf];
        else throw new Error('Not a TrueType/OpenType font');
        for (const part of parts) {
          const meta = parseFontMeta(part, file.name);
          const id = `${meta.family.toLowerCase()}|${meta.bold ? 'b' : 'r'}${meta.italic ? 'i' : ''}`;
          const existed = this.records.has(id);
          const rec: UserFontRecord = { id, ...meta, fileName: file.name, size: part.byteLength, addedAt: Date.now(), data: part };
          await tx('readwrite', (s) => s.put(rec));
          await this.register(rec);
          existed ? report.replaced++ : report.added++;
          touched.add(meta.family);
        }
      } catch (e: any) {
        report.skipped.push({ file: file.name, reason: e?.message || 'Could not read this file' });
      }
      onProgress?.(++done, fontFiles.length);
      if (done % 10 === 0) { this.emit(); await new Promise((r) => setTimeout(r, 0)); }
    }
    report.families = Array.from(touched).sort((a, b) => a.localeCompare(b));
    this.emit();
    return report;
  }

  async remove(family: string) {
    await this.init();
    const ids = Array.from(this.records.values()).filter((r) => r.family === family).map((r) => r.id);
    for (const id of ids) {
      await tx('readwrite', (s) => s.delete(id));
      const face = this.faces.get(id);
      if (face) document.fonts.delete(face);
      this.faces.delete(id);
      this.records.delete(id);
    }
    this.emit();
  }

  async removeAll() {
    await this.init();
    await tx('readwrite', (s) => s.clear());
    this.faces.forEach((f) => document.fonts.delete(f));
    this.faces.clear();
    this.records.clear();
    this.emit();
  }
}

export const userFonts = new UserFontService();

/** React hook: the fonts the user has imported (updates when fonts are added or removed). */
export function useUserFonts(): UserFontInfo[] {
  return useSyncExternalStore(userFonts.subscribe, userFonts.getSnapshot, userFonts.getSnapshot);
}
