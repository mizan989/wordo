import React, { useState } from 'react';
import {
  X,
  Sparkles,
  FileText,
  User,
  Briefcase,
  Calendar,
  Mail,
  BookOpen,
  FolderOpen,
} from 'lucide-react';
import { DOCUMENT_TEMPLATES, DocumentTemplate } from '../templates';

interface TemplateModalProps {
  isOpen: boolean;
  onSelectTemplate: (template: DocumentTemplate) => void;
  onOpenLocalFile: () => void;
  onClose: () => void;
}

export const TemplateModal: React.FC<TemplateModalProps> = ({
  isOpen,
  onSelectTemplate,
  onOpenLocalFile,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'General', 'Corporate', 'Legal', 'Business', 'Resumes', 'Academic'];

  const filteredTemplates =
    selectedCategory === 'All'
      ? DOCUMENT_TEMPLATES
      : DOCUMENT_TEMPLATES.filter((t) => t.category === selectedCategory);

  const getTemplateIcon = (iconName: string) => {
    switch (iconName) {
      case 'User':
        return <User className="w-6 h-6 text-indigo-500" />;
      case 'Briefcase':
        return <Briefcase className="w-6 h-6 text-[var(--accent-color)]" />;
      case 'Calendar':
        return <Calendar className="w-6 h-6 text-emerald-500" />;
      case 'Mail':
        return <Mail className="w-6 h-6 text-amber-500" />;
      case 'BookOpen':
        return <BookOpen className="w-6 h-6 text-purple-500" />;
      default:
        return <FileText className="w-6 h-6 text-[var(--text-muted)]" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none animate-in fade-in-50">
      <div className="bg-[var(--surface-primary)] text-[var(--text-primary)] w-full max-w-3xl rounded-[var(--radius-xl)] shadow-[var(--shadow-modal)] border border-[var(--border-color)] overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[var(--surface-secondary)] border-b border-[var(--border-color)] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 bg-[var(--accent-color)] text-white rounded-[var(--radius-md)] flex items-center justify-center font-bold text-sm shadow-xs">
              W
            </div>
            <div>
              <h3 className="font-bold text-base text-[var(--text-primary)]">
                New Document — Wordo
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Choose a template or open an existing file on your computer
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-[var(--hover-bg)] text-[var(--text-primary)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter bar & Open Local */}
        <div className="px-6 py-2.5 bg-[var(--surface-secondary)] border-b border-[var(--border-color)] flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[var(--text-primary)] text-[var(--surface-primary)] dark:bg-white dark:text-black font-semibold'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-[var(--hover-bg)] text-[var(--text-primary)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenLocalFile();
            }}
            className="flex items-center space-x-1.5 px-3 py-1 bg-[var(--surface-primary)] border border-[var(--border-color)] rounded-[var(--radius-md)] hover:bg-[var(--hover-bg)] text-[var(--text-primary)] font-medium transition-colors"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Open Existing Document...</span>
          </button>
        </div>

        {/* Template Cards Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => {
                onSelectTemplate(template);
                onClose();
              }}
              className="group border border-[var(--border-color)] hover:border-[var(--accent-color)] rounded-[var(--radius-lg)] p-4 bg-[var(--surface-primary)] hover:bg-[var(--hover-bg)] shadow-[var(--shadow-card)] transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-[var(--radius-md)] bg-[var(--surface-secondary)] border border-[var(--border-color)] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  {getTemplateIcon(template.icon)}
                </div>
                <h4 className="font-bold text-sm text-[var(--text-primary)] group-hover:text-[var(--accent-color)] transition-colors">
                  {template.name}
                </h4>
                <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2">
                  {template.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-gray-400">
                <span className="font-medium text-[var(--text-muted)] uppercase">{template.category}</span>
                <span className="text-[var(--accent-color)] font-semibold group-hover:underline">
                  Create →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
