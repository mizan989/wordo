import React from 'react';
import { X, FileText, Clock, Volume2, AlignLeft } from 'lucide-react';
import { DocumentStats } from '../types';

interface WordCountDialogProps {
  stats: DocumentStats;
  onClose: () => void;
}

export const WordCountDialog: React.FC<WordCountDialogProps> = ({ stats, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none animate-in fade-in-50">
      <div className="bg-white dark:bg-[#252526] text-[#242424] dark:text-[#cccccc] w-full max-w-md rounded-lg shadow-2xl border border-gray-300 dark:border-gray-700 overflow-hidden text-xs">
        {/* Header */}
        <div className="px-4 py-3 bg-[#f5f5f5] dark:bg-[#1e1e1e] border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-2 font-bold text-sm text-[#185abd] dark:text-white">
            <FileText className="w-4 h-4" />
            <span>Word Count & Document Statistics</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-[#333] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-md">
              <span className="text-[11px] text-gray-500 font-medium">Total Words</span>
              <div className="text-xl font-bold text-[#185abd] dark:text-[#5fa2f8] mt-0.5">
                {stats.words.toLocaleString()}
              </div>
            </div>

            <div className="p-3 bg-gray-50 dark:bg-[#1f1f1f] border border-gray-200 dark:border-gray-700 rounded-md">
              <span className="text-[11px] text-gray-500 font-medium">Total Characters</span>
              <div className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-0.5">
                {stats.characters.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-md divide-y divide-gray-100 dark:divide-gray-700 text-xs">
            <div className="px-3 py-2 flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Characters (no spaces)</span>
              <span className="font-semibold">{stats.charactersWithoutSpaces.toLocaleString()}</span>
            </div>
            <div className="px-3 py-2 flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Paragraphs</span>
              <span className="font-semibold">{stats.paragraphs.toLocaleString()}</span>
            </div>
            <div className="px-3 py-2 flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Sentences</span>
              <span className="font-semibold">{stats.sentences.toLocaleString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <Clock className="w-4 h-4 text-[#185abd]" />
              <div>
                <div className="text-[10px] text-gray-400">Reading Time</div>
                <div className="font-semibold">~{stats.readingTimeMinutes} min</div>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <Volume2 className="w-4 h-4 text-purple-600" />
              <div>
                <div className="text-[10px] text-gray-400">Speaking Time</div>
                <div className="font-semibold">~{stats.speakingTimeMinutes} min</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-[#f5f5f5] dark:bg-[#1e1e1e] border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#185abd] text-white hover:bg-[#1651aa] rounded font-medium transition-colors shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
