import React, { useState } from 'react';
import {
  FileText,
  Save,
  Undo2,
  Redo2,
  Printer,
  FilePlus2,
  FolderOpen,
  Sun,
  Moon,
  Minus,
  Square,
  X,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { PlatformService } from '../services/platform';

interface TitleBarProps {
  documentTitle: string;
  isDirty: boolean;
  theme: 'light' | 'dark';
  onTitleChange: (newTitle: string) => void;
  onNew: () => void;
  onOpen: () => void;
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onPrint: () => void;
  onToggleTheme: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  documentTitle,
  isDirty,
  theme,
  onTitleChange,
  onNew,
  onOpen,
  onSave,
  onUndo,
  onRedo,
  onPrint,
  onToggleTheme,
  canUndo,
  canRedo,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(documentTitle);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (titleInput.trim()) {
      onTitleChange(titleInput.trim());
    } else {
      setTitleInput(documentTitle);
    }
  };

  return (
    <header className="h-10 select-none bg-[#185abd] text-white flex items-center justify-between px-3 text-xs border-b border-[#1651aa] shadow-sm z-30">
      {/* Left: App Identity & Quick Access Toolbar */}
      <div className="flex items-center space-x-2">
        {/* Brand Icon & Name */}
        <div className="flex items-center space-x-1.5 mr-2 font-semibold tracking-wide">
          <div className="w-6 h-6 bg-white text-[#185abd] rounded flex items-center justify-center shadow-xs">
            <span className="font-bold text-sm leading-none">W</span>
          </div>
          <span className="text-sm font-bold tracking-tight">Word-Client</span>
        </div>

        {/* Quick Access Toolbar */}
        <div className="flex items-center space-x-0.5 bg-black/15 rounded px-1 py-0.5">
          <button
            onClick={onNew}
            title="New Document (Ctrl+N)"
            className="p-1 rounded hover:bg-white/20 active:bg-white/30 transition-colors"
          >
            <FilePlus2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onOpen}
            title="Open Document (Ctrl+O)"
            className="p-1 rounded hover:bg-white/20 active:bg-white/30 transition-colors"
          >
            <FolderOpen className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onSave}
            title="Save Document (Ctrl+S)"
            className="p-1 rounded hover:bg-white/20 active:bg-white/30 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
          </button>
          <div className="w-[1px] h-3 bg-white/30 mx-0.5" />
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className={`p-1 rounded transition-colors ${
              canUndo ? 'hover:bg-white/20 active:bg-white/30' : 'opacity-40 cursor-not-allowed'
            }`}
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className={`p-1 rounded transition-colors ${
              canRedo ? 'hover:bg-white/20 active:bg-white/30' : 'opacity-40 cursor-not-allowed'
            }`}
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onPrint}
            title="Print Document (Ctrl+P)"
            className="p-1 rounded hover:bg-white/20 active:bg-white/30 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Center: Document Title & Save Status */}
      <div className="flex items-center space-x-2">
        {isEditingTitle ? (
          <input
            type="text"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleTitleSubmit();
              if (e.key === 'Escape') {
                setTitleInput(documentTitle);
                setIsEditingTitle(false);
              }
            }}
            autoFocus
            className="bg-white text-[#242424] font-medium px-2 py-0.5 rounded text-xs outline-hidden shadow-inner max-w-[280px]"
          />
        ) : (
          <button
            onClick={() => {
              setTitleInput(documentTitle);
              setIsEditingTitle(true);
            }}
            title="Click to rename document"
            className="hover:bg-white/20 px-2 py-0.5 rounded transition-colors font-medium flex items-center space-x-1.5 max-w-[320px] truncate"
          >
            <span className="truncate">{documentTitle}</span>
            <span className="text-[10px] opacity-75 font-normal">.docx</span>
          </button>
        )}

        {/* Saved Status Indicator */}
        <div className="flex items-center space-x-1 text-[11px] opacity-85">
          {isDirty ? (
            <span className="flex items-center text-amber-200">
              <AlertCircle className="w-3 h-3 mr-1" />
              Unsaved changes
            </span>
          ) : (
            <span className="flex items-center text-blue-100">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Saved to device
            </span>
          )}
        </div>
      </div>

      {/* Right: Theme Switcher & Desktop Window Controls */}
      <div className="flex items-center space-x-1">
        <button
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          className="p-1.5 rounded hover:bg-white/20 active:bg-white/30 transition-colors mr-2"
        >
          {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5" />}
        </button>

        {/* Window controls */}
        <div className="flex items-center space-x-0.5 ml-1">
          <button
            onClick={() => PlatformService.minimizeWindow()}
            title="Minimize"
            className="p-1.5 rounded hover:bg-white/20 active:bg-white/30 transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => PlatformService.toggleMaximizeWindow()}
            title="Maximize / Fullscreen"
            className="p-1.5 rounded hover:bg-white/20 active:bg-white/30 transition-colors"
          >
            <Square className="w-3 h-3" />
          </button>
          <button
            onClick={() => PlatformService.closeWindow()}
            title="Close Application"
            className="p-1.5 rounded hover:bg-red-600 active:bg-red-700 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
