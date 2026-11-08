import React from 'react';
import { Editor } from '@tiptap/react';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { SpellIssue } from '../types';

interface SpellCheckPanelProps {
  editor: Editor | null;
  issues: SpellIssue[];
  onRefresh: () => void;
  onClose: () => void;
}

export const SpellCheckPanel: React.FC<SpellCheckPanelProps> = ({
  editor,
  issues,
  onRefresh,
  onClose,
}) => {
  if (!editor) return null;

  const handleApplySuggestion = (issue: SpellIssue, suggestion: string) => {
    const currentHtml = editor.getHTML();
    // Replace word with suggestion
    const regex = new RegExp(`\\b${issue.word}\\b`, 'i');
    const newHtml = currentHtml.replace(regex, suggestion);
    editor.commands.setContent(newHtml);
    onRefresh();
  };

  return (
    <aside className="w-80 bg-white dark:bg-[#252526] border-r border-[#e0e0e0] dark:border-[#383838] flex flex-col h-full shadow-sm z-10 select-none text-xs">
      {/* Header */}
      <div className="h-9 px-3 border-b border-[#e0e0e0] dark:border-[#383838] flex items-center justify-between bg-[#f5f5f5] dark:bg-[#1e1e1e]">
        <div className="flex items-center space-x-1.5 font-semibold text-gray-700 dark:text-gray-200">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Editor Proofing & Grammar</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={onRefresh}
            title="Recheck Document"
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-[#333]"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-[#333]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Issues list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {issues.length === 0 ? (
          <div className="py-12 text-center text-gray-500 space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200">
              Document Proofing Complete
            </h4>
            <p className="text-[11px] px-4 text-gray-400">
              No spelling, grammar, or punctuation errors detected in your active document.
            </p>
          </div>
        ) : (
          <>
            <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              {issues.length} {issues.length === 1 ? 'Suggestion' : 'Suggestions'}
            </div>

            {issues.map((issue) => (
              <div
                key={issue.id}
                className="p-3 bg-[#fafafa] dark:bg-[#1f1f1f] border border-gray-200 dark:border-gray-700 rounded-md shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      issue.type === 'spelling'
                        ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300'
                        : issue.type === 'grammar'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                    }`}
                  >
                    {issue.type}
                  </span>
                  <span className="font-mono text-gray-800 dark:text-gray-200 font-semibold line-through decoration-red-500">
                    {issue.word}
                  </span>
                </div>

                <p className="text-[11px] text-gray-600 dark:text-gray-300">{issue.message}</p>

                {/* Suggestions */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {issue.suggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleApplySuggestion(issue, sug)}
                      className="px-2 py-1 bg-white dark:bg-[#2d2d2d] border border-[#185abd] text-[#185abd] dark:text-[#5fa2f8] hover:bg-[#185abd] hover:text-white rounded text-xs font-medium transition-colors flex items-center shadow-2xs"
                    >
                      <ArrowRight className="w-2.5 h-2.5 mr-1" />
                      {sug}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </aside>
  );
};
