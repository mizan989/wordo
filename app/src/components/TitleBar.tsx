import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  AlertCircle,
  Sun,
  Moon,
  MessageSquare,
  Cloud,
} from 'lucide-react';
import wordoLogo from '../assets/wordo-logo.png';
import { PlatformService } from '../services/platform';

interface TitleBarProps {
  documentTitle: string;
  isDirty: boolean;
  theme: 'light' | 'dark';
  onTitleChange: (newTitle: string) => void;
  onToggleTheme: () => void;
  onOpenSearch?: () => void;
  onRequestClose?: () => void;
  isEditingTitleExternal?: boolean;
  onStartEditingTitle?: () => void;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  documentTitle,
  isDirty,
  theme,
  onTitleChange,
  onToggleTheme,
  onOpenSearch,
  onRequestClose,
  isEditingTitleExternal,
  onStartEditingTitle,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(documentTitle);

  const editing = isEditingTitleExternal || isEditingTitle;

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (titleInput.trim()) {
      onTitleChange(titleInput.trim());
    } else {
      setTitleInput(documentTitle);
    }
  };

  return (
    <header
      className="h-10 select-none bg-[#f3f2f1] dark:bg-[#201f1e] text-gray-800 dark:text-gray-100 flex items-center justify-between px-3 text-xs border-b border-[#e1dfdd] dark:border-[#2d2c2b] shadow-2xs z-30 transition-colors"
      aria-label="Wordo document header"
    >
      {/* 1. Left: App Identity, Document Title & Cloud Save Status */}
      <div className="flex items-center space-x-2.5 min-w-[200px]">
        {/* Word Logo */}
        <div className="flex items-center space-x-1.5 cursor-pointer">
          <img src={wordoLogo} alt="" className="w-5 h-5 object-contain" />
        </div>

        {/* Document Title & Rename */}
        <div className="flex items-center space-x-1.5">
          {editing ? (
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
              className="bg-white dark:bg-[#2d2c2b] text-gray-900 dark:text-gray-100 font-semibold px-2 py-0.5 rounded text-xs border border-[#185abd] outline-hidden shadow-xs max-w-[220px]"
            />
          ) : (
            <button
              onClick={() => {
                setTitleInput(documentTitle);
                setIsEditingTitle(true);
                onStartEditingTitle?.();
              }}
              title="Click to rename document"
              className="hover:bg-black/5 dark:hover:bg-white/10 px-2 py-1 rounded transition-colors font-semibold text-gray-800 dark:text-gray-100 flex items-center space-x-1 max-w-[240px] truncate"
            >
              <span className="truncate">{documentTitle}</span>
            </button>
          )}

          {/* Cloud Auto-save Icon (matching screenshot) */}
          <div
            title={isDirty ? 'Saving changes...' : 'Saved to Documents'}
            className="flex items-center cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 p-1 rounded transition-colors"
          >
            {isDirty ? (
              <div className="relative flex items-center">
                <Cloud className="w-4 h-4 text-gray-400" />
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" />
              </div>
            ) : (
              <div className="relative flex items-center">
                <Cloud className="w-4 h-4 text-[#107c41]" />
                <CheckCircle2 className="w-2.5 h-2.5 text-[#107c41] absolute -bottom-0.5 -right-0.5 bg-[#f3f2f1] dark:bg-[#201f1e] rounded-full" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Center: Search Bar ("Search for tools, help, and more (Alt + Q)") */}
      <div className="flex-1 flex justify-center max-w-[500px] mx-4">
        <button
          onClick={onOpenSearch}
          title="Search tools, commands and help (Alt+Q)"
          className="w-full flex items-center space-x-2 bg-white dark:bg-[#2d2c2b] hover:bg-white/90 border border-[#e1dfdd] dark:border-gray-700 hover:border-gray-400 rounded-md px-3 py-1 text-xs text-gray-500 dark:text-gray-400 shadow-2xs transition-colors"
        >
          <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span className="truncate">Search for tools, help, and more (Alt + Q)</span>
        </button>
      </div>

      {/* 3. Right: Theme Toggle & Native Window Controls */}
      <div className="flex items-center space-x-1">
        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          {theme === 'dark' ? (
            <Sun className="w-3.5 h-3.5 text-amber-300" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-gray-600" />
          )}
        </button>
      </div>
    </header>
  );
};
