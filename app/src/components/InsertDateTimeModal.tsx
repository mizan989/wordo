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
      <div className="bg-white dark:bg-[#202020] text-gray-800 dark:text-gray-100 rounded-lg shadow-2xl border border-gray-300 dark:border-gray-700 w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#282828]">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-[#185abd]" />
            <span className="text-sm font-semibold">Date and Time</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Available formats:</p>
          <div className="border border-gray-300 dark:border-gray-700 rounded-md max-h-60 overflow-y-auto bg-gray-50 dark:bg-[#181818] divide-y divide-gray-200 dark:divide-gray-800">
            {formats.map((fmt, idx) => (
              <div
                key={fmt + idx}
                onClick={() => setSelectedFormatIndex(idx)}
                onDoubleClick={handleInsert}
                className={`px-3 py-2 text-xs cursor-pointer transition-colors ${
                  selectedFormatIndex === idx
                    ? 'bg-[#185abd] text-white font-medium'
                    : 'hover:bg-gray-100 dark:hover:bg-[#262626]'
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
        <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#252525] flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleInsert}
            className="px-5 py-1.5 text-xs rounded font-medium bg-[#185abd] text-white hover:bg-[#1651aa] transition-colors shadow-xs"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};
