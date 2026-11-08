import React, { useState, useEffect, useCallback } from 'react';
import { Editor } from '@tiptap/react';
import {
  X,
  Search,
  ListTree,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface NavigationSidebarProps {
  editor: Editor | null;
  onClose: () => void;
  defaultTab?: 'outline' | 'search';
}

interface MatchRange {
  from: number;
  to: number;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  editor,
  onClose,
  defaultTab = 'outline',
}) => {
  const [activeTab, setActiveTab] = useState<'outline' | 'search'>(defaultTab);
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [matches, setMatches] = useState<MatchRange[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  // Extract headings with exact ProseMirror node positions
  const extractHeadings = useCallback(() => {
    const headings: { level: number; text: string; pos: number }[] = [];
    if (!editor) return headings;

    editor.state.doc.descendants((node, pos) => {
      if (node.type.name === 'heading') {
        const text = node.textContent;
        headings.push({
          level: node.attrs?.level || 1,
          text: text || 'Untitled Heading',
          pos,
        });
      }
    });
    return headings;
  }, [editor]);

  const [headings, setHeadings] = useState(extractHeadings);

  useEffect(() => {
    if (editor) {
      setHeadings(extractHeadings());
    }
  }, [editor, extractHeadings]);

  const handleHeadingClick = (pos: number) => {
    if (!editor) return;
    editor.chain().focus().setTextSelection(pos + 1).run();
    const domNode = editor.view.nodeDOM(pos);
    if (domNode && domNode instanceof HTMLElement) {
      domNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Find all matches in document using ProseMirror text nodes
  const findMatches = useCallback(
    (term: string): MatchRange[] => {
      const results: MatchRange[] = [];
      if (!editor || !term.trim()) return results;

      const lowerTerm = term.toLowerCase();
      editor.state.doc.descendants((node, pos) => {
        if (node.isText && node.text) {
          const text = node.text.toLowerCase();
          let index = text.indexOf(lowerTerm);
          while (index !== -1) {
            results.push({
              from: pos + index,
              to: pos + index + term.length,
            });
            index = text.indexOf(lowerTerm, index + 1);
          }
        }
      });
      return results;
    },
    [editor]
  );

  const selectMatch = (match: MatchRange) => {
    if (!editor) return;
    editor.chain().focus().setTextSelection({ from: match.from, to: match.to }).run();
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setMatches([]);
      setCurrentMatchIndex(0);
      return;
    }

    const found = findMatches(term);
    setMatches(found);
    if (found.length > 0) {
      setCurrentMatchIndex(1);
      selectMatch(found[0]);
    } else {
      setCurrentMatchIndex(0);
    }
  };

  const handleNextMatch = () => {
    if (matches.length > 0) {
      const nextIndex = currentMatchIndex >= matches.length ? 1 : currentMatchIndex + 1;
      setCurrentMatchIndex(nextIndex);
      selectMatch(matches[nextIndex - 1]);
    }
  };

  const handlePrevMatch = () => {
    if (matches.length > 0) {
      const prevIndex = currentMatchIndex <= 1 ? matches.length : currentMatchIndex - 1;
      setCurrentMatchIndex(prevIndex);
      selectMatch(matches[prevIndex - 1]);
    }
  };

  const handleReplaceOne = () => {
    if (!editor || !searchTerm.trim() || matches.length === 0) return;
    const target = matches[currentMatchIndex - 1] || matches[0];
    if (!target) return;

    editor.chain().focus().insertContentAt({ from: target.from, to: target.to }, replaceTerm).run();
    handleSearchChange(searchTerm);
  };

  const handleReplaceAll = () => {
    if (!editor || !searchTerm.trim()) return;
    const currentMatches = findMatches(searchTerm);
    if (currentMatches.length === 0) return;

    const { tr } = editor.state;
    // Replace in reverse position order so node positions do not get offset
    for (let i = currentMatches.length - 1; i >= 0; i--) {
      const m = currentMatches[i];
      tr.insertText(replaceTerm, m.from, m.to);
    }
    editor.view.dispatch(tr);
    handleSearchChange(searchTerm);
  };

  return (
    <aside className="w-72 bg-white dark:bg-[#252526] border-r border-[#e0e0e0] dark:border-[#383838] flex flex-col h-full shadow-sm z-10 select-none text-xs">
      {/* Sidebar Header */}
      <div className="h-9 px-3 border-b border-[#e0e0e0] dark:border-[#383838] flex items-center justify-between bg-[#f5f5f5] dark:bg-[#1e1e1e]">
        <div className="flex items-center space-x-1 font-semibold text-gray-700 dark:text-gray-200">
          <ListTree className="w-4 h-4 text-[#185abd]" />
          <span>Navigation</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-[#333] transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#e0e0e0] dark:border-[#383838] bg-[#fafafa] dark:bg-[#1f1f1f]">
        <button
          onClick={() => {
            setActiveTab('outline');
            setHeadings(extractHeadings());
          }}
          className={`flex-1 py-1.5 text-center font-medium border-b-2 transition-colors ${
            activeTab === 'outline'
              ? 'border-[#185abd] text-[#185abd] bg-white dark:bg-[#252526]'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-[#185abd]'
          }`}
        >
          Headings ({headings.length})
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={`flex-1 py-1.5 text-center font-medium border-b-2 transition-colors ${
            activeTab === 'search'
              ? 'border-[#185abd] text-[#185abd] bg-white dark:bg-[#252526]'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-[#185abd]'
          }`}
        >
          Find & Replace
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {/* OUTLINE TAB */}
        {activeTab === 'outline' && (
          <div className="space-y-1">
            {headings.length === 0 ? (
              <div className="py-8 text-center text-gray-400">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p>No headings in document.</p>
                <p className="text-[10px] mt-1">Apply Heading 1, 2, or 3 styles to build an outline.</p>
              </div>
            ) : (
              headings.map((h, i) => (
                <div
                  key={i}
                  onClick={() => handleHeadingClick(h.pos)}
                  className={`py-1 px-2 rounded hover:bg-[#eef5fc] dark:hover:bg-[#2a2d2e] cursor-pointer transition-colors truncate font-sans ${
                    h.level === 1
                      ? 'font-bold text-[#185abd] text-xs'
                      : h.level === 2
                      ? 'pl-4 font-semibold text-gray-700 dark:text-gray-300'
                      : 'pl-6 font-normal text-gray-600 dark:text-gray-400'
                  }`}
                  title={h.text}
                >
                  {h.text}
                </div>
              ))
            )}
          </div>
        )}

        {/* SEARCH & REPLACE TAB */}
        {activeTab === 'search' && (
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Find
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search in document..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full px-2.5 py-1.5 pl-8 bg-white dark:bg-[#1f1f1f] border border-gray-300 dark:border-gray-600 rounded text-xs outline-hidden focus:border-[#185abd]"
                  autoFocus
                />
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
              </div>

              {searchTerm.trim() && (
                <div className="flex items-center justify-between mt-1 text-[11px] text-gray-500">
                  <span>
                    {matches.length > 0
                      ? `Match ${currentMatchIndex} of ${matches.length}`
                      : 'No matches found'}
                  </span>
                  <div className="flex space-x-1">
                    <button
                      onClick={handlePrevMatch}
                      disabled={matches.length === 0}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-[#333] disabled:opacity-30"
                      title="Previous match"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleNextMatch}
                      disabled={matches.length === 0}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-[#333] disabled:opacity-30"
                      title="Next match"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Replace With
              </label>
              <input
                type="text"
                placeholder="Replacement text..."
                value={replaceTerm}
                onChange={(e) => setReplaceTerm(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white dark:bg-[#1f1f1f] border border-gray-300 dark:border-gray-600 rounded text-xs outline-hidden focus:border-[#185abd]"
              />

              <div className="flex items-center space-x-2 mt-2">
                <button
                  onClick={handleReplaceOne}
                  disabled={matches.length === 0}
                  className="flex-1 py-1 bg-white dark:bg-[#2d2d2d] border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-[#383838] rounded font-medium disabled:opacity-40"
                >
                  Replace
                </button>
                <button
                  onClick={handleReplaceAll}
                  disabled={matches.length === 0}
                  className="flex-1 py-1 bg-[#185abd] text-white hover:bg-[#1651aa] rounded font-medium disabled:opacity-40"
                >
                  Replace All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
