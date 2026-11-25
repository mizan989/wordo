import React, { useRef, useState } from 'react';
import { X, Trash2, FolderOpen, FilePlus } from 'lucide-react';
import { userFonts, useUserFonts, ImportReport } from '../services/userFonts';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const FontManagerDialog: React.FC<Props> = ({ open, onClose }) => {
  const fonts = useUserFonts();
  const fileInput = useRef<HTMLInputElement>(null);
  const folderInput = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [report, setReport] = useState<ImportReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const run = async (list: FileList | null) => {
    if (!list || list.length === 0) return;
    setError(null);
    setReport(null);
    const files = Array.from(list);
    setProgress({ done: 0, total: files.length });
    try {
      const result = await userFonts.importFiles(files, (done, total) => setProgress({ done, total }));
      setReport(result);
    } catch (e: any) {
      setError(e?.message || 'Importing fonts failed');
    } finally {
      setProgress(null);
      if (fileInput.current) fileInput.current.value = '';
      if (folderInput.current) folderInput.current.value = '';
    }
  };

  const busy = progress !== null;

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/40" onMouseDown={onClose}>
      <div
        className="w-[540px] max-w-[94vw] max-h-[84vh] flex flex-col rounded-[var(--radius-lg,12px)] border border-[var(--border-color)] bg-[var(--surface-primary,#fff)] text-[var(--text-primary)] shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="My fonts"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)]">
          <h2 className="text-sm font-semibold">My fonts</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-[var(--hover-bg)]" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-4 py-3 text-xs text-[var(--text-secondary)] space-y-2 overflow-y-auto">
          <p>
            Add font files (.ttf, .otf, .ttc) so documents that use them look exactly like they do in Word. For example, copy
            the fonts you need from <span className="font-mono">C:\Windows\Fonts</span> on a Windows PC and add that folder here.
          </p>
          <p>
            Fonts are stored privately on this computer. They are not uploaded and are not part of Wordo. Only add fonts you have a
            licence to use.
          </p>

          <div className="flex gap-2 pt-1">
            <button
              disabled={busy}
              onClick={() => fileInput.current?.click()}
              className="flex items-center gap-1.5 h-8 px-3 rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--surface-secondary)] hover:bg-[var(--hover-bg)] text-xs font-medium disabled:opacity-50"
            >
              <FilePlus className="w-3.5 h-3.5" /> Add font files…
            </button>
            <button
              disabled={busy}
              onClick={() => folderInput.current?.click()}
              className="flex items-center gap-1.5 h-8 px-3 rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--surface-secondary)] hover:bg-[var(--hover-bg)] text-xs font-medium disabled:opacity-50"
            >
              <FolderOpen className="w-3.5 h-3.5" /> Add a folder…
            </button>
            <input
              ref={fileInput}
              type="file"
              multiple
              accept=".ttf,.otf,.ttc,.otc"
              className="hidden"
              onChange={(e) => run(e.target.files)}
            />
            <input
              ref={(el) => {
                folderInput.current = el;
                if (el) {
                  el.setAttribute('webkitdirectory', '');
                  el.setAttribute('directory', '');
                }
              }}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => run(e.target.files)}
            />
          </div>

          {progress && (
            <div className="pt-1">
              <div className="h-1.5 rounded bg-[var(--border-subtle,#e5e7eb)] overflow-hidden">
                <div
                  className="h-full bg-[var(--accent-color)] transition-all"
                  style={{ width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%` }}
                />
              </div>
              <div className="pt-1">Importing {progress.done} of {progress.total}…</div>
            </div>
          )}

          {error && <div className="text-red-600">{error}</div>}

          {report && (
            <div className="rounded border border-[var(--border-color)] p-2 space-y-1">
              <div>
                Added {report.added} font{report.added === 1 ? '' : 's'}
                {report.replaced > 0 ? `, updated ${report.replaced}` : ''}
                {report.skipped.length > 0 ? `, skipped ${report.skipped.length}` : ''}.
              </div>
              {report.added + report.replaced > 0 && (
                <div>Re-open a document that is already open to get its exact line spacing with the new fonts.</div>
              )}
              {report.skipped.slice(0, 4).map((s) => (
                <div key={s.file} className="text-[var(--text-muted)]">• {s.file}: {s.reason}</div>
              ))}
              {report.skipped.length > 4 && <div className="text-[var(--text-muted)]">• and {report.skipped.length - 4} more</div>}
            </div>
          )}
        </div>

        <div className="flex-1 min-h-[80px] overflow-y-auto border-t border-[var(--border-color)]">
          {fonts.length === 0 ? (
            <div className="px-4 py-6 text-xs text-center text-[var(--text-muted)]">No fonts added yet.</div>
          ) : (
            <ul>
              {fonts.map((f) => (
                <li key={f.family} className="flex items-center justify-between px-4 py-1.5 hover:bg-[var(--hover-bg)]">
                  <div className="min-w-0">
                    <div className="text-sm truncate" style={{ fontFamily: `"${f.family}", sans-serif` }}>{f.family}</div>
                    <div className="text-[10px] text-[var(--text-muted)]">{f.styles.join(' · ')}</div>
                  </div>
                  <button
                    onClick={() => userFonts.remove(f.family)}
                    className="p-1 rounded text-[var(--text-secondary)] hover:text-red-600"
                    title={`Remove ${f.family}`}
                    aria-label={`Remove ${f.family}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-2.5 border-t border-[var(--border-color)] text-xs">
          <span className="text-[var(--text-muted)]">{fonts.length} font{fonts.length === 1 ? '' : 's'}</span>
          <div className="flex gap-2">
            {fonts.length > 0 && (
              <button
                onClick={() => { if (window.confirm('Remove all of your imported fonts?')) userFonts.removeAll(); }}
                className="h-7 px-2.5 rounded-[var(--radius-md)] border border-[var(--border-color)] hover:bg-[var(--hover-bg)]"
              >
                Remove all
              </button>
            )}
            <button
              onClick={onClose}
              className="h-7 px-3 rounded-[var(--radius-md)] bg-[var(--accent-color)] text-white font-medium"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
