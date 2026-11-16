import React from 'react';
import { X, FileText, Clock, Volume2, AlignLeft } from 'lucide-react';
import { DocumentStats } from '../types';

interface WordCountDialogProps {
  stats: DocumentStats;
  onClose: () => void;
}

export const WordCountDialog: React.FC<WordCountDialogProps> = ({ stats, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none animate-in fade-in-50">
      <div className="bg-[var(--surface-primary)] text-[var(--text-primary)] w-full max-w-md rounded-[var(--radius-xl)] shadow-[var(--shadow-modal)] border border-[var(--border-color)] overflow-hidden text-xs">
        {/* Header */}
        <div className="px-4 py-3 bg-[var(--surface-secondary)] border-b border-[var(--border-color)] flex items-center justify-between">
          <div className="flex items-center space-x-2 font-bold text-sm text-[var(--text-primary)]">
            <FileText className="w-4 h-4" />
            <span>Word Count & Document Statistics</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[var(--hover-bg)] text-[var(--text-primary)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-[var(--surface-secondary)] border border-[var(--border-color)] rounded-[var(--radius-lg)]">
              <span className="text-[11px] text-[var(--text-secondary)] font-medium">Total Words</span>
              <div className="text-xl font-bold text-[var(--accent-color)] mt-0.5">
                {stats.words.toLocaleString()}
              </div>
            </div>

            <div className="p-3 bg-[var(--surface-secondary)] border border-[var(--border-color)] rounded-[var(--radius-lg)]">
              <span className="text-[11px] text-[var(--text-secondary)] font-medium">Total Characters</span>
              <div className="text-xl font-bold text-[var(--text-primary)] mt-0.5">
                {stats.characters.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="border border-[var(--border-color)] rounded-[var(--radius-lg)] divide-y divide-[var(--border-subtle)] text-xs">
            <div className="px-3 py-2 flex items-center justify-between">
              <span className="text-[var(--text-secondary)]">Characters (no spaces)</span>
              <span className="font-semibold">{stats.charactersWithoutSpaces.toLocaleString()}</span>
            </div>
            <div className="px-3 py-2 flex items-center justify-between">
              <span className="text-[var(--text-secondary)]">Paragraphs</span>
              <span className="font-semibold">{stats.paragraphs.toLocaleString()}</span>
            </div>
            <div className="px-3 py-2 flex items-center justify-between">
              <span className="text-[var(--text-secondary)]">Sentences</span>
              <span className="font-semibold">{stats.sentences.toLocaleString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="flex items-center space-x-2 text-[var(--text-secondary)]">
              <Clock className="w-4 h-4 text-[var(--accent-color)]" />
              <div>
                <div className="text-[10px] text-[var(--text-muted)]">Reading Time</div>
                <div className="font-semibold">~{stats.readingTimeMinutes} min</div>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-[var(--text-secondary)]">
              <Volume2 className="w-4 h-4 text-purple-600" />
              <div>
                <div className="text-[10px] text-[var(--text-muted)]">Speaking Time</div>
                <div className="font-semibold">~{stats.speakingTimeMinutes} min</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-[var(--surface-secondary)] border-t border-[var(--border-color)] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[var(--accent-color)] text-white hover:opacity-90 rounded-[var(--radius-md)] font-medium transition-opacity shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
