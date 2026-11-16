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
  onOpenSearch?: (mode?: 'find' | 'replace') => void;
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
      className="h-[var(--titlebar-height)] select-none bg-[var(--surface-primary)] text-[var(--text-primary)] flex items-center justify-between px-3.5 text-xs border-b border-[var(--border-color)] z-30 transition-colors"
      aria-label="Wordo document header"
    >
      {/* 1. Left: App Identity, Document Title & Cloud Save Status */}
      <div className="flex items-center space-x-2.5 min-w-[200px]">
        {/* Wordo Logo */}
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
              className="bg-[var(--surface-secondary)] text-[var(--text-primary)] font-medium px-2.5 py-0.5 rounded-[var(--radius-md)] text-xs border border-[var(--border-color)] focus:border-[var(--accent-color)] outline-hidden max-w-[220px]"
            />
          ) : (
            <button
              onClick={() => {
                setTitleInput(documentTitle);
                setIsEditingTitle(true);
                onStartEditingTitle?.();
              }}
              title="Click to rename document"
              className="hover:bg-[var(--hover-bg)] px-2.5 py-1 rounded-[var(--radius-md)] transition-colors font-medium text-[var(--text-primary)] flex items-center space-x-1 max-w-[240px] truncate"
            >
              <span className="truncate">{documentTitle}</span>
            </button>
          )}

          {/* Cloud Auto-save Icon */}
          <div
            title={isDirty ? 'Saving changes...' : 'Saved to Documents'}
            className="flex items-center cursor-pointer hover:bg-[var(--hover-bg)] p-1 rounded-[var(--radius-sm)] transition-colors"
          >
            {isDirty ? (
              <div className="relative flex items-center">
                <Cloud className="w-4 h-4 text-[var(--text-muted)]" />
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[var(--warning-color)] rounded-full animate-ping" />
              </div>
            ) : (
              <div className="relative flex items-center">
                <Cloud className="w-4 h-4 text-[var(--success-color)]" />
                <CheckCircle2 className="w-2.5 h-2.5 text-[var(--success-color)] absolute -bottom-0.5 -right-0.5 bg-[var(--surface-primary)] rounded-full" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Center: Search Bar ("Search for tools, help, and more (Alt + Q)") */}
      <div className="flex-1 flex justify-center max-w-[480px] mx-4">
        <button
          onClick={() => onOpenSearch?.('find')}
          title="Search tools, commands and help (Alt+Q)"
          className="w-full flex items-center space-x-2 bg-[var(--surface-secondary)] hover:bg-[var(--hover-bg)] border border-[var(--border-color)] hover:border-[var(--border-hover)] rounded-[var(--radius-md)] px-3 py-1 text-xs text-[var(--text-secondary)] transition-colors"
        >
          <Search className="w-3.5 h-3.5 text-[var(--text-muted)] flex-shrink-0" />
          <span className="truncate">Search for tools, help, and more (Alt + Q)</span>
        </button>
      </div>

      {/* 3. Right: Theme Toggle & Controls */}
      <div className="flex items-center space-x-1">
        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          className="p-1.5 rounded-[var(--radius-md)] hover:bg-[var(--hover-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          {theme === 'dark' ? (
            <Sun className="w-3.5 h-3.5 text-amber-300" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
          )}
        </button>
      </div>
    </header>
  );
};
