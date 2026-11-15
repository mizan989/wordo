import React, { useState, useEffect, useRef } from 'react';
import { Editor } from '@tiptap/react';
import {
  Scissors,
  Copy,
  Clipboard,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Highlighter,
  Baseline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Sparkles,
  Languages,
  Volume2,
  Table as TableIcon,
  Plus,
  Trash2,
  RemoveFormatting,
  ChevronRight,
  Check,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { FONT_SIZE_STEPS } from '../extensions/typography';
import { SpellService } from '../services/spellService';

const CONTEXT_FONTS = [
  'Aptos',
  'Calibri',
  'Segoe UI',
  'Arial',
  'Times New Roman',
  'Georgia',
  'Consolas',
  'Garamond',
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

const SYNONYMS_MAP: Record<string, string[]> = {
  good: ['excellent', 'fine', 'superior', 'commendable', 'beneficial'],
  bad: ['poor', 'inferior', 'unfavorable', 'adverse', 'harmful'],
  big: ['large', 'substantial', 'sizable', 'grand', 'extensive'],
  small: ['compact', 'diminutive', 'minor', 'modest', 'slight'],
  happy: ['pleased', 'delighted', 'content', 'cheerful', 'gratified'],
  important: ['crucial', 'vital', 'essential', 'significant', 'paramount'],
  fast: ['rapid', 'swift', 'speedy', 'quick', 'brisk'],
  problem: ['issue', 'challenge', 'complication', 'obstacle', 'difficulty'],
  solution: ['remedy', 'resolution', 'answer', 'fix', 'approach'],
  change: ['modify', 'alter', 'adjust', 'transform', 'revise'],
  show: ['display', 'exhibit', 'demonstrate', 'reveal', 'indicate'],
  use: ['utilize', 'apply', 'employ', 'adopt', 'leverage'],
  create: ['produce', 'generate', 'form', 'scaffold', 'establish'],
  write: ['compose', 'draft', 'author', 'record', 'inscribe'],
  help: ['assist', 'support', 'facilitate', 'aid', 'succor'],
  start: ['initiate', 'commence', 'launch', 'begin', 'embark'],
  stop: ['halt', 'terminate', 'cease', 'discontinue', 'pause'],
  work: ['labor', 'function', 'operate', 'perform', 'endeavor'],
  check: ['verify', 'inspect', 'examine', 'audit', 'validate'],
  new: ['fresh', 'novel', 'recent', 'modern', 'innovative'],
};

interface EditorContextMenuProps {
  editor: Editor | null;
  isOpen: boolean;
  x: number;
  y: number;
  onClose: () => void;
  onOpenTranslate?: (text: string) => void;
  onReadAloud?: (text: string) => void;
}

export const EditorContextMenu: React.FC<EditorContextMenuProps> = ({
  editor,
  isOpen,
  x,
  y,
  onClose,
  onOpenTranslate,
  onReadAloud,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showSynonymsSubmenu, setShowSynonymsSubmenu] = useState(false);
  const [pos, setPos] = useState({ top: y, left: x });

  // Compute position clamped within viewport bounds
  useEffect(() => {
    if (!isOpen) return;
    const menuWidth = 280;
    const menuHeight = 440;
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;

    let adjustedLeft = x;
    let adjustedTop = y;

    if (x + menuWidth > winWidth - 16) {
      adjustedLeft = Math.max(16, winWidth - menuWidth - 16);
    }
    if (y + menuHeight > winHeight - 16) {
      adjustedTop = Math.max(16, winHeight - menuHeight - 16);
    }

    setPos({ top: adjustedTop, left: adjustedLeft });
  }, [isOpen, x, y]);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleScroll = () => {
      onClose();
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !editor) return null;

  const { state } = editor;
  const { selection } = state;
  const isTableActive = editor.isActive('table');
  const currentFont = editor.getAttributes('textStyle')?.fontFamily || 'Aptos';
  const currentSize = editor.getAttributes('textStyle')?.fontSize || '11';

  // Get current text or word under cursor
  let selectedText = '';
  let currentWord = '';
  let wordFrom = selection.from;
  let wordTo = selection.to;

  if (!selection.empty) {
    selectedText = state.doc.textBetween(selection.from, selection.to, ' ');
    currentWord = selectedText.trim().toLowerCase();
  } else {
    const { $from } = selection;
    const text = $from.parent.textBetween(0, $from.parent.content.size, undefined, '\uFFFC');
    const offset = $from.parentOffset;
    let start = offset;
    let end = offset;
    while (start > 0 && /\S/.test(text[start - 1])) start--;
    while (end < text.length && /\S/.test(text[end])) end++;
    if (start < end) {
      wordFrom = $from.start() + start;
      wordTo = $from.start() + end;
      currentWord = text.substring(start, end).replace(/[.,!?;:]/g, '').trim().toLowerCase();
      selectedText = text.substring(start, end);
    }
  }

  // Check if current word has spelling issues
  const spellIssues = currentWord ? SpellService.checkText(currentWord) : [];
  const currentSpellIssue = spellIssues.find(
    (issue) => issue.word.toLowerCase() === currentWord.toLowerCase()
  );

  // Check if synonyms exist for current word
  const cleanWord = currentWord.replace(/[^a-zA-Z]/g, '');
  const synonyms = SYNONYMS_MAP[cleanWord] || [];

  const handleApplyFormatting = (action: () => void) => {
    action();
  };

  const handleReplaceWord = (replacement: string) => {
    editor.chain().focus().setTextSelection({ from: wordFrom, to: wordTo }).insertContent(replacement).run();
    onClose();
  };

  const handleLink = () => {
    const previousUrl = editor.getAttributes('link')?.href;
    const url = window.prompt('Enter Web Address (URL):', previousUrl || 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().setLink({ href: url }).run();
    }
    onClose();
  };

  return (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        top: `${pos.top}px`,
        left: `${pos.left}px`,
        zIndex: 9999,
      }}
      className="w-72 bg-white dark:bg-[#252526] text-gray-800 dark:text-gray-100 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 py-1.5 text-xs select-none animate-in fade-in zoom-in-95 duration-100 font-sans"
    >
      {/* 1. Top Quick Mini-Formatting Strip */}
      <div
        onMouseDown={(e) => e.preventDefault()}
        className="px-2 py-1 pb-2 border-b border-gray-200 dark:border-gray-700 flex flex-col space-y-1.5 bg-gray-50/70 dark:bg-[#202020] rounded-t"
      >
        {/* Row 1: Font & Size */}
        <div className="flex items-center space-x-1">
          <select
            value={currentFont}
            onChange={(e) => {
              const val = e.target.value;
              if (!selection.empty) {
                editor.chain().focus().setMark('textStyle', { fontFamily: val }).run();
              } else {
                (editor.commands as any).setFontFamily(val);
              }
            }}
            className="h-6 px-1.5 bg-white dark:bg-[#2d2d2d] border border-gray-300 dark:border-gray-600 rounded text-[11px] outline-hidden flex-1 truncate"
            title="Font Family"
          >
            {CONTEXT_FONTS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>

          <select
            value={currentSize}
            onChange={(e) => {
              const val = e.target.value;
              if (!selection.empty) {
                editor.chain().focus().setMark('textStyle', { fontSize: val }).run();
              } else {
                (editor.commands as any).setFontSize(val);
              }
            }}
            className="h-6 px-1 bg-white dark:bg-[#2d2d2d] border border-gray-300 dark:border-gray-600 rounded text-[11px] outline-hidden w-14"
            title="Font Size"
          >
            {FONT_SIZE_STEPS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            onClick={() => (editor.commands as any).growFontSize()}
            title="Grow Font"
            className="h-6 px-1 rounded hover:bg-gray-200 dark:hover:bg-[#333] font-bold text-[10px]"
          >
            A+
          </button>
          <button
            onClick={() => (editor.commands as any).shrinkFontSize()}
            title="Shrink Font"
            className="h-6 px-1 rounded hover:bg-gray-200 dark:hover:bg-[#333] text-[10px]"
          >
            A-
          </button>
        </div>

        {/* Row 2: Mark buttons (Bold, Italic, Underline, Strike, Colors, List, Align) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-0.5">
            <button
              onClick={() => handleApplyFormatting(() => editor.chain().focus().toggleBold().run())}
              title="Bold (Ctrl+B)"
              className={`p-1 rounded transition-colors ${
                editor.isActive('bold')
                  ? 'bg-[#185abd] text-white'
                  : 'hover:bg-gray-200 dark:hover:bg-[#333]'
              }`}
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleApplyFormatting(() => editor.chain().focus().toggleItalic().run())}
              title="Italic (Ctrl+I)"
              className={`p-1 rounded transition-colors ${
                editor.isActive('italic')
                  ? 'bg-[#185abd] text-white'
                  : 'hover:bg-gray-200 dark:hover:bg-[#333]'
              }`}
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleApplyFormatting(() => editor.chain().focus().toggleUnderline().run())}
              title="Underline (Ctrl+U)"
              className={`p-1 rounded transition-colors ${
                editor.isActive('underline')
                  ? 'bg-[#185abd] text-white'
                  : 'hover:bg-gray-200 dark:hover:bg-[#333]'
              }`}
            >
              <Underline className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleApplyFormatting(() => editor.chain().focus().toggleStrike().run())}
              title="Strikethrough"
              className={`p-1 rounded transition-colors ${
                editor.isActive('strike')
                  ? 'bg-[#185abd] text-white'
                  : 'hover:bg-gray-200 dark:hover:bg-[#333]'
              }`}
            >
              <Strikethrough className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center space-x-0.5">
            {/* Color Picker */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowColorPicker(!showColorPicker);
                  setShowHighlightPicker(false);
                }}
                title="Font Color"
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-[#333] flex items-center"
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

            {/* Highlighter Picker */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowHighlightPicker(!showHighlightPicker);
                  setShowColorPicker(false);
                }}
                title="Highlight Color"
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-[#333] flex items-center"
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

            {/* List */}
            <button
              onClick={() => handleApplyFormatting(() => editor.chain().focus().toggleBulletList().run())}
              title="Bullet List"
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-[#333]"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleApplyFormatting(() => editor.chain().focus().toggleOrderedList().run())}
              title="Numbered List"
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-[#333]"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>

            {/* Clear Formatting */}
            <button
              onClick={() => handleApplyFormatting(() => editor.chain().focus().unsetAllMarks().run())}
              title="Clear Formatting"
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-[#333] text-gray-500 hover:text-red-500"
            >
              <RemoveFormatting className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Spelling Suggestions (if misspelled word clicked) */}
      {currentSpellIssue && currentSpellIssue.suggestions.length > 0 && (
        <div className="py-1 border-b border-gray-200 dark:border-gray-700 bg-amber-50/50 dark:bg-amber-950/20">
          <div className="px-3 py-0.5 text-[10px] text-amber-700 dark:text-amber-400 font-semibold uppercase flex items-center space-x-1">
            <Sparkles className="w-3 h-3" />
            <span>Spelling Suggestion</span>
          </div>
          {currentSpellIssue.suggestions.slice(0, 3).map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleReplaceWord(suggestion)}
              className="w-full text-left px-3 py-1 text-xs font-semibold text-[#185abd] dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/40 flex items-center space-x-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{suggestion}</span>
            </button>
          ))}
        </div>
      )}

      {/* 3. Standard Edit Operations: Cut, Copy, Paste */}
      <div className="py-1">
        <button
          onClick={() => {
            document.execCommand('cut');
            onClose();
          }}
          className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
        >
          <span className="flex items-center">
            <Scissors className="w-3.5 h-3.5 mr-2 text-gray-500" /> Cut
          </span>
          <span className="text-[10px] text-gray-400">Ctrl+X</span>
        </button>

        <button
          onClick={() => {
            document.execCommand('copy');
            onClose();
          }}
          className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
        >
          <span className="flex items-center">
            <Copy className="w-3.5 h-3.5 mr-2 text-gray-500" /> Copy
          </span>
          <span className="text-[10px] text-gray-400">Ctrl+C</span>
        </button>

        <button
          onClick={async () => {
            try {
              const text = await navigator.clipboard.readText();
              if (text) {
                editor.commands.insertContent(text);
              }
            } catch (err) {
              document.execCommand('paste');
            }
            onClose();
          }}
          className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
        >
          <span className="flex items-center">
            <Clipboard className="w-3.5 h-3.5 mr-2 text-[#185abd]" /> Paste
          </span>
          <span className="text-[10px] text-gray-400">Ctrl+V</span>
        </button>
      </div>

      <div className="h-[1px] bg-gray-200 dark:bg-gray-700 my-0.5" />

      {/* 4. Smart Word & Selection Tools: Synonyms, Translate, Read Aloud */}
      <div className="py-1">
        {/* Synonyms / Thesaurus */}
        {synonyms.length > 0 && (
          <div className="relative group/syn">
            <div
              onMouseEnter={() => setShowSynonymsSubmenu(true)}
              className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer"
            >
              <span className="flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-2 text-indigo-500" /> Synonyms
              </span>
              <ChevronRight className="w-3 h-3 text-gray-400" />
            </div>
            {showSynonymsSubmenu && (
              <div
                onMouseLeave={() => setShowSynonymsSubmenu(false)}
                className="absolute left-full top-0 w-48 bg-white dark:bg-[#252526] border border-gray-200 dark:border-gray-700 rounded-md shadow-2xl py-1 z-50 animate-in fade-in-50"
              >
                <div className="px-2.5 py-1 text-[10px] text-gray-400 font-semibold uppercase">
                  Synonyms for "{cleanWord}"
                </div>
                {synonyms.map((syn) => (
                  <button
                    key={syn}
                    onClick={() => handleReplaceWord(syn)}
                    className="w-full text-left px-3 py-1 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-gray-800 dark:text-gray-200 text-xs"
                  >
                    {syn}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Translate */}
        {selectedText && (
          <button
            onClick={() => {
              onOpenTranslate?.(selectedText);
              onClose();
            }}
            className="w-full px-3 py-1.5 flex items-center hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
          >
            <Languages className="w-3.5 h-3.5 mr-2 text-blue-600" />
            <span className="truncate">Translate "{selectedText.slice(0, 15)}..."</span>
          </button>
        )}

        {/* Read Aloud */}
        <button
          onClick={() => {
            onReadAloud?.(selectedText || state.doc.textBetween(0, state.doc.content.size, ' '));
            onClose();
          }}
          className="w-full px-3 py-1.5 flex items-center hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
        >
          <Volume2 className="w-3.5 h-3.5 mr-2 text-teal-600" />
          <span>Read Aloud</span>
        </button>

        {/* Link */}
        <button
          onClick={handleLink}
          className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
        >
          <span className="flex items-center">
            <LinkIcon className="w-3.5 h-3.5 mr-2 text-blue-500" />
            <span>{editor.isActive('link') ? 'Edit Link' : 'Link...'}</span>
          </span>
          <span className="text-[10px] text-gray-400">Ctrl+K</span>
        </button>
      </div>

      {/* 5. Table Operations (if inside a table) */}
      {isTableActive && (
        <>
          <div className="h-[1px] bg-gray-200 dark:bg-gray-700 my-0.5" />
          <div className="py-1">
            <div className="px-3 py-0.5 text-[10px] text-gray-400 font-semibold uppercase flex items-center space-x-1">
              <TableIcon className="w-3 h-3 text-[#185abd]" />
              <span>Table Tools</span>
            </div>
            <button
              onClick={() => {
                editor.chain().focus().addRowBefore().run();
                onClose();
              }}
              className="w-full px-3 py-1 flex items-center hover:bg-blue-50 dark:hover:bg-blue-900/30"
            >
              <Plus className="w-3 h-3 mr-2 text-emerald-600" /> Insert Row Above
            </button>
            <button
              onClick={() => {
                editor.chain().focus().addRowAfter().run();
                onClose();
              }}
              className="w-full px-3 py-1 flex items-center hover:bg-blue-50 dark:hover:bg-blue-900/30"
            >
              <Plus className="w-3 h-3 mr-2 text-emerald-600" /> Insert Row Below
            </button>
            <button
              onClick={() => {
                editor.chain().focus().addColumnBefore().run();
                onClose();
              }}
              className="w-full px-3 py-1 flex items-center hover:bg-blue-50 dark:hover:bg-blue-900/30"
            >
              <Plus className="w-3 h-3 mr-2 text-blue-600" /> Insert Column Left
            </button>
            <button
              onClick={() => {
                editor.chain().focus().addColumnAfter().run();
                onClose();
              }}
              className="w-full px-3 py-1 flex items-center hover:bg-blue-50 dark:hover:bg-blue-900/30"
            >
              <Plus className="w-3 h-3 mr-2 text-blue-600" /> Insert Column Right
            </button>
            <button
              onClick={() => {
                editor.chain().focus().deleteRow().run();
                onClose();
              }}
              className="w-full px-3 py-1 flex items-center text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <Trash2 className="w-3 h-3 mr-2" /> Delete Row
            </button>
            <button
              onClick={() => {
                editor.chain().focus().deleteColumn().run();
                onClose();
              }}
              className="w-full px-3 py-1 flex items-center text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <Trash2 className="w-3 h-3 mr-2" /> Delete Column
            </button>
            <button
              onClick={() => {
                editor.chain().focus().deleteTable().run();
                onClose();
              }}
              className="w-full px-3 py-1 flex items-center text-red-700 hover:bg-red-100 dark:hover:bg-red-950/40 font-medium"
            >
              <Trash2 className="w-3 h-3 mr-2" /> Delete Table
            </button>
          </div>
        </>
      )}

      <div className="h-[1px] bg-gray-200 dark:bg-gray-700 my-0.5" />

      {/* 6. Select All */}
      <div className="py-0.5">
        <button
          onClick={() => {
            editor.chain().focus().selectAll().run();
            onClose();
          }}
          className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
        >
          <span>Select All</span>
          <span className="text-[10px] text-gray-400">Ctrl+A</span>
        </button>
      </div>
    </div>
  );
};
