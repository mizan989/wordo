import React, { useState, useEffect, useRef } from 'react';
import {
  Scissors,
  Copy,
  Clipboard,
  Paintbrush,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  Highlighter,
  Baseline,
  RemoveFormatting,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  CheckSquare,
  Indent,
  Outdent,
  Table as TableIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  Search,
  Sparkles,
  FileDown,
  Printer,
  ChevronDown,
  ChevronUp,
  Quote,
  Code,
  Minus,
  FileText,
  FileCheck,
  Check,
  Calendar,
  Palette,
  Columns,
  Trash2,
  Plus,
} from 'lucide-react';
import { Editor } from '@tiptap/react';
import { FONT_SIZE_STEPS } from '../extensions/typography';

interface RibbonToolbarProps {
  editor: Editor | null;
  onOpenSearch: () => void;
  onOpenSpellCheck: () => void;
  onOpenWordCount: () => void;
  onOpenRecovery: () => void;
  onExportDocx: () => void;
  onExportPdf: () => void;
  onOpenSettings?: () => void;
  currentZoom: number;
  onZoomChange: (zoom: number) => void;
  showRuler: boolean;
  onToggleRuler: () => void;
  showNavSidebar: boolean;
  onToggleNavSidebar: () => void;
  pageSettings?: any;
  onUpdatePageSettings?: (settings: any) => void;
}

const FONT_FAMILIES = [
  'Aptos',
  'Aptos Display',
  'Calibri',
  'Calibri Light',
  'Segoe UI',
  'Segoe UI Variable',
  'Arial',
  'Arial Black',
  'Times New Roman',
  'Georgia',
  'Garamond',
  'Cambria',
  'Verdana',
  'Tahoma',
  'Trebuchet MS',
  'Century Gothic',
  'Book Antiqua',
  'Consolas',
  'Courier New',
  'Comic Sans MS',
  'Impact',
];

const FONT_SIZES = ['8', '9', '10', '10.5', '11', '12', '14', '16', '18', '20', '22', '24', '26', '28', '36', '48', '72'];

// Microsoft Office Theme Colors
const THEME_BASE_COLORS = [
  '#ffffff',
  '#000000',
  '#e7e6e6',
  '#44546a',
  '#4472c4',
  '#ed7d31',
  '#a5a5a5',
  '#ffc000',
  '#5b9bd5',
  '#70ad47',
];

const THEME_SHADES = [
  ['#f2f2f2', '#7f7f7f', '#d0cece', '#d6dce4', '#d9e1f2', '#fce4d6', '#ededed', '#fff2cc', '#deebf7', '#e2efda'],
  ['#d9d9d9', '#595959', '#aeabab', '#acb9ca', '#b4c6e7', '#f8cbad', '#dbdbdb', '#ffe699', '#bdd7ee', '#c6e0b4'],
  ['#bfbfbf', '#3f3f3f', '#757171', '#8497b0', '#8ea9db', '#f4b084', '#c9c9c9', '#ffd966', '#9bc2e6', '#a9d08e'],
  ['#a6a6a6', '#262626', '#3a3838', '#333f48', '#305496', '#c65911', '#7b7b7b', '#bf8f00', '#2f5597', '#548235'],
  ['#7f7f7f', '#0c0c0c', '#161616', '#222a35', '#203764', '#833c0c', '#525252', '#806000', '#1f3864', '#375623'],
];

const STANDARD_COLORS = [
  '#c00000',
  '#ff0000',
  '#ffc000',
  '#ffff00',
  '#92d050',
  '#00b050',
  '#00b0f0',
  '#0070c0',
  '#002060',
  '#7030a0',
];

const WORD_HIGHLIGHT_COLORS = [
  { name: 'Yellow', color: '#ffff00' },
  { name: 'Bright Green', color: '#00ff00' },
  { name: 'Turquoise', color: '#00ffff' },
  { name: 'Pink', color: '#ff00ff' },
  { name: 'Blue', color: '#0000ff' },
  { name: 'Red', color: '#ff0000' },
  { name: 'Dark Blue', color: '#000080' },
  { name: 'Teal', color: '#008080' },
  { name: 'Green', color: '#008000' },
  { name: 'Violet', color: '#800080' },
  { name: 'Dark Red', color: '#800000' },
  { name: 'Dark Yellow', color: '#808000' },
  { name: '50% Gray', color: '#808080' },
  { name: '25% Gray', color: '#c0c0c0' },
  { name: 'Black', color: '#000000' },
];

const SPECIAL_SYMBOLS = [
  '©', '®', '™', '€', '£', '¥', '₹', '¢', '§', '¶',
  '°', '±', '≠', '≤', '≥', '×', '÷', '√', '∞', 'π',
  '∑', 'µ', 'Ω', '←', '↑', '→', '↓', '—', '–', '•',
  '★', '✓', '✗', '½', '¼', '¾', '‰', 'α', 'β', 'λ',
];

const PAGE_COLORS = [
  { name: 'Standard White', color: '#ffffff' },
  { name: 'Classic Cream', color: '#fdf6e2' },
  { name: 'Warm Sepia', color: '#fbf0d9' },
  { name: 'Mint Fresh', color: '#f0fdf4' },
  { name: 'Soft Blue', color: '#f0f9ff' },
  { name: 'Charcoal Dark', color: '#1e293b' },
];

const WATERMARK_PRESETS = [
  'CONFIDENTIAL',
  'DRAFT',
  'DO NOT COPY',
  'URGENT',
  'SAMPLE',
  'ORIGINAL',
];

export const RibbonToolbar: React.FC<RibbonToolbarProps> = ({
  editor,
  onOpenSearch,
  onOpenSpellCheck,
  onOpenWordCount,
  onOpenRecovery,
  onExportDocx,
  onExportPdf,
  onOpenSettings,
  currentZoom,
  onZoomChange,
  showRuler,
  onToggleRuler,
  showNavSidebar,
  onToggleNavSidebar,
  pageSettings,
  onUpdatePageSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'insert' | 'layout' | 'view' | 'tools' | 'table'>('home');
  const [selectedFont, setSelectedFont] = useState('Aptos');
  const [customFontSize, setCustomFontSize] = useState<string | null>(null);
  const [showFontSizeDropdown, setShowFontSizeDropdown] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showCaseMenu, setShowCaseMenu] = useState(false);
  const [showSpacingMenu, setShowSpacingMenu] = useState(false);
  const [showTablePicker, setShowTablePicker] = useState(false);
  const [showSymbolPicker, setShowSymbolPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPageColorPicker, setShowPageColorPicker] = useState(false);
  const [showWatermarkPicker, setShowWatermarkPicker] = useState(false);
  const [tableGrid, setTableGrid] = useState({ rows: 3, cols: 3 });

  // Format Painter State
  const [formatPainter, setFormatPainter] = useState<{
    active: boolean;
    isPinned: boolean;
    data: any;
  } | null>(null);

  const colorInputRef = useRef<HTMLInputElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleGlobalClick = () => {
      setShowFontSizeDropdown(false);
      setShowCaseMenu(false);
      setShowSpacingMenu(false);
      setShowColorPicker(false);
      setShowHighlightPicker(false);
      setShowTablePicker(false);
      setShowSymbolPicker(false);
      setShowDatePicker(false);
      setShowPageColorPicker(false);
      setShowWatermarkPicker(false);
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  // Format painter application handler
  useEffect(() => {
    if (!editor || !formatPainter?.active) return;

    const handleSelection = () => {
      const { selection } = editor.state;
      if (selection.empty) return;

      const { marks, paragraph } = formatPainter.data;
      const chain = editor.chain().focus();

      if (marks.bold) chain.setBold(); else chain.unsetBold();
      if (marks.italic) chain.setItalic(); else chain.unsetItalic();
      if (marks.underline) chain.setUnderline(); else chain.unsetUnderline();
      if (marks.strike) chain.setStrike(); else chain.unsetStrike();
      if (marks.subscript) chain.setSubscript(); else chain.unsetSubscript();
      if (marks.superscript) chain.setSuperscript(); else chain.unsetSuperscript();
      if (marks.color) chain.setColor(marks.color); else chain.unsetColor();
      if (marks.highlight) chain.setHighlight({ color: marks.highlight }); else chain.unsetHighlight();
      if (marks.fontSize || marks.fontFamily) {
        chain.setMark('textStyle', {
          fontSize: marks.fontSize,
          fontFamily: marks.fontFamily,
        });
      }
      if (paragraph?.lineHeight) {
        chain.updateAttributes('paragraph', { lineHeight: paragraph.lineHeight });
      }
      chain.run();

      if (!formatPainter.isPinned) {
        setFormatPainter(null);
      }
    };

    editor.on('selectionUpdate', handleSelection);
    return () => {
      editor.off('selectionUpdate', handleSelection);
    };
  }, [editor, formatPainter]);

  if (!editor) return null;

  const isTableActive = editor.isActive('table');
  const currentFontSize = editor.getAttributes('textStyle')?.fontSize || '11';
  const currentFontFamily = editor.getAttributes('textStyle')?.fontFamily || selectedFont;

  const handleCopyFormatting = (isPinned = false) => {
    const currentTextStyle = editor.getAttributes('textStyle');
    const marks = {
      bold: editor.isActive('bold'),
      italic: editor.isActive('italic'),
      underline: editor.isActive('underline'),
      strike: editor.isActive('strike'),
      subscript: editor.isActive('subscript'),
      superscript: editor.isActive('superscript'),
      color: currentTextStyle?.color,
      highlight: editor.getAttributes('highlight')?.color,
      fontSize: currentTextStyle?.fontSize,
      fontFamily: currentTextStyle?.fontFamily,
    };
    const paragraph = editor.getAttributes('paragraph');
    setFormatPainter({
      active: true,
      isPinned,
      data: { marks, paragraph },
    });
  };

  const handleClearFormatting = () => {
    editor
      .chain()
      .focus()
      .unsetAllMarks()
      .setParagraph()
      .updateAttributes('paragraph', {
        lineHeight: '1.15',
        indent: 0,
        spaceBefore: false,
        spaceAfter: true,
      })
      .run();
  };

  const handleInsertTable = (rows: number, cols: number) => {
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
    setShowTablePicker(false);
  };

  const handleInsertImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          editor.chain().focus().setImage({ src: reader.result as string }).run();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleInsertLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter Web Address (URL):', previousUrl || 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const getDateOptions = () => {
    const d = new Date();
    return [
      d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      d.toLocaleDateString('en-US'),
      d.toISOString().slice(0, 10),
      d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      `${d.toLocaleDateString('en-US')} ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
    ];
  };

  return (
    <div className="bg-[#fbfbfb] dark:bg-[#1f1f1f] border-b border-[#e5e7eb] dark:border-[#37373d] shadow-xs select-none">
      {/* Ribbon Tabs */}
      <div className="flex items-center space-x-1 px-3 pt-1 border-b border-[#e5e7eb] dark:border-[#333333] text-xs">
        {[
          { id: 'home', label: 'Home' },
          { id: 'insert', label: 'Insert' },
          { id: 'layout', label: 'Layout' },
          { id: 'view', label: 'View' },
          { id: 'tools', label: 'Tools' },
          ...(isTableActive ? [{ id: 'table', label: 'Table Design & Layout', isContextual: true }] : []),
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1 font-medium transition-colors border-b-2 -mb-[1px] ${
              tab.isContextual
                ? activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-[#282828] rounded-t font-semibold'
                  : 'border-transparent text-indigo-700 dark:text-indigo-400 bg-indigo-50/60 dark:bg-indigo-950/30 hover:bg-indigo-100 rounded-t'
                : activeTab === tab.id
                ? 'border-[#185abd] text-[#185abd] dark:text-[#5fa2f8] bg-white dark:bg-[#282828] rounded-t'
                : 'border-transparent text-gray-700 dark:text-gray-300 hover:text-[#185abd] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#2c2c2c] rounded-t'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Ribbon Command Strip */}
      <div className="h-16 px-3 py-1 flex items-center overflow-x-auto text-xs space-x-3 text-gray-700 dark:text-gray-200">
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <>
            {/* 1. Clipboard */}
            <div className="flex items-center space-x-1 pr-2 border-r border-gray-300 dark:border-gray-700">
              <button
                onClick={() => {
                  navigator.clipboard.readText().then((text) => {
                    editor.commands.insertContent(text);
                  });
                }}
                title="Paste (Ctrl+V)"
                className="flex flex-col items-center justify-center p-1 px-1.5 rounded hover:bg-gray-200 dark:hover:bg-[#333] transition-colors"
              >
                <Clipboard className="w-4 h-4 text-[#185abd]" />
                <span className="text-[10px]">Paste</span>
              </button>
              <div className="flex flex-col space-y-0.5">
                <button
                  onClick={() => document.execCommand('cut')}
                  title="Cut (Ctrl+X)"
                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-[#333]"
                >
                  <Scissors className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => document.execCommand('copy')}
                  title="Copy (Ctrl+C)"
                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-[#333]"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              <button
                onClick={() => handleCopyFormatting(false)}
                onDoubleClick={() => handleCopyFormatting(true)}
                title="Format Painter (Ctrl+Shift+C / Ctrl+Shift+V) - Double-click to pin"
                className={`p-1.5 rounded flex flex-col items-center justify-center transition-colors ${
                  formatPainter?.active
                    ? 'bg-[#185abd] text-white shadow-xs'
                    : 'hover:bg-gray-200 dark:hover:bg-[#333]'
                }`}
              >
                <Paintbrush className="w-4 h-4" />
                <span className="text-[9px]">Painter</span>
              </button>
            </div>

            {/* 2. Font Controls */}
            <div className="flex flex-col justify-between py-0.5 space-y-1 pr-2 border-r border-gray-300 dark:border-gray-700">
              {/* Row 1 */}
              <div className="flex items-center space-x-1">
                <select
                  value={currentFontFamily}
                  onChange={(e) => {
                    const font = e.target.value;
                    setSelectedFont(font);
                    (editor.commands as any).setFontFamily(font);
                  }}
                  className="h-6 px-1.5 bg-white dark:bg-[#2d2d2d] border border-gray-300 dark:border-[#444] rounded text-xs outline-hidden w-32 font-medium truncate"
                  title="Font Family"
                >
                  {FONT_FAMILIES.map((f) => (
                    <option key={f} value={f} style={{ fontFamily: `"${f}", sans-serif` }}>
                      {f}
                    </option>
                  ))}
                </select>

                {/* Font Size */}
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={customFontSize !== null ? customFontSize : currentFontSize}
                    onChange={(e) => setCustomFontSize(e.target.value)}
                    onFocus={() => setCustomFontSize(currentFontSize)}
                    onBlur={() => {
                      if (customFontSize !== null && customFontSize.trim() !== '') {
                        const parsed = parseFloat(customFontSize);
                        if (!isNaN(parsed) && parsed > 0 && parsed <= 500) {
                          (editor.commands as any).setFontSize(parsed);
                        }
                      }
                      setCustomFontSize(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const parsed = parseFloat((e.target as HTMLInputElement).value);
                        if (!isNaN(parsed) && parsed > 0 && parsed <= 500) {
                          (editor.commands as any).setFontSize(parsed);
                        }
                        (e.target as HTMLInputElement).blur();
                      }
                    }}
                    className="h-6 w-10 px-1 bg-white dark:bg-[#2d2d2d] border border-gray-300 dark:border-[#444] rounded-l text-xs outline-hidden text-center text-gray-800 dark:text-gray-100 font-medium"
                    title="Font Size (select or type)"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowFontSizeDropdown(!showFontSizeDropdown);
                    }}
                    className="h-6 px-0.5 bg-gray-100 dark:bg-[#383838] border-y border-r border-gray-300 dark:border-[#444] rounded-r hover:bg-gray-200 dark:hover:bg-[#444]"
                  >
                    <ChevronDown className="w-2.5 h-2.5 text-gray-500" />
                  </button>
                  {showFontSizeDropdown && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute left-0 top-full mt-1 w-16 max-h-56 overflow-y-auto bg-white dark:bg-[#2d2d2d] border border-gray-300 dark:border-gray-600 rounded shadow-xl z-50 py-1"
                    >
                      {FONT_SIZES.map((s) => (
                        <button
                          key={s}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            (editor.commands as any).setFontSize(s);
                            setShowFontSizeDropdown(false);
                          }}
                          className={`w-full text-left px-2 py-0.5 text-xs hover:bg-blue-50 dark:hover:bg-blue-900/40 ${
                            currentFontSize === s ? 'font-bold text-[#185abd]' : ''
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => (editor.commands as any).growFontSize()}
                  title="Increase Font Size (Ctrl+Shift+>)"
                  className="h-6 px-1 rounded hover:bg-gray-200 dark:hover:bg-[#333] flex items-center text-xs font-bold"
                >
                  A<ChevronUp className="w-3 h-3 -ml-0.5 text-blue-600" />
                </button>

                <button
                  onClick={() => (editor.commands as any).shrinkFontSize()}
                  title="Decrease Font Size (Ctrl+Shift+<)"
                  className="h-6 px-1 rounded hover:bg-gray-200 dark:hover:bg-[#333] flex items-center text-[11px]"
                >
                  A<ChevronDown className="w-3 h-3 -ml-0.5 text-blue-600" />
                </button>

                {/* Case */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowCaseMenu(!showCaseMenu);
                    }}
                    title="Change Case (Shift+F3)"
                    className="h-6 px-1 rounded hover:bg-gray-200 dark:hover:bg-[#333] flex items-center text-xs font-serif font-bold text-gray-700 dark:text-gray-200"
                  >
                    <span>Aa</span>
                    <ChevronDown className="w-2.5 h-2.5 ml-0.5 text-gray-400" />
                  </button>
                  {showCaseMenu && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute left-0 top-full mt-1 w-44 bg-white dark:bg-[#2d2d2d] border border-gray-300 dark:border-gray-600 rounded-md shadow-xl py-1 z-50 text-xs"
                    >
                      {[
                        { id: 'sentence', label: 'Sentence case.' },
                        { id: 'lower', label: 'lowercase' },
                        { id: 'upper', label: 'UPPERCASE' },
                        { id: 'title', label: 'Capitalize Each Word' },
                        { id: 'toggle', label: 'tOGGLE cASE' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            (editor.commands as any).transformCase(item.id);
                            setShowCaseMenu(false);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-gray-800 dark:text-gray-200"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleClearFormatting}
                  title="Clear All Formatting (Ctrl+Space)"
                  className="h-6 px-1 rounded hover:bg-gray-200 dark:hover:bg-[#333] flex items-center text-gray-500 hover:text-red-600"
                >
                  <RemoveFormatting className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Row 2 */}
              <div className="flex items-center space-x-0.5">
                <button
                  onClick={() => editor.chain().focus().toggleBold().run()}
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
                  onClick={() => editor.chain().focus().toggleItalic().run()}
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
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
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
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  title="Strikethrough"
                  className={`p-1 rounded transition-colors ${
                    editor.isActive('strike')
                      ? 'bg-[#185abd] text-white'
                      : 'hover:bg-gray-200 dark:hover:bg-[#333]'
                  }`}
                >
                  <Strikethrough className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleSubscript().run()}
                  title="Subscript (Ctrl+=)"
                  className={`p-1 rounded transition-colors ${
                    editor.isActive('subscript')
                      ? 'bg-[#185abd] text-white'
                      : 'hover:bg-gray-200 dark:hover:bg-[#333]'
                  }`}
                >
                  <Subscript className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleSuperscript().run()}
                  title="Superscript (Ctrl+Shift++)"
                  className={`p-1 rounded transition-colors ${
                    editor.isActive('superscript')
                      ? 'bg-[#185abd] text-white'
                      : 'hover:bg-gray-200 dark:hover:bg-[#333]'
                  }`}
                >
                  <Superscript className="w-3.5 h-3.5" />
                </button>

                <div className="w-[1px] h-3.5 bg-gray-300 dark:bg-gray-700 mx-0.5" />

                {/* Highlighter */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowHighlightPicker(!showHighlightPicker);
                      setShowColorPicker(false);
                    }}
                    title="Text Highlight Color"
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-[#333] flex items-center"
                  >
                    <div className="flex flex-col items-center">
                      <Highlighter className="w-3.5 h-3.5 text-amber-500" />
                      <div
                        className="w-3.5 h-0.5 mt-0.5 rounded-full"
                        style={{
                          backgroundColor:
                            editor.getAttributes('highlight')?.color || '#ffff00',
                        }}
                      />
                    </div>
                    <ChevronDown className="w-2.5 h-2.5 ml-0.5 opacity-60" />
                  </button>
                  {showHighlightPicker && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute left-0 top-full mt-1 p-2 bg-white dark:bg-[#2d2d2d] border border-gray-300 dark:border-gray-600 rounded-md shadow-2xl z-50 w-44"
                    >
                      <button
                        onClick={() => {
                          editor.chain().focus().unsetHighlight().run();
                          setShowHighlightPicker(false);
                        }}
                        className="w-full text-left px-2 py-1 mb-1 text-[11px] hover:bg-gray-100 dark:hover:bg-[#383838] rounded flex items-center space-x-1"
                      >
                        <RemoveFormatting className="w-3 h-3 text-gray-500" />
                        <span>No Color</span>
                      </button>
                      <div className="grid grid-cols-5 gap-1.5 pt-1 border-t border-gray-200 dark:border-gray-700">
                        {WORD_HIGHLIGHT_COLORS.map((h) => (
                          <button
                            key={h.color}
                            onClick={() => {
                              editor.chain().focus().toggleHighlight({ color: h.color }).run();
                              setShowHighlightPicker(false);
                            }}
                            title={h.name}
                            className="w-5 h-5 rounded-xs border border-gray-300 hover:scale-110 transition-transform"
                            style={{ backgroundColor: h.color }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Font Color */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowColorPicker(!showColorPicker);
                      setShowHighlightPicker(false);
                    }}
                    title="Font Color"
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-[#333] flex items-center"
                  >
                    <div className="flex flex-col items-center">
                      <Baseline className="w-3.5 h-3.5 text-red-600" />
                      <div
                        className="w-3.5 h-0.5 mt-0.5 rounded-full"
                        style={{
                          backgroundColor:
                            editor.getAttributes('textStyle')?.color || '#c00000',
                        }}
                      />
                    </div>
                    <ChevronDown className="w-2.5 h-2.5 ml-0.5 opacity-60" />
                  </button>
                  {showColorPicker && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute left-0 top-full mt-1 p-2.5 bg-white dark:bg-[#2d2d2d] border border-gray-300 dark:border-gray-600 rounded-md shadow-2xl z-50 w-52 text-xs"
                    >
                      <button
                        onClick={() => {
                          editor.chain().focus().unsetColor().run();
                          setShowColorPicker(false);
                        }}
                        className="w-full text-left px-2 py-1 mb-2 font-medium hover:bg-gray-100 dark:hover:bg-[#383838] rounded flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-1.5">
                          <div className="w-3.5 h-3.5 bg-black dark:bg-white border border-gray-400 rounded-xs" />
                          <span>Automatic</span>
                        </div>
                        {!editor.getAttributes('textStyle')?.color && (
                          <Check className="w-3 h-3 text-[#185abd]" />
                        )}
                      </button>

                      <div className="text-[10px] text-gray-500 font-semibold mb-1">
                        Theme Colors
                      </div>
                      <div className="grid grid-cols-10 gap-1 mb-1">
                        {THEME_BASE_COLORS.map((c) => (
                          <button
                            key={c}
                            onClick={() => {
                              editor.chain().focus().setColor(c).run();
                              setShowColorPicker(false);
                            }}
                            className="w-4 h-4 border border-gray-300 hover:scale-110"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                      <div className="space-y-0.5 mb-2">
                        {THEME_SHADES.map((row, rIdx) => (
                          <div key={rIdx} className="grid grid-cols-10 gap-1">
                            {row.map((c, cIdx) => (
                              <button
                                key={`${rIdx}-${cIdx}`}
                                onClick={() => {
                                  editor.chain().focus().setColor(c).run();
                                  setShowColorPicker(false);
                                }}
                                className="w-4 h-3 border border-gray-200 dark:border-gray-700 hover:scale-110"
                                style={{ backgroundColor: c }}
                              />
                            ))}
                          </div>
                        ))}
                      </div>

                      <div className="text-[10px] text-gray-500 font-semibold mb-1">
                        Standard Colors
                      </div>
                      <div className="grid grid-cols-10 gap-1 mb-2">
                        {STANDARD_COLORS.map((c) => (
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

                      <div className="pt-1.5 border-t border-gray-200 dark:border-gray-700">
                        <button
                          onClick={() => colorInputRef.current?.click()}
                          className="w-full text-left px-2 py-1 text-[11px] hover:bg-gray-100 dark:hover:bg-[#383838] rounded text-[#185abd] font-medium"
                        >
                          More Colors...
                        </button>
                        <input
                          ref={colorInputRef}
                          type="color"
                          className="sr-only"
                          onChange={(e) => {
                            editor.chain().focus().setColor(e.target.value).run();
                            setShowColorPicker(false);
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Paragraph */}
            <div className="flex flex-col justify-between py-0.5 space-y-1 pr-2 border-r border-gray-300 dark:border-gray-700">
              <div className="flex items-center space-x-0.5">
                <button
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  title="Bulleted List"
                  className={`p-1 rounded ${
                    editor.isActive('bulletList')
                      ? 'bg-[#185abd] text-white'
                      : 'hover:bg-gray-200 dark:hover:bg-[#333]'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  title="Numbered List"
                  className={`p-1 rounded ${
                    editor.isActive('orderedList')
                      ? 'bg-[#185abd] text-white'
                      : 'hover:bg-gray-200 dark:hover:bg-[#333]'
                  }`}
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleTaskList().run()}
                  title="Checklist Task"
                  className={`p-1 rounded ${
                    editor.isActive('taskList')
                      ? 'bg-[#185abd] text-white'
                      : 'hover:bg-gray-200 dark:hover:bg-[#333]'
                  }`}
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                </button>
                <div className="w-[1px] h-3 bg-gray-300 dark:bg-gray-600 mx-1" />
                <button
                  onClick={() => (editor.commands as any).outdentParagraph()}
                  title="Decrease Indent"
                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-[#333]"
                >
                  <Outdent className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => (editor.commands as any).indentParagraph()}
                  title="Increase Indent"
                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-[#333]"
                >
                  <Indent className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center space-x-0.5">
                <button
                  onClick={() => editor.chain().focus().setTextAlign('left').run()}
                  title="Align Left (Ctrl+L)"
                  className={`p-1 rounded ${
                    editor.isActive({ textAlign: 'left' })
                      ? 'bg-[#185abd] text-white'
                      : 'hover:bg-gray-200 dark:hover:bg-[#333]'
                  }`}
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => editor.chain().focus().setTextAlign('center').run()}
                  title="Align Center (Ctrl+E)"
                  className={`p-1 rounded ${
                    editor.isActive({ textAlign: 'center' })
                      ? 'bg-[#185abd] text-white'
                      : 'hover:bg-gray-200 dark:hover:bg-[#333]'
                  }`}
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => editor.chain().focus().setTextAlign('right').run()}
                  title="Align Right (Ctrl+R)"
                  className={`p-1 rounded ${
                    editor.isActive({ textAlign: 'right' })
                      ? 'bg-[#185abd] text-white'
                      : 'hover:bg-gray-200 dark:hover:bg-[#333]'
                  }`}
                >
                  <AlignRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                  title="Justify (Ctrl+J)"
                  className={`p-1 rounded ${
                    editor.isActive({ textAlign: 'justify' })
                      ? 'bg-[#185abd] text-white'
                      : 'hover:bg-gray-200 dark:hover:bg-[#333]'
                  }`}
                >
                  <AlignJustify className="w-3.5 h-3.5" />
                </button>

                <div className="w-[1px] h-3 bg-gray-300 dark:bg-gray-600 mx-0.5" />

                {/* Line Spacing */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSpacingMenu(!showSpacingMenu);
                    }}
                    title="Line and Paragraph Spacing"
                    className="h-6 px-1.5 rounded hover:bg-gray-200 dark:hover:bg-[#333] flex items-center space-x-0.5 text-[11px] font-medium"
                  >
                    <span>{editor.getAttributes('paragraph')?.lineHeight || '1.15'}</span>
                    <ChevronDown className="w-2.5 h-2.5 text-gray-400" />
                  </button>
                  {showSpacingMenu && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute left-0 top-full mt-1 w-56 bg-white dark:bg-[#2d2d2d] border border-gray-300 dark:border-gray-600 rounded-md shadow-2xl py-1 z-50 text-xs"
                    >
                      {['1.0', '1.15', '1.5', '2.0', '2.5', '3.0'].map((val) => (
                        <button
                          key={val}
                          onClick={() => {
                            (editor.commands as any).setLineHeight(val);
                            setShowSpacingMenu(false);
                          }}
                          className="w-full text-left px-3 py-1 hover:bg-blue-50 dark:hover:bg-blue-900/40 flex items-center justify-between"
                        >
                          <span>{val}</span>
                          {(editor.getAttributes('paragraph')?.lineHeight || '1.15') === val && (
                            <Check className="w-3 h-3 text-[#185abd]" />
                          )}
                        </button>
                      ))}
                      <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
                      <button
                        onClick={() => {
                          (editor.commands as any).toggleSpaceBefore();
                          setShowSpacingMenu(false);
                        }}
                        className="w-full text-left px-3 py-1 hover:bg-blue-50 dark:hover:bg-blue-900/40"
                      >
                        {editor.getAttributes('paragraph')?.spaceBefore
                          ? 'Remove Space Before Paragraph'
                          : 'Add Space Before Paragraph'}
                      </button>
                      <button
                        onClick={() => {
                          (editor.commands as any).toggleSpaceAfter();
                          setShowSpacingMenu(false);
                        }}
                        className="w-full text-left px-3 py-1 hover:bg-blue-50 dark:hover:bg-blue-900/40"
                      >
                        {editor.getAttributes('paragraph')?.spaceAfter === false
                          ? 'Add Space After Paragraph'
                          : 'Remove Space After Paragraph'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 4. Quick Styles */}
            <div className="flex items-center space-x-1.5 pr-2 border-r border-gray-300 dark:border-gray-700">
              <button
                onClick={() => editor.chain().focus().setParagraph().run()}
                className={`flex flex-col items-start px-2 py-1 rounded border min-w-[62px] text-left transition-colors ${
                  !editor.isActive('heading') && !editor.isActive('blockquote')
                    ? 'border-[#185abd] bg-blue-50/80 dark:bg-blue-950/40'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#333]'
                }`}
              >
                <span className="text-[12px] font-medium leading-none">AaBbCc</span>
                <span className="text-[10px] text-gray-500 mt-1">Normal</span>
              </button>

              <button
                onClick={() => {
                  editor
                    .chain()
                    .focus()
                    .setParagraph()
                    .updateAttributes('paragraph', { spaceAfter: false, lineHeight: '1.0' })
                    .run();
                }}
                className="flex flex-col items-start px-2 py-1 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#333] min-w-[70px] text-left transition-colors"
              >
                <span className="text-[12px] font-medium leading-none">AaBbCc</span>
                <span className="text-[10px] text-gray-500 mt-1">No Spacing</span>
              </button>

              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`flex flex-col items-start px-2 py-1 rounded border min-w-[68px] text-left transition-colors ${
                  editor.isActive('heading', { level: 1 })
                    ? 'border-[#185abd] bg-blue-50/80 dark:bg-blue-950/40'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#333]'
                }`}
              >
                <span className="text-[13px] font-bold text-[#185abd] leading-none">AaBbCc</span>
                <span className="text-[10px] text-gray-500 mt-1">Heading 1</span>
              </button>

              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`flex flex-col items-start px-2 py-1 rounded border min-w-[68px] text-left transition-colors ${
                  editor.isActive('heading', { level: 2 })
                    ? 'border-[#185abd] bg-blue-50/80 dark:bg-blue-950/40'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#333]'
                }`}
              >
                <span className="text-[12px] font-bold text-[#2b579a] leading-none">AaBbCc</span>
                <span className="text-[10px] text-gray-500 mt-1">Heading 2</span>
              </button>

              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`flex flex-col items-start px-2 py-1 rounded border min-w-[68px] text-left transition-colors ${
                  editor.isActive('heading', { level: 3 })
                    ? 'border-[#185abd] bg-blue-50/80 dark:bg-blue-950/40'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#333]'
                }`}
              >
                <span className="text-[12px] font-bold text-[#424242] dark:text-gray-300 leading-none">
                  AaBbCc
                </span>
                <span className="text-[10px] text-gray-500 mt-1">Heading 3</span>
              </button>

              <button
                onClick={() => {
                  editor
                    .chain()
                    .focus()
                    .setParagraph()
                    .setMark('textStyle', { fontSize: '26', fontFamily: 'Aptos' })
                    .setColor('#185abd')
                    .run();
                }}
                className="flex flex-col items-start px-2 py-1 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#333] min-w-[55px] text-left transition-colors"
              >
                <span className="text-[14px] font-light text-[#185abd] leading-none">Title</span>
                <span className="text-[10px] text-gray-500 mt-1">Title</span>
              </button>

              <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`flex flex-col items-start px-2 py-1 rounded border min-w-[55px] text-left transition-colors ${
                  editor.isActive('blockquote')
                    ? 'border-[#185abd] bg-blue-50/80 dark:bg-blue-950/40'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#333]'
                }`}
              >
                <span className="text-[11px] italic font-serif leading-none">"Quote"</span>
                <span className="text-[10px] text-gray-500 mt-1">Quote</span>
              </button>
            </div>

            {/* 5. Find & Spell Assistant */}
            <div className="flex items-center space-x-1">
              <button
                onClick={onOpenSearch}
                className="flex flex-col items-center justify-center p-1.5 rounded hover:bg-gray-200 dark:hover:bg-[#333] transition-colors text-xs"
                title="Find and Replace (Ctrl+F)"
              >
                <Search className="w-4 h-4 text-[#185abd]" />
                <span className="text-[10px]">Find & Replace</span>
              </button>
              <button
                onClick={onOpenSpellCheck}
                className="flex flex-col items-center justify-center p-1.5 rounded hover:bg-gray-200 dark:hover:bg-[#333] transition-colors text-xs"
                title="Editor / Spell Assistant"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-[10px]">Editor</span>
              </button>
            </div>
          </>
        )}

        {/* INSERT TAB */}
        {activeTab === 'insert' && (
          <div className="flex items-center space-x-3">
            {/* Table Inserter */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTablePicker(!showTablePicker);
                }}
                className="flex flex-col items-center justify-center p-1.5 rounded hover:bg-gray-200 dark:hover:bg-[#333]"
              >
                <TableIcon className="w-4 h-4 text-[#185abd]" />
                <span className="text-[10px] flex items-center">
                  Table <ChevronDown className="w-2.5 h-2.5 ml-0.5" />
                </span>
              </button>

              {showTablePicker && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute left-0 top-full mt-1 p-3 bg-white dark:bg-[#2d2d2d] border border-gray-300 dark:border-gray-600 rounded-md shadow-2xl z-50"
                >
                  <div className="text-[11px] font-medium mb-1.5">
                    Select Grid ({tableGrid.rows} × {tableGrid.cols})
                  </div>
                  <div className="grid grid-cols-10 gap-1">
                    {Array.from({ length: 10 }).map((_, r) =>
                      Array.from({ length: 10 }).map((_, c) => (
                        <div
                          key={`${r}-${c}`}
                          onMouseEnter={() => setTableGrid({ rows: r + 1, cols: c + 1 })}
                          onClick={() => handleInsertTable(r + 1, c + 1)}
                          className={`w-4 h-4 border border-gray-300 cursor-pointer ${
                            r < tableGrid.rows && c < tableGrid.cols
                              ? 'bg-[#185abd]/30 border-[#185abd]'
                              : 'bg-gray-50 dark:bg-gray-800'
                          }`}
                        />
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleInsertImage}
              className="flex flex-col items-center justify-center p-1.5 rounded hover:bg-gray-200 dark:hover:bg-[#333]"
              title="Insert Picture"
            >
              <ImageIcon className="w-4 h-4 text-green-600" />
              <span className="text-[10px]">Picture</span>
            </button>

            <button
              onClick={handleInsertLink}
              className="flex flex-col items-center justify-center p-1.5 rounded hover:bg-gray-200 dark:hover:bg-[#333]"
              title="Insert Hyperlink (Ctrl+K)"
            >
              <LinkIcon className="w-4 h-4 text-blue-500" />
              <span className="text-[10px]">Link</span>
            </button>

            <div className="w-[1px] h-8 bg-gray-300 dark:bg-gray-700" />

            <button
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className="flex flex-col items-center justify-center p-1.5 rounded hover:bg-gray-200 dark:hover:bg-[#333]"
              title="Page Break (Ctrl+Enter)"
            >
              <Minus className="w-4 h-4 text-gray-500" />
              <span className="text-[10px]">Page Break</span>
            </button>

            <button
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className="flex flex-col items-center justify-center p-1.5 rounded hover:bg-gray-200 dark:hover:bg-[#333]"
              title="Code Block"
            >
              <Code className="w-4 h-4 text-purple-600" />
              <span className="text-[10px]">Code Block</span>
            </button>

            {/* Special Symbols Inserter */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSymbolPicker(!showSymbolPicker);
                }}
                className="flex flex-col items-center justify-center p-1.5 rounded hover:bg-gray-200 dark:hover:bg-[#333]"
                title="Special Symbols & Glyphs"
              >
                <span className="font-serif text-sm font-bold text-amber-600">Ω</span>
                <span className="text-[10px] flex items-center">
                  Symbol <ChevronDown className="w-2.5 h-2.5 ml-0.5" />
                </span>
              </button>
              {showSymbolPicker && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute left-0 top-full mt-1 p-2 bg-white dark:bg-[#2d2d2d] border border-gray-300 dark:border-gray-600 rounded-md shadow-2xl z-50 grid grid-cols-8 gap-1 w-64"
                >
                  {SPECIAL_SYMBOLS.map((sym) => (
                    <button
                      key={sym}
                      onClick={() => {
                        editor.chain().focus().insertContent(sym).run();
                        setShowSymbolPicker(false);
                      }}
                      className="w-7 h-7 flex items-center justify-center text-sm font-sans hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded transition-colors"
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Date & Time Inserter */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDatePicker(!showDatePicker);
                }}
                className="flex flex-col items-center justify-center p-1.5 rounded hover:bg-gray-200 dark:hover:bg-[#333]"
                title="Insert Current Date & Time"
              >
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span className="text-[10px] flex items-center">
                  Date/Time <ChevronDown className="w-2.5 h-2.5 ml-0.5" />
                </span>
              </button>
              {showDatePicker && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute left-0 top-full mt-1 p-1 bg-white dark:bg-[#2d2d2d] border border-gray-300 dark:border-gray-600 rounded-md shadow-2xl z-50 w-56 text-xs"
                >
                  <div className="px-2 py-1 text-[10px] text-gray-400 font-semibold uppercase">
                    Select Format
                  </div>
                  {getDateOptions().map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        editor.chain().focus().insertContent(opt).run();
                        setShowDatePicker(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-gray-800 dark:text-gray-200 rounded"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {onOpenSettings && (
              <>
                <div className="w-[1px] h-8 bg-gray-300 dark:bg-gray-700" />
                <button
                  onClick={onOpenSettings}
                  className="flex flex-col items-center justify-center p-1.5 rounded hover:bg-gray-200 dark:hover:bg-[#333]"
                  title="Header & Footer Presets"
                >
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span className="text-[10px]">Header & Footer</span>
                </button>
              </>
            )}
          </div>
        )}

        {/* LAYOUT TAB */}
        {activeTab === 'layout' && (
          <div className="flex items-center space-x-3">
            {onOpenSettings && (
              <button
                onClick={onOpenSettings}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-blue-50 dark:bg-blue-950/40 text-[#185abd] border border-[#185abd] rounded hover:bg-blue-100 dark:hover:bg-blue-900/50 text-xs font-medium"
                title="Page Setup, Margins & Header/Footer Presets"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Page Setup</span>
              </button>
            )}

            <div className="w-[1px] h-8 bg-gray-300 dark:bg-gray-700" />

            <div className="flex flex-col space-y-0.5">
              <span className="text-[10px] text-gray-400 font-semibold uppercase">Page Margins</span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() =>
                    onUpdatePageSettings?.({
                      ...(pageSettings || {
                        size: 'a4',
                        orientation: 'portrait',
                        showPageNumbers: true,
                      }),
                      margins: { top: 96, bottom: 96, left: 96, right: 96 },
                    })
                  }
                  className={`px-2 py-1 rounded text-[11px] border transition-colors ${
                    pageSettings?.margins?.left === 96
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-[#185abd] border-[#185abd] font-semibold'
                      : 'bg-white dark:bg-[#2d2d2d] border-gray-300 dark:border-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Normal (1")
                </button>
                <button
                  onClick={() =>
                    onUpdatePageSettings?.({
                      ...(pageSettings || {
                        size: 'a4',
                        orientation: 'portrait',
                        showPageNumbers: true,
                      }),
                      margins: { top: 48, bottom: 48, left: 48, right: 48 },
                    })
                  }
                  className={`px-2 py-1 rounded text-[11px] border transition-colors ${
                    pageSettings?.margins?.left === 48
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-[#185abd] border-[#185abd] font-semibold'
                      : 'bg-white dark:bg-[#2d2d2d] border-gray-300 dark:border-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Narrow (0.5")
                </button>
                <button
                  onClick={() =>
                    onUpdatePageSettings?.({
                      ...(pageSettings || {
                        size: 'a4',
                        orientation: 'portrait',
                        showPageNumbers: true,
                      }),
                      margins: { top: 96, bottom: 96, left: 144, right: 144 },
                    })
                  }
                  className={`px-2 py-1 rounded text-[11px] border transition-colors ${
                    pageSettings?.margins?.left === 144
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-[#185abd] border-[#185abd] font-semibold'
                      : 'bg-white dark:bg-[#2d2d2d] border-gray-300 dark:border-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Wide (1.5")
                </button>
              </div>
            </div>

            <div className="w-[1px] h-8 bg-gray-300 dark:bg-gray-700" />

            {/* Page Orientation */}
            <div className="flex flex-col space-y-0.5">
              <span className="text-[10px] text-gray-400 font-semibold uppercase">Orientation</span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() =>
                    onUpdatePageSettings?.({
                      ...(pageSettings || {
                        size: 'a4',
                        margins: { top: 96, bottom: 96, left: 96, right: 96 },
                        showPageNumbers: true,
                      }),
                      orientation: 'portrait',
                    })
                  }
                  className={`px-2 py-1 rounded text-[11px] border transition-colors ${
                    pageSettings?.orientation !== 'landscape'
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-[#185abd] border-[#185abd] font-semibold'
                      : 'bg-white dark:bg-[#2d2d2d] border-gray-300 dark:border-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Portrait
                </button>
                <button
                  onClick={() =>
                    onUpdatePageSettings?.({
                      ...(pageSettings || {
                        size: 'a4',
                        margins: { top: 96, bottom: 96, left: 96, right: 96 },
                        showPageNumbers: true,
                      }),
                      orientation: 'landscape',
                    })
                  }
                  className={`px-2 py-1 rounded text-[11px] border transition-colors ${
                    pageSettings?.orientation === 'landscape'
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-[#185abd] border-[#185abd] font-semibold'
                      : 'bg-white dark:bg-[#2d2d2d] border-gray-300 dark:border-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Landscape
                </button>
              </div>
            </div>

            <div className="w-[1px] h-8 bg-gray-300 dark:bg-gray-700" />

            {/* Page Color */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPageColorPicker(!showPageColorPicker);
                }}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-white dark:bg-[#2d2d2d] border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 text-xs font-medium"
                title="Page Color Tint"
              >
                <Palette className="w-3.5 h-3.5 text-purple-600" />
                <span>Page Color</span>
              </button>
              {showPageColorPicker && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute left-0 top-full mt-1 p-2 bg-white dark:bg-[#2d2d2d] border border-gray-300 dark:border-gray-600 rounded-md shadow-2xl z-50 w-44"
                >
                  {PAGE_COLORS.map((pc) => (
                    <button
                      key={pc.color}
                      onClick={() => {
                        onUpdatePageSettings?.({
                          ...(pageSettings || {
                            size: 'a4',
                            orientation: 'portrait',
                            margins: { top: 96, bottom: 96, left: 96, right: 96 },
                            showPageNumbers: true,
                          }),
                          pageColor: pc.color,
                        });
                        setShowPageColorPicker(false);
                      }}
                      className="w-full text-left px-2 py-1 rounded text-xs hover:bg-gray-100 dark:hover:bg-[#383838] flex items-center space-x-2"
                    >
                      <div
                        className="w-4 h-4 rounded-xs border border-gray-300"
                        style={{ backgroundColor: pc.color }}
                      />
                      <span>{pc.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Watermark */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowWatermarkPicker(!showWatermarkPicker);
                }}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-white dark:bg-[#2d2d2d] border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 text-xs font-medium"
                title="Document Watermark"
              >
                <span className="font-bold text-xs text-gray-400">WM</span>
                <span>Watermark</span>
              </button>
              {showWatermarkPicker && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute left-0 top-full mt-1 p-1 bg-white dark:bg-[#2d2d2d] border border-gray-300 dark:border-gray-600 rounded-md shadow-2xl z-50 w-48 text-xs"
                >
                  <button
                    onClick={() => {
                      onUpdatePageSettings?.({
                        ...(pageSettings || {
                          size: 'a4',
                          orientation: 'portrait',
                          margins: { top: 96, bottom: 96, left: 96, right: 96 },
                          showPageNumbers: true,
                        }),
                        watermarkText: undefined,
                      });
                      setShowWatermarkPicker(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-gray-100 dark:hover:bg-[#383838] text-gray-500 rounded"
                  >
                    No Watermark
                  </button>
                  <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
                  {WATERMARK_PRESETS.map((wm) => (
                    <button
                      key={wm}
                      onClick={() => {
                        onUpdatePageSettings?.({
                          ...(pageSettings || {
                            size: 'a4',
                            orientation: 'portrait',
                            margins: { top: 96, bottom: 96, left: 96, right: 96 },
                            showPageNumbers: true,
                          }),
                          watermarkText: wm,
                        });
                        setShowWatermarkPicker(false);
                      }}
                      className="w-full text-left px-2.5 py-1 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-gray-800 dark:text-gray-200 rounded font-medium"
                    >
                      {wm}
                    </button>
                  ))}
                  <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
                  <button
                    onClick={() => {
                      const custom = window.prompt('Enter custom watermark text:');
                      if (custom) {
                        onUpdatePageSettings?.({
                          ...(pageSettings || {
                            size: 'a4',
                            orientation: 'portrait',
                            margins: { top: 96, bottom: 96, left: 96, right: 96 },
                            showPageNumbers: true,
                          }),
                          watermarkText: custom.toUpperCase(),
                        });
                      }
                      setShowWatermarkPicker(false);
                    }}
                    className="w-full text-left px-2.5 py-1 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-[#185abd] font-medium"
                  >
                    Custom Watermark...
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW TAB */}
        {activeTab === 'view' && (
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleRuler}
              className={`flex items-center px-2 py-1.5 rounded transition-colors ${
                showRuler
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-[#185abd] border border-[#185abd] font-medium'
                  : 'hover:bg-gray-200 dark:hover:bg-[#333]'
              }`}
            >
              Horizontal Ruler
            </button>

            <button
              onClick={onToggleNavSidebar}
              className={`flex items-center px-2 py-1.5 rounded transition-colors ${
                showNavSidebar
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-[#185abd] border border-[#185abd] font-medium'
                  : 'hover:bg-gray-200 dark:hover:bg-[#333]'
              }`}
            >
              Navigation Pane
            </button>

            <div className="w-[1px] h-8 bg-gray-300 dark:bg-gray-700" />

            <div className="flex items-center space-x-1">
              <span className="text-[10px] text-gray-400 font-semibold mr-1">Zoom:</span>
              {[75, 100, 125, 150].map((z) => (
                <button
                  key={z}
                  onClick={() => onZoomChange(z)}
                  className={`px-2 py-1 rounded text-[11px] ${
                    currentZoom === z
                      ? 'bg-[#185abd] text-white font-bold'
                      : 'bg-white dark:bg-[#2d2d2d] border border-gray-300 dark:border-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {z}%
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CONTEXTUAL TABLE TAB */}
        {activeTab === 'table' && (
          <div className="flex items-center space-x-3">
            {/* Rows & Columns Group */}
            <div className="flex items-center space-x-1 pr-2 border-r border-gray-300 dark:border-gray-700">
              <div className="flex flex-col space-y-0.5">
                <button
                  onClick={() => editor.chain().focus().addRowBefore().run()}
                  className="px-2 py-0.5 bg-gray-100 dark:bg-[#333] hover:bg-gray-200 rounded text-[11px] flex items-center space-x-1"
                >
                  <Plus className="w-3 h-3 text-blue-600" />
                  <span>Row Above</span>
                </button>
                <button
                  onClick={() => editor.chain().focus().addRowAfter().run()}
                  className="px-2 py-0.5 bg-gray-100 dark:bg-[#333] hover:bg-gray-200 rounded text-[11px] flex items-center space-x-1"
                >
                  <Plus className="w-3 h-3 text-blue-600" />
                  <span>Row Below</span>
                </button>
              </div>

              <div className="flex flex-col space-y-0.5">
                <button
                  onClick={() => editor.chain().focus().addColumnBefore().run()}
                  className="px-2 py-0.5 bg-gray-100 dark:bg-[#333] hover:bg-gray-200 rounded text-[11px] flex items-center space-x-1"
                >
                  <Columns className="w-3 h-3 text-emerald-600" />
                  <span>Col Left</span>
                </button>
                <button
                  onClick={() => editor.chain().focus().addColumnAfter().run()}
                  className="px-2 py-0.5 bg-gray-100 dark:bg-[#333] hover:bg-gray-200 rounded text-[11px] flex items-center space-x-1"
                >
                  <Columns className="w-3 h-3 text-emerald-600" />
                  <span>Col Right</span>
                </button>
              </div>
            </div>

            {/* Delete Group */}
            <div className="flex items-center space-x-1 pr-2 border-r border-gray-300 dark:border-gray-700">
              <button
                onClick={() => editor.chain().focus().deleteRow().run()}
                className="px-2 py-1 bg-red-50 dark:bg-red-950/30 text-red-600 hover:bg-red-100 rounded text-[11px] flex items-center space-x-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete Row</span>
              </button>
              <button
                onClick={() => editor.chain().focus().deleteColumn().run()}
                className="px-2 py-1 bg-red-50 dark:bg-red-950/30 text-red-600 hover:bg-red-100 rounded text-[11px] flex items-center space-x-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete Column</span>
              </button>
              <button
                onClick={() => editor.chain().focus().deleteTable().run()}
                className="px-2 py-1 bg-red-600 text-white hover:bg-red-700 rounded text-[11px] flex items-center space-x-1 font-medium shadow-xs"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete Table</span>
              </button>
            </div>

            {/* Merge / Header Group */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => editor.chain().focus().mergeCells().run()}
                className="px-2 py-1 bg-gray-100 dark:bg-[#333] hover:bg-gray-200 rounded text-[11px]"
              >
                Merge Cells
              </button>
              <button
                onClick={() => editor.chain().focus().splitCell().run()}
                className="px-2 py-1 bg-gray-100 dark:bg-[#333] hover:bg-gray-200 rounded text-[11px]"
              >
                Split Cell
              </button>
              <button
                onClick={() => editor.chain().focus().toggleHeaderRow().run()}
                className="px-2 py-1 bg-gray-100 dark:bg-[#333] hover:bg-gray-200 rounded text-[11px]"
              >
                Toggle Header Row
              </button>
            </div>
          </div>
        )}

        {/* TOOLS TAB */}
        {activeTab === 'tools' && (
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenWordCount}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-white dark:bg-[#2d2d2d] border border-gray-300 dark:border-gray-600 rounded hover:bg-blue-50 dark:hover:bg-blue-950/30 text-xs font-medium"
            >
              <FileText className="w-4 h-4 text-[#185abd]" />
              <span>Word Count & Insights</span>
            </button>

            <button
              onClick={onOpenSpellCheck}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-white dark:bg-[#2d2d2d] border border-gray-300 dark:border-gray-600 rounded hover:bg-blue-50 dark:hover:bg-blue-950/30 text-xs font-medium"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Spell & Grammar Assistant</span>
            </button>

            <button
              onClick={onOpenRecovery}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-white dark:bg-[#2d2d2d] border border-gray-300 dark:border-gray-600 rounded hover:bg-blue-50 dark:hover:bg-blue-950/30 text-xs font-medium"
            >
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>Document Recovery</span>
            </button>

            <div className="w-[1px] h-8 bg-gray-300 dark:bg-gray-700" />

            <button
              onClick={onExportDocx}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-[#185abd] text-white rounded hover:bg-[#1651aa] text-xs font-medium shadow-xs"
            >
              <FileDown className="w-4 h-4" />
              <span>Export Word .docx</span>
            </button>

            <button
              onClick={onExportPdf}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 text-xs font-medium shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
