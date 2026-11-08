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
      <div className="bg-white dark:bg-[#252526] text-[#242424] dark:text-[#cccccc] w-full max-w-md rounded-xl shadow-2xl border border-gray-300 dark:border-gray-700 overflow-hidden text-xs">
        {/* Header */}
        <div className="px-5 py-4 bg-[#f5f5f5] dark:bg-[#1e1e1e] border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <img src={wordoLogo} alt="Wordo" className="w-8 h-8 object-contain rounded" />
            <div>
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">Wordo</h3>
              <p className="text-[11px] text-gray-500">Independent Desktop Word Processor</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-[#333] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
              <span className="text-gray-500">Version</span>
              <span className="font-mono font-semibold">1.0.0 (Production Release)</span>
            </div>
            <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
              <span className="text-gray-500">Architecture</span>
              <span className="font-mono">Tauri 2 + ProseMirror + React 19</span>
            </div>
            <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
              <span className="text-gray-500">Document Engine</span>
              <span>Tiptap / ProseMirror</span>
            </div>
          </div>

          <div className="p-3 bg-[#fafafa] dark:bg-[#1f1f1f] border border-gray-200 dark:border-gray-700 rounded-lg space-y-2">
            <div className="font-semibold text-gray-800 dark:text-gray-200 flex items-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mr-1.5" />
              Cross-Platform Native Desktop Support
            </div>
            <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed">
              Engineered for seamless offline desktop productivity on <strong>Linux</strong> (Ubuntu, Debian, Kali, AppImage), <strong>Windows 10/11</strong>, and <strong>macOS</strong>. Local document processing with zero telemetry.
            </p>
          </div>

          <div className="text-[11px] text-gray-400 space-y-1 pt-1">
            <p>© 2026 Wordo Systems. All rights reserved.</p>
            <p>Inspired by modern productivity experiences. Independent software product.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#f5f5f5] dark:bg-[#1e1e1e] border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#185abd] text-white hover:bg-[#1651aa] rounded font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
