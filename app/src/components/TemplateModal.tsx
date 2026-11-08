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
        return <Briefcase className="w-6 h-6 text-[#185abd]" />;
      case 'Calendar':
        return <Calendar className="w-6 h-6 text-emerald-500" />;
      case 'Mail':
        return <Mail className="w-6 h-6 text-amber-500" />;
      case 'BookOpen':
        return <BookOpen className="w-6 h-6 text-purple-500" />;
      default:
        return <FileText className="w-6 h-6 text-gray-500" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none animate-in fade-in-50">
      <div className="bg-white dark:bg-[#252526] text-[#242424] dark:text-[#cccccc] w-full max-w-3xl rounded-xl shadow-2xl border border-gray-300 dark:border-gray-700 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#f5f5f5] dark:bg-[#1e1e1e] border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 bg-[#185abd] text-white rounded flex items-center justify-center font-bold text-sm">
              W
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-900 dark:text-white">
                New Document — Word-Client
              </h3>
              <p className="text-xs text-gray-500">
                Choose a template or open an existing file on your computer
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-[#333] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter bar & Open Local */}
        <div className="px-6 py-2.5 bg-[#fafafa] dark:bg-[#202020] border-b border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#185abd] text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#333]'
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
            className="flex items-center space-x-1.5 px-3 py-1 bg-white dark:bg-[#2d2d2d] border border-gray-300 dark:border-gray-600 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950/30 text-[#185abd] dark:text-[#5fa2f8] font-medium transition-colors"
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
              className="group border border-gray-200 dark:border-gray-700 hover:border-[#185abd] dark:hover:border-[#5fa2f8] rounded-lg p-4 bg-white dark:bg-[#1f1f1f] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-lg bg-gray-50 dark:bg-[#282828] border border-gray-200 dark:border-gray-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  {getTemplateIcon(template.icon)}
                </div>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-[#185abd] dark:group-hover:text-[#5fa2f8] transition-colors">
                  {template.name}
                </h4>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {template.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px] text-gray-400">
                <span className="font-medium text-gray-500 uppercase">{template.category}</span>
                <span className="text-[#185abd] dark:text-[#5fa2f8] font-semibold group-hover:underline">
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
