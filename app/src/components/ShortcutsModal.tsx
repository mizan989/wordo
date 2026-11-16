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
        { label: 'Find in Document', keys: [modKey, 'F'] },
        { label: 'Replace in Document', keys: [modKey, 'H'] },
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
      <div className="bg-[var(--surface-primary)] text-[var(--text-primary)] w-full max-w-xl rounded-[var(--radius-xl)] shadow-[var(--shadow-modal)] border border-[var(--border-color)] overflow-hidden text-xs">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[var(--surface-secondary)] border-b border-[var(--border-color)] flex items-center justify-between">
          <div className="flex items-center space-x-2 font-bold text-sm text-[var(--text-primary)]">
            <Command className="w-4 h-4" />
            <span>Keyboard Shortcuts</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[var(--hover-bg)] text-[var(--text-primary)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {shortcutGroups.map((group, idx) => (
            <div key={idx} className="space-y-2">
              <h4 className="font-semibold text-[var(--text-secondary)] uppercase tracking-wider text-[11px]">
                {group.title}
              </h4>
              <div className="bg-[var(--surface-secondary)] border border-[var(--border-color)] rounded-[var(--radius-lg)] divide-y divide-[var(--border-subtle)]">
                {group.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="px-3 py-2 flex items-center justify-between">
                    <span className="font-medium text-[var(--text-primary)]">{item.label}</span>
                    <div className="flex items-center space-x-1">
                      {item.keys.map((k, kIdx) => (
                        <kbd
                          key={kIdx}
                          className="px-2 py-0.5 bg-[var(--surface-primary)] border border-[var(--border-color)] rounded-[var(--radius-sm)] shadow-xs font-mono font-bold text-[11px] text-[var(--text-primary)]"
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
        <div className="px-5 py-3 bg-[var(--surface-secondary)] border-t border-[var(--border-color)] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[var(--accent-color)] text-white hover:opacity-90 rounded-[var(--radius-md)] font-medium transition-opacity shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
