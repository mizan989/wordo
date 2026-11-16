import React from 'react';
import {
  FileText,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Layout,
  Globe,
  Minus,
  Plus,
  HardDrive,
} from 'lucide-react';

interface StatusBarProps {
  wordCount: number;
  charCount: number;
  issueCount: number;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onOpenWordCount: () => void;
  onOpenSpellCheck: () => void;
  isDirty: boolean;
  onToggleFocusMode?: () => void;
  isFocusMode?: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  wordCount,
  charCount,
  issueCount,
  zoom,
  onZoomChange,
  onOpenWordCount,
  onOpenSpellCheck,
  isDirty,
  onToggleFocusMode,
  isFocusMode,
}) => {
  return (
    <footer className="h-[var(--statusbar-height)] bg-[var(--surface-primary)] text-[var(--text-secondary)] flex items-center justify-between px-3 text-[11px] select-none z-20 border-t border-[var(--border-color)] transition-colors">
      {/* Left items */}
      <div className="flex items-center space-x-2">
        {/* Page status */}
        <span className="flex items-center space-x-1 hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)] px-2 py-0.5 rounded-[var(--radius-sm)] cursor-pointer transition-colors">
          <FileText className="w-3 h-3 mr-1 text-[var(--text-muted)]" />
          <span>Document</span>
        </span>

        {/* Word count button */}
        <button
          onClick={onOpenWordCount}
          title="Click to view full document statistics"
          className="hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)] px-2 py-0.5 rounded-[var(--radius-sm)] transition-colors font-medium text-[var(--text-primary)]"
        >
          {wordCount.toLocaleString()} {wordCount === 1 ? 'word' : 'words'}
        </button>

        {/* Char count */}
        <span className="text-[var(--text-muted)]">
          {charCount.toLocaleString()} chars
        </span>

        {/* Spell Check Status */}
        <button
          onClick={onOpenSpellCheck}
          className="flex items-center space-x-1 hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)] px-2 py-0.5 rounded-[var(--radius-sm)] transition-colors"
        >
          {issueCount === 0 ? (
            <>
              <CheckCircle className="w-3 h-3 text-[var(--success-color)]" />
              <span>English (US)</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-3 h-3 text-[var(--warning-color)]" />
              <span className="text-[var(--warning-color)] font-medium">
                {issueCount} {issueCount === 1 ? 'correction' : 'corrections'}
              </span>
            </>
          )}
        </button>

        {/* Offline & Autosave state */}
        <span className="flex items-center text-[var(--text-muted)]">
          <HardDrive className="w-3 h-3 mr-1" />
          {isDirty ? 'Draft modified' : 'No unsaved changes'}
        </span>
      </div>

      {/* Right items: Zoom Controls & Layout Modes */}
      <div className="flex items-center space-x-2">
        {/* Layout Mode Icons */}
        <div className="flex items-center space-x-0.5 bg-[var(--surface-secondary)] p-0.5 rounded-[var(--radius-md)] border border-[var(--border-subtle)]">
          <button
            onClick={() => {
              if (isFocusMode && onToggleFocusMode) onToggleFocusMode();
            }}
            title="Page Layout View"
            className={`p-1 rounded-[var(--radius-sm)] transition-colors ${
              !isFocusMode
                ? 'bg-[var(--surface-primary)] text-[var(--text-primary)] shadow-xs font-medium'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onToggleFocusMode}
            title="Focus / Reading View (Esc to exit)"
            className={`p-1 rounded-[var(--radius-sm)] transition-colors ${
              isFocusMode
                ? 'bg-[var(--surface-primary)] text-[var(--text-primary)] shadow-xs font-medium'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="w-[1px] h-3 bg-[var(--border-color)] mx-1" />

        {/* Zoom Slider */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => onZoomChange(Math.max(50, zoom - 10))}
            title="Zoom Out"
            className="p-1 hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)] rounded-[var(--radius-sm)] text-[var(--text-secondary)]"
          >
            <Minus className="w-3 h-3" />
          </button>

          <input
            type="range"
            min="50"
            max="200"
            step="5"
            value={zoom}
            onChange={(e) => onZoomChange(Number(e.target.value))}
            className="w-20 h-1 bg-[var(--surface-tertiary)] rounded-lg appearance-none cursor-pointer accent-[var(--accent-color)]"
          />

          <button
            onClick={() => onZoomChange(Math.min(200, zoom + 10))}
            title="Zoom In"
            className="p-1 hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)] rounded-[var(--radius-sm)] text-[var(--text-secondary)]"
          >
            <Plus className="w-3 h-3" />
          </button>

          <button
            onClick={() => onZoomChange(100)}
            title="Reset Zoom to 100%"
            className="w-10 text-right hover:text-[var(--text-primary)] font-mono text-[10px] text-[var(--text-secondary)]"
          >
            {zoom}%
          </button>
        </div>
      </div>
    </footer>
  );
};
