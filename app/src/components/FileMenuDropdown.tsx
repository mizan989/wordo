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
      className="absolute left-0 top-full mt-1 z-50 bg-[var(--surface-floating)] border border-[var(--border-color)] rounded-[var(--radius-lg)] shadow-[var(--shadow-popover)] py-1.5 w-64 text-xs text-[var(--text-primary)] select-none animate-in fade-in duration-100 transition-colors"
    >
      {/* 1. Header: Autosaved status */}
      <div className="px-3.5 py-1.5 border-b border-[var(--border-subtle)] flex items-center space-x-2 text-[var(--success-color)] text-[11px] font-medium bg-[var(--success-subtle)] rounded-t-[calc(var(--radius-lg)-2px)]">
        <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="truncate">
          Autosaved to <span className="font-semibold">Documents</span>
        </span>
      </div>

      <div className="py-1 relative">
        {/* New Item */}
        <div
          onMouseEnter={() => setActiveSubmenu('new')}
          className="relative px-1"
        >
          <button
            onClick={() => {
              onNew();
              onClose();
            }}
            className="w-full flex items-center justify-between px-2.5 py-1.5 hover:bg-[var(--hover-bg)] rounded-[var(--radius-sm)] transition-colors text-[var(--text-primary)]"
          >
            <div className="flex items-center space-x-2.5">
              <PlusCircle className="w-4 h-4 text-[var(--success-color)]" />
              <span>New</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          </button>

          {/* New Submenu */}
          {activeSubmenu === 'new' && (
            <div
              className="absolute left-full top-0 ml-1 bg-[var(--surface-floating)] border border-[var(--border-color)] rounded-[var(--radius-lg)] shadow-[var(--shadow-popover)] py-1.5 w-56 text-xs z-50 text-[var(--text-primary)]"
              onMouseLeave={() => setActiveSubmenu(null)}
            >
              <button
                onClick={() => {
                  onNew();
                  onClose();
                }}
                className="w-full flex items-center space-x-2.5 px-3 py-1.5 hover:bg-[var(--hover-bg)] text-left font-medium rounded-[var(--radius-sm)]"
              >
                <FileText className="w-4 h-4 text-[var(--accent-color)]" />
                <span>Blank document</span>
              </button>
              <div className="my-1 border-t border-[var(--border-subtle)]" />
              <div className="px-3 py-1 text-[10px] uppercase font-semibold text-[var(--text-muted)]">Templates</div>
              {DOCUMENT_TEMPLATES.slice(0, 4).map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => {
                    onNewFromTemplate(tmpl);
                    onClose();
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-1.5 hover:bg-[var(--hover-bg)] text-left truncate rounded-[var(--radius-sm)]"
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
          className="relative px-1"
        >
          <button
            onClick={() => {
              onOpenLocalFile();
              onClose();
            }}
            className="w-full flex items-center justify-between px-2.5 py-1.5 hover:bg-[var(--hover-bg)] rounded-[var(--radius-sm)] transition-colors text-[var(--text-primary)]"
          >
            <div className="flex items-center space-x-2.5">
              <FolderOpen className="w-4 h-4 text-amber-500" />
              <span>Open</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          </button>

          {/* Open Submenu */}
          {activeSubmenu === 'open' && (
            <div
              className="absolute left-full top-0 ml-1 bg-[var(--surface-floating)] border border-[var(--border-color)] rounded-[var(--radius-lg)] shadow-[var(--shadow-popover)] py-1.5 w-64 text-xs z-50 max-h-72 overflow-y-auto text-[var(--text-primary)]"
              onMouseLeave={() => setActiveSubmenu(null)}
            >
              <button
                onClick={() => {
                  onOpenLocalFile();
                  onClose();
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 hover:bg-[var(--hover-bg)] text-left font-medium text-[var(--accent-color)] rounded-[var(--radius-sm)]"
              >
                <HardDrive className="w-4 h-4" />
                <span>Browse This Device...</span>
              </button>
              <div className="my-1 border-t border-[var(--border-subtle)]" />
              <div className="px-3 py-1 text-[10px] uppercase font-semibold text-[var(--text-muted)]">Recent Documents</div>
              {recentDocuments.length === 0 ? (
                <div className="px-3 py-2 text-[11px] text-[var(--text-muted)] italic">No recent documents</div>
              ) : (
                recentDocuments.slice(0, 6).map((doc, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onOpenRecent(doc);
                      onClose();
                    }}
                    className="w-full flex flex-col px-3 py-1.5 hover:bg-[var(--hover-bg)] text-left truncate rounded-[var(--radius-sm)]"
                  >
                    <span className="font-medium truncate">{doc.title}</span>
                    <span className="text-[10px] text-[var(--text-muted)] truncate">{new Date(doc.lastOpened).toLocaleDateString()}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <div className="my-1 border-t border-[var(--border-subtle)]" />

        {/* Create a Copy / Save As */}
        <div className="px-1">
          <button
            onClick={() => {
              onSaveAs();
              onClose();
            }}
            className="w-full flex items-center justify-between px-2.5 py-1.5 hover:bg-[var(--hover-bg)] rounded-[var(--radius-sm)] transition-colors text-[var(--text-primary)]"
          >
            <div className="flex items-center space-x-2.5">
              <Copy className="w-4 h-4 text-[var(--text-secondary)]" />
              <span>Create a Copy</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          </button>
        </div>

        {/* Export */}
        <div
          onMouseEnter={() => setActiveSubmenu('export')}
          className="relative px-1"
        >
          <button
            onClick={() => setActiveSubmenu(activeSubmenu === 'export' ? null : 'export')}
            className="w-full flex items-center justify-between px-2.5 py-1.5 hover:bg-[var(--hover-bg)] rounded-[var(--radius-sm)] transition-colors text-[var(--text-primary)]"
          >
            <div className="flex items-center space-x-2.5">
              <Download className="w-4 h-4 text-[var(--text-secondary)]" />
              <span>Export</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          </button>

          {/* Export Submenu */}
          {activeSubmenu === 'export' && (
            <div
              className="absolute left-full top-0 ml-1 bg-[var(--surface-floating)] border border-[var(--border-color)] rounded-[var(--radius-lg)] shadow-[var(--shadow-popover)] py-1.5 w-56 text-xs z-50 text-[var(--text-primary)]"
              onMouseLeave={() => setActiveSubmenu(null)}
            >
              <button
                onClick={() => {
                  onExportDocx();
                  onClose();
                }}
                className="w-full flex items-center space-x-2.5 px-3 py-1.5 hover:bg-[var(--hover-bg)] text-left font-medium rounded-[var(--radius-sm)]"
              >
                <FileText className="w-4 h-4 text-[var(--accent-color)]" />
                <span>Download as DOCX (.docx)</span>
              </button>
              <button
                onClick={() => {
                  onExportPdf();
                  onClose();
                }}
                className="w-full flex items-center space-x-2.5 px-3 py-1.5 hover:bg-[var(--hover-bg)] text-left font-medium rounded-[var(--radius-sm)]"
              >
                <Download className="w-4 h-4 text-red-500" />
                <span>Download as PDF (.pdf)</span>
              </button>
              <button
                onClick={() => {
                  onExportHtml();
                  onClose();
                }}
                className="w-full flex items-center space-x-2.5 px-3 py-1.5 hover:bg-[var(--hover-bg)] text-left font-medium rounded-[var(--radius-sm)]"
              >
                <FileCode className="w-4 h-4 text-amber-500" />
                <span>Export as Web Page (.html)</span>
              </button>
              <button
                onClick={() => {
                  onExportTxt();
                  onClose();
                }}
                className="w-full flex items-center space-x-2.5 px-3 py-1.5 hover:bg-[var(--hover-bg)] text-left font-medium rounded-[var(--radius-sm)]"
              >
                <FileText className="w-4 h-4 text-[var(--text-muted)]" />
                <span>Plain Text (.txt)</span>
              </button>
            </div>
          )}
        </div>

        {/* Print */}
        <div className="px-1">
          <button
            onClick={() => {
              onPrint();
              onClose();
            }}
            className="w-full flex items-center space-x-2.5 px-2.5 py-1.5 hover:bg-[var(--hover-bg)] rounded-[var(--radius-sm)] transition-colors text-[var(--text-primary)]"
          >
            <Printer className="w-4 h-4 text-[var(--text-secondary)]" />
            <span>Print</span>
          </button>
        </div>

        <div className="my-1 border-t border-[var(--border-subtle)]" />

        {/* Rename */}
        <div className="px-1">
          <button
            onClick={() => {
              onRename();
              onClose();
            }}
            className="w-full flex items-center space-x-2.5 px-2.5 py-1.5 hover:bg-[var(--hover-bg)] rounded-[var(--radius-sm)] transition-colors text-[var(--text-primary)]"
          >
            <Edit2 className="w-4 h-4 text-[var(--text-secondary)]" />
            <span>Rename</span>
          </button>
        </div>

        {/* Version History */}
        <div className="px-1">
          <button
            onClick={() => {
              onOpenRecovery();
              onClose();
            }}
            className="w-full flex items-center space-x-2.5 px-2.5 py-1.5 hover:bg-[var(--hover-bg)] rounded-[var(--radius-sm)] transition-colors text-[var(--text-primary)]"
          >
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Version History</span>
          </button>
        </div>

        {/* Delete */}
        <div className="px-1">
          <button
            onClick={() => {
              onClose();
              onCloseDocument();
            }}
            className="w-full flex items-center space-x-2.5 px-2.5 py-1.5 hover:bg-[var(--destructive-subtle)] text-[var(--destructive-color)] rounded-[var(--radius-sm)] transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>

        {/* Info */}
        <div className="px-1">
          <button
            onClick={() => {
              onOpenInfo();
              onClose();
            }}
            className="w-full flex items-center justify-between px-2.5 py-1.5 hover:bg-[var(--hover-bg)] rounded-[var(--radius-sm)] transition-colors text-[var(--text-primary)]"
          >
            <div className="flex items-center space-x-2.5">
              <Info className="w-4 h-4 text-[var(--text-secondary)]" />
              <span>Info</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          </button>
        </div>
      </div>
    </div>
  );
};
