import React, { useEffect, useState, useRef } from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Highlighter,
  Link as LinkIcon,
  ChevronDown,
  ChevronUp,
  Baseline,
  RemoveFormatting,
} from 'lucide-react';
import { FONT_SIZE_STEPS } from '../extensions/typography';

const MINI_FONT_FAMILIES = [
  'Aptos',
  'Calibri',
  'Segoe UI',
  'Arial',
  'Times New Roman',
  'Georgia',
  'Consolas',
];

const MINI_COLORS = [
  '#000000',
  '#185abd',
  '#c00000',
  '#00b050',
  '#ffc000',
  '#7030a0',
  '#70ad47',
  '#ed7d31',
];

const MINI_HIGHLIGHTS = [
  '#ffff00',
  '#00ff00',
  '#00ffff',
  '#ff00ff',
  '#0000ff',
  '#ff0000',
];

interface FloatingMiniToolbarProps {
  editor: Editor | null;
}

export const FloatingMiniToolbar: React.FC<FloatingMiniToolbarProps> = ({ editor }) => {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editor) return;

    const updatePosition = () => {
      const { selection } = editor.state;
      if (selection.empty || !editor.isFocused) {
        setPosition(null);
        setShowColorPicker(false);
        setShowHighlightPicker(false);
        return;
      }

      try {
        const fromCoords = editor.view.coordsAtPos(selection.from);
        const toCoords = editor.view.coordsAtPos(selection.to);
        const left = (fromCoords.left + toCoords.left) / 2;
        const top = fromCoords.top - 52;

        if (top > 10 && left > 10) {
          setPosition({ top, left });
        } else {
          // If too close to top edge, show below selection
          setPosition({ top: toCoords.bottom + 10, left });
        }
      } catch (e) {
        setPosition(null);
      }
    };

    editor.on('selectionUpdate', updatePosition);
    editor.on('blur', () => {
      // Small timeout so clicking inside the toolbar doesn't immediately hide it
      setTimeout(() => {
        if (!toolbarRef.current?.contains(document.activeElement)) {
          setPosition(null);
        }
      }, 150);
    });

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      editor.off('selectionUpdate', updatePosition);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [editor]);

  if (!editor || !position) return null;

  const currentFont = editor.getAttributes('textStyle')?.fontFamily || 'Aptos';
  const currentSize = editor.getAttributes('textStyle')?.fontSize || '11';

  const handleLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter Web Address (URL):', previousUrl || 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div
      ref={toolbarRef}
      onMouseDown={(e) => e.preventDefault()}
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translateX(-50%)',
        zIndex: 100,
      }}
      className="flex items-center space-x-1 p-1 bg-white dark:bg-[#252526] border border-[#d1d5db] dark:border-[#444] rounded-lg shadow-2xl text-xs select-none animate-in fade-in zoom-in-95 duration-100"
    >
      {/* Font Family */}
      <select
        value={currentFont}
        onChange={(e) => {
          (editor.commands as any).setFontFamily(e.target.value);
        }}
        className="h-6 px-1 bg-gray-50 dark:bg-[#333] border border-gray-200 dark:border-gray-600 rounded text-[11px] outline-hidden w-20 text-gray-800 dark:text-gray-100 truncate"
      >
        {MINI_FONT_FAMILIES.map((f) => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </select>

      {/* Font Size */}
      <select
        value={currentSize}
        onChange={(e) => {
          (editor.commands as any).setFontSize(e.target.value);
        }}
        className="h-6 px-0.5 bg-gray-50 dark:bg-[#333] border border-gray-200 dark:border-gray-600 rounded text-[11px] outline-hidden w-11 text-gray-800 dark:text-gray-100"
      >
        {FONT_SIZE_STEPS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {/* Grow / Shrink */}
      <button
        onClick={() => (editor.commands as any).growFontSize()}
        title="Grow Font"
        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-[#383838] flex items-center text-[10px] font-bold"
      >
        A<ChevronUp className="w-2.5 h-2.5 -ml-0.5 text-blue-600" />
      </button>
      <button
        onClick={() => (editor.commands as any).shrinkFontSize()}
        title="Shrink Font"
        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-[#383838] flex items-center text-[10px]"
      >
        A<ChevronDown className="w-2.5 h-2.5 -ml-0.5 text-blue-600" />
      </button>

      <div className="w-[1px] h-3.5 bg-gray-200 dark:bg-gray-700 mx-0.5" />

      {/* Formatting buttons */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Bold"
        className={`p-1 rounded ${
          editor.isActive('bold')
            ? 'bg-[#185abd] text-white'
            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#333]'
        }`}
      >
        <Bold className="w-3.5 h-3.5" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Italic"
        className={`p-1 rounded ${
          editor.isActive('italic')
            ? 'bg-[#185abd] text-white'
            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#333]'
        }`}
      >
        <Italic className="w-3.5 h-3.5" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        title="Underline"
        className={`p-1 rounded ${
          editor.isActive('underline')
            ? 'bg-[#185abd] text-white'
            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#333]'
        }`}
      >
        <Underline className="w-3.5 h-3.5" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        title="Strikethrough"
        className={`p-1 rounded ${
          editor.isActive('strike')
            ? 'bg-[#185abd] text-white'
            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#333]'
        }`}
      >
        <Strikethrough className="w-3.5 h-3.5" />
      </button>

      {/* Text Color */}
      <div className="relative">
        <button
          onClick={() => {
            setShowColorPicker(!showColorPicker);
            setShowHighlightPicker(false);
          }}
          title="Font Color"
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-[#333] flex items-center"
        >
          <Baseline className="w-3.5 h-3.5 text-red-600" />
        </button>
        {showColorPicker && (
          <div className="absolute left-0 top-full mt-1 p-1.5 bg-white dark:bg-[#2d2d2d] border border-gray-300 dark:border-gray-600 rounded-md shadow-xl grid grid-cols-4 gap-1 z-50">
            {MINI_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => {
                  editor.chain().focus().setColor(c).run();
                  setShowColorPicker(false);
                }}
                className="w-4 h-4 rounded-xs border border-gray-300 hover:scale-110"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Highlighter */}
      <div className="relative">
        <button
          onClick={() => {
            setShowHighlightPicker(!showHighlightPicker);
            setShowColorPicker(false);
          }}
          title="Highlight Color"
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-[#333] flex items-center"
        >
          <Highlighter className="w-3.5 h-3.5 text-amber-500" />
        </button>
        {showHighlightPicker && (
          <div className="absolute left-0 top-full mt-1 p-1.5 bg-white dark:bg-[#2d2d2d] border border-gray-300 dark:border-gray-600 rounded-md shadow-xl grid grid-cols-3 gap-1 z-50">
            {MINI_HIGHLIGHTS.map((c) => (
              <button
                key={c}
                onClick={() => {
                  editor.chain().focus().toggleHighlight({ color: c }).run();
                  setShowHighlightPicker(false);
                }}
                className="w-4 h-4 rounded-xs border border-gray-300 hover:scale-110"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="w-[1px] h-3.5 bg-gray-200 dark:bg-gray-700 mx-0.5" />

      {/* Link */}
      <button
        onClick={handleLink}
        title="Insert Link"
        className={`p-1 rounded ${
          editor.isActive('link')
            ? 'bg-[#185abd] text-white'
            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#333]'
        }`}
      >
        <LinkIcon className="w-3.5 h-3.5 text-blue-500" />
      </button>

      {/* Clear Formatting */}
      <button
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
        title="Clear Formatting"
        className="p-1 rounded text-gray-500 hover:bg-gray-100 dark:hover:bg-[#333]"
      >
        <RemoveFormatting className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
