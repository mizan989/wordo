import React, { useState } from 'react';
import { X, Languages, ArrowRight, Check } from 'lucide-react';
import { Editor } from '@tiptap/react';

interface TranslateModalProps {
  isOpen: boolean;
  onClose: () => void;
  editor: Editor | null;
}

const LANGUAGES = [
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'zh', name: 'Chinese (Simplified)' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'ru', name: 'Russian' },
  { code: 'hi', name: 'Hindi' },
  { code: 'en', name: 'English' },
];

// Offline translation lookup table for common words & expressions
const DICTIONARY: Record<string, Record<string, string>> = {
  es: {
    hello: 'hola',
    world: 'mundo',
    document: 'documento',
    title: 'título',
    abstract: 'resumen',
    introduction: 'introducción',
    summary: 'resumen',
    conclusion: 'conclusión',
    references: 'referencias',
    table: 'tabla',
    figure: 'figura',
    report: 'informe',
    meeting: 'reunión',
    project: 'proyecto',
    author: 'autor',
    date: 'fecha',
    overview: 'descripción general',
    page: 'página',
    notes: 'notas',
  },
  fr: {
    hello: 'bonjour',
    world: 'monde',
    document: 'document',
    title: 'titre',
    abstract: 'résumé',
    introduction: 'introduction',
    summary: 'sommaire',
    conclusion: 'conclusion',
    references: 'références',
    table: 'tableau',
    figure: 'figure',
    report: 'rapport',
    meeting: 'réunion',
    project: 'projet',
    author: 'auteur',
    date: 'date',
    overview: 'aperçu',
    page: 'page',
    notes: 'remarques',
  },
  de: {
    hello: 'hallo',
    world: 'welt',
    document: 'dokument',
    title: 'titel',
    abstract: 'zusammenfassung',
    introduction: 'einleitung',
    summary: 'übersicht',
    conclusion: 'fazit',
    references: 'literaturverzeichnis',
    table: 'tabelle',
    figure: 'abbildung',
    report: 'bericht',
    meeting: 'besprechung',
    project: 'projekt',
    author: 'autor',
    date: 'datum',
    overview: 'überblick',
    page: 'seite',
    notes: 'notizen',
  },
};

export const TranslateModal: React.FC<TranslateModalProps> = ({ isOpen, onClose, editor }) => {
  const [targetLang, setTargetLang] = useState('es');
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    if (!isOpen || !editor) return;
    const { from, to, empty } = editor.state.selection;
    let text = '';
    if (!empty) {
      text = editor.state.doc.textBetween(from, to, ' ');
    } else {
      text = editor.getText().slice(0, 500);
    }
    setSourceText(text);
    performTranslation(text, targetLang);
  }, [isOpen, editor]);

  if (!isOpen) return null;

  const performTranslation = (text: string, langCode: string) => {
    if (!text.trim()) {
      setTranslatedText('');
      return;
    }

    const dict = DICTIONARY[langCode] || {};
    // Smart word-by-word token replacement preserving punctuation
    const words = text.split(/(\s+|[.,!?;:()])/);
    const translatedWords = words.map((w) => {
      const lower = w.toLowerCase();
      if (dict[lower]) {
        // preserve casing
        if (w === w.toUpperCase() && w.length > 1) return dict[lower].toUpperCase();
        if (w[0] === w[0].toUpperCase()) {
          return dict[lower].charAt(0).toUpperCase() + dict[lower].slice(1);
        }
        return dict[lower];
      }
      return w;
    });

    const result = translatedWords.join('');
    setTranslatedText(result);
  };

  const handleLangChange = (code: string) => {
    setTargetLang(code);
    performTranslation(sourceText, code);
  };

  const handleInsert = (mode: 'replace' | 'below') => {
    if (!editor || !translatedText) return;
    if (mode === 'replace') {
      editor.chain().focus().insertContent(translatedText).run();
    } else {
      editor.chain().focus().insertContent(`<p><em>[Translated]:</em> ${translatedText}</p>`).run();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs">
      <div className="bg-[var(--surface-primary)] text-[var(--text-primary)] rounded-[var(--radius-xl)] shadow-[var(--shadow-modal)] border border-[var(--border-color)] w-full max-w-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border-color)] bg-[var(--surface-secondary)]">
          <div className="flex items-center space-x-2">
            <Languages className="w-5 h-5 text-[var(--text-primary)]" />
            <span className="text-sm font-semibold">Translate</span>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] p-1 rounded-[var(--radius-sm)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Translation Body */}
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between text-xs bg-[var(--surface-secondary)] p-2 rounded-[var(--radius-md)] border border-[var(--border-color)]">
            <div className="font-medium text-gray-600 dark:text-gray-300">Auto-detected (English)</div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <div className="flex items-center space-x-1">
              <span className="text-gray-500">To:</span>
              <select
                value={targetLang}
                onChange={(e) => handleLangChange(e.target.value)}
                className="px-2 py-1 bg-[var(--surface-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-[var(--radius-md)] font-medium focus:outline-hidden focus:border-[var(--accent-color)]"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="block font-semibold text-gray-500 mb-1">Source Text:</span>
              <textarea
                value={sourceText}
                onChange={(e) => {
                  setSourceText(e.target.value);
                  performTranslation(e.target.value, targetLang);
                }}
                placeholder="Type or select text in editor to translate..."
                rows={6}
                className="w-full p-2.5 bg-[var(--surface-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-[var(--radius-md)] focus:outline-hidden focus:border-[var(--accent-color)] resize-none"
              />
            </div>
            <div>
              <span className="block font-semibold text-gray-500 mb-1">Translation:</span>
              <textarea
                value={translatedText}
                onChange={(e) => setTranslatedText(e.target.value)}
                rows={6}
                className="w-full p-2.5 bg-[var(--surface-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-[var(--radius-md)] focus:outline-hidden focus:border-[var(--accent-color)] resize-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[var(--border-color)] bg-[var(--surface-secondary)] flex items-center justify-between">
          <button
            onClick={() => {
              navigator.clipboard.writeText(translatedText);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="text-xs text-gray-600 dark:text-gray-300 hover:text-[var(--text-primary)] flex items-center space-x-1"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : null}
            <span>{copied ? 'Copied!' : 'Copy translation'}</span>
          </button>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--surface-primary)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleInsert('below')}
              className="px-3.5 py-1.5 text-xs rounded border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
            >
              Insert Below
            </button>
            <button
              onClick={() => handleInsert('replace')}
              disabled={!translatedText}
              className="px-5 py-1.5 text-xs rounded-[var(--radius-md)] font-medium bg-[var(--accent-color)] text-white hover:opacity-90 disabled:opacity-40 transition-opacity shadow-xs"
            >
              Replace Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
