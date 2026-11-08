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
    <div className="bg-amber-50 dark:bg-amber-950/60 border-b border-amber-300 dark:border-amber-700 px-4 py-2 flex items-center justify-between text-xs select-none z-20 shadow-xs">
      <div className="flex items-center space-x-2 text-amber-900 dark:text-amber-200">
        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
        <span>
          <strong>Document Recovery:</strong> Word-Client found unsaved work for "
          <span className="font-semibold">{draft.title}</span>" from {formattedTime}. Would you like to restore it?
        </span>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={onRestore}
          className="flex items-center space-x-1 px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-medium transition-colors shadow-2xs"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Restore Work</span>
        </button>

        <button
          onClick={onDiscard}
          className="flex items-center space-x-1 px-2.5 py-1 bg-white dark:bg-[#2d2d2d] border border-amber-300 dark:border-amber-700 text-gray-700 dark:text-gray-300 hover:bg-amber-100 rounded transition-colors"
        >
          <Trash2 className="w-3 h-3 text-gray-500" />
          <span>Discard</span>
        </button>
      </div>
    </div>
  );
};
