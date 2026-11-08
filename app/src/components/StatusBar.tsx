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
  currentPage: number;
  totalPages: number;
  wordCount: number;
  charCount: number;
  issueCount: number;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onOpenWordCount: () => void;
  onOpenSpellCheck: () => void;
  isDirty: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  currentPage,
  totalPages,
  wordCount,
  charCount,
  issueCount,
  zoom,
  onZoomChange,
  onOpenWordCount,
  onOpenSpellCheck,
  isDirty,
}) => {
  return (
    <footer className="h-6 bg-[#185abd] text-white flex items-center justify-between px-3 text-[11px] select-none z-20 shadow-xs border-t border-[#1651aa]">
      {/* Left items */}
      <div className="flex items-center space-x-3">
        {/* Page status */}
        <span className="flex items-center space-x-1 hover:bg-white/20 px-1.5 py-0.5 rounded cursor-pointer transition-colors">
          <FileText className="w-3 h-3 mr-1" />
          <span>Page {currentPage} of {totalPages}</span>
        </span>

        {/* Word count button */}
        <button
          onClick={onOpenWordCount}
          title="Click to view full document statistics"
          className="hover:bg-white/20 px-1.5 py-0.5 rounded transition-colors font-medium"
        >
          {wordCount.toLocaleString()} {wordCount === 1 ? 'word' : 'words'}
        </button>

        {/* Char count */}
        <span className="opacity-80">
          {charCount.toLocaleString()} chars
        </span>

        {/* Spell Check Status */}
        <button
          onClick={onOpenSpellCheck}
          className="flex items-center space-x-1 hover:bg-white/20 px-1.5 py-0.5 rounded transition-colors"
        >
          {issueCount === 0 ? (
            <>
              <CheckCircle className="w-3 h-3 text-emerald-300" />
              <span>English (US)</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-3 h-3 text-amber-300" />
              <span className="text-amber-200 font-medium">
                {issueCount} {issueCount === 1 ? 'correction' : 'corrections'}
              </span>
            </>
          )}
        </button>

        {/* Offline & Autosave state */}
        <span className="flex items-center opacity-85">
          <HardDrive className="w-3 h-3 mr-1" />
          {isDirty ? 'Draft modified' : 'Local storage synced'}
        </span>
      </div>

      {/* Right items: Zoom Controls & Layout Modes */}
      <div className="flex items-center space-x-3">
        {/* Layout Mode Icons */}
        <div className="flex items-center space-x-1 opacity-90">
          <button title="Page Layout View" className="p-0.5 hover:bg-white/20 rounded">
            <Layout className="w-3.5 h-3.5" />
          </button>
          <button title="Web Layout View" className="p-0.5 hover:bg-white/20 rounded">
            <Globe className="w-3.5 h-3.5" />
          </button>
          <button title="Reading View" className="p-0.5 hover:bg-white/20 rounded">
            <BookOpen className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="w-[1px] h-3 bg-white/30" />

        {/* Zoom Slider */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => onZoomChange(Math.max(50, zoom - 10))}
            title="Zoom Out"
            className="p-0.5 hover:bg-white/20 rounded"
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
            className="w-20 h-1 bg-white/40 rounded-lg appearance-none cursor-pointer accent-white"
          />

          <button
            onClick={() => onZoomChange(Math.min(200, zoom + 10))}
            title="Zoom In"
            className="p-0.5 hover:bg-white/20 rounded"
          >
            <Plus className="w-3 h-3" />
          </button>

          <button
            onClick={() => onZoomChange(100)}
            title="Reset Zoom to 100%"
            className="w-10 text-right hover:underline font-mono text-[10px]"
          >
            {zoom}%
          </button>
        </div>
      </div>
    </footer>
  );
};
