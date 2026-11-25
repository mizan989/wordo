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
  Check,
} from 'lucide-react';
import { FONT_SIZE_STEPS } from '../extensions/typography';
import { CLOUD_FONTS, STANDARD_FONTS } from './RibbonToolbar';
import { useUserFonts } from '../services/userFonts';

const MINI_COLORS = [
  '#000000',
  '#007AFF',
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
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  
  const toolbarRef = useRef<HTMLDivElement>(null);
  const lastSelectionRef = useRef<any>(null);
  const isInteractingRef = useRef(false);

  useEffect(() => {
    if (!editor) return;

    const updatePosition = () => {
      const { selection } = editor.state;
      if (selection.empty || !editor.isFocused) {
        if (!isInteractingRef.current) {
          setPosition(null);
          setShowFontDropdown(false);
          setShowSizeDropdown(false);
          setShowColorPicker(false);
          setShowHighlightPicker(false);
        }
        return;
      }

      // Save selection whenever it updates
      lastSelectionRef.current = selection;

      try {
        const fromCoords = editor.view.coordsAtPos(selection.from);
        const toCoords = editor.view.coordsAtPos(selection.to);
        const left = (fromCoords.left + toCoords.left) / 2;
        const top = fromCoords.top - 54;

        if (top > 10 && left > 10) {
          setPosition({ top, left });
        } else {
          setPosition({ top: toCoords.bottom + 10, left });
        }
      } catch (e) {
        if (!isInteractingRef.current) {
          setPosition(null);
        }
      }
    };

    editor.on('selectionUpdate', updatePosition);
    editor.on('blur', () => {
      setTimeout(() => {
        if (isInteractingRef.current) return;
        if (!toolbarRef.current?.contains(document.activeElement)) {
          setPosition(null);
          setShowFontDropdown(false);
          setShowSizeDropdown(false);
          setShowColorPicker(false);
          setShowHighlightPicker(false);
        }
      }, 200);
    });

    const handleGlobalMouseDown = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        isInteractingRef.current = false;
        setShowFontDropdown(false);
        setShowSizeDropdown(false);
        setShowColorPicker(false);
        setShowHighlightPicker(false);
      }
    };

    window.addEventListener('mousedown', handleGlobalMouseDown);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      editor.off('selectionUpdate', updatePosition);
      window.removeEventListener('mousedown', handleGlobalMouseDown);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [editor]);

  const myFonts = useUserFonts(); // hooks must run before the early return below

  if (!editor || !position) return null;

  const currentFont = editor.getAttributes('textStyle')?.fontFamily || 'Aptos';
  const currentSize = editor.getAttributes('textStyle')?.fontSize || '11';

  const handleApplyFont = (font: string) => {
    isInteractingRef.current = false;
    setShowFontDropdown(false);
    if (!editor) return;

    const sel = lastSelectionRef.current || editor.state.selection;
    if (sel && !sel.empty) {
      editor
        .chain()
        .focus()
        .setTextSelection({ from: sel.from, to: sel.to })
        .setMark('textStyle', { fontFamily: font })
        .setTextSelection({ from: sel.from, to: sel.to })
        .run();
    } else {
      (editor.commands as any).setFontFamily(font);
    }
  };

  const handleApplySize = (size: string) => {
    isInteractingRef.current = false;
    setShowSizeDropdown(false);
    if (!editor) return;

    const sel = lastSelectionRef.current || editor.state.selection;
    if (sel && !sel.empty) {
      editor
        .chain()
        .focus()
        .setTextSelection({ from: sel.from, to: sel.to })
        .setMark('textStyle', { fontSize: size })
        .setTextSelection({ from: sel.from, to: sel.to })
        .run();
    } else {
      (editor.commands as any).setFontSize(size);
    }
  };

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
      onMouseDown={(e) => {
        // Prevent default so editor does not lose focus, but allow clicking controls
        e.preventDefault();
      }}
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translateX(-50%)',
        zIndex: 100,
      }}
      className="flex items-center space-x-1 p-1 bg-[var(--surface-floating)] border border-[var(--border-color)] rounded-[var(--radius-lg)] shadow-[var(--shadow-popover)] text-xs select-none backdrop-blur-md"
    >
      {/* 1. Custom Font Family Dropdown */}
      <div className="relative">
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            lastSelectionRef.current = editor.state.selection;
            isInteractingRef.current = !showFontDropdown;
            setShowFontDropdown(!showFontDropdown);
            setShowSizeDropdown(false);
            setShowColorPicker(false);
            setShowHighlightPicker(false);
          }}
          className="h-6 px-1.5 bg-[var(--surface-secondary)] hover:bg-[var(--hover-bg)] border border-[var(--border-color)] rounded-[var(--radius-md)] text-[11px] flex items-center justify-between space-x-1 w-24 text-[var(--text-primary)] font-medium transition-colors"
          title="Font Family"
        >
          <span className="truncate">{currentFont}</span>
          <ChevronDown className="w-2.5 h-2.5 opacity-60 flex-shrink-0" />
        </button>

        {showFontDropdown && (
          <div
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="absolute left-0 top-full mt-1 w-48 max-h-60 overflow-y-auto bg-[var(--surface-floating)] border border-[var(--border-color)] rounded-[var(--radius-lg)] shadow-[var(--shadow-popover)] py-1 z-50 text-xs"
          >
            {myFonts.length > 0 && (
              <>
                <div className="px-2 py-0.5 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                  My Fonts
                </div>
                {myFonts.map((m) => (
                  <button
                    key={m.family}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleApplyFont(m.family);
                    }}
                    className={`w-full text-left px-2.5 py-1 flex items-center justify-between hover:bg-[var(--hover-bg)] text-[11px] ${
                      currentFont === m.family ? 'text-[var(--accent-color)] font-semibold bg-[var(--selection-bg)]' : 'text-[var(--text-primary)]'
                    }`}
                    style={{ fontFamily: `"${m.family}", sans-serif` }}
                  >
                    <span className="truncate">{m.family}</span>
                    {currentFont === m.family && <Check className="w-3 h-3 text-[var(--accent-color)] flex-shrink-0" />}
                  </button>
                ))}
              </>
            )}
            <div className="px-2 py-0.5 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider border-t border-gray-100 dark:border-gray-800 mt-1 pt-1">
              Cloud Fonts
            </div>
            {CLOUD_FONTS.map((font) => (
              <button
                key={font}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleApplyFont(font);
                }}
                className={`w-full text-left px-2.5 py-1 flex items-center justify-between hover:bg-[var(--hover-bg)] text-[11px] ${
                  currentFont === font ? 'text-[var(--accent-color)] font-semibold bg-[var(--selection-bg)]' : 'text-[var(--text-primary)]'
                }`}
                style={{ fontFamily: `"${font}", sans-serif` }}
              >
                <span className="truncate">{font}</span>
                {currentFont === font && <Check className="w-3 h-3 text-[var(--accent-color)] flex-shrink-0" />}
              </button>
            ))}

            <div className="px-2 py-0.5 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider border-t border-gray-100 dark:border-gray-800 mt-1 pt-1">
              Standard Fonts
            </div>
            {STANDARD_FONTS.map((font) => (
              <button
                key={font}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleApplyFont(font);
                }}
                className={`w-full text-left px-2.5 py-1 flex items-center justify-between hover:bg-[var(--hover-bg)] text-[11px] ${
                  currentFont === font ? 'text-[var(--accent-color)] font-semibold bg-[var(--selection-bg)]' : 'text-[var(--text-primary)]'
                }`}
                style={{ fontFamily: `"${font}", sans-serif` }}
              >
                <span className="truncate">{font}</span>
                {currentFont === font && <Check className="w-3 h-3 text-[var(--accent-color)] flex-shrink-0" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. Custom Font Size Dropdown */}
      <div className="relative">
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            lastSelectionRef.current = editor.state.selection;
            isInteractingRef.current = !showSizeDropdown;
            setShowSizeDropdown(!showSizeDropdown);
            setShowFontDropdown(false);
            setShowColorPicker(false);
            setShowHighlightPicker(false);
          }}
          className="h-6 px-1 bg-[var(--surface-secondary)] hover:bg-[var(--hover-bg)] border border-[var(--border-color)] rounded-[var(--radius-md)] text-[11px] flex items-center justify-between space-x-0.5 w-12 text-[var(--text-primary)] font-medium transition-colors"
          title="Font Size"
        >
          <span>{currentSize}</span>
          <ChevronDown className="w-2.5 h-2.5 opacity-60 flex-shrink-0" />
        </button>

        {showSizeDropdown && (
          <div
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="absolute left-0 top-full mt-1 w-16 max-h-48 overflow-y-auto bg-[var(--surface-floating)] border border-[var(--border-color)] rounded-[var(--radius-lg)] shadow-[var(--shadow-popover)] py-1 z-50 text-xs"
          >
            {FONT_SIZE_STEPS.map((s) => (
              <button
                key={s}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleApplySize(`${s}`);
                }}
                className={`w-full text-center py-1 text-[11px] hover:bg-[var(--hover-bg)] ${
                  `${currentSize}` === `${s}` ? 'text-[var(--accent-color)] font-semibold bg-[var(--selection-bg)]' : 'text-[var(--text-primary)]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grow / Shrink */}
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          (editor.commands as any).growFontSize();
        }}
        title="Grow Font"
        className="p-1 rounded hover:bg-[var(--hover-bg)] flex items-center text-[10px] font-bold text-[var(--text-primary)]"
      >
        A<ChevronUp className="w-2.5 h-2.5 -ml-0.5 text-blue-600" />
      </button>
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          (editor.commands as any).shrinkFontSize();
        }}
        title="Shrink Font"
        className="p-1 rounded hover:bg-[var(--hover-bg)] flex items-center text-[10px] text-[var(--text-primary)]"
      >
        A<ChevronDown className="w-2.5 h-2.5 -ml-0.5 text-blue-600" />
      </button>

      <div className="w-[1px] h-3.5 bg-[var(--border-subtle)] mx-0.5" />

      {/* Formatting buttons */}
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBold().run();
        }}
        title="Bold"
        className={`p-1 rounded transition-colors ${
          editor.isActive('bold')
            ? 'bg-[var(--selection-bg)] text-[var(--accent-color)] font-medium rounded-[var(--radius-sm)]'
            : 'text-[var(--text-primary)] hover:bg-[var(--hover-bg)]'
        }`}
      >
        <Bold className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleItalic().run();
        }}
        title="Italic"
        className={`p-1 rounded transition-colors ${
          editor.isActive('italic')
            ? 'bg-[var(--selection-bg)] text-[var(--accent-color)] font-medium rounded-[var(--radius-sm)]'
            : 'text-[var(--text-primary)] hover:bg-[var(--hover-bg)]'
        }`}
      >
        <Italic className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleUnderline().run();
        }}
        title="Underline"
        className={`p-1 rounded transition-colors ${
          editor.isActive('underline')
            ? 'bg-[var(--selection-bg)] text-[var(--accent-color)] font-medium rounded-[var(--radius-sm)]'
            : 'text-[var(--text-primary)] hover:bg-[var(--hover-bg)]'
        }`}
      >
        <Underline className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleStrike().run();
        }}
        title="Strikethrough"
        className={`p-1 rounded transition-colors ${
          editor.isActive('strike')
            ? 'bg-[var(--selection-bg)] text-[var(--accent-color)] font-medium rounded-[var(--radius-sm)]'
            : 'text-[var(--text-primary)] hover:bg-[var(--hover-bg)]'
        }`}
      >
        <Strikethrough className="w-3.5 h-3.5" />
      </button>

      {/* Text Color */}
      <div className="relative">
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            lastSelectionRef.current = editor.state.selection;
            isInteractingRef.current = !showColorPicker;
            setShowColorPicker(!showColorPicker);
            setShowHighlightPicker(false);
            setShowFontDropdown(false);
            setShowSizeDropdown(false);
          }}
          title="Font Color"
          className="p-1 rounded hover:bg-[var(--hover-bg)] flex items-center"
        >
          <Baseline className="w-3.5 h-3.5 text-red-600" />
        </button>
        {showColorPicker && (
          <div
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="absolute left-0 top-full mt-1 p-2 bg-[var(--surface-floating)] border border-[var(--border-color)] rounded-[var(--radius-lg)] shadow-[var(--shadow-popover)] grid grid-cols-4 gap-1.5 z-50 w-[96px] min-w-[96px]"
          >
            {MINI_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  isInteractingRef.current = false;
                  editor.chain().focus().setColor(c).run();
                  setShowColorPicker(false);
                }}
                className="w-4 h-4 shrink-0 rounded-xs border border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Highlighter */}
      <div className="relative">
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            lastSelectionRef.current = editor.state.selection;
            isInteractingRef.current = !showHighlightPicker;
            setShowHighlightPicker(!showHighlightPicker);
            setShowColorPicker(false);
            setShowFontDropdown(false);
            setShowSizeDropdown(false);
          }}
          title="Highlight Color"
          className="p-1 rounded hover:bg-[var(--hover-bg)] flex items-center"
        >
          <Highlighter className="w-3.5 h-3.5 text-amber-500" />
        </button>
        {showHighlightPicker && (
          <div
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="absolute left-0 top-full mt-1 p-2 bg-[var(--surface-floating)] border border-[var(--border-color)] rounded-[var(--radius-lg)] shadow-[var(--shadow-popover)] grid grid-cols-3 gap-1.5 z-50 w-[76px] min-w-[76px]"
          >
            {MINI_HIGHLIGHTS.map((c) => (
              <button
                key={c}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  isInteractingRef.current = false;
                  editor.chain().focus().toggleHighlight({ color: c }).run();
                  setShowHighlightPicker(false);
                }}
                className="w-4 h-4 shrink-0 rounded-xs border border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="w-[1px] h-3.5 bg-[var(--border-subtle)] mx-0.5" />

      {/* Link */}
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          handleLink();
        }}
        title="Insert Link"
        className={`p-1 rounded ${
          editor.isActive('link')
            ? 'bg-[var(--selection-bg)] text-[var(--accent-color)] font-medium rounded-[var(--radius-sm)]'
            : 'text-[var(--text-primary)] hover:bg-[var(--hover-bg)]'
        }`}
      >
        <LinkIcon className="w-3.5 h-3.5 text-blue-500" />
      </button>

      {/* Clear Formatting */}
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().unsetAllMarks().run();
        }}
        title="Clear Formatting"
        className="p-1 rounded text-gray-500 hover:bg-[var(--hover-bg)]"
      >
        <RemoveFormatting className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
