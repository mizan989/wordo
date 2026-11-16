import React, { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { Editor } from '@tiptap/react';

interface InsertDateTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  editor: Editor | null;
}

export const InsertDateTimeModal: React.FC<InsertDateTimeModalProps> = ({ isOpen, onClose, editor }) => {
  const [selectedFormatIndex, setSelectedFormatIndex] = useState(0);

  if (!isOpen) return null;

  const now = new Date();

  const formats = [
    now.toLocaleDateString('en-US'), // 11/15/2026
    now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }), // Sunday, November 15, 2026
    now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), // November 15, 2026
    now.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }), // 15 November 2026
    `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}/${String(now.getFullYear()).slice(-2)}`, // 11/15/26
    now.toISOString().split('T')[0], // 2026-11-15
    `${now.getDate()}-${now.toLocaleDateString('en-US', { month: 'short' })}-${String(now.getFullYear()).slice(-2)}`, // 15-Nov-26
    `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()}`, // 15.11.2026
    now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }), // November 2026
    now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }), // 10:30 AM
    now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }), // 10:30:15 AM
    now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }), // 10:30
    now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }), // 10:30:15
    `${now.toLocaleDateString('en-US')} ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`,
  ];

  const handleInsert = () => {
    if (!editor) return;
    const str = formats[selectedFormatIndex];
    editor.chain().focus().insertContent(str).run();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs">
      <div className="bg-[var(--surface-primary)] text-[var(--text-primary)] rounded-[var(--radius-xl)] shadow-[var(--shadow-modal)] border border-[var(--border-color)] w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border-color)] bg-[var(--surface-secondary)]">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-[var(--text-primary)]" />
            <span className="text-sm font-semibold">Date and Time</span>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] p-1 rounded-[var(--radius-sm)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Available formats:</p>
          <div className="border border-[var(--border-color)] rounded-[var(--radius-lg)] max-h-60 overflow-y-auto bg-[var(--surface-secondary)] divide-y divide-[var(--border-subtle)]">
            {formats.map((fmt, idx) => (
              <div
                key={fmt + idx}
                onClick={() => setSelectedFormatIndex(idx)}
                onDoubleClick={handleInsert}
                className={`px-3 py-2 text-xs cursor-pointer transition-colors ${
                  selectedFormatIndex === idx
                    ? 'bg-[var(--selection-bg)] text-[var(--accent-color)] font-semibold'
                    : 'hover:bg-[var(--hover-bg)] text-[var(--text-primary)]'
                }`}
              >
                {fmt}
              </div>
            ))}
          </div>

          <div className="pt-2 text-[11px] text-gray-400">
            Language: <span className="text-gray-600 dark:text-gray-200 font-medium">English (United States)</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[var(--border-color)] bg-[var(--surface-secondary)] flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--surface-primary)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleInsert}
            className="px-5 py-1.5 text-xs rounded-[var(--radius-md)] font-medium bg-[var(--accent-color)] text-white hover:opacity-90 transition-opacity shadow-xs"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};
