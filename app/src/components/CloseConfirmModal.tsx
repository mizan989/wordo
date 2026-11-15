import React, { useEffect } from 'react';
import { AlertTriangle, X, Save, Trash2 } from 'lucide-react';

interface CloseConfirmModalProps {
  isOpen: boolean;
  documentTitle: string;
  onSave: () => void;
  onCloseWithoutSaving: () => void;
  onCancel: () => void;
}

export const CloseConfirmModal: React.FC<CloseConfirmModalProps> = ({
  isOpen,
  documentTitle,
  onSave,
  onCloseWithoutSaving,
  onCancel,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-[100] p-4 select-none animate-in fade-in-50">
      <div className="bg-white dark:bg-[#252526] text-[#242424] dark:text-[#cccccc] w-full max-w-md rounded-xl shadow-2xl border border-gray-300 dark:border-gray-700 overflow-hidden text-xs">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#f5f5f5] dark:bg-[#1e1e1e] border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-2 font-bold text-sm text-[#185abd] dark:text-blue-400">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Wordo — Save Document</span>
          </div>
          <button
            onClick={onCancel}
            title="Cancel and return to document"
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-[#333] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <div className="flex items-start space-x-3.5">
            <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-full shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white leading-snug">
                Do you want to save changes to &ldquo;{documentTitle}&rdquo;?
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                If you close without saving, the file and all your unsaved changes will be lost.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 bg-[#f5f5f5] dark:bg-[#1e1e1e] border-t border-gray-200 dark:border-gray-700 flex items-center justify-end space-x-2">
          <button
            onClick={onSave}
            autoFocus
            className="px-4 py-2 bg-[#185abd] hover:bg-[#1651aa] text-white rounded-lg font-medium text-xs transition-colors shadow-xs flex items-center space-x-1.5 cursor-pointer focus:ring-2 focus:ring-blue-400 focus:outline-hidden"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>

          <button
            onClick={onCloseWithoutSaving}
            className="px-3.5 py-2 bg-white dark:bg-[#2d2d2d] hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Close without saving</span>
          </button>

          <button
            onClick={onCancel}
            className="px-3.5 py-2 bg-white dark:bg-[#2d2d2d] hover:bg-gray-100 dark:hover:bg-[#383838] text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
