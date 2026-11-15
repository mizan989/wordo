import React, { useState } from 'react';
import {
  CheckCircle2,
  PlusCircle,
  FolderOpen,
  Copy,
  Download,
  Printer,
  Edit2,
  Clock,
  Trash2,
  Info,
  ChevronRight,
  FileText,
  FileCode,
  HardDrive,
  Sparkles,
} from 'lucide-react';
import { DOCUMENT_TEMPLATES, DocumentTemplate } from '../templates';
import { RecentDocument, DocumentStats } from '../types';

interface FileMenuDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onNew: () => void;
  onNewFromTemplate: (template: DocumentTemplate) => void;
  onOpenLocalFile: () => void;
  onOpenRecent: (doc: RecentDocument) => void;
  recentDocuments: RecentDocument[];
  onSaveAs: () => void;
  onExportDocx: () => void;
  onExportPdf: () => void;
  onExportHtml: () => void;
  onExportTxt: () => void;
  onPrint: () => void;
  onRename: () => void;
  onOpenRecovery: () => void;
  onCloseDocument: () => void;
  onOpenInfo: () => void;
  documentTitle: string;
}

export const FileMenuDropdown: React.FC<FileMenuDropdownProps> = ({
  isOpen,
  onClose,
  onNew,
  onNewFromTemplate,
  onOpenLocalFile,
  onOpenRecent,
  recentDocuments,
  onSaveAs,
  onExportDocx,
  onExportPdf,
  onExportHtml,
  onExportTxt,
  onPrint,
  onRename,
  onOpenRecovery,
  onCloseDocument,
  onOpenInfo,
  documentTitle,
}) => {
  const [activeSubmenu, setActiveSubmenu] = useState<'new' | 'open' | 'export' | 'createCopy' | null>(null);

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute left-0 top-full mt-0.5 z-50 bg-white dark:bg-[#252423] border border-gray-200 dark:border-gray-700 rounded-md shadow-2xl py-1 w-64 text-xs text-gray-800 dark:text-gray-100 select-none animate-in fade-in duration-100"
    >
      {/* 1. Header: Autosaved status */}
      <div className="px-3.5 py-2 border-b border-gray-100 dark:border-gray-800 flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium bg-emerald-50/50 dark:bg-emerald-950/20">
        <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="truncate">
          Autosaved online to <span className="underline font-semibold cursor-pointer">Documents</span>
        </span>
      </div>

      <div className="py-1 relative">
        {/* New Item */}
        <div
          onMouseEnter={() => setActiveSubmenu('new')}
          className="relative"
        >
          <button
            onClick={() => {
              onNew();
              onClose();
            }}
            className="w-full flex items-center justify-between px-3.5 py-2 hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
          >
            <div className="flex items-center space-x-2.5">
              <PlusCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>New</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {/* New Submenu */}
          {activeSubmenu === 'new' && (
            <div
              className="absolute left-full top-0 ml-0.5 bg-white dark:bg-[#252423] border border-gray-200 dark:border-gray-700 rounded-md shadow-2xl py-1 w-56 text-xs z-50"
              onMouseLeave={() => setActiveSubmenu(null)}
            >
              <button
                onClick={() => {
                  onNew();
                  onClose();
                }}
                className="w-full flex items-center space-x-2.5 px-3 py-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-left font-medium"
              >
                <FileText className="w-4 h-4 text-[#185abd]" />
                <span>Blank document</span>
              </button>
              <div className="my-1 border-t border-gray-100 dark:border-gray-800" />
              <div className="px-3 py-1 text-[10px] uppercase font-semibold text-gray-400">Templates</div>
              {DOCUMENT_TEMPLATES.slice(0, 4).map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => {
                    onNewFromTemplate(tmpl);
                    onClose();
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-left truncate"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                  <span className="truncate">{tmpl.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Open Item */}
        <div
          onMouseEnter={() => setActiveSubmenu('open')}
          className="relative"
        >
          <button
            onClick={() => {
              onOpenLocalFile();
              onClose();
            }}
            className="w-full flex items-center justify-between px-3.5 py-2 hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
          >
            <div className="flex items-center space-x-2.5">
              <FolderOpen className="w-4 h-4 text-amber-500" />
              <span>Open</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {/* Open Submenu */}
          {activeSubmenu === 'open' && (
            <div
              className="absolute left-full top-0 ml-0.5 bg-white dark:bg-[#252423] border border-gray-200 dark:border-gray-700 rounded-md shadow-2xl py-1 w-64 text-xs z-50 max-h-72 overflow-y-auto"
              onMouseLeave={() => setActiveSubmenu(null)}
            >
              <button
                onClick={() => {
                  onOpenLocalFile();
                  onClose();
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-left font-medium text-[#185abd] dark:text-blue-400"
              >
                <HardDrive className="w-4 h-4" />
                <span>Browse This Device...</span>
              </button>
              <div className="my-1 border-t border-gray-100 dark:border-gray-800" />
              <div className="px-3 py-1 text-[10px] uppercase font-semibold text-gray-400">Recent Documents</div>
              {recentDocuments.length === 0 ? (
                <div className="px-3 py-2 text-[11px] text-gray-400 italic">No recent documents</div>
              ) : (
                recentDocuments.slice(0, 6).map((doc, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onOpenRecent(doc);
                      onClose();
                    }}
                    className="w-full flex flex-col px-3 py-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-left truncate"
                  >
                    <span className="font-medium truncate">{doc.title}</span>
                    <span className="text-[10px] text-gray-400 truncate">{new Date(doc.lastOpened).toLocaleDateString()}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <div className="my-1 border-t border-gray-100 dark:border-gray-800" />

        {/* Create a Copy / Save As */}
        <button
          onClick={() => {
            onSaveAs();
            onClose();
          }}
          className="w-full flex items-center justify-between px-3.5 py-2 hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
        >
          <div className="flex items-center space-x-2.5">
            <Copy className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            <span>Create a Copy</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        </button>

        {/* Export */}
        <div
          onMouseEnter={() => setActiveSubmenu('export')}
          className="relative"
        >
          <button
            onClick={() => setActiveSubmenu(activeSubmenu === 'export' ? null : 'export')}
            className="w-full flex items-center justify-between px-3.5 py-2 hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
          >
            <div className="flex items-center space-x-2.5">
              <Download className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              <span>Export</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {/* Export Submenu */}
          {activeSubmenu === 'export' && (
            <div
              className="absolute left-full top-0 ml-0.5 bg-white dark:bg-[#252423] border border-gray-200 dark:border-gray-700 rounded-md shadow-2xl py-1 w-56 text-xs z-50"
              onMouseLeave={() => setActiveSubmenu(null)}
            >
              <button
                onClick={() => {
                  onExportDocx();
                  onClose();
                }}
                className="w-full flex items-center space-x-2.5 px-3 py-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-left font-medium"
              >
                <FileText className="w-4 h-4 text-[#185abd]" />
                <span>Download as DOCX (.docx)</span>
              </button>
              <button
                onClick={() => {
                  onExportPdf();
                  onClose();
                }}
                className="w-full flex items-center space-x-2.5 px-3 py-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 text-left font-medium"
              >
                <Download className="w-4 h-4 text-red-600" />
                <span>Download as PDF (.pdf)</span>
              </button>
              <button
                onClick={() => {
                  onExportHtml();
                  onClose();
                }}
                className="w-full flex items-center space-x-2.5 px-3 py-1.5 hover:bg-amber-50 dark:hover:bg-amber-900/30 text-left font-medium"
              >
                <FileCode className="w-4 h-4 text-amber-600" />
                <span>Export as Web Page (.html)</span>
              </button>
              <button
                onClick={() => {
                  onExportTxt();
                  onClose();
                }}
                className="w-full flex items-center space-x-2.5 px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 text-left font-medium"
              >
                <FileText className="w-4 h-4 text-gray-500" />
                <span>Plain Text (.txt)</span>
              </button>
            </div>
          )}
        </div>

        {/* Print */}
        <button
          onClick={() => {
            onPrint();
            onClose();
          }}
          className="w-full flex items-center space-x-2.5 px-3.5 py-2 hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
        >
          <Printer className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          <span>Print</span>
        </button>

        <div className="my-1 border-t border-gray-100 dark:border-gray-800" />

        {/* Rename */}
        <button
          onClick={() => {
            onRename();
            onClose();
          }}
          className="w-full flex items-center space-x-2.5 px-3.5 py-2 hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
        >
          <Edit2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          <span>Rename</span>
        </button>

        {/* Version History */}
        <button
          onClick={() => {
            onOpenRecovery();
            onClose();
          }}
          className="w-full flex items-center space-x-2.5 px-3.5 py-2 hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
        >
          <Clock className="w-4 h-4 text-amber-500" />
          <span>Version History</span>
        </button>

        {/* Delete */}
        <button
          onClick={() => {
            onClose();
            onCloseDocument();
          }}
          className="w-full flex items-center space-x-2.5 px-3.5 py-2 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 transition-colors"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
          <span>Delete</span>
        </button>

        {/* Info */}
        <button
          onClick={() => {
            onOpenInfo();
            onClose();
          }}
          className="w-full flex items-center justify-between px-3.5 py-2 hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
        >
          <div className="flex items-center space-x-2.5">
            <Info className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            <span>Info</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        </button>
      </div>
    </div>
  );
};
