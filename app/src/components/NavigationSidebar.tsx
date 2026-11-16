import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Editor } from '@tiptap/react';
import {
  X,
  Search,
  ListTree,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { searchHighlightPluginKey } from '../extensions/searchHighlight';

interface NavigationSidebarProps {
  editor: Editor | null;
  onClose: () => void;
  defaultTab?: 'outline' | 'search';
  initialSearchFocus?: 'find' | 'replace';
}

interface MatchRange {
  from: number;
  to: number;
  snippet?: string;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  editor,
  onClose,
  defaultTab = 'outline',
  initialSearchFocus = 'find',
}) => {
  const [activeTab, setActiveTab] = useState<'outline' | 'search'>(defaultTab);
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [matchCase, setMatchCase] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [matches, setMatches] = useState<MatchRange[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [replaceStatus, setReplaceStatus] = useState<string | null>(null);

  const findInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  // Sync tab if defaultTab changes externally
  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  // Focus the appropriate input when opening search tab or changing focus mode
  useEffect(() => {
    if (activeTab === 'search') {
      const timer = setTimeout(() => {
        if (initialSearchFocus === 'replace' && replaceInputRef.current) {
          replaceInputRef.current.focus();
          replaceInputRef.current.select();
        } else if (findInputRef.current) {
          findInputRef.current.focus();
          findInputRef.current.select();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [activeTab, initialSearchFocus]);

  // Dispatch live search highlight decorations to ProseMirror document canvas
  const updateSearchDecorations = useCallback(
    (currentMatches: MatchRange[], activeIdx: number) => {
      if (!editor || editor.isDestroyed) return;
      const { tr } = editor.state;
      tr.setMeta(searchHighlightPluginKey, {
        matches: currentMatches.map((m) => ({ from: m.from, to: m.to })),
        activeIndex: activeIdx > 0 ? activeIdx - 1 : -1,
      });
      editor.view.dispatch(tr);
    },
    [editor]
  );

  // Clear decorations on unmount or close
  useEffect(() => {
    return () => {
      if (editor && !editor.isDestroyed) {
        const { tr } = editor.state;
        tr.setMeta(searchHighlightPluginKey, { matches: [], activeIndex: -1 });
        editor.view.dispatch(tr);
      }
    };
  }, [editor]);

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
    (term: string, caseSensitive: boolean = matchCase, wholeWords: boolean = wholeWord): MatchRange[] => {
      const results: MatchRange[] = [];
      if (!editor || !term.trim()) return results;

      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = wholeWords ? `\\b${escaped}\\b` : escaped;

      let regex: RegExp;
      try {
        regex = new RegExp(pattern, caseSensitive ? 'gu' : 'giu');
      } catch {
        return results;
      }

      editor.state.doc.descendants((node, pos) => {
        if (node.isText && node.text) {
          regex.lastIndex = 0;
          let match: RegExpExecArray | null;
          while ((match = regex.exec(node.text)) !== null) {
            const matchIndex = match.index;
            const matchLength = match[0].length;

            // Generate context snippet around the match
            const start = Math.max(0, matchIndex - 25);
            const end = Math.min(node.text.length, matchIndex + matchLength + 25);
            let snippet = node.text.substring(start, end).replace(/\s+/g, ' ');
            if (start > 0) snippet = '…' + snippet;
            if (end < node.text.length) snippet = snippet + '…';

            results.push({
              from: pos + matchIndex,
              to: pos + matchIndex + matchLength,
              snippet,
            });

            if (matchLength === 0) {
              regex.lastIndex++;
            }
          }
        }
      });
      return results;
    },
    [editor, matchCase, wholeWord]
  );

  // Set selection and scroll without stealing DOM focus from the search inputs
  const selectMatch = useCallback(
    (match: MatchRange) => {
      if (!editor) return;
      // Do NOT call editor.chain().focus() here!
      // This keeps the typing pointer strictly inside the Find/Replace input.
      editor
        .chain()
        .setTextSelection({ from: match.from, to: match.to })
        .scrollIntoView()
        .run();

      // Smooth scroll the matched DOM container into center view
      try {
        const dom = editor.view.domAtPos(match.from);
        const element = dom.node instanceof HTMLElement ? dom.node : dom.node.parentElement;
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
        }
      } catch {}
    },
    [editor]
  );

  const handleSearchChange = (
    term: string,
    caseSensitive: boolean = matchCase,
    wholeWords: boolean = wholeWord
  ) => {
    setSearchTerm(term);
    setReplaceStatus(null);
    if (!term.trim()) {
      setMatches([]);
      setCurrentMatchIndex(0);
      updateSearchDecorations([], 0);
      return;
    }

    const found = findMatches(term, caseSensitive, wholeWords);
    setMatches(found);
    if (found.length > 0) {
      setCurrentMatchIndex(1);
      updateSearchDecorations(found, 1);
      selectMatch(found[0]);
    } else {
      setCurrentMatchIndex(0);
      updateSearchDecorations([], 0);
    }
  };

  const handleToggleMatchCase = () => {
    const nextCase = !matchCase;
    setMatchCase(nextCase);
    if (searchTerm.trim()) {
      handleSearchChange(searchTerm, nextCase, wholeWord);
    }
  };

  const handleToggleWholeWord = () => {
    const nextWhole = !wholeWord;
    setWholeWord(nextWhole);
    if (searchTerm.trim()) {
      handleSearchChange(searchTerm, matchCase, nextWhole);
    }
  };

  const handleNextMatch = () => {
    if (matches.length > 0) {
      const nextIndex = currentMatchIndex >= matches.length ? 1 : currentMatchIndex + 1;
      setCurrentMatchIndex(nextIndex);
      updateSearchDecorations(matches, nextIndex);
      selectMatch(matches[nextIndex - 1]);
    }
  };

  const handlePrevMatch = () => {
    if (matches.length > 0) {
      const prevIndex = currentMatchIndex <= 1 ? matches.length : currentMatchIndex - 1;
      setCurrentMatchIndex(prevIndex);
      updateSearchDecorations(matches, prevIndex);
      selectMatch(matches[prevIndex - 1]);
    }
  };

  const handleReplaceOne = () => {
    if (!editor || !searchTerm.trim() || matches.length === 0) return;
    const targetIdx = currentMatchIndex > 0 ? currentMatchIndex - 1 : 0;
    const target = matches[targetIdx];
    if (!target) return;

    const { tr } = editor.state;
    tr.insertText(replaceTerm, target.from, target.to);
    editor.view.dispatch(tr);

    // Refresh matches with updated document state
    const newMatches = findMatches(searchTerm, matchCase, wholeWord);
    setMatches(newMatches);

    if (newMatches.length === 0) {
      setCurrentMatchIndex(0);
      updateSearchDecorations([], 0);
      setReplaceStatus('Replaced 1 match. No more matches found.');
    } else {
      // Advance to the match now occupying targetIdx, or wrap to first
      const nextIndex = targetIdx < newMatches.length ? targetIdx + 1 : 1;
      setCurrentMatchIndex(nextIndex);
      updateSearchDecorations(newMatches, nextIndex);
      selectMatch(newMatches[nextIndex - 1]);
      setReplaceStatus(`Replaced 1 match. (${newMatches.length} remaining)`);
    }
  };

  const handleReplaceAll = () => {
    if (!editor || !searchTerm.trim()) return;
    const currentMatches = findMatches(searchTerm, matchCase, wholeWord);
    if (currentMatches.length === 0) {
      setReplaceStatus('No matches found to replace.');
      return;
    }

    const count = currentMatches.length;
    const { tr } = editor.state;
    // Replace in reverse position order so node positions do not get offset
    for (let i = count - 1; i >= 0; i--) {
      const m = currentMatches[i];
      tr.insertText(replaceTerm, m.from, m.to);
    }
    editor.view.dispatch(tr);

    const newMatches = findMatches(searchTerm, matchCase, wholeWord);
    setMatches(newMatches);
    if (newMatches.length > 0) {
      setCurrentMatchIndex(1);
      updateSearchDecorations(newMatches, 1);
      selectMatch(newMatches[0]);
    } else {
      setCurrentMatchIndex(0);
      updateSearchDecorations([], 0);
    }
    setReplaceStatus(`Replaced all ${count} occurrence${count === 1 ? '' : 's'}.`);
  };

  // Keep matches and headings in sync when editor content changes
  useEffect(() => {
    if (!editor) return;
    const onDocUpdate = () => {
      if (activeTab === 'search' && searchTerm.trim()) {
        const found = findMatches(searchTerm, matchCase, wholeWord);
        setMatches(found);
        setCurrentMatchIndex((prev) => {
          if (found.length === 0) {
            updateSearchDecorations([], 0);
            return 0;
          }
          const nextIdx = prev > found.length ? found.length : (prev === 0 ? 1 : prev);
          updateSearchDecorations(found, nextIdx);
          return nextIdx;
        });
      } else if (activeTab === 'outline') {
        setHeadings(extractHeadings());
      }
    };

    editor.on('update', onDocUpdate);
    return () => {
      editor.off('update', onDocUpdate);
    };
  }, [editor, activeTab, searchTerm, matchCase, wholeWord, findMatches, extractHeadings, updateSearchDecorations]);

  return (
    <aside className="w-80 bg-[var(--surface-primary)] border-r border-[var(--border-color)] flex flex-col h-full z-10 select-none text-xs text-[var(--text-primary)] transition-colors">
      {/* Sidebar Header */}
      <div className="h-9 px-3 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--surface-secondary)]">
        <div className="flex items-center space-x-1.5 font-medium text-[var(--text-primary)]">
          <ListTree className="w-4 h-4 text-[var(--text-secondary)]" />
          <span>Navigation</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-[var(--radius-sm)] hover:bg-[var(--hover-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          title="Close navigation pane"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Segmented Control Tabs */}
      <div className="p-2 border-b border-[var(--border-color)] bg-[var(--surface-secondary)]">
        <div className="flex p-0.5 bg-[var(--surface-tertiary)] rounded-[var(--radius-md)] border border-[var(--border-subtle)]">
          <button
            onClick={() => {
              setActiveTab('outline');
              updateSearchDecorations([], 0);
              setHeadings(extractHeadings());
            }}
            className={`flex-1 py-1 text-center font-medium rounded-[var(--radius-sm)] transition-all ${
              activeTab === 'outline'
                ? 'bg-[var(--surface-primary)] text-[var(--text-primary)] shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Headings ({headings.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('search');
              if (matches.length > 0) {
                updateSearchDecorations(matches, currentMatchIndex);
              }
            }}
            className={`flex-1 py-1 text-center font-medium rounded-[var(--radius-sm)] transition-all ${
              activeTab === 'search'
                ? 'bg-[var(--surface-primary)] text-[var(--text-primary)] shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Find & Replace
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col bg-[var(--surface-primary)]">
        {/* OUTLINE TAB */}
        {activeTab === 'outline' && (
          <div className="space-y-1">
            {headings.length === 0 ? (
              <div className="py-8 text-center text-[var(--text-muted)]">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p>No headings in document.</p>
                <p className="text-[10px] mt-1">Apply Heading 1, 2, or 3 styles to build an outline.</p>
              </div>
            ) : (
              headings.map((h, i) => (
                <div
                  key={i}
                  onClick={() => handleHeadingClick(h.pos)}
                  className={`py-1.5 px-2.5 rounded-[var(--radius-md)] hover:bg-[var(--hover-bg)] cursor-pointer transition-colors truncate font-sans ${
                    h.level === 1
                      ? 'font-semibold text-[var(--text-primary)] text-xs'
                      : h.level === 2
                      ? 'pl-4 font-medium text-[var(--text-secondary)]'
                      : 'pl-6 font-normal text-[var(--text-muted)]'
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
          <div className="space-y-3 flex-1 flex flex-col">
            {/* FIND SECTION */}
            <div>
              <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">
                Find
              </label>
              <div className="relative">
                <input
                  ref={findInputRef}
                  type="text"
                  placeholder="Search in document..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (e.shiftKey) {
                        handlePrevMatch();
                      } else {
                        handleNextMatch();
                      }
                    } else if (e.key === 'Escape') {
                      onClose();
                    }
                  }}
                  className="w-full px-2.5 py-1.5 pl-8 pr-7 bg-[var(--surface-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] focus:border-[var(--accent-color)] rounded-[var(--radius-md)] text-xs outline-hidden"
                />
                <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-2.5 top-2.5" />
                {searchTerm && (
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      handleSearchChange('');
                      findInputRef.current?.focus();
                    }}
                    className="absolute right-2 top-2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Search Options: Case Sensitivity & Whole Word */}
              <div className="flex items-center space-x-1.5 mt-2">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleToggleMatchCase}
                  title="Match Case (Case sensitive)"
                  className={`px-2 py-0.5 rounded-[var(--radius-sm)] text-[10px] font-medium border transition-colors ${
                    matchCase
                      ? 'bg-[var(--selection-bg)] text-[var(--accent-color)] border-[var(--accent-color)]'
                      : 'bg-[var(--surface-secondary)] text-[var(--text-secondary)] border-[var(--border-color)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  Aa Match Case
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleToggleWholeWord}
                  title="Match Whole Words Only"
                  className={`px-2 py-0.5 rounded-[var(--radius-sm)] text-[10px] font-medium border transition-colors ${
                    wholeWord
                      ? 'bg-[var(--selection-bg)] text-[var(--accent-color)] border-[var(--accent-color)]'
                      : 'bg-[var(--surface-secondary)] text-[var(--text-secondary)] border-[var(--border-color)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  [ab] Whole Word
                </button>
              </div>

              {searchTerm.trim() && (
                <div className="flex items-center justify-between mt-2 text-[11px] text-[var(--text-muted)]">
                  <span>
                    {matches.length > 0
                      ? `Match ${currentMatchIndex} of ${matches.length}`
                      : 'No matches found'}
                  </span>
                  <div className="flex space-x-1">
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={handlePrevMatch}
                      disabled={matches.length === 0}
                      className="p-1 rounded-[var(--radius-sm)] hover:bg-[var(--hover-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-30"
                      title="Previous match (Shift+Enter)"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={handleNextMatch}
                      disabled={matches.length === 0}
                      className="p-1 rounded-[var(--radius-sm)] hover:bg-[var(--hover-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-30"
                      title="Next match (Enter)"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* REPLACE SECTION */}
            <div className="pt-2 border-t border-[var(--border-color)]">
              <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">
                Replace With
              </label>
              <input
                ref={replaceInputRef}
                type="text"
                placeholder="Replacement text..."
                value={replaceTerm}
                onChange={(e) => {
                  setReplaceTerm(e.target.value);
                  setReplaceStatus(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (e.ctrlKey || e.metaKey) {
                      handleReplaceAll();
                    } else {
                      handleReplaceOne();
                    }
                  } else if (e.key === 'Escape') {
                    onClose();
                  }
                }}
                className="w-full px-2.5 py-1.5 bg-[var(--surface-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] focus:border-[var(--accent-color)] rounded-[var(--radius-md)] text-xs outline-hidden"
              />

              <div className="flex items-center space-x-2 mt-2">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleReplaceOne}
                  disabled={matches.length === 0}
                  className="flex-1 py-1 bg-[var(--surface-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] hover:bg-[var(--hover-bg)] rounded-[var(--radius-md)] font-medium disabled:opacity-40 transition-colors"
                  title="Replace current match (Enter)"
                >
                  Replace
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleReplaceAll}
                  disabled={matches.length === 0}
                  className="flex-1 py-1 bg-[var(--accent-color)] text-[var(--text-on-accent)] hover:bg-[var(--accent-hover)] rounded-[var(--radius-md)] font-medium disabled:opacity-40 transition-colors"
                  title="Replace all matches (Ctrl+Enter)"
                >
                  Replace All
                </button>
              </div>

              {replaceStatus && (
                <div className="mt-1.5 text-[11px] text-[var(--accent-color)] font-medium">
                  {replaceStatus}
                </div>
              )}
            </div>

            {/* MATCHES LIST */}
            {matches.length > 0 && (
              <div className="pt-2 border-t border-[var(--border-color)] flex-1 flex flex-col min-h-0">
                <div className="text-[11px] font-medium text-[var(--text-muted)] mb-1.5">
                  Results ({matches.length})
                </div>
                <div className="flex-1 overflow-y-auto space-y-1 pr-1 max-h-56">
                  {matches.map((m, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setCurrentMatchIndex(idx + 1);
                        updateSearchDecorations(matches, idx + 1);
                        selectMatch(m);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-[var(--radius-md)] text-xs transition-colors border ${
                        currentMatchIndex === idx + 1
                          ? 'bg-[var(--selection-bg)] border-[var(--accent-color)] text-[var(--text-primary)] font-medium shadow-2xs'
                          : 'bg-[var(--surface-secondary)] border-transparent hover:bg-[var(--hover-bg)] text-[var(--text-primary)]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] mb-0.5">
                        <span>Match {idx + 1}</span>
                        {currentMatchIndex === idx + 1 && (
                          <span className="text-[var(--accent-color)] font-semibold">Current</span>
                        )}
                      </div>
                      <div className="truncate font-sans text-[11px]">
                        {m.snippet || searchTerm}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
