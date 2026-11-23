import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import CharacterCount from '@tiptap/extension-character-count';
import { TypographyExtension } from './extensions/typography';
import { PageBreak } from './extensions/pageBreak';
import { SearchHighlightExtension } from './extensions/searchHighlight';

import { TitleBar } from './components/TitleBar';
import { BackstageView } from './components/BackstageView';
import { RibbonToolbar } from './components/RibbonToolbar';
import { Ruler } from './components/Ruler';
import { EditorCanvas } from './components/EditorCanvas';
import { StatusBar } from './components/StatusBar';
import { NavigationSidebar } from './components/NavigationSidebar';
import { SpellCheckPanel } from './components/SpellCheckPanel';
import { WordCountDialog } from './components/WordCountDialog';
import { TemplateModal } from './components/TemplateModal';
import { ShortcutsModal } from './components/ShortcutsModal';
import { AboutModal } from './components/AboutModal';
import { DocumentSettingsModal } from './components/DocumentSettingsModal';
import { RecoveryBanner } from './components/RecoveryBanner';
import { CloseConfirmModal } from './components/CloseConfirmModal';
import { InsertSymbolModal } from './components/InsertSymbolModal';
import { InsertDateTimeModal } from './components/InsertDateTimeModal';
import { CitationModal } from './components/CitationModal';
import { TranslateModal } from './components/TranslateModal';
import { AccessibilityModal } from './components/AccessibilityModal';
import { ReadAloudBar } from './components/ReadAloudBar';

import { PlatformService } from './services/platform';
import { DocxService } from './services/docxService';
import { StorageService } from './services/storageService';
import { SpellService } from './services/spellService';
import { PdfService } from './services/pdfService';
import { DOCUMENT_TEMPLATES, DocumentTemplate } from './templates';
import { PageSettings, RecoveryDraft, RecentDocument, SpellIssue, DocumentStats } from './types';

export const App: React.FC = () => {
  // Document state
  const [documentTitle, setDocumentTitle] = useState('Document 1');
  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null);
  const [currentFileFormat, setCurrentFileFormat] = useState<'docx' | 'txt' | 'html'>('docx');
  const [isDirty, setIsDirty] = useState(false);
  const [editRevision, setEditRevision] = useState(0);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => StorageService.getSavedTheme());
  const [zoom, setZoom] = useState(100);
  const [showRuler, setShowRuler] = useState(true);
  const [showNavSidebar, setShowNavSidebar] = useState(false);
  const [navDefaultTab, setNavDefaultTab] = useState<'outline' | 'search'>('outline');
  const [navSearchFocus, setNavSearchFocus] = useState<'find' | 'replace'>('find');
  const [showSpellCheck, setShowSpellCheck] = useState(false);
  const [showWordCount, setShowWordCount] = useState(false);
  const [showBackstage, setShowBackstage] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCloseConfirmModal, setShowCloseConfirmModal] = useState(false);
  const [showSymbolModal, setShowSymbolModal] = useState(false);
  const [showDateTimeModal, setShowDateTimeModal] = useState(false);
  const [showCitationModal, setShowCitationModal] = useState(false);
  const [showTranslateModal, setShowTranslateModal] = useState(false);
  const [showAccessibilityModal, setShowAccessibilityModal] = useState(false);
  const [isReadAloudOpen, setIsReadAloudOpen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [paperTheme, setPaperTheme] = useState<'white' | 'dark' | 'sepia'>('white');

  const [activeRecoveryDraft, setActiveRecoveryDraft] = useState<RecoveryDraft | null>(null);
  const [recentDocuments, setRecentDocuments] = useState<RecentDocument[]>(() =>
    StorageService.getRecentDocuments()
  );

  const [spellIssues, setSpellIssues] = useState<SpellIssue[]>([]);
  const [stats, setStats] = useState<DocumentStats>({
    words: 0,
    characters: 0,
    charactersWithoutSpaces: 0,
    paragraphs: 0,
    sentences: 0,
    readingTimeMinutes: 1,
    speakingTimeMinutes: 1,
  });

  const [pageSettings, setPageSettings] = useState<PageSettings>({
    size: 'a4',
    orientation: 'portrait',
    margins: { top: 96, bottom: 96, left: 96, right: 96 },
    showPageNumbers: false,
  });

  // Apply dark theme class to root html element and Astryx neutral theme attributes
  useEffect(() => {
    document.documentElement.setAttribute('data-astryx-theme', 'neutral');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.setAttribute('data-astryx-media', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.setAttribute('data-astryx-media', 'light');
    }
    StorageService.saveTheme(theme);
  }, [theme]);

  // Escape key exits Focus Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFocusMode) {
        setIsFocusMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocusMode]);

  // A new document starts empty; templates are only opened from the template picker.
  const initialContent = '<p></p>';

  // Initialize Tiptap Editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[var(--accent-color)] underline cursor-pointer',
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Subscript,
      Superscript,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      CharacterCount,
      TypographyExtension,
      PageBreak,
      SearchHighlightExtension,
    ],
    content: initialContent,
    autofocus: true,
    editorProps: {
      attributes: {
        class: 'outline-none focus:outline-none focus-visible:outline-none border-none ring-0 focus:ring-0',
      },
    },
    onUpdate: ({ editor: ed }) => {
      setIsDirty(true);
      setEditRevision((revision) => revision + 1);
      updateDocumentStats(ed);
    },
  });

  // Calculate document metrics and proofing
  const updateDocumentStats = useCallback(
    (ed: any) => {
      if (!ed) return;
      const text = ed.getText();
      const words = ed.storage.characterCount.words();
      const characters = ed.storage.characterCount.characters();
      const charactersWithoutSpaces = text.replace(/\s+/g, '').length;

      const paragraphs = text
        .split('\n')
        .map((p: string) => p.trim())
        .filter((p: string) => p.length > 0).length || 1;

      const sentences = text
        .split(/[.!?]+/)
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0).length || 1;

      const readingTime = Math.max(1, Math.ceil(words / 200));
      const speakingTime = Math.max(1, Math.ceil(words / 130));

      setStats({
        words,
        characters,
        charactersWithoutSpaces,
        paragraphs,
        sentences,
        readingTimeMinutes: readingTime,
        speakingTimeMinutes: speakingTime,
      });

      // Run proofing checks
      const issues = SpellService.checkText(text);
      setSpellIssues(issues);
    },
    []
  );

  // Initialize stats once editor is ready
  useEffect(() => {
    if (editor) {
      updateDocumentStats(editor);
    }
  }, [editor, updateDocumentStats]);

  // Check for recovery draft on startup and seed authorized paths for recent files
  useEffect(() => {
    const draft = StorageService.getRecoverableDraft();
    if (draft) {
      setActiveRecoveryDraft(draft);
    }
  }, []);

  // Keep a ref to the latest document state for the close handler
  const closeStateRef = useRef({ isDirty, editor, documentTitle, pageSettings });
  useEffect(() => {
    closeStateRef.current = { isDirty, editor, documentTitle, pageSettings };
  }, [isDirty, editor, documentTitle, pageSettings]);

  // Check if document has any written text, modified formatting, or changed settings
  const isDocumentModified = useCallback((): boolean => {
    // 1. If actively marked dirty by typing, formatting, or settings changes:
    if (isDirty) return true;

    if (!editor) return false;

    // 2. If it's a new unsaved document (no file path):
    if (!currentFilePath) {
      // Check if any non-empty text has been written
      const text = editor.getText().trim();
      if (text.length > 0) return true;

      // Check if non-text elements (images, tables, hr) exist in the content
      const html = editor.getHTML();
      if (
        html !== '<p></p>' &&
        html !== '' &&
        (html.includes('<img') || html.includes('<table') || html.includes('<hr') || html.includes('data-page-break'))
      ) {
        return true;
      }

      // Check if document title was customized
      if (documentTitle !== 'Document 1' && documentTitle.trim() !== '') return true;

      // Check if page settings changed from defaults (margins, orientation, size, page numbers)
      if (
        pageSettings.size !== 'a4' ||
        pageSettings.orientation !== 'portrait' ||
        pageSettings.showPageNumbers !== false ||
        pageSettings.margins.top !== 96 ||
        pageSettings.margins.bottom !== 96 ||
        pageSettings.margins.left !== 96 ||
        pageSettings.margins.right !== 96
      ) {
        return true;
      }
    }

    return false;
  }, [isDirty, editor, currentFilePath, documentTitle, pageSettings]);

  const isDocumentModifiedRef = useRef(isDocumentModified);
  useEffect(() => {
    isDocumentModifiedRef.current = isDocumentModified;
  }, [isDocumentModified]);

  const performDirectClose = async () => {
    const win =
      (window as any).__TAURI__?.window?.getCurrentWindow?.() ||
      (window as any).__TAURI__?.webviewWindow?.getCurrentWebviewWindow?.();

    if (win && typeof win.destroy === 'function') {
      try {
        await win.destroy();
        return;
      } catch (e) {
        console.error('[Wordo] Direct destroy failed:', e);
      }
    }

    try {
      const invoke = (window as any).__TAURI__?.core?.invoke;
      if (invoke) {
        await invoke('close_window');
        return;
      }
    } catch (e) {
      console.error('[Wordo] IPC close_window failed:', e);
    }

    window.close();
  };

  const requestWindowClose = useCallback(() => {
    if (isDocumentModifiedRef.current()) {
      setShowCloseConfirmModal(true);
    } else {
      void performDirectClose();
    }
  }, []);

  // Window close interception
  useEffect(() => {
    const getWin = () =>
      (window as any).__TAURI__?.window?.getCurrentWindow?.() ||
      (window as any).__TAURI__?.webviewWindow?.getCurrentWebviewWindow?.();

    const win = getWin();
    const unlisteners: (() => void)[] = [];

    const handleClose = () => {
      requestWindowClose();
    };

    // 1. Listen for custom "request-close" emitted by Rust on_window_event
    const tauriEvent = (window as any).__TAURI__?.event;
    if (typeof tauriEvent?.listen === 'function') {
      tauriEvent.listen('request-close', handleClose).then((unlisten: () => void) => {
        unlisteners.push(unlisten);
      }).catch((err: any) => {
        console.error('[Wordo] Failed to listen to request-close event:', err);
      });
    }

    if (win && typeof win.listen === 'function') {
      win.listen('request-close', handleClose).then((unlisten: () => void) => {
        unlisteners.push(unlisten);
      }).catch((err: any) => {
        console.error('[Wordo] Failed to listen to win request-close:', err);
      });
    }

    // 2. Also listen for onCloseRequested
    if (win && typeof win.onCloseRequested === 'function') {
      try {
        win.onCloseRequested((event: any) => {
          if (event && typeof event.preventDefault === 'function') {
            event.preventDefault();
          }
          handleClose();
        }).then((unlisten: () => void) => {
          unlisteners.push(unlisten);
        }).catch((err: any) => {
          console.error('[Wordo] Failed to register onCloseRequested handler:', err);
        });
      } catch (err) {
        console.error('[Wordo] Could not attach onCloseRequested listener:', err);
      }
    }

    // 3. Web beforeunload fallback
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDocumentModifiedRef.current()) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      unlisteners.forEach((u) => u());
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [requestWindowClose]);

  // Autosave periodically (every 4 seconds if dirty)
  useEffect(() => {
    if (!editor || !isDirty) return;

    const timer = setTimeout(() => {
      const html = editor.getHTML();
      const json = editor.getJSON();
      StorageService.saveDraft(
        documentTitle,
        html,
        json,
        pageSettings,
        currentFilePath || undefined,
        currentFileFormat
      );
    }, 4000);

    return () => clearTimeout(timer);
  }, [editor, isDirty, documentTitle, editRevision, pageSettings, currentFilePath, currentFileFormat]);

  // Check URL paths for Craft Anything routes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const path = window.location.pathname.toLowerCase();

    if (path.includes('spell-checker') || path.includes('grammar-checker')) {
      setShowSpellCheck(true);
    } else if (path.includes('word-counter')) {
      setShowWordCount(true);
    }
  }, []);

  const copiedFormatRef = useRef<any>(null);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Global exit shortcut
      if (e.altKey && (e.key === 'F4' || e.key === 'f4')) {
        e.preventDefault();
        requestWindowClose();
        return;
      }

      const isMod = e.ctrlKey || e.metaKey;

      if (!editor) return;

      if (isMod && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (e.shiftKey) {
          handleSaveAs();
        } else {
          handleSave();
        }
      } else if (isMod && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        handleOpenLocalFile();
      } else if (isMod && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        handleNewDocument();
      } else if (isMod && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handlePrint();
      } else if (isMod && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setNavDefaultTab('search');
        setNavSearchFocus('find');
        setShowNavSidebar(true);
      } else if (isMod && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        setNavDefaultTab('search');
        setNavSearchFocus('replace');
        setShowNavSidebar(true);
      } else if (isMod && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('Enter Web Address (URL):', previousUrl || 'https://');
        if (url !== null) {
          if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
          } else {
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
          }
        }
      } else if (isMod && e.key === 'Enter') {
        e.preventDefault();
        editor.chain().focus().setHorizontalRule().run();
      } else if (isMod && (e.key === ']' || (e.shiftKey && (e.key === '>' || e.key === '.')))) {
        e.preventDefault();
        (editor.commands as any).growFontSize?.();
      } else if (isMod && (e.key === '[' || (e.shiftKey && (e.key === '<' || e.key === ',')))) {
        e.preventDefault();
        (editor.commands as any).shrinkFontSize?.();
      } else if (isMod && e.code === 'Space') {
        e.preventDefault();
        editor.chain().focus().unsetAllMarks().run();
      } else if (isMod && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        // Word Format Painter Copy
        const textStyle = editor.getAttributes('textStyle');
        copiedFormatRef.current = {
          bold: editor.isActive('bold'),
          italic: editor.isActive('italic'),
          underline: editor.isActive('underline'),
          strike: editor.isActive('strike'),
          subscript: editor.isActive('subscript'),
          superscript: editor.isActive('superscript'),
          color: textStyle?.color,
          highlight: editor.getAttributes('highlight')?.color,
          fontSize: textStyle?.fontSize,
          fontFamily: textStyle?.fontFamily,
          lineHeight: editor.getAttributes('paragraph')?.lineHeight,
        };
      } else if (isMod && e.shiftKey && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        // Word Format Painter Paste
        if (copiedFormatRef.current) {
          const f = copiedFormatRef.current;
          const chain = editor.chain().focus();
          if (f.bold) chain.setBold(); else chain.unsetBold();
          if (f.italic) chain.setItalic(); else chain.unsetItalic();
          if (f.underline) chain.setUnderline(); else chain.unsetUnderline();
          if (f.strike) chain.setStrike(); else chain.unsetStrike();
          if (f.subscript) chain.setSubscript(); else chain.unsetSubscript();
          if (f.superscript) chain.setSuperscript(); else chain.unsetSuperscript();
          if (f.color) chain.setColor(f.color); else chain.unsetColor();
          if (f.highlight) chain.setHighlight({ color: f.highlight }); else chain.unsetHighlight();
          if (f.fontSize || f.fontFamily) {
            chain.setMark('textStyle', { fontSize: f.fontSize, fontFamily: f.fontFamily });
          }
          if (f.lineHeight) {
            chain.updateAttributes('paragraph', { lineHeight: f.lineHeight });
          }
          chain.run();
        }
      } else if (isMod && e.shiftKey && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        setShowWordCount(true);
      } else if (isMod && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        editor.chain().focus().setTextAlign('center').run();
      } else if (isMod && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        editor.chain().focus().setTextAlign('left').run();
      } else if (isMod && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        editor.chain().focus().setTextAlign('right').run();
      } else if (isMod && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        editor.chain().focus().setTextAlign('justify').run();
      } else if (isMod && e.key === '1') {
        e.preventDefault();
        (editor.commands as any).setLineHeight?.('1.0');
      } else if (isMod && e.key === '2') {
        e.preventDefault();
        (editor.commands as any).setLineHeight?.('2.0');
      } else if (isMod && e.key === '5') {
        e.preventDefault();
        (editor.commands as any).setLineHeight?.('1.5');
      } else if (isMod && (e.key === '=' || e.key === '+') && !e.shiftKey) {
        e.preventDefault();
        editor.chain().focus().toggleSubscript().run();
      } else if (isMod && e.shiftKey && (e.key === '+' || e.key === '=')) {
        e.preventDefault();
        editor.chain().focus().toggleSuperscript().run();
      } else if (e.shiftKey && e.key === 'F3') {
        e.preventDefault();
        (editor.commands as any).transformCase?.('title');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editor, documentTitle]);

  // Action handlers
  const handleOpenSearch = (mode: 'find' | 'replace' = 'find') => {
    setNavDefaultTab('search');
    setNavSearchFocus(mode);
    setShowNavSidebar(true);
  };

  const handleNewDocument = () => {
    if (!editor) return;
    if (isDirty) {
      const confirmLeave = window.confirm(
        'You have unsaved changes. Start a new blank document and keep the current work in recovery?'
      );
      if (!confirmLeave) return;
      StorageService.saveDraft(documentTitle, editor.getHTML(), editor.getJSON(), pageSettings);
    }
    editor.commands.setContent('<p></p>');
    setDocumentTitle('Document 1');
    setCurrentFilePath(null);
    setCurrentFileFormat('docx');
    setIsDirty(false);
  };

  const handleSelectTemplate = (template: DocumentTemplate) => {
    if (!editor) return;
    if (isDirty && !window.confirm('Replace the current document with this template and keep your work in recovery?')) return;
    if (isDirty) StorageService.saveDraft(documentTitle, editor.getHTML(), editor.getJSON(), pageSettings);
    editor.commands.setContent(template.contentHtml);
    setDocumentTitle(template.name);
    setCurrentFilePath(null);
    setCurrentFileFormat('docx');
    setIsDirty(true);
    StorageService.addRecentDocument(template.name, editor.getText(), undefined, editor.getHTML(), pageSettings);
    setRecentDocuments(StorageService.getRecentDocuments());
  };

  const handleOpenLocalFile = async () => {
    if (!editor) return;
    try {
      if (isDirty && !window.confirm('Discard unsaved changes and open another document?')) return;
      const fileData = await PlatformService.openFileDialog('.docx,.txt,.html');
      if (!fileData) return;

      const lowerName = fileData.name.toLowerCase();
      const isDocx = fileData.isBinary && lowerName.endsWith('.docx');
      const isHtml = lowerName.endsWith('.html') || lowerName.endsWith('.htm');

      if (isDocx) {
        const { html, warnings, pageSettings: importedPage } = await DocxService.importDocx(fileData.content as ArrayBuffer);
        editor.commands.setContent(html);
        if (importedPage) setPageSettings((prev) => ({ ...prev, ...importedPage }));
        if (warnings && warnings.length > 0) {
          const meaningful = warnings.filter((w) => !w.toLowerCase().includes('unrecognised style'));
          if (meaningful.length > 0) {
            console.info('[Wordo DOCX Import Info]:', meaningful.slice(0, 3).join('; '));
          }
        }
      } else if (typeof fileData.content === 'string') {
        if (isHtml) {
          editor.commands.setContent(fileData.content);
        } else {
          // Plain text: escape HTML-sensitive characters and preserve line breaks and empty paragraphs
          const escapeHtml = (str: string) =>
            str
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#039;');

          const paragraphs = fileData.content
            .split(/\r?\n/)
            .map((line) => (line.length === 0 ? '<p><br/></p>' : `<p>${escapeHtml(line)}</p>`))
            .join('');
          editor.commands.setContent(paragraphs || '<p><br/></p>');
        }
      }

      const cleanTitle = fileData.name.replace(/\.[^/.]+$/, '');
      setDocumentTitle(cleanTitle);

      if (isDocx) {
        // Existing DOCX opened from disk: preserve path so Save directly updates this DOCX
        setCurrentFilePath(fileData.path || null);
        setCurrentFileFormat('docx');
      } else {
        // Imported TXT or HTML: keep original intact on disk; Save creates a new Wordo DOCX copy
        setCurrentFilePath(null);
        setCurrentFileFormat('docx');
      }
      setIsDirty(false);

      StorageService.addRecentDocument(cleanTitle, editor.getText(), isDocx ? fileData.path : undefined, editor.getHTML(), pageSettings);
      setRecentDocuments(StorageService.getRecentDocuments());
    } catch (err: any) {
      alert(`Could not open document: ${err.message}`);
    }
  };

  const handleOpenRecent = async (recent: RecentDocument) => {
    if (!editor) return;
    if (isDirty) {
      const confirm = window.confirm('Discard unsaved changes and open recent document?');
      if (!confirm) return;
    }
    try {
      if (recent.filePath && PlatformService.isDesktop()) {
        try {
          const fileData = await PlatformService.readDocument(recent.filePath);
          const lowerName = (fileData.name || recent.filePath).toLowerCase();
          const isDocx = fileData.isBinary && lowerName.endsWith('.docx');
          const isHtml = lowerName.endsWith('.html') || lowerName.endsWith('.htm');

          let html = '';
          let importedPage: Partial<PageSettings> | undefined;
          if (isDocx) {
            const result = await DocxService.importDocx(fileData.content as ArrayBuffer);
            html = result.html;
            importedPage = result.pageSettings;
          } else if (isHtml) {
            html = fileData.content as string;
          } else {
            const escapeHtml = (str: string) =>
              str
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
            html = (fileData.content as string)
              .split(/\r?\n/)
              .map((line) => (line.length === 0 ? '<p><br/></p>' : `<p>${escapeHtml(line)}</p>`))
              .join('');
          }

          editor.commands.setContent(html);
          if (importedPage) setPageSettings((prev) => ({ ...prev, ...importedPage }));
          else if (recent.pageSettings) setPageSettings(recent.pageSettings);

          if (isDocx) {
            // Recent DOCX: preserve path so Save directly updates this DOCX
            setCurrentFilePath(recent.filePath);
            setCurrentFileFormat('docx');
          } else {
            // Recent TXT or HTML: keep original intact on disk; Save creates a new DOCX copy
            setCurrentFilePath(null);
            setCurrentFileFormat('docx');
          }
        } catch (readErr) {
          if (recent.contentHtml) {
            console.warn('Original file not found on disk, falling back to cached snapshot:', readErr);
            editor.commands.setContent(recent.contentHtml);
            if (recent.pageSettings) setPageSettings(recent.pageSettings);
            setCurrentFilePath(null);
            setCurrentFileFormat('docx');
          } else {
            throw new Error(`Original file could not be read: ${readErr}`);
          }
        }
      } else if (recent.contentHtml) {
        editor.commands.setContent(recent.contentHtml);
        if (recent.pageSettings) setPageSettings(recent.pageSettings);
        setCurrentFilePath(null);
        setCurrentFileFormat('docx');
      } else {
        alert('This recent entry has no saved content. Open the document from its original location.');
        return;
      }
      setDocumentTitle(recent.title);
      setIsDirty(false);
    } catch (err: any) {
      alert(`Could not reopen document: ${err.message || err}`);
    }
  };

  const handleSave = async (): Promise<boolean> => {
    if (!editor) return false;
    try {
      if (currentFilePath && currentFilePath.toLowerCase().endsWith('.docx')) {
        const saved = await DocxService.exportDocx(
          editor.getJSON(),
          editor.getHTML(),
          `${documentTitle}.docx`,
          pageSettings,
          currentFilePath
        );
        if (!saved) return false;
        setIsDirty(false);
        StorageService.discardRecoverableDraft(currentFilePath);
        StorageService.addRecentDocument(documentTitle, editor.getText(), currentFilePath, editor.getHTML(), pageSettings);
        setRecentDocuments(StorageService.getRecentDocuments());
        return true;
      } else {
        // Document has no path yet or was imported from TXT/HTML -> prompt Save As for new DOCX copy!
        return await handleSaveAs();
      }
    } catch (err: any) {
      alert(`Save error: ${err.message}`);
      return false;
    }
  };

  const handleSaveAs = async (): Promise<boolean> => {
    const newName = window.prompt('Enter file name for Save As:', documentTitle);
    if (!newName || !newName.trim()) return false;
    const cleanName = newName.trim().replace(/\.docx$/i, '');
    if (!editor) return false;
    try {
      const saved = await DocxService.exportDocx(editor.getJSON(), editor.getHTML(), `${cleanName}.docx`, pageSettings);
      if (!saved) return false;
      const savedPath = typeof saved === 'string' && PlatformService.isDesktop() ? saved : null;
      setDocumentTitle(cleanName);
      setCurrentFilePath(savedPath);
      setCurrentFileFormat('docx');
      setIsDirty(false);
      StorageService.discardRecoverableDraft(savedPath || undefined);
      StorageService.addRecentDocument(cleanName, editor.getText(), savedPath || undefined, editor.getHTML(), pageSettings);
      setRecentDocuments(StorageService.getRecentDocuments());
      return true;
    } catch (err: any) {
      alert(`Save error: ${err.message}`);
      return false;
    }
  };

  const handleExportDocx = async () => {
    if (!editor) return;
    await DocxService.exportDocx(editor.getJSON(), editor.getHTML(), `${documentTitle}.docx`, pageSettings);
  };

  const handleExportPdf = async () => {
    const canvas = document.getElementById('wordo-page-canvas');
    if (canvas) {
      await PdfService.exportPdf(canvas, `${documentTitle}.pdf`, pageSettings);
    } else {
      PdfService.printDocument();
    }
  };

  const handleExportHtml = () => {
    if (!editor) return;
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${documentTitle}</title></head><body>${editor.getHTML()}</body></html>`;
    PlatformService.saveFile(`${documentTitle}.html`, html, 'text/html');
  };

  const handleExportTxt = () => {
    if (!editor) return;
    const txt = editor.getText();
    PlatformService.saveFile(`${documentTitle}.txt`, txt, 'text/plain');
  };

  const handlePrint = () => {
    PdfService.printDocument();
  };

  const handleCloseDocument = () => {
    if (isDirty) {
      const confirm = window.confirm('Close document? Any unsaved changes will be saved to recovery.');
      if (!confirm) return;
      if (editor) StorageService.saveDraft(documentTitle, editor.getHTML(), editor.getJSON(), pageSettings);
    }
    if (!editor) return;
    editor.commands.setContent('<p></p>');
    setDocumentTitle('Document 1');
    setCurrentFilePath(null);
    setCurrentFileFormat('docx');
    setIsDirty(false);
  };

  const handleUpdatePageSettings = (newSettings: PageSettings) => {
    setPageSettings(newSettings);
    setIsDirty(true);
  };

  const handleConfirmSaveAndClose = async () => {
    const saved = await handleSave();
    if (saved) {
      setShowCloseConfirmModal(false);
      await performDirectClose();
    }
  };

  const handleConfirmCloseWithoutSaving = async () => {
    setShowCloseConfirmModal(false);
    StorageService.discardRecoverableDraft();
    await performDirectClose();
  };

  const handleRestoreDraft = () => {
    if (!editor || !activeRecoveryDraft) return;
    editor.commands.setContent(activeRecoveryDraft.contentHtml);
    if (activeRecoveryDraft.pageSettings) setPageSettings(activeRecoveryDraft.pageSettings);
    setDocumentTitle(activeRecoveryDraft.title);
    // If the draft was associated with an existing DOCX file, restore its path;
    // otherwise set to null so Save prompts Save As and never overwrites an unrelated file!
    const draftPath = activeRecoveryDraft.filePath;
    if (draftPath && draftPath.toLowerCase().endsWith('.docx')) {
      setCurrentFilePath(draftPath);
    } else {
      setCurrentFilePath(null);
    }
    setCurrentFileFormat('docx');
    setIsDirty(true);
    setActiveRecoveryDraft(null);
  };

  const handleDiscardDraft = () => {
    StorageService.discardRecoverableDraft();
    setActiveRecoveryDraft(null);
  };

  const handleToggleFormattingMark = (mark: 'bold' | 'italic' | 'underline') => {
    if (!editor) return;
    const { selection } = editor.state;
    if (selection.empty) {
      const { $from } = selection;
      const text = $from.parent.textBetween(0, $from.parent.content.size, undefined, '\uFFFC');
      const offset = $from.parentOffset;
      let start = offset;
      let end = offset;
      while (start > 0 && /\S/.test(text[start - 1])) start--;
      while (end < text.length && /\S/.test(text[end])) end++;
      if (start < end) {
        const from = $from.start() + start;
        const to = $from.start() + end;
        editor
          .chain()
          .focus()
          .setTextSelection({ from, to })
          .toggleMark(mark)
          .setTextSelection(selection.from)
          .run();
        return;
      }
    }
    if (mark === 'bold') editor.chain().focus().toggleBold().run();
    else if (mark === 'italic') editor.chain().focus().toggleItalic().run();
    else if (mark === 'underline') editor.chain().focus().toggleUnderline().run();
  };

  return (
    <div className="wordo-app-shell flex flex-col h-screen w-screen overflow-hidden bg-[var(--app-bg)] text-[var(--text-primary)] select-none">
      {/* 1. Desktop Window Title Bar */}
      {!isFocusMode && (
        <div className="no-print">
          <TitleBar
            documentTitle={documentTitle}
            isDirty={isDirty}
            theme={theme}
            onTitleChange={(title) => {
              setDocumentTitle(title);
              setIsDirty(true);
            }}
            onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            onOpenSearch={() => handleOpenSearch('find')}
            onRequestClose={requestWindowClose}
          />
        </div>
      )}

      {/* Focus Mode floating exit button */}
      {isFocusMode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 no-print">
          <button
            onClick={() => setIsFocusMode(false)}
            className="px-4 py-1.5 bg-neutral-900/90 hover:bg-black text-white rounded-full shadow-2xl text-xs font-medium flex items-center space-x-2 backdrop-blur-xs transition-transform hover:scale-105 border border-white/20"
          >
            <span>Exit Focus Mode</span>
            <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px]">Esc</span>
          </button>
        </div>
      )}

      {/* 2. Office 365 Ribbon Toolbar (Unified with Backstage) */}
      {!isFocusMode && (
        <div className="no-print relative z-50 overflow-visible">
          <RibbonToolbar
            editor={editor}
            onOpenFileMenu={() => setShowBackstage(true)}
            onNew={handleNewDocument}
            onNewFromTemplate={handleSelectTemplate}
            onOpen={handleOpenLocalFile}
            onOpenRecent={handleOpenRecent}
            recentDocuments={recentDocuments}
            onSave={handleSave}
            onSaveAs={handleSaveAs}
            onExportDocx={handleExportDocx}
            onExportPdf={handleExportPdf}
            onExportHtml={handleExportHtml}
            onExportTxt={handleExportTxt}
            onPrint={handlePrint}
            onCloseDocument={handleCloseDocument}
            onOpenAbout={() => setShowAboutModal(true)}
            onOpenShortcuts={() => setShowShortcutsModal(true)}
            onOpenSearch={handleOpenSearch}
            onOpenSpellCheck={() => setShowSpellCheck(true)}
            onOpenWordCount={() => setShowWordCount(true)}
            onOpenRecovery={() => {
              const draft = StorageService.getRecoverableDraft();
              if (draft) setActiveRecoveryDraft(draft);
            }}
            onOpenSettings={() => setShowSettingsModal(true)}
            currentZoom={zoom}
            onZoomChange={setZoom}
            showRuler={showRuler}
            onToggleRuler={() => setShowRuler(!showRuler)}
            showNavSidebar={showNavSidebar}
            onToggleNavSidebar={() => setShowNavSidebar(!showNavSidebar)}
            pageSettings={pageSettings}
            onUpdatePageSettings={handleUpdatePageSettings}
            onOpenSymbolModal={() => setShowSymbolModal(true)}
            onOpenDateTimeModal={() => setShowDateTimeModal(true)}
            onOpenCitationModal={() => setShowCitationModal(true)}
            onOpenTranslateModal={() => setShowTranslateModal(true)}
            onOpenAccessibilityModal={() => setShowAccessibilityModal(true)}
            onToggleReadAloud={() => setIsReadAloudOpen(!isReadAloudOpen)}
            isReadAloudOpen={isReadAloudOpen}
            onToggleFocusMode={() => setIsFocusMode(!isFocusMode)}
            isFocusMode={isFocusMode}
            paperTheme={paperTheme}
            onSetPaperTheme={setPaperTheme}
          />
        </div>
      )}

      {/* Read Aloud Text-to-Speech Control Bar */}
      <div className="no-print">
        <ReadAloudBar
          isOpen={isReadAloudOpen}
          onClose={() => setIsReadAloudOpen(false)}
          editor={editor}
        />
      </div>

      {/* 4. Document Recovery Alert Banner */}
      {activeRecoveryDraft && !isFocusMode && (
        <div className="no-print">
          <RecoveryBanner
            draft={activeRecoveryDraft}
            onRestore={handleRestoreDraft}
            onDiscard={handleDiscardDraft}
          />
        </div>
      )}

      {/* 5. Horizontal Ruler */}
      {showRuler && !isFocusMode && (
        <div className="no-print">
          <Ruler
            pageWidth={
              (pageSettings.orientation === 'landscape'
                ? pageSettings.size === 'a4'
                  ? 1123
                  : pageSettings.size === 'legal'
                  ? 1344
                  : 1056
                : pageSettings.size === 'a4'
                ? 794
                : 816) *
              (zoom / 100)
            }
            marginLeft={pageSettings.margins.left * (zoom / 100)}
            marginRight={pageSettings.margins.right * (zoom / 100)}
            onMarginChange={(newLeft, newRight) => {
              const scale = zoom / 100;
              handleUpdatePageSettings({
                ...pageSettings,
                margins: {
                  ...pageSettings.margins,
                  left: Math.round(newLeft / scale),
                  right: Math.round(newRight / scale),
                },
              });
            }}
          />
        </div>
      )}

      {/* 6. Workspace Body (Navigation Sidebar + Editor Canvas + Proofing Panel) */}
      <div className="wordo-workspace flex-1 flex overflow-hidden relative z-0">
        {/* Navigation Sidebar */}
        {showNavSidebar && !isFocusMode && (
          <div className="no-print">
            <NavigationSidebar
              editor={editor}
              defaultTab={navDefaultTab}
              initialSearchFocus={navSearchFocus}
              onClose={() => setShowNavSidebar(false)}
            />
          </div>
        )}

        {/* Multi-Page Document Canvas */}
        <EditorCanvas
          editor={editor}
          zoom={zoom}
          documentTitle={documentTitle}
          pageSettings={pageSettings}
          onUpdatePageSettings={handleUpdatePageSettings}
          paperTheme={paperTheme}
          onOpenTranslate={(text) => {
            setShowTranslateModal(true);
          }}
          onReadAloud={() => {
            setIsReadAloudOpen(true);
          }}
        />

        {/* Proofing / Spell Check Assistant */}
        {showSpellCheck && !isFocusMode && (
          <div className="no-print">
            <SpellCheckPanel
              editor={editor}
              issues={spellIssues}
              onRefresh={() => updateDocumentStats(editor)}
              onClose={() => setShowSpellCheck(false)}
            />
          </div>
        )}
      </div>

      {/* 7. Bottom Status Bar */}
      {!isFocusMode && (
        <div className="no-print">
          <StatusBar
            wordCount={stats.words}
            charCount={stats.characters}
            issueCount={spellIssues.length}
            zoom={zoom}
            onZoomChange={setZoom}
            onOpenWordCount={() => setShowWordCount(true)}
            onOpenSpellCheck={() => setShowSpellCheck(true)}
            isDirty={isDirty}
            onToggleFocusMode={() => setIsFocusMode(!isFocusMode)}
            isFocusMode={isFocusMode}
          />
        </div>
      )}

      {/* Dialog Modals */}
      <BackstageView
        isOpen={showBackstage}
        onClose={() => setShowBackstage(false)}
        onNew={() => {
          setShowBackstage(false);
          handleNewDocument();
        }}
        onNewFromTemplate={(tmpl) => {
          setShowBackstage(false);
          handleSelectTemplate(tmpl);
        }}
        onOpenLocalFile={() => {
          setShowBackstage(false);
          handleOpenLocalFile();
        }}
        onOpenRecent={(doc) => {
          setShowBackstage(false);
          handleOpenRecent(doc);
        }}
        recentDocuments={recentDocuments}
        onSave={handleSave}
        onSaveAs={handleSaveAs}
        onExportDocx={handleExportDocx}
        onExportPdf={handleExportPdf}
        onExportHtml={handleExportHtml}
        onExportTxt={handleExportTxt}
        onPrint={handlePrint}
        onCloseDocument={handleCloseDocument}
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenAbout={() => setShowAboutModal(true)}
        onOpenShortcuts={() => setShowShortcutsModal(true)}
        onOpenRecovery={() => {
          const draft = StorageService.getRecoverableDraft();
          if (draft) setActiveRecoveryDraft(draft);
          else alert('No recovery drafts currently stored.');
        }}
        documentTitle={documentTitle}
        stats={stats}
        currentFilePath={currentFilePath}
      />

      {showWordCount && (
        <WordCountDialog stats={stats} onClose={() => setShowWordCount(false)} />
      )}

      <TemplateModal
        isOpen={showTemplateModal}
        onSelectTemplate={handleSelectTemplate}
        onOpenLocalFile={handleOpenLocalFile}
        onClose={() => setShowTemplateModal(false)}
      />

      <ShortcutsModal
        isOpen={showShortcutsModal}
        onClose={() => setShowShortcutsModal(false)}
      />

      <AboutModal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
      />

      <DocumentSettingsModal
        isOpen={showSettingsModal}
        settings={pageSettings}
        onSaveSettings={handleUpdatePageSettings}
        onClose={() => setShowSettingsModal(false)}
      />

      {/* Insert Modals */}
      <InsertSymbolModal
        isOpen={showSymbolModal}
        onClose={() => setShowSymbolModal(false)}
        editor={editor}
      />

      <InsertDateTimeModal
        isOpen={showDateTimeModal}
        onClose={() => setShowDateTimeModal(false)}
        editor={editor}
      />

      {/* References & Review Modals */}
      <CitationModal
        isOpen={showCitationModal}
        onClose={() => setShowCitationModal(false)}
        editor={editor}
      />

      <TranslateModal
        isOpen={showTranslateModal}
        onClose={() => setShowTranslateModal(false)}
        editor={editor}
      />

      <AccessibilityModal
        isOpen={showAccessibilityModal}
        onClose={() => setShowAccessibilityModal(false)}
        editor={editor}
      />

      {/* Close Document Confirmation Dialog */}
      <CloseConfirmModal
        isOpen={showCloseConfirmModal}
        documentTitle={documentTitle}
        onSave={handleConfirmSaveAndClose}
        onCloseWithoutSaving={handleConfirmCloseWithoutSaving}
        onCancel={() => setShowCloseConfirmModal(false)}
      />
    </div>
  );
};
