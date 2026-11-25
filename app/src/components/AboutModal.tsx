import React from 'react';
import { X, ShieldCheck, CheckCircle2, Cpu, Globe, FolderGit2 } from 'lucide-react';
import wordoLogo from '../assets/wordo-logo.png';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none animate-in fade-in-50">
      <div className="bg-[var(--surface-primary)] text-[var(--text-primary)] w-full max-w-md rounded-[var(--radius-xl)] shadow-[var(--shadow-modal)] border border-[var(--border-color)] overflow-hidden text-xs">
        {/* Header */}
        <div className="px-5 py-4 bg-[var(--surface-secondary)] border-b border-[var(--border-color)] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <img src={wordoLogo} alt="Wordo" className="w-8 h-8 object-contain rounded" />
            <div>
              <h3 className="font-bold text-sm text-[var(--text-primary)]">Wordo</h3>
              <p className="text-[11px] text-[var(--text-muted)]">Independent Desktop Word Processor</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[var(--hover-bg)] text-[var(--text-primary)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[var(--text-primary)]">
              <span className="text-[var(--text-muted)]">Version</span>
              <span className="font-mono font-semibold">2.0.4 (Production Release)</span>
            </div>
            <div className="flex items-center justify-between text-[var(--text-primary)]">
              <span className="text-[var(--text-muted)]">Architecture</span>
              <span className="font-mono">Tauri 2 + ProseMirror + React 19</span>
            </div>
            <div className="flex items-center justify-between text-[var(--text-primary)]">
              <span className="text-[var(--text-muted)]">Document Engine</span>
              <span>Tiptap / ProseMirror</span>
            </div>
          </div>

          <div className="p-3 bg-[var(--surface-secondary)] border border-[var(--border-color)] rounded-[var(--radius-lg)] space-y-2">
            <div className="font-semibold text-gray-800 dark:text-gray-200 flex items-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mr-1.5" />
              Cross-Platform Native Desktop Support
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
              Engineered for seamless offline desktop productivity on <strong>Linux</strong> (Ubuntu, Debian, Kali, AppImage), <strong>Windows 10/11</strong>, and <strong>macOS</strong>. Local document processing with zero telemetry.
            </p>
          </div>

          <div className="text-[11px] text-[var(--text-muted)] space-y-1 pt-1">
            <p>© 2026 Wordo Systems. All rights reserved.</p>
            <p>Inspired by modern productivity experiences. Independent software product.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[var(--surface-secondary)] border-t border-[var(--border-color)] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[var(--accent-color)] text-white hover:opacity-90 rounded-[var(--radius-md)] font-medium transition-opacity shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
