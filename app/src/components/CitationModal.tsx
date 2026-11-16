import React, { useState } from 'react';
import { X, BookOpen, Plus, Trash2 } from 'lucide-react';
import { Editor } from '@tiptap/react';

interface CitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  editor: Editor | null;
}

interface CitationSource {
  id: string;
  type: 'book' | 'journal' | 'website' | 'report';
  author: string;
  title: string;
  year: string;
  publisher?: string;
  journal?: string;
  volume?: string;
  pages?: string;
  url?: string;
}

const DEFAULT_SOURCES: CitationSource[] = [
  {
    id: '1',
    type: 'book',
    author: 'Knuth, Donald E.',
    title: 'The Art of Computer Programming',
    year: '1997',
    publisher: 'Addison-Wesley',
  },
  {
    id: '2',
    type: 'journal',
    author: 'Turing, Alan M.',
    title: 'Computing Machinery and Intelligence',
    year: '1950',
    journal: 'Mind',
    volume: '59',
    pages: '433-460',
  },
];

export const CitationModal: React.FC<CitationModalProps> = ({ isOpen, onClose, editor }) => {
  const [sources, setSources] = useState<CitationSource[]>(DEFAULT_SOURCES);
  const [selectedSourceId, setSelectedSourceId] = useState<string>(DEFAULT_SOURCES[0].id);
  const [style, setStyle] = useState<'APA' | 'MLA' | 'Chicago' | 'IEEE' | 'Harvard'>('APA');

  // New source form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newType, setNewType] = useState<'book' | 'journal' | 'website' | 'report'>('book');
  const [newAuthor, setNewAuthor] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newYear, setNewYear] = useState(new Date().getFullYear().toString());
  const [newPublisher, setNewPublisher] = useState('');
  const [newUrl, setNewUrl] = useState('');

  if (!isOpen) return null;

  const handleAddSource = () => {
    if (!newAuthor.trim() || !newTitle.trim()) return;
    const newSrc: CitationSource = {
      id: Date.now().toString(),
      type: newType,
      author: newAuthor,
      title: newTitle,
      year: newYear,
      publisher: newPublisher,
      url: newUrl,
    };
    setSources((prev) => [...prev, newSrc]);
    setSelectedSourceId(newSrc.id);
    setShowAddForm(false);
    setNewAuthor('');
    setNewTitle('');
    setNewPublisher('');
    setNewUrl('');
  };

  const handleDeleteSource = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSources((prev) => prev.filter((s) => s.id !== id));
    if (selectedSourceId === id && sources.length > 1) {
      setSelectedSourceId(sources.filter((s) => s.id !== id)[0].id);
    }
  };

  const formatInTextCitation = (src: CitationSource): string => {
    const lastName = src.author.split(',')[0].trim() || src.author.split(' ').pop() || 'Unknown';
    switch (style) {
      case 'IEEE':
        return `[${sources.findIndex((s) => s.id === src.id) + 1}]`;
      case 'MLA':
        return `(${lastName} ${src.pages || ''})`.trim();
      case 'APA':
      case 'Harvard':
      case 'Chicago':
      default:
        return `(${lastName}, ${src.year})`;
    }
  };

  const formatBibliographyEntry = (src: CitationSource): string => {
    switch (style) {
      case 'MLA':
        return `${src.author}. <i>${src.title}</i>. ${src.publisher ? src.publisher + ', ' : ''}${src.year}.`;
      case 'IEEE':
        return `[${sources.findIndex((s) => s.id === src.id) + 1}] ${src.author}, <i>${src.title}</i>, ${src.publisher || ''}, ${src.year}.`;
      case 'Chicago':
        return `${src.author}. ${src.year}. <i>${src.title}</i>. ${src.publisher || ''}.`;
      case 'APA':
      case 'Harvard':
      default:
        return `${src.author} (${src.year}). <i>${src.title}</i>. ${src.publisher || src.journal || ''}.`;
    }
  };

  const handleInsertCitation = () => {
    if (!editor) return;
    const src = sources.find((s) => s.id === selectedSourceId);
    if (!src) return;
    const citation = formatInTextCitation(src);
    editor.chain().focus().insertContent(` ${citation} `).run();
    onClose();
  };

  const handleInsertBibliography = () => {
    if (!editor) return;
    const heading = style === 'MLA' ? 'Works Cited' : 'References';
    const entriesHtml = sources
      .map((s) => `<p style="padding-left: 36px; text-indent: -36px; margin-bottom: 8px;">${formatBibliographyEntry(s)}</p>`)
      .join('');

    const bibHtml = `
      <div class="wordo-bibliography" style="margin-top: 32px; border-top: 1px solid #cbd5e1; padding-top: 16px;">
        <h2 style="font-size: 16pt; font-weight: bold; margin-bottom: 16px;">${heading}</h2>
        ${entriesHtml}
      </div>
    `;
    editor.chain().focus().insertContent(bibHtml).run();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs">
      <div className="bg-[var(--surface-primary)] text-[var(--text-primary)] rounded-[var(--radius-xl)] shadow-[var(--shadow-modal)] border border-[var(--border-color)] w-full max-w-xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border-color)] bg-[var(--surface-secondary)]">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-[var(--text-primary)]" />
            <span className="text-sm font-semibold">Citations & Bibliography</span>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] p-1 rounded-[var(--radius-sm)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Style Selector */}
        <div className="px-5 py-3 bg-[var(--surface-secondary)] border-b border-[var(--border-color)] flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-600 dark:text-gray-300">Citation Style:</span>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value as any)}
              className="px-2 py-1 bg-[var(--surface-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-[var(--radius-md)] text-xs focus:outline-hidden focus:border-[var(--accent-color)]"
            >
              <option value="APA">APA (7th edition)</option>
              <option value="MLA">MLA (9th edition)</option>
              <option value="Chicago">Chicago (17th edition)</option>
              <option value="Harvard">Harvard Reference Format</option>
              <option value="IEEE">IEEE Reference System</option>
            </select>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-1 px-2.5 py-1 bg-[var(--accent-color)] text-white rounded-[var(--radius-md)] text-xs hover:opacity-90 transition-opacity"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showAddForm ? 'Cancel New' : 'Add New Source'}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {showAddForm && (
            <div className="p-3 bg-[var(--surface-secondary)] border border-[var(--border-color)] rounded-[var(--radius-lg)] space-y-2 text-xs">
              <span className="font-semibold text-blue-900 dark:text-blue-300">Create New Source</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-gray-500">Type of Source</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full p-1.5 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-600 rounded"
                  >
                    <option value="book">Book</option>
                    <option value="journal">Journal Article</option>
                    <option value="website">Website</option>
                    <option value="report">Report / Document</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-gray-500">Year</label>
                  <input
                    type="text"
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    className="w-full p-1.5 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-600 rounded"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] text-gray-500">Author(s) (e.g., Last, First M.)</label>
                <input
                  type="text"
                  placeholder="Smith, John"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full p-1.5 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-600 rounded"
                />
              </div>
              <div>
                <label className="text-[11px] text-gray-500">Title</label>
                <input
                  type="text"
                  placeholder="Title of work"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-1.5 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-600 rounded"
                />
              </div>
              <div>
                <label className="text-[11px] text-gray-500">Publisher / Organization / URL</label>
                <input
                  type="text"
                  placeholder="Publisher name or https://..."
                  value={newPublisher}
                  onChange={(e) => setNewPublisher(e.target.value)}
                  className="w-full p-1.5 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-600 rounded"
                />
              </div>
              <div className="flex justify-end pt-1">
                <button
                  onClick={handleAddSource}
                  className="px-3 py-1 bg-[var(--accent-color)] text-white rounded-[var(--radius-md)] font-medium hover:opacity-90"
                >
                  Save Source
                </button>
              </div>
            </div>
          )}

          {/* Sources List */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Master Source List:</span>
            <div className="border border-gray-200 dark:border-gray-700 rounded-md divide-y divide-gray-200 dark:divide-gray-800 bg-gray-50 dark:bg-[#181818] max-h-48 overflow-y-auto">
              {sources.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedSourceId(s.id)}
                  className={`p-2.5 flex items-center justify-between text-xs cursor-pointer transition-colors ${
                    selectedSourceId === s.id
                      ? 'bg-[var(--selection-bg)] border-l-2 border-l-[var(--accent-color)]'
                      : 'hover:bg-gray-100 dark:hover:bg-[#252525]'
                  }`}
                >
                  <div className="pr-3">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{s.title}</p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      {s.author} ({s.year}) • {s.publisher || s.journal || 'General Reference'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded uppercase">
                      {formatInTextCitation(s)}
                    </span>
                    <button
                      onClick={(e) => handleDeleteSource(s.id, e)}
                      title="Delete source"
                      className="text-gray-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[var(--border-color)] bg-[var(--surface-secondary)] flex items-center justify-between">
          <button
            onClick={handleInsertBibliography}
            className="px-3.5 py-1.5 text-xs rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--surface-primary)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-colors font-medium"
          >
            Insert Works Cited / Bibliography
          </button>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--surface-primary)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleInsertCitation}
              disabled={sources.length === 0}
              className="px-5 py-1.5 text-xs rounded-[var(--radius-md)] font-medium bg-[var(--accent-color)] text-white hover:opacity-90 disabled:opacity-40 transition-opacity shadow-xs"
            >
              Insert Citation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
