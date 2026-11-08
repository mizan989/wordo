import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  FolderOpen,
  Save,
  Printer,
  Undo2,
  Redo2,
  Copy,
  Scissors,
  Clipboard,
  Search,
  Table as TableIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  CheckSquare,
  Sparkles,
  HelpCircle,
  Settings,
  Clock,
  Download,
  FileCode,
  FileCheck,
  ChevronRight,
} from 'lucide-react';
import { RecentDocument } from '../types';

interface MenuBarProps {
  onNew: () => void;
  onNewFromTemplate: () => void;
  onOpen: () => void;
  onOpenRecent: (doc: RecentDocument) => void;
  recentDocuments: RecentDocument[];
  onSave: () => void;
  onSaveAs: () => void;
  onExportDocx: () => void;
  onExportPdf: () => void;
  onExportHtml: () => void;
  onExportTxt: () => void;
  onPrint: () => void;
  onCloseDocument: () => void;

  onUndo: () => void;
  onRedo: () => void;
  onCut: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onSelectAll: () => void;
  onFind: () => void;
  onClearFormat: () => void;

  onInsertTable: (rows: number, cols: number) => void;
  onInsertImage: () => void;
  onInsertLink: () => void;
  onInsertPageBreak: () => void;
  onInsertHorizontalRule: () => void;
  onInsertBlockquote: () => void;
  onInsertTaskList: () => void;

  onFormatBold: () => void;
  onFormatItalic: () => void;
  onFormatUnderline: () => void;
  onFormatAlign: (align: 'left' | 'center' | 'right' | 'justify') => void;

  onZoomChange: (zoom: number) => void;
  onToggleRuler: () => void;
  showRuler: boolean;
  onToggleNavSidebar: () => void;
  showNavSidebar: boolean;
  onToggleTheme: () => void;

  onOpenWordCount: () => void;
  onOpenSpellCheck: () => void;
  onOpenRecovery: () => void;
  onOpenSettings: () => void;
  onOpenAbout: () => void;
  onOpenShortcuts: () => void;
}

export const MenuBar: React.FC<MenuBarProps> = ({
  onNew,
  onNewFromTemplate,
  onOpen,
  onOpenRecent,
  recentDocuments,
  onSave,
  onSaveAs,
  onExportDocx,
  onExportPdf,
  onExportHtml,
  onExportTxt,
  onPrint,
  onCloseDocument,
  onUndo,
  onRedo,
  onCut,
  onCopy,
  onPaste,
  onSelectAll,
  onFind,
  onClearFormat,
  onInsertTable,
  onInsertImage,
  onInsertLink,
  onInsertPageBreak,
  onInsertHorizontalRule,
  onInsertBlockquote,
  onInsertTaskList,
  onFormatBold,
  onFormatItalic,
  onFormatUnderline,
  onFormatAlign,
  onZoomChange,
  onToggleRuler,
  showRuler,
  onToggleNavSidebar,
  showNavSidebar,
  onToggleTheme,
  onOpenWordCount,
  onOpenSpellCheck,
  onOpenRecovery,
  onOpenSettings,
  onOpenAbout,
  onOpenShortcuts,
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuBarRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuBarRef.current && !menuBarRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuClick = (menuName: string) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const handleMenuMouseEnter = (menuName: string) => {
    if (activeMenu) {
      setActiveMenu(menuName);
    }
  };

  const closeMenu = () => setActiveMenu(null);

  return (
    <nav
      ref={menuBarRef}
      className="bg-[#f0f0f0] dark:bg-[#252526] text-[#242424] dark:text-[#cccccc] px-2 py-0.5 border-b border-[#e0e0e0] dark:border-[#333333] flex items-center space-x-1 text-xs select-none relative z-20"
    >
      {/* File Menu */}
      <div className="relative">
        <button
          onClick={() => handleMenuClick('file')}
          onMouseEnter={() => handleMenuMouseEnter('file')}
          className={`px-2.5 py-1 rounded transition-colors ${
            activeMenu === 'file'
              ? 'bg-[#e0e0e0] dark:bg-[#37373d] text-[#185abd] dark:text-white font-medium'
              : 'hover:bg-[#e4e4e4] dark:hover:bg-[#2a2d2e]'
          }`}
        >
          File
        </button>

        {activeMenu === 'file' && (
          <div className="absolute left-0 top-full mt-0.5 w-60 bg-white dark:bg-[#1e1e1e] border border-[#d1d5db] dark:border-[#3f3f46] rounded-md shadow-xl py-1 text-xs z-50 animate-in fade-in-50">
            <button
              onClick={() => {
                onNew();
                closeMenu();
              }}
              className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-[#eef5fc] dark:hover:bg-[#2a2d2e] transition-colors"
            >
              <span className="flex items-center">
                <FileText className="w-3.5 h-3.5 mr-2 text-[#185abd]" /> New Blank Document
              </span>
              <span className="text-[10px] text-gray-400">Ctrl+N</span>
            </button>

            <button
              onClick={() => {
                onNewFromTemplate();
                closeMenu();
              }}
              className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-[#eef5fc] dark:hover:bg-[#2a2d2e] transition-colors"
            >
              <span className="flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-2 text-amber-500" /> New from Template...
              </span>
            </button>

            <div className="h-[1px] bg-gray-200 dark:bg-[#333] my-1" />

            <button
              onClick={() => {
                onOpen();
                closeMenu();
              }}
              className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-[#eef5fc] dark:hover:bg-[#2a2d2e] transition-colors"
            >
              <span className="flex items-center">
                <FolderOpen className="w-3.5 h-3.5 mr-2 text-[#185abd]" /> Open Document...
              </span>
              <span className="text-[10px] text-gray-400">Ctrl+O</span>
            </button>

            {/* Recent documents preview */}
            {recentDocuments.length > 0 && (
              <div className="relative group/recent">
                <div className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-[#eef5fc] dark:hover:bg-[#2a2d2e] cursor-pointer">
                  <span className="flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-2 text-gray-400" /> Open Recent
                  </span>
                  <ChevronRight className="w-3 h-3 text-gray-400" />
                </div>
                <div className="hidden group-hover/recent:block absolute left-full top-0 w-64 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#3f3f46] rounded-md shadow-xl py-1 z-50">
                  {recentDocuments.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => {
                        onOpenRecent(doc);
                        closeMenu();
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-[#eef5fc] dark:hover:bg-[#2a2d2e] truncate"
                    >
                      <div className="font-medium truncate">{doc.title}</div>
                      <div className="text-[10px] text-gray-400 truncate">{doc.previewSnippet || 'Empty document'}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="h-[1px] bg-gray-200 dark:bg-[#333] my-1" />

            <button
              onClick={() => {
                onSave();
                closeMenu();
              }}
              className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-[#eef5fc] dark:hover:bg-[#2a2d2e] transition-colors"
            >
              <span className="flex items-center">
                <Save className="w-3.5 h-3.5 mr-2 text-[#185abd]" /> Save
              </span>
              <span className="text-[10px] text-gray-400">Ctrl+S</span>
            </button>

            <button
              onClick={() => {
                onSaveAs();
                closeMenu();
              }}
              className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-[#eef5fc] dark:hover:bg-[#2a2d2e] transition-colors"
            >
              <span className="flex items-center">
                <Save className="w-3.5 h-3.5 mr-2 text-gray-400" /> Save As...
              </span>
              <span className="text-[10px] text-gray-400">Ctrl+Shift+S</span>
            </button>

            <div className="h-[1px] bg-gray-200 dark:bg-[#333] my-1" />

            <button
              onClick={() => {
                onExportDocx();
                closeMenu();
              }}
              className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-[#eef5fc] dark:hover:bg-[#2a2d2e] transition-colors"
            >
              <span className="flex items-center">
                <FileCheck className="w-3.5 h-3.5 mr-2 text-[#185abd]" /> Export to Word (.docx)
              </span>
            </button>

            <button
              onClick={() => {
                onExportPdf();
                closeMenu();
              }}
              className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-[#eef5fc] dark:hover:bg-[#2a2d2e] transition-colors"
            >
              <span className="flex items-center">
                <Download className="w-3.5 h-3.5 mr-2 text-red-500" /> Export to PDF (.pdf)
              </span>
            </button>

            <button
              onClick={() => {
                onExportHtml();
                closeMenu();
              }}
              className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-[#eef5fc] dark:hover:bg-[#2a2d2e] transition-colors"
            >
              <span className="flex items-center">
                <FileCode className="w-3.5 h-3.5 mr-2 text-amber-600" /> Export to Web (.html)
              </span>
            </button>

            <button
              onClick={() => {
                onExportTxt();
                closeMenu();
              }}
              className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-[#eef5fc] dark:hover:bg-[#2a2d2e] transition-colors"
            >
              <span className="flex items-center">
                <FileText className="w-3.5 h-3.5 mr-2 text-gray-400" /> Export Plain Text (.txt)
              </span>
            </button>

            <div className="h-[1px] bg-gray-200 dark:bg-[#333] my-1" />

            <button
              onClick={() => {
                onPrint();
                closeMenu();
              }}
              className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-[#eef5fc] dark:hover:bg-[#2a2d2e] transition-colors"
            >
              <span className="flex items-center">
                <Printer className="w-3.5 h-3.5 mr-2 text-[#185abd]" /> Print...
              </span>
              <span className="text-[10px] text-gray-400">Ctrl+P</span>
            </button>

            <div className="h-[1px] bg-gray-200 dark:bg-[#333] my-1" />

            <button
              onClick={() => {
                onCloseDocument();
                closeMenu();
              }}
              className="w-full px-3 py-1.5 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              Close Document
            </button>
          </div>
        )}
      </div>

      {/* Edit Menu */}
      <div className="relative">
        <button
          onClick={() => handleMenuClick('edit')}
          onMouseEnter={() => handleMenuMouseEnter('edit')}
          className={`px-2.5 py-1 rounded transition-colors ${
            activeMenu === 'edit'
              ? 'bg-[#e0e0e0] dark:bg-[#37373d] text-[#185abd] dark:text-white font-medium'
              : 'hover:bg-[#e4e4e4] dark:hover:bg-[#2a2d2e]'
          }`}
        >
          Edit
        </button>

        {activeMenu === 'edit' && (
          <div className="absolute left-0 top-full mt-0.5 w-52 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#3f3f46] rounded-md shadow-xl py-1 text-xs z-50">
            <button
              onClick={() => {
                onUndo();
                closeMenu();
              }}
              className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-[#eef5fc] dark:hover:bg-[#2a2d2e]"
            >
              <span className="flex items-center">
                <Undo2 className="w-3.5 h-3.5 mr-2" /> Undo
              </span>
              <span className="text-[10px] text-gray-400">Ctrl+Z</span>
            </button>
            <button
              onClick={() => {
                onRedo();
                closeMenu();
              }}
              className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-[#eef5fc] dark:hover:bg-[#2a2d2e]"
            >
              <span className="flex items-center">
                <Redo2 className="w-3.5 h-3.5 mr-2" /> Redo
              </span>
              <span className="text-[10px] text-gray-400">Ctrl+Y</span>
            </button>

            <div className="h-[1px] bg-gray-200 dark:bg-[#333] my-1" />

            <button
              onClick={() => {
                onCut();
                closeMenu();
              }}
              className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-[#eef5fc] dark:hover:bg-[#2a2d2e]"
            >
              <span className="flex items-center">
                <Scissors className="w-3.5 h-3.5 mr-2" /> Cut
              </span>
              <span className="text-[10px] text-gray-400">Ctrl+X</span>
            </button>
            <button
              onClick={() => {
                onCopy();
                closeMenu();
              }}
              className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-[#eef5fc] dark:hover:bg-[#2a2d2e]"
            >
              <span className="flex items-center">
                <Copy className="w-3.5 h-3.5 mr-2" /> Copy
              </span>
              <span className="text-[10px] text-gray-400">Ctrl+C</span>
            </button>
            <button
              onClick={() => {
                onPaste();
                closeMenu();
              }}
              className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-[#eef5fc] dark:hover:bg-[#2a2d2e]"
            >
              <span className="flex items-center">
                <Clipboard className="w-3.5 h-3.5 mr-2" /> Paste
              </span>
              <span className="text-[10px] text-gray-400">Ctrl+V</span>
            </button>

            <div className="h-[1px] bg-gray-200 dark:bg-[#333] my-1" />

            <button
              onClick={() => {
                onSelectAll();
                closeMenu();
              }}
              className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-[#eef5fc] dark:hover:bg-[#2a2d2e]"
            >
              <span>Select All</span>
              <span className="text-[10px] text-gray-400">Ctrl+A</span>
            </button>
            <button
              onClick={() => {
                onFind();
                closeMenu();
              }}
              className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-[#eef5fc] dark:hover:bg-[#2a2d2e]"
            >
              <span className="flex items-center">
                <Search className="w-3.5 h-3.5 mr-2 text-[#185abd]" /> Find & Replace...
              </span>
              <span className="text-[10px] text-gray-400">Ctrl+F</span>
            </button>
            <button
              onClick={() => {
                onClearFormat();
                closeMenu();
              }}
              className="w-full px-3 py-1.5 text-left hover:bg-[#eef5fc] dark:hover:bg-[#2a2d2e]"
            >
              Clear Formatting
            </button>
          </div>
        )}
      </div>

      {/* Insert Menu */}
      <div className="relative">
        <button
          onClick={() => handleMenuClick('insert')}
          onMouseEnter={() => handleMenuMouseEnter('insert')}
          className={`px-2.5 py-1 rounded transition-colors ${
            activeMenu === 'insert'
              ? 'bg-[#e0e0e0] dark:bg-[#37373d] text-[#185abd] dark:text-white font-medium'
              : 'hover:bg-[#e4e4e4] dark:hover:bg-[#2a2d2e]'
          }`}
        >
          Insert
        </button>

        {activeMenu === 'insert' && (
          <div className="absolute left-0 top-full mt-0.5 w-52 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#3f3f46] rounded-md shadow-xl py-1 text-xs z-50">
            <button
              onClick={() => {
                onInsertTable(3, 3);
                closeMenu();
              }}
              className="w-full px-3 py-1.5 flex items-center hover:bg-[#eef5fc] dark:hover:bg-[#2a2d2e]"
            >
              <TableIcon className="w-3.5 h-3.5 mr-2 text-[#185abd]" /> Insert 3×3 Table
            </button>
            <button
              onClick={() => {
                onInsertImage();
                closeMenu();
              }}
              className="w-full px-3 py-1.5 flex items-center hover:bg-[#eef5fc] dark:hover:bg-[#2a2d2e]"
            >
              <ImageIcon className="w-3.5 h-3.5 mr-2 text-green-600" /> Insert Picture...
            </button>
            <button
              onClick={() => {
                onInsertLink();
                closeMenu();
              }}
              className="w-full px-3 py-1.5 flex items-center hover:bg-[#eef5fc] dark:hover:bg-[#2a2d2e]"
            >
              <LinkIcon className="w-3.5 h-3.5 mr-2 text-blue-500" /> Insert Hyperlink...
            </button>

            <div className="h-[1px] bg-gray-200 dark:bg-[#333] my-1" />

            <button
              onClick={() => {
                onInsertPageBreak();
                closeMenu();
              }}
              className="w-full px-3 py-1.5 text-left hover:bg-[#eef5fc] dark:hover:bg-[#2a2d2e]"
            >
              Page Break
            </button>
            <button
              onClick={() => {
                onInsertHorizontalRule();
                closeMenu();
              }}
              className="w-full px-3 py-1.5 text-left hover:bg-[#eef5fc] dark:hover:bg-[#2a2d2e]"
            >
              Horizontal Line
            </button>
            <button
              onClick={() => {
                onInsertBlockquote();
                closeMenu();
              }}
              className="w-full px-3 py-1.5 text-left hover:bg-[#eef5fc] dark:hover:bg-[#2a2d2e]"
            >
              Callout Quote Block
            </button>
            <button
              onClick={() => {
                onInsertTaskList();
                closeMenu();
              }}
              className="w-full px-3 py-1.5 text-left hover:bg-[#eef5fc] dark:hover:bg-[#2a2d2e]"
            >
              Interactive Checklist
            </button>
            <div className="my-1 border-t border-gray-200 dark:border-[#333]" />
            <button
              onClick={() => {
                onOpenSettings();
                closeMenu();
              }}
              className="w-full px-3 py-1.5 text-left hover:bg-[#eef5fc] dark:hover:bg-[#2a2d2e] text-[#185abd] font-medium"
            >
              Header, Footer & Presets...
            </button>
          </div>
        )}
      </div>

      {/* Format Menu */}
      <div className="relative">
        <button
          onClick={() => handleMenuClick('format')}
          onMouseEnter={() => handleMenuMouseEnter('format')}
          className={`px-2.5 py-1 rounded transition-colors ${
            activeMenu === 'format'
              ? 'bg-[#e0e0e0] dark:bg-[#37373d] text-[#185abd] dark:text-white font-medium'
              : 'hover:bg-[#e4e4e4] dark:hover:bg-[#2a2d2e]'
          }`}
        >
          Format
        </button>

        {activeMenu === 'format' && (
          <div className="absolute left-0 top-full mt-0.5 w-52 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#3f3f46] rounded-md shadow-xl py-1 text-xs z-50">
            <button
              onClick={() => {
                onFormatBold();
                closeMenu();
              }}
              className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-[#eef5fc] dark:hover:bg-[#2a2d2e]"
            >
              <span className="flex items-center">
                <Bold className="w-3.5 h-3.5 mr-2 font-bold" /> Bold
              </span>
              <span className="text-[10px] text-gray-400">Ctrl+B</span>
            </button>
            <button
              onClick={() => {
                onFormatItalic();
                closeMenu();
              }}
              className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-[#eef5fc] dark:hover:bg-[#2a2d2e]"
            >
              <span className="flex items-center">
                <Italic className="w-3.5 h-3.5 mr-2 italic" /> Italic
              </span>
              <span className="text-[10px] text-gray-400">Ctrl+I</span>
            </button>
            <button
              onClick={() => {
                onFormatUnderline();
                closeMenu();
              }}
              className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-[#eef5fc] dark:hover:bg-[#2a2d2e]"
            >
              <span className="flex items-center">
                <Underline className="w-3.5 h-3.5 mr-2 underline" /> Underline
              </span>
              <span className="text-[10px] text-gray-400">Ctrl+U</span>
            </button>

            <div className="h-[1px] bg-gray-200 dark:bg-[#333] my-1" />

            <button
              onClick={() => {
                onFormatAlign('left');
                closeMenu();
              }}
              className="w-full px-3 py-1.5 flex items-center hover:bg-[#eef5fc] dark:hover:bg-[#2a2d2e]"
            >
              <AlignLeft className="w-3.5 h-3.5 mr-2" /> Align Left
            </button>
            <button
              onClick={() => {
                onFormatAlign('center');
                closeMenu();
              }}
              className="w-full px-3 py-1.5 flex items-center hover:bg-[#eef5fc] dark:hover:bg-[#2a2d2e]"
            >
              <AlignCenter className="w-3.5 h-3.5 mr-2" /> Align Center
            </button>
            <button
              onClick={() => {
                onFormatAlign('right');
                closeMenu();
              }}
              className="w-full px-3 py-1.5 flex items-center hover:bg-[#eef5fc] dark:hover:bg-[#2a2d2e]"
            >
              <AlignRight className="w-3.5 h-3.5 mr-2" /> Align Right
            </button>
            <button
              onClick={() => {
                onFormatAlign('justify');
                closeMenu();
              }}
              className="w-full px-3 py-1.5 flex items-center hover:bg-[#eef5fc] dark:hover:bg-[#2a2d2e]"
            >
              <AlignJustify className="w-3.5 h-3.5 mr-2" /> Justify
            </button>
          </div>
        )}
      </div>

      {/* View Menu */}
      <div className="relative">
        <button
          onClick={() => handleMenuClick('view')}
          onMouseEnter={() => handleMenuMouseEnter('view')}
          className={`px-2.5 py-1 rounded transition-colors ${
            activeMenu === 'view'
              ? 'bg-[#e0e0e0] dark:bg-[#37373d] text-[#185abd] dark:text-white font-medium'
              : 'hover:bg-[#e4e4e4] dark:hover:bg-[#2a2d2e]'
          }`}
        >
          View
        </button>

        {activeMenu === 'view' && (
          <div className="absolute left-0 top-full mt-0.5 w-52 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#3f3f46] rounded-md shadow-xl py-1 text-xs z-50">
            <button
              onClick={() => {
                onToggleRuler();
                closeMenu();
              }}
              className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-[#eef5fc] dark:hover:bg-[#2a2d2e]"
            >
              <span>Horizontal Ruler</span>
              <span className="font-semibold text-[#185abd]">{showRuler ? '✓' : ''}</span>
            </button>
            <button
              onClick={() => {
                onToggleNavSidebar();
                closeMenu();
              }}
              className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-[#eef5fc] dark:hover:bg-[#2a2d2e]"
            >
              <span>Navigation & Outline Panel</span>
              <span className="font-semibold text-[#185abd]">{showNavSidebar ? '✓' : ''}</span>
            </button>
            <button
              onClick={() => {
                onToggleTheme();
                closeMenu();
              }}
              className="w-full px-3 py-1.5 text-left hover:bg-[#eef5fc] dark:hover:bg-[#2a2d2e]"
            >
              Toggle Light / Dark Mode
            </button>

            <div className="h-[1px] bg-gray-200 dark:bg-[#333] my-1" />

            <div className="px-3 py-1 text-[11px] font-semibold text-gray-400">Zoom Level</div>
            {[50, 75, 100, 125, 150, 200].map((z) => (
              <button
                key={z}
                onClick={() => {
                  onZoomChange(z);
                  closeMenu();
                }}
                className="w-full px-3 py-1 text-left hover:bg-[#eef5fc] dark:hover:bg-[#2a2d2e]"
              >
                {z}%
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tools Menu */}
      <div className="relative">
        <button
          onClick={() => handleMenuClick('tools')}
          onMouseEnter={() => handleMenuMouseEnter('tools')}
          className={`px-2.5 py-1 rounded transition-colors ${
            activeMenu === 'tools'
              ? 'bg-[#e0e0e0] dark:bg-[#37373d] text-[#185abd] dark:text-white font-medium'
              : 'hover:bg-[#e4e4e4] dark:hover:bg-[#2a2d2e]'
          }`}
        >
          Tools
        </button>

        {activeMenu === 'tools' && (
          <div className="absolute left-0 top-full mt-0.5 w-56 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#3f3f46] rounded-md shadow-xl py-1 text-xs z-50">
            <button
              onClick={() => {
                onOpenWordCount();
                closeMenu();
              }}
              className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-[#eef5fc] dark:hover:bg-[#2a2d2e]"
            >
              <span className="flex items-center">
                <FileText className="w-3.5 h-3.5 mr-2 text-[#185abd]" /> Word Count & Statistics
              </span>
              <span className="text-[10px] text-gray-400">Ctrl+Shift+C</span>
            </button>
            <button
              onClick={() => {
                onOpenSpellCheck();
                closeMenu();
              }}
              className="w-full px-3 py-1.5 flex items-center hover:bg-[#eef5fc] dark:hover:bg-[#2a2d2e]"
            >
              <Sparkles className="w-3.5 h-3.5 mr-2 text-indigo-600" /> Spell & Grammar Checker
            </button>
            <button
              onClick={() => {
                onOpenRecovery();
                closeMenu();
              }}
              className="w-full px-3 py-1.5 flex items-center hover:bg-[#eef5fc] dark:hover:bg-[#2a2d2e]"
            >
              <Clock className="w-3.5 h-3.5 mr-2 text-amber-600" /> Document Recovery Vault
            </button>
            <button
              onClick={() => {
                onOpenSettings();
                closeMenu();
              }}
              className="w-full px-3 py-1.5 flex items-center hover:bg-[#eef5fc] dark:hover:bg-[#2a2d2e]"
            >
              <Settings className="w-3.5 h-3.5 mr-2 text-gray-500" /> Document Settings & Margins...
            </button>
          </div>
        )}
      </div>

      {/* Help Menu */}
      <div className="relative">
        <button
          onClick={() => handleMenuClick('help')}
          onMouseEnter={() => handleMenuMouseEnter('help')}
          className={`px-2.5 py-1 rounded transition-colors ${
            activeMenu === 'help'
              ? 'bg-[#e0e0e0] dark:bg-[#37373d] text-[#185abd] dark:text-white font-medium'
              : 'hover:bg-[#e4e4e4] dark:hover:bg-[#2a2d2e]'
          }`}
        >
          Help
        </button>

        {activeMenu === 'help' && (
          <div className="absolute left-0 top-full mt-0.5 w-52 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#3f3f46] rounded-md shadow-xl py-1 text-xs z-50">
            <button
              onClick={() => {
                onOpenAbout();
                closeMenu();
              }}
              className="w-full px-3 py-1.5 flex items-center hover:bg-[#eef5fc] dark:hover:bg-[#2a2d2e]"
            >
              <HelpCircle className="w-3.5 h-3.5 mr-2 text-[#185abd]" /> About Wordo
            </button>
            <button
              onClick={() => {
                onOpenShortcuts();
                closeMenu();
              }}
              className="w-full px-3 py-1.5 flex items-center hover:bg-[#eef5fc] dark:hover:bg-[#2a2d2e]"
            >
              <FileCheck className="w-3.5 h-3.5 mr-2 text-green-600" /> Keyboard Shortcuts
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
