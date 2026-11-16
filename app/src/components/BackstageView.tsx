import React, { useState } from 'react';
import {
  ArrowLeft,
  FilePlus,
  FolderOpen,
  Info,
  Save,
  Download,
  Printer,
  Settings,
  HelpCircle,
  FileText,
  Clock,
  ExternalLink,
  X,
  FileCheck,
  CheckCircle2,
  HardDrive,
  FileCode,
  Layout,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { DOCUMENT_TEMPLATES, DocumentTemplate } from '../templates';
import { RecentDocument, DocumentStats } from '../types';
import wordoLogo from '../assets/wordo-logo.png';

interface BackstageViewProps {
  isOpen: boolean;
  onClose: () => void;
  onNew: () => void;
  onNewFromTemplate: (template: DocumentTemplate) => void;
  onOpenLocalFile: () => void;
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
  onOpenSettings?: () => void;
  onOpenAbout?: () => void;
  onOpenShortcuts?: () => void;
  onOpenRecovery?: () => void;
  documentTitle: string;
  stats?: DocumentStats;
  currentFilePath?: string | null;
}

type BackstageTab = 'home' | 'new' | 'open' | 'info' | 'saveAs' | 'print' | 'settings' | 'about';

export const BackstageView: React.FC<BackstageViewProps> = ({
  isOpen,
  onClose,
  onNew,
  onNewFromTemplate,
  onOpenLocalFile,
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
  onOpenSettings,
  onOpenAbout,
  onOpenShortcuts,
  onOpenRecovery,
  documentTitle,
  stats,
  currentFilePath,
}) => {
  const [activeTab, setActiveTab] = useState<BackstageTab>('home');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[var(--app-bg)] text-[var(--text-primary)] flex flex-row select-none"
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
      tabIndex={0}
    >
      {/* 1. Left Navigation Bar - Office 365 Blue */}
      <div className="w-64 bg-[var(--surface-primary)] border-r border-[var(--border-color)] text-[var(--text-primary)] flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Top Return Button */}
          <div className="p-3 border-b border-[var(--border-color)] flex items-center justify-between">
            <button
              onClick={onClose}
              title="Return to Document (Esc)"
              className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-md)] hover:bg-[var(--hover-bg)] text-[var(--text-primary)] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-[var(--text-primary)]" />
            </button>
            <div className="flex items-center space-x-2">
              <img src={wordoLogo} alt="" className="w-5 h-5 object-contain" />
              <span className="font-semibold text-sm tracking-wide text-[var(--text-primary)]">Wordo</span>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="py-2 space-y-0.5 text-xs font-medium">
            <button
              onClick={() => setActiveTab('home')}
              className={`w-full flex items-center space-x-3 px-5 py-2.5 transition-colors ${
                activeTab === 'home' ? 'bg-[var(--selection-bg)] text-[var(--accent-color)] font-semibold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)]'
              }`}
            >
              <Layout className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              onClick={() => setActiveTab('new')}
              className={`w-full flex items-center space-x-3 px-5 py-2.5 transition-colors ${
                activeTab === 'new' ? 'bg-[var(--selection-bg)] text-[var(--accent-color)] font-semibold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)]'
              }`}
            >
              <FilePlus className="w-4 h-4" />
              <span>New</span>
            </button>

            <button
              onClick={() => setActiveTab('open')}
              className={`w-full flex items-center space-x-3 px-5 py-2.5 transition-colors ${
                activeTab === 'open' ? 'bg-[var(--selection-bg)] text-[var(--accent-color)] font-semibold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)]'
              }`}
            >
              <FolderOpen className="w-4 h-4" />
              <span>Open</span>
            </button>

            <button
              onClick={() => setActiveTab('info')}
              className={`w-full flex items-center space-x-3 px-5 py-2.5 transition-colors ${
                activeTab === 'info' ? 'bg-[var(--selection-bg)] text-[var(--accent-color)] font-semibold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)]'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>Info</span>
            </button>

            <button
              onClick={() => {
                onSave();
                onClose();
              }}
              className="w-full flex items-center space-x-3 px-5 py-2.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>

            <button
              onClick={() => setActiveTab('saveAs')}
              className={`w-full flex items-center space-x-3 px-5 py-2.5 transition-colors ${
                activeTab === 'saveAs' ? 'bg-[var(--selection-bg)] text-[var(--accent-color)] font-semibold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)]'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Save As & Export</span>
            </button>

            <button
              onClick={() => setActiveTab('print')}
              className={`w-full flex items-center space-x-3 px-5 py-2.5 transition-colors ${
                activeTab === 'print' ? 'bg-[var(--selection-bg)] text-[var(--accent-color)] font-semibold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)]'
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Bottom Options */}
        <div className="py-2 border-t border-[var(--border-color)] text-xs font-medium space-y-0.5">
          {onOpenSettings && (
            <button
              onClick={() => {
                onClose();
                onOpenSettings();
              }}
              className="w-full flex items-center space-x-3 px-5 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Page & Document Options</span>
            </button>
          )}

          {onOpenShortcuts && (
            <button
              onClick={() => {
                onClose();
                onOpenShortcuts();
              }}
              className="w-full flex items-center space-x-3 px-5 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Keyboard Shortcuts</span>
            </button>
          )}

          {onOpenAbout && (
            <button
              onClick={() => {
                onClose();
                onOpenAbout();
              }}
              className="w-full flex items-center space-x-3 px-5 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-colors"
            >
              <Info className="w-4 h-4" />
              <span>About Wordo</span>
            </button>
          )}

          <button
            onClick={() => {
              onClose();
              onCloseDocument();
            }}
            className="w-full flex items-center space-x-3 px-5 py-2 text-[var(--destructive-color)] hover:bg-[var(--destructive-color)]/10 transition-colors font-medium"
          >
            <X className="w-4 h-4" />
            <span>Close Document</span>
          </button>
        </div>
      </div>

      {/* 2. Main Content Area */}
      <div className="flex-1 overflow-y-auto p-10 bg-[var(--app-bg)] text-[var(--text-primary)]">
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <div className="max-w-4xl space-y-8 animate-in fade-in duration-150">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Good day</h1>
              <p className="text-sm text-[var(--text-secondary)]">
                Create a new document or jump back into recent files.
              </p>
            </div>

            {/* Quick Template Cards */}
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">
                New
              </h2>
              <div className="grid grid-cols-4 gap-4">
                {/* Blank Document */}
                <button
                  onClick={() => {
                    onNew();
                    onClose();
                  }}
                  className="flex flex-col items-center p-4 bg-[var(--surface-primary)] hover:bg-[var(--hover-bg)] text-[var(--text-primary)] shadow-[var(--shadow-card)] border border-[var(--border-color)] hover:border-[var(--accent-color)] rounded-lg transition-all text-center group"
                >
                  <div className="w-20 h-28 bg-white dark:bg-[#333] border border-gray-300 dark:border-gray-600 rounded shadow-xs mb-3 flex items-center justify-center group-hover:shadow-md transition-shadow">
                    <FilePlus className="w-8 h-8 text-[var(--accent-color)]" />
                  </div>
                  <span className="text-xs font-semibold text-[var(--text-primary)]">
                    Blank document
                  </span>
                </button>

                {DOCUMENT_TEMPLATES.slice(0, 3).map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => {
                      onNewFromTemplate(tmpl);
                      onClose();
                    }}
                    className="flex flex-col items-center p-4 bg-[var(--surface-primary)] hover:bg-[var(--hover-bg)] text-[var(--text-primary)] shadow-[var(--shadow-card)] border border-[var(--border-color)] hover:border-[var(--accent-color)] rounded-lg transition-all text-center group"
                  >
                    <div className="w-20 h-28 bg-white dark:bg-[#333] border border-gray-300 dark:border-gray-600 rounded shadow-xs mb-3 flex flex-col justify-between p-2 group-hover:shadow-md transition-shadow">
                      <div className="w-full h-1.5 bg-[var(--accent-color)] rounded-xs" />
                      <div className="space-y-1">
                        <div className="w-full h-1 bg-gray-200 dark:bg-gray-600 rounded-xs" />
                        <div className="w-3/4 h-1 bg-gray-200 dark:bg-gray-600 rounded-xs" />
                        <div className="w-1/2 h-1 bg-gray-200 dark:bg-gray-600 rounded-xs" />
                      </div>
                      <div className="w-1/3 h-1 bg-gray-300 dark:bg-gray-500 rounded-xs" />
                    </div>
                    <span className="text-xs font-semibold text-[var(--text-primary)] truncate w-full">
                      {tmpl.name}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)] mt-0.5">{tmpl.category}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Documents */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Recent Documents
                </h2>
                <button
                  onClick={() => {
                    onOpenLocalFile();
                    onClose();
                  }}
                  className="text-xs text-[var(--accent-color)] hover:underline flex items-center space-x-1"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>Browse Device...</span>
                </button>
              </div>

              {recentDocuments.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-[var(--border-color)] rounded-lg text-xs text-[var(--text-muted)]">
                  No recent documents yet.
                </div>
              ) : (
                <div className="divide-y divide-[var(--border-subtle)] border border-[var(--border-color)] rounded-lg overflow-hidden bg-[var(--surface-primary)] text-[var(--text-primary)] shadow-[var(--shadow-card)]">
                  {recentDocuments.slice(0, 8).map((doc, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        onOpenRecent(doc);
                        onClose();
                      }}
                      className="w-full flex items-center justify-between p-3 px-4 hover:bg-[var(--hover-bg)] text-[var(--text-primary)] text-left transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="w-4 h-4 text-[var(--accent-color)]" />
                        <div>
                          <p className="text-xs font-medium text-[var(--text-primary)]">
                            {doc.title}
                          </p>
                          <p className="text-[10px] text-[var(--text-muted)]">{doc.filePath || 'Local Document'}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-[var(--text-muted)]">
                        {new Date(doc.lastOpened).toLocaleDateString()}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* NEW TAB */}
        {activeTab === 'new' && (
          <div className="max-w-4xl space-y-6 animate-in fade-in duration-150">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">New Document</h1>
              <p className="text-sm text-[var(--text-secondary)]">
                Choose a blank template or start with a pre-designed layout.
              </p>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {/* Blank */}
              <button
                onClick={() => {
                  onNew();
                  onClose();
                }}
                className="flex flex-col items-center p-4 bg-[var(--surface-primary)] hover:bg-[var(--hover-bg)] text-[var(--text-primary)] shadow-[var(--shadow-card)] border border-[var(--border-color)] hover:border-[var(--accent-color)] rounded-lg transition-all text-center group"
              >
                <div className="w-24 h-32 bg-white dark:bg-[#333] border border-gray-300 dark:border-gray-600 rounded shadow-xs mb-3 flex items-center justify-center group-hover:shadow-md transition-shadow">
                  <FilePlus className="w-10 h-10 text-[var(--accent-color)]" />
                </div>
                <span className="text-xs font-semibold text-[var(--text-primary)]">
                  Blank document
                </span>
              </button>

              {DOCUMENT_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => {
                    onNewFromTemplate(tmpl);
                    onClose();
                  }}
                  className="flex flex-col items-center p-4 bg-[var(--surface-primary)] hover:bg-[var(--hover-bg)] text-[var(--text-primary)] shadow-[var(--shadow-card)] border border-[var(--border-color)] hover:border-[var(--accent-color)] rounded-lg transition-all text-center group"
                >
                  <div className="w-24 h-32 bg-white dark:bg-[#333] border border-gray-300 dark:border-gray-600 rounded shadow-xs mb-3 flex flex-col justify-between p-3 group-hover:shadow-md transition-shadow">
                    <div className="w-full h-2 bg-[var(--accent-color)] rounded-xs" />
                    <div className="space-y-1.5">
                      <div className="w-full h-1 bg-gray-200 dark:bg-gray-600 rounded-xs" />
                      <div className="w-5/6 h-1 bg-gray-200 dark:bg-gray-600 rounded-xs" />
                      <div className="w-2/3 h-1 bg-gray-200 dark:bg-gray-600 rounded-xs" />
                    </div>
                    <div className="w-1/2 h-1 bg-gray-300 dark:bg-gray-500 rounded-xs" />
                  </div>
                  <span className="text-xs font-semibold text-[var(--text-primary)] truncate w-full">
                    {tmpl.name}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] mt-0.5">{tmpl.category}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* OPEN TAB */}
        {activeTab === 'open' && (
          <div className="max-w-3xl space-y-6 animate-in fade-in duration-150">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Open</h1>
              <p className="text-sm text-[var(--text-secondary)]">
                Open documents from your local disk or recent work.
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  onOpenLocalFile();
                  onClose();
                }}
                className="flex items-center space-x-2 px-5 py-3 bg-[var(--accent-color)] hover:bg-blue-800 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
              >
                <FolderOpen className="w-4 h-4" />
                <span>Browse This Device</span>
              </button>
            </div>

            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">
                Recent Documents
              </h2>
              {recentDocuments.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-[var(--border-color)] rounded-lg text-xs text-[var(--text-muted)]">
                  No recent documents found.
                </div>
              ) : (
                <div className="divide-y divide-[var(--border-subtle)] border border-[var(--border-color)] rounded-lg overflow-hidden bg-[var(--surface-primary)] text-[var(--text-primary)] shadow-[var(--shadow-card)]">
                  {recentDocuments.map((doc, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        onOpenRecent(doc);
                        onClose();
                      }}
                      className="w-full flex items-center justify-between p-3.5 px-4 hover:bg-[var(--hover-bg)] text-[var(--text-primary)] text-left transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-[var(--accent-color)]" />
                        <div>
                          <p className="text-xs font-medium text-[var(--text-primary)]">
                            {doc.title}
                          </p>
                          <p className="text-[10px] text-[var(--text-muted)]">{doc.filePath || 'Local Document'}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-[var(--text-muted)]">
                        {new Date(doc.lastOpened).toLocaleString()}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* INFO TAB */}
        {activeTab === 'info' && (
          <div className="max-w-2xl space-y-6 animate-in fade-in duration-150">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">
                Document Info
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">
                Properties, word counts, and version recovery.
              </p>
            </div>

            <div className="p-5 bg-[var(--surface-primary)] text-[var(--text-primary)] shadow-[var(--shadow-card)] border border-[var(--border-color)] rounded-lg space-y-3">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                <span className="text-xs font-medium text-[var(--text-muted)]">Document Title:</span>
                <span className="text-xs font-bold text-[var(--text-primary)]">
                  {documentTitle}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                <span className="text-xs font-medium text-[var(--text-muted)]">File Location:</span>
                <span className="text-xs text-[var(--text-secondary)] font-mono">
                  {currentFilePath || 'Local Unsaved Buffer'}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                <span className="text-xs font-medium text-[var(--text-muted)]">Word Count:</span>
                <span className="text-xs font-semibold text-[var(--text-primary)]">
                  {stats?.words ?? 0} words
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                <span className="text-xs font-medium text-[var(--text-muted)]">Characters:</span>
                <span className="text-xs text-[var(--text-primary)]">
                  {stats?.characters ?? 0} (without spaces: {stats?.charactersWithoutSpaces ?? 0})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[var(--text-muted)]">Estimated Reading Time:</span>
                <span className="text-xs text-[var(--text-primary)]">
                  {stats?.readingTimeMinutes ?? 1} min
                </span>
              </div>
            </div>

            {/* Version Recovery */}
            {onOpenRecovery && (
              <div className="p-5 border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 rounded-lg flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                    Auto-Save & Version Recovery
                  </h3>
                  <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5">
                    Wordo automatically snapshots your edits every 30 seconds to prevent data loss.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenRecovery();
                  }}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-medium transition-colors"
                >
                  Manage Drafts
                </button>
              </div>
            )}
          </div>
        )}

        {/* SAVE AS & EXPORT TAB */}
        {activeTab === 'saveAs' && (
          <div className="max-w-2xl space-y-6 animate-in fade-in duration-150">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">
                Save As & Export
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">
                Save a local copy or export in various document formats.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* DOCX */}
              <button
                onClick={() => {
                  onExportDocx();
                  onClose();
                }}
                className="p-4 bg-[var(--surface-primary)] hover:bg-[var(--hover-bg)] text-[var(--text-primary)] shadow-[var(--shadow-card)] border border-[var(--border-color)] hover:border-[var(--accent-color)] rounded-lg transition-all text-left flex items-start space-x-3"
              >
                <div className="p-2 bg-blue-100 dark:bg-blue-950/50 text-[var(--accent-color)] rounded">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[var(--text-primary)]">
                    Download a Copy (.docx)
                  </h3>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                    Standard Microsoft Word format, fully editable.
                  </p>
                </div>
              </button>

              {/* PDF */}
              <button
                onClick={() => {
                  onExportPdf();
                  onClose();
                }}
                className="p-4 bg-[var(--surface-primary)] text-[var(--text-primary)] shadow-[var(--shadow-card)] hover:bg-red-50 dark:hover:bg-[#2d2c2b] border border-[var(--border-color)] hover:border-red-600 rounded-lg transition-all text-left flex items-start space-x-3"
              >
                <div className="p-2 bg-red-100 dark:bg-red-950/50 text-red-600 rounded">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[var(--text-primary)]">
                    Download as PDF (.pdf)
                  </h3>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                    Fixed layout document for sharing and printing.
                  </p>
                </div>
              </button>

              {/* HTML */}
              <button
                onClick={() => {
                  onExportHtml();
                  onClose();
                }}
                className="p-4 bg-[var(--surface-primary)] text-[var(--text-primary)] shadow-[var(--shadow-card)] hover:bg-amber-50 dark:hover:bg-[#2d2c2b] border border-[var(--border-color)] hover:border-amber-600 rounded-lg transition-all text-left flex items-start space-x-3"
              >
                <div className="p-2 bg-amber-100 dark:bg-amber-950/50 text-amber-600 rounded">
                  <FileCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[var(--text-primary)]">
                    Export as Web Page (.html)
                  </h3>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                    Clean HTML markup with styling included.
                  </p>
                </div>
              </button>

              {/* TXT */}
              <button
                onClick={() => {
                  onExportTxt();
                  onClose();
                }}
                className="p-4 bg-[var(--surface-primary)] text-[var(--text-primary)] shadow-[var(--shadow-card)] hover:bg-gray-100 dark:hover:bg-[#2d2c2b] border border-[var(--border-color)] hover:border-gray-600 rounded-lg transition-all text-left flex items-start space-x-3"
              >
                <div className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[var(--text-primary)]">
                    Plain Text (.txt)
                  </h3>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                    Unformatted text without images or styling.
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* PRINT TAB */}
        {activeTab === 'print' && (
          <div className="max-w-xl space-y-6 animate-in fade-in duration-150">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Print</h1>
              <p className="text-sm text-[var(--text-secondary)]">
                Send document to local printer or save to PDF via system print dialog.
              </p>
            </div>

            <div className="p-6 bg-[var(--surface-primary)] text-[var(--text-primary)] shadow-[var(--shadow-card)] border border-[var(--border-color)] rounded-lg space-y-4">
              <button
                onClick={() => {
                  onClose();
                  onPrint();
                }}
                className="flex items-center space-x-2 px-6 py-3 bg-[var(--accent-color)] hover:bg-blue-800 text-white rounded text-xs font-bold shadow-xs transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Document (Ctrl+P)</span>
              </button>

              <div className="text-xs text-[var(--text-secondary)] space-y-1">
                <p>• Ensures page boundaries, margins, and headers/footers render accurately.</p>
                <p>• Compatible with all CUPS and Linux print queues.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
