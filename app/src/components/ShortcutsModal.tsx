import React from 'react';
import { X, Command } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const isMac = typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().includes('mac');
  const modKey = isMac ? '⌘' : 'Ctrl';

  const shortcutGroups = [
    {
      title: 'File Operations',
      items: [
        { label: 'New Document', keys: [modKey, 'N'] },
        { label: 'Open Document', keys: [modKey, 'O'] },
        { label: 'Save Document', keys: [modKey, 'S'] },
        { label: 'Save As...', keys: [modKey, 'Shift', 'S'] },
        { label: 'Print Document', keys: [modKey, 'P'] },
      ],
    },
    {
      title: 'Editing & Clipboard',
      items: [
        { label: 'Undo', keys: [modKey, 'Z'] },
        { label: 'Redo', keys: [modKey, 'Y'] },
        { label: 'Cut Selection', keys: [modKey, 'X'] },
        { label: 'Copy Selection', keys: [modKey, 'C'] },
        { label: 'Paste Clipboard', keys: [modKey, 'V'] },
        { label: 'Select All', keys: [modKey, 'A'] },
        { label: 'Find & Replace', keys: [modKey, 'F'] },
      ],
    },
    {
      title: 'Text Formatting',
      items: [
        { label: 'Bold', keys: [modKey, 'B'] },
        { label: 'Italic', keys: [modKey, 'I'] },
        { label: 'Underline', keys: [modKey, 'U'] },
        { label: 'Word Count & Stats', keys: [modKey, 'Shift', 'C'] },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none animate-in fade-in-50">
      <div className="bg-white dark:bg-[#252526] text-[#242424] dark:text-[#cccccc] w-full max-w-xl rounded-xl shadow-2xl border border-gray-300 dark:border-gray-700 overflow-hidden text-xs">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#f5f5f5] dark:bg-[#1e1e1e] border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-2 font-bold text-sm text-[#185abd] dark:text-white">
            <Command className="w-4 h-4" />
            <span>Keyboard Shortcuts</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-[#333] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {shortcutGroups.map((group, idx) => (
            <div key={idx} className="space-y-2">
              <h4 className="font-semibold text-gray-500 uppercase tracking-wider text-[11px]">
                {group.title}
              </h4>
              <div className="bg-[#fafafa] dark:bg-[#1f1f1f] border border-gray-200 dark:border-gray-700 rounded-md divide-y divide-gray-100 dark:divide-gray-800">
                {group.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="px-3 py-2 flex items-center justify-between">
                    <span className="font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                    <div className="flex items-center space-x-1">
                      {item.keys.map((k, kIdx) => (
                        <kbd
                          key={kIdx}
                          className="px-2 py-0.5 bg-white dark:bg-[#2d2d2d] border border-gray-300 dark:border-gray-600 rounded shadow-xs font-mono font-bold text-[11px] text-gray-800 dark:text-gray-200"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#f5f5f5] dark:bg-[#1e1e1e] border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#185abd] text-white hover:bg-[#1651aa] rounded font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
