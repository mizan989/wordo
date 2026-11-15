import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { Editor } from '@tiptap/react';

interface InsertSymbolModalProps {
  isOpen: boolean;
  onClose: () => void;
  editor: Editor | null;
}

interface SymbolCategory {
  name: string;
  symbols: { char: string; name: string }[];
}

const SYMBOL_CATEGORIES: SymbolCategory[] = [
  {
    name: 'Common & Punctuation',
    symbols: [
      { char: '©', name: 'Copyright' },
      { char: '®', name: 'Registered Trademark' },
      { char: '™', name: 'Trademark' },
      { char: '§', name: 'Section' },
      { char: '¶', name: 'Pilcrow / Paragraph' },
      { char: '†', name: 'Dagger' },
      { char: '‡', name: 'Double Dagger' },
      { char: '•', name: 'Bullet' },
      { char: '—', name: 'Em Dash' },
      { char: '–', name: 'En Dash' },
      { char: '…', name: 'Horizontal Ellipsis' },
      { char: '«', name: 'Left-Pointing Guimet' },
      { char: '»', name: 'Right-Pointing Guimet' },
      { char: '“', name: 'Left Double Quote' },
      { char: '”', name: 'Right Double Quote' },
      { char: '‘', name: 'Left Single Quote' },
      { char: '’', name: 'Right Single Quote' },
      { char: '¿', name: 'Inverted Question Mark' },
      { char: '¡', name: 'Inverted Exclamation Mark' },
      { char: '№', name: 'Numero Sign' },
      { char: '‰', name: 'Per Mille Sign' },
      { char: '°', name: 'Degree Sign' },
    ],
  },
  {
    name: 'Math & Logic',
    symbols: [
      { char: '±', name: 'Plus-Minus' },
      { char: '×', name: 'Multiplication Sign' },
      { char: '÷', name: 'Division Sign' },
      { char: '≠', name: 'Not Equal To' },
      { char: '≈', name: 'Almost Equal To' },
      { char: '≤', name: 'Less-Than or Equal To' },
      { char: '≥', name: 'Greater-Than or Equal To' },
      { char: '∞', name: 'Infinity' },
      { char: '√', name: 'Square Root' },
      { char: '∑', name: 'N-Ary Summation' },
      { char: '∫', name: 'Integral' },
      { char: '∏', name: 'N-Ary Product' },
      { char: '∂', name: 'Partial Differential' },
      { char: '∆', name: 'Increment / Delta' },
      { char: '∇', name: 'Nabla' },
      { char: '∈', name: 'Element Of' },
      { char: '∉', name: 'Not An Element Of' },
      { char: '⊂', name: 'Subset Of' },
      { char: '⊆', name: 'Subset Of or Equal To' },
      { char: '∪', name: 'Union' },
      { char: '∩', name: 'Intersection' },
      { char: '∧', name: 'Logical AND' },
      { char: '∨', name: 'Logical OR' },
      { char: '¬', name: 'Not Sign' },
      { char: '≡', name: 'Identical To' },
      { char: '∝', name: 'Proportional To' },
      { char: '∠', name: 'Angle' },
    ],
  },
  {
    name: 'Currency',
    symbols: [
      { char: '$', name: 'Dollar Sign' },
      { char: '€', name: 'Euro Sign' },
      { char: '£', name: 'Pound Sign' },
      { char: '¥', name: 'Yen / Yuan Sign' },
      { char: '₹', name: 'Indian Rupee' },
      { char: '₽', name: 'Russian Ruble' },
      { char: '₩', name: 'Won Sign' },
      { char: '¢', name: 'Cent Sign' },
      { char: '₿', name: 'Bitcoin Sign' },
      { char: '¤', name: 'Currency Sign' },
      { char: '₺', name: 'Turkish Lira' },
      { char: '₪', name: 'New Israeli Sheqel' },
      { char: '₫', name: 'Dong Sign' },
      { char: '₱', name: 'Philippine Peso' },
      { char: 'CHF', name: 'Swiss Franc' },
    ],
  },
  {
    name: 'Greek Alphabet',
    symbols: [
      { char: 'α', name: 'Alpha (lower)' },
      { char: 'β', name: 'Beta (lower)' },
      { char: 'γ', name: 'Gamma (lower)' },
      { char: 'δ', name: 'Delta (lower)' },
      { char: 'ε', name: 'Epsilon (lower)' },
      { char: 'ζ', name: 'Zeta (lower)' },
      { char: 'η', name: 'Eta (lower)' },
      { char: 'θ', name: 'Theta (lower)' },
      { char: 'ι', name: 'Iota (lower)' },
      { char: 'κ', name: 'Kappa (lower)' },
      { char: 'λ', name: 'Lambda (lower)' },
      { char: 'μ', name: 'Mu (lower)' },
      { char: 'ν', name: 'Nu (lower)' },
      { char: 'ξ', name: 'Xi (lower)' },
      { char: 'π', name: 'Pi (lower)' },
      { char: 'ρ', name: 'Rho (lower)' },
      { char: 'σ', name: 'Sigma (lower)' },
      { char: 'τ', name: 'Tau (lower)' },
      { char: 'υ', name: 'Upsilon (lower)' },
      { char: 'φ', name: 'Phi (lower)' },
      { char: 'χ', name: 'Chi (lower)' },
      { char: 'ψ', name: 'Psi (lower)' },
      { char: 'ω', name: 'Omega (lower)' },
      { char: 'Γ', name: 'Gamma (upper)' },
      { char: 'Δ', name: 'Delta (upper)' },
      { char: 'Θ', name: 'Theta (upper)' },
      { char: 'Λ', name: 'Lambda (upper)' },
      { char: 'Ξ', name: 'Xi (upper)' },
      { char: 'Π', name: 'Pi (upper)' },
      { char: 'Σ', name: 'Sigma (upper)' },
      { char: 'Φ', name: 'Phi (upper)' },
      { char: 'Ψ', name: 'Psi (upper)' },
      { char: 'Ω', name: 'Omega (upper)' },
    ],
  },
  {
    name: 'Arrows & Shapes',
    symbols: [
      { char: '←', name: 'Leftwards Arrow' },
      { char: '→', name: 'Rightwards Arrow' },
      { char: '↑', name: 'Upwards Arrow' },
      { char: '↓', name: 'Downwards Arrow' },
      { char: '↔', name: 'Left Right Arrow' },
      { char: '↕', name: 'Up Down Arrow' },
      { char: '↖', name: 'North West Arrow' },
      { char: '↗', name: 'North East Arrow' },
      { char: '↘', name: 'South East Arrow' },
      { char: '↙', name: 'South West Arrow' },
      { char: '⇐', name: 'Leftwards Double Arrow' },
      { char: '⇒', name: 'Rightwards Double Arrow' },
      { char: '⇑', name: 'Upwards Double Arrow' },
      { char: '⇓', name: 'Downwards Double Arrow' },
      { char: '⇔', name: 'Left Right Double Arrow' },
      { char: '★', name: 'Black Star' },
      { char: '☆', name: 'White Star' },
      { char: '✓', name: 'Check Mark' },
      { char: '✗', name: 'Ballot X' },
      { char: '◆', name: 'Black Diamond' },
      { char: '◇', name: 'White Diamond' },
      { char: '■', name: 'Black Square' },
      { char: '□', name: 'White Square' },
      { char: '▲', name: 'Black Up-Pointing Triangle' },
      { char: '▼', name: 'Black Down-Pointing Triangle' },
    ],
  },
  {
    name: 'Latin & Accents',
    symbols: [
      { char: 'à', name: 'a grave' },
      { char: 'á', name: 'a acute' },
      { char: 'â', name: 'a circumflex' },
      { char: 'ã', name: 'a tilde' },
      { char: 'ä', name: 'a diaeresis' },
      { char: 'å', name: 'a ring above' },
      { char: 'æ', name: 'ae ligature' },
      { char: 'ç', name: 'c cedilla' },
      { char: 'è', name: 'e grave' },
      { char: 'é', name: 'e acute' },
      { char: 'ê', name: 'e circumflex' },
      { char: 'ë', name: 'e diaeresis' },
      { char: 'ì', name: 'i grave' },
      { char: 'í', name: 'i acute' },
      { char: 'î', name: 'i circumflex' },
      { char: 'ï', name: 'i diaeresis' },
      { char: 'ñ', name: 'n tilde' },
      { char: 'ò', name: 'o grave' },
      { char: 'ó', name: 'o acute' },
      { char: 'ô', name: 'o circumflex' },
      { char: 'õ', name: 'o tilde' },
      { char: 'ö', name: 'o diaeresis' },
      { char: 'ø', name: 'o stroke' },
      { char: 'ù', name: 'u grave' },
      { char: 'ú', name: 'u acute' },
      { char: 'û', name: 'u circumflex' },
      { char: 'ü', name: 'u diaeresis' },
      { char: 'ÿ', name: 'y diaeresis' },
      { char: 'ß', name: 'sharp s' },
    ],
  },
];

export const InsertSymbolModal: React.FC<InsertSymbolModalProps> = ({ isOpen, onClose, editor }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState<{ char: string; name: string } | null>(
    SYMBOL_CATEGORIES[0].symbols[0]
  );
  const [recentSymbols, setRecentSymbols] = useState<string[]>(['©', '®', '™', '±', '€', '°', '—']);

  if (!isOpen) return null;

  const handleInsert = (symbolChar: string) => {
    if (!editor) return;
    editor.chain().focus().insertContent(symbolChar).run();
    setRecentSymbols((prev) => [symbolChar, ...prev.filter((c) => c !== symbolChar)].slice(0, 14));
  };

  const getFilteredSymbols = () => {
    if (!searchQuery.trim()) {
      return SYMBOL_CATEGORIES[activeTab].symbols;
    }
    const q = searchQuery.toLowerCase();
    const results: { char: string; name: string }[] = [];
    SYMBOL_CATEGORIES.forEach((cat) => {
      cat.symbols.forEach((sym) => {
        if (sym.name.toLowerCase().includes(q) || sym.char.includes(q)) {
          results.push(sym);
        }
      });
    });
    return results;
  };

  const filteredSymbols = getFilteredSymbols();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#202020] text-gray-800 dark:text-gray-100 rounded-lg shadow-2xl border border-gray-300 dark:border-gray-700 w-full max-w-xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#282828]">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold text-[#185abd]">Ω Symbol</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Microsoft Word Character Palette</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Tabs */}
        <div className="p-4 pb-2 border-b border-gray-200 dark:border-gray-700 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search symbols by name (e.g., copyright, delta, euro)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-gray-100 dark:bg-[#181818] border border-gray-300 dark:border-gray-600 rounded-md focus:outline-hidden focus:border-[#185abd]"
            />
          </div>

          {!searchQuery && (
            <div className="flex flex-wrap gap-1 text-xs">
              {SYMBOL_CATEGORIES.map((cat, idx) => (
                <button
                  key={cat.name}
                  onClick={() => setActiveTab(idx)}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeTab === idx
                      ? 'bg-[#185abd] text-white font-medium'
                      : 'bg-gray-100 dark:bg-[#2c2c2c] hover:bg-gray-200 dark:hover:bg-[#383838]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Symbols Grid */}
        <div className="p-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5">
            {filteredSymbols.map((item) => (
              <button
                key={item.char + item.name}
                onClick={() => setSelectedSymbol(item)}
                onDoubleClick={() => {
                  handleInsert(item.char);
                  onClose();
                }}
                title={item.name}
                className={`h-11 flex flex-col items-center justify-center rounded text-xl font-serif transition-all border ${
                  selectedSymbol?.char === item.char
                    ? 'border-[#185abd] bg-blue-50 dark:bg-blue-950/40 text-[#185abd] font-bold shadow-xs'
                    : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-100 dark:hover:bg-[#2a2a2a]'
                }`}
              >
                {item.char}
              </button>
            ))}
          </div>

          {filteredSymbols.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm">No matching symbols found.</div>
          )}
        </div>

        {/* Recently Used */}
        <div className="px-5 py-2 bg-gray-50 dark:bg-[#252525] border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-gray-500 font-medium">Recently used:</span>
            <div className="flex space-x-1">
              {recentSymbols.map((char) => (
                <button
                  key={char}
                  onClick={() => handleInsert(char)}
                  className="w-7 h-7 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-[#1f1f1f] hover:border-[#185abd] hover:bg-blue-50 dark:hover:bg-blue-950/30 text-sm font-serif"
                >
                  {char}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer with Character Details & Action */}
        <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#202020] flex items-center justify-between">
          <div className="text-xs text-gray-600 dark:text-gray-300">
            {selectedSymbol ? (
              <span>
                <span className="font-semibold">{selectedSymbol.name}</span>
                <span className="text-gray-400 ml-2">
                  (Unicode: U+{selectedSymbol.char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')})
                </span>
              </span>
            ) : (
              <span>Select a symbol to preview</span>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={!selectedSymbol}
              onClick={() => {
                if (selectedSymbol) {
                  handleInsert(selectedSymbol.char);
                  onClose();
                }
              }}
              className="px-5 py-1.5 text-xs rounded font-medium bg-[#185abd] text-white hover:bg-[#1651aa] disabled:opacity-50 transition-colors shadow-xs"
            >
              Insert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
