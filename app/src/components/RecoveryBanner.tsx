import React from 'react';
import { AlertCircle, RotateCcw, Trash2 } from 'lucide-react';
import { RecoveryDraft } from '../types';

interface RecoveryBannerProps {
  draft: RecoveryDraft;
  onRestore: () => void;
  onDiscard: () => void;
}

export const RecoveryBanner: React.FC<RecoveryBannerProps> = ({ draft, onRestore, onDiscard }) => {
  const formattedTime = new Date(draft.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 flex items-center justify-between text-xs select-none z-20 text-[var(--text-primary)] shadow-xs">
      <div className="flex items-center space-x-2 text-[var(--text-primary)]">
        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
        <span>
          <strong>Document Recovery:</strong> Wordo found unsaved work for "
          <span className="font-semibold">{draft.title}</span>" from {formattedTime}. Would you like to restore it?
        </span>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={onRestore}
          className="flex items-center space-x-1.5 px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-[var(--radius-md)] font-medium transition-colors shadow-2xs"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Restore Work</span>
        </button>

        <button
          onClick={onDiscard}
          className="flex items-center space-x-1.5 px-2.5 py-1 bg-[var(--surface-primary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)] rounded-[var(--radius-md)] transition-colors"
        >
          <Trash2 className="w-3 h-3 text-gray-500" />
          <span>Discard</span>
        </button>
      </div>
    </div>
  );
};
