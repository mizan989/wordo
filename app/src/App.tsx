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

import { TitleBar } from './components/TitleBar';
import { MenuBar } from './components/MenuBar';
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
  const [isDirty, setIsDirty] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => StorageService.getSavedTheme());
  const [zoom, setZoom] = useState(100);
  const [showRuler, setShowRuler] = useState(true);
  const [showNavSidebar, setShowNavSidebar] = useState(false);
  const [navDefaultTab, setNavDefaultTab] = useState<'outline' | 'search'>('outline');
  const [showSpellCheck, setShowSpellCheck] = useState(false);
  const [showWordCount, setShowWordCount] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

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
    showPageNumbers: true,
  });

  // Apply dark theme class to root html element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    StorageService.saveTheme(theme);
  }, [theme]);

  // Initial template (Project proposal as rich default)
  const initialContent = DOCUMENT_TEMPLATES.find((t) => t.id === 'business-proposal')?.contentHtml || '<p>Welcome to Word-Client</p>';

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
          class: 'text-[#185abd] underline cursor-pointer',
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
    ],
    content: initialContent,
    autofocus: true,
    onUpdate: ({ editor: ed }) => {
      setIsDirty(true);
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

  // Check for recovery draft on startup
  useEffect(() => {
    const draft = StorageService.getRecoverableDraft();
    if (draft) {
      setActiveRecoveryDraft(draft);
    }
  }, []);

  // Autosave periodically (every 4 seconds if dirty)
  useEffect(() => {
    if (!editor || !isDirty) return;

    const timer = setTimeout(() => {
      const html = editor.getHTML();
      const json = editor.getJSON();
      StorageService.saveDraft(documentTitle, html, json);
    }, 4000);

    return () => clearTimeout(timer);
  }, [editor, isDirty, documentTitle]);

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
  const handleNewDocument = () => {
    if (!editor) return;
    if (isDirty) {
      const confirmLeave = window.confirm(
        'You have unsaved changes. Do you want to create a new blank document?'
      );
      if (!confirmLeave) return;
    }
    editor.commands.setContent('<p></p>');
    setDocumentTitle('Document 1');
    setIsDirty(false);
  };

  const handleSelectTemplate = (template: DocumentTemplate) => {
    if (!editor) return;
    editor.commands.setContent(template.contentHtml);
    setDocumentTitle(template.name);
    setIsDirty(true);
    StorageService.addRecentDocument(template.name, editor.getText());
    setRecentDocuments(StorageService.getRecentDocuments());
  };

  const handleOpenLocalFile = async () => {
    if (!editor) return;
    try {
      const fileData = await PlatformService.openFileDialog('.docx,.txt,.html');
      if (!fileData) return;

      if (fileData.isBinary && fileData.name.toLowerCase().endsWith('.docx')) {
        const { html } = await DocxService.importDocx(fileData.content as ArrayBuffer);
        editor.commands.setContent(html);
      } else if (typeof fileData.content === 'string') {
        if (fileData.name.toLowerCase().endsWith('.html') || fileData.content.includes('<p>')) {
          editor.commands.setContent(fileData.content);
        } else {
          // Plain text: split by lines
          const paragraphs = fileData.content
            .split('\n')
            .map((line) => `<p>${line || '<br/>'}</p>`)
            .join('');
          editor.commands.setContent(paragraphs);
        }
      }

      const cleanTitle = fileData.name.replace(/\.[^/.]+$/, '');
      setDocumentTitle(cleanTitle);
      setIsDirty(false);

      StorageService.addRecentDocument(cleanTitle, editor.getText());
      setRecentDocuments(StorageService.getRecentDocuments());
    } catch (err: any) {
      alert(`Could not open document: ${err.message}`);
    }
  };

  const handleOpenRecent = (recent: RecentDocument) => {
    if (!editor) return;
    if (isDirty) {
      const confirm = window.confirm('Discard unsaved changes and open recent document?');
      if (!confirm) return;
    }
    setDocumentTitle(recent.title);
    setIsDirty(false);
  };

  const handleSave = async () => {
    if (!editor) return;
    try {
      await DocxService.exportDocx(editor.getJSON(), editor.getHTML(), `${documentTitle}.docx`, pageSettings);
      setIsDirty(false);
      StorageService.discardRecoverableDraft();
      StorageService.addRecentDocument(documentTitle, editor.getText());
      setRecentDocuments(StorageService.getRecentDocuments());
    } catch (err: any) {
      alert(`Save error: ${err.message}`);
    }
  };

  const handleSaveAs = async () => {
    const newName = window.prompt('Enter file name for Save As:', documentTitle);
    if (!newName || !newName.trim()) return;
    const cleanName = newName.trim().replace(/\.docx$/i, '');
    setDocumentTitle(cleanName);
    if (!editor) return;
    try {
      await DocxService.exportDocx(editor.getJSON(), editor.getHTML(), `${cleanName}.docx`, pageSettings);
      setIsDirty(false);
      StorageService.addRecentDocument(cleanName, editor.getText());
      setRecentDocuments(StorageService.getRecentDocuments());
    } catch (err: any) {
      alert(`Save error: ${err.message}`);
    }
  };

  const handleExportDocx = async () => {
    if (!editor) return;
    await DocxService.exportDocx(editor.getJSON(), editor.getHTML(), `${documentTitle}.docx`, pageSettings);
  };

  const handleExportPdf = async () => {
    const pageElement = document.getElementById('word-client-page-canvas');
    if (pageElement) {
      await PdfService.exportPdf(pageElement, `${documentTitle}.pdf`);
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
    }
    handleNewDocument();
  };

  const handleRestoreDraft = () => {
    if (!editor || !activeRecoveryDraft) return;
    editor.commands.setContent(activeRecoveryDraft.contentHtml);
    setDocumentTitle(activeRecoveryDraft.title);
    setIsDirty(true);
    setActiveRecoveryDraft(null);
  };

  const handleDiscardDraft = () => {
    StorageService.discardRecoverableDraft();
    setActiveRecoveryDraft(null);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#f5f5f5] dark:bg-[#1f1f1f] text-[#242424] dark:text-[#cccccc] select-none">
      {/* 1. Desktop Window Title Bar */}
      <TitleBar
        documentTitle={documentTitle}
        isDirty={isDirty}
        theme={theme}
        onTitleChange={setDocumentTitle}
        onNew={handleNewDocument}
        onOpen={handleOpenLocalFile}
        onSave={handleSave}
        onUndo={() => editor?.chain().focus().undo().run()}
        onRedo={() => editor?.chain().focus().redo().run()}
        onPrint={handlePrint}
        onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        canUndo={editor?.can().undo() ?? false}
        canRedo={editor?.can().redo() ?? false}
      />

      {/* 2. Main Menu Bar */}
      <MenuBar
        onNew={handleNewDocument}
        onNewFromTemplate={() => setShowTemplateModal(true)}
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
        onUndo={() => editor?.chain().focus().undo().run()}
        onRedo={() => editor?.chain().focus().redo().run()}
        onCut={() => document.execCommand('cut')}
        onCopy={() => document.execCommand('copy')}
        onPaste={() => navigator.clipboard.readText().then((t) => editor?.commands.insertContent(t))}
        onSelectAll={() => editor?.chain().focus().selectAll().run()}
        onFind={() => {
          setNavDefaultTab('search');
          setShowNavSidebar(true);
        }}
        onClearFormat={() => editor?.chain().focus().unsetAllMarks().clearNodes().run()}
        onInsertTable={(r, c) => editor?.chain().focus().insertTable({ rows: r, cols: c }).run()}
        onInsertImage={() => {
          const url = window.prompt('Enter Image URL:');
          if (url) editor?.chain().focus().setImage({ src: url }).run();
        }}
        onInsertLink={() => {
          const url = window.prompt('Enter Link URL:');
          if (url) editor?.chain().focus().setLink({ href: url }).run();
        }}
        onInsertPageBreak={() => editor?.chain().focus().setHorizontalRule().run()}
        onInsertHorizontalRule={() => editor?.chain().focus().setHorizontalRule().run()}
        onInsertBlockquote={() => editor?.chain().focus().toggleBlockquote().run()}
        onInsertTaskList={() => editor?.chain().focus().toggleTaskList().run()}
        onFormatBold={() => editor?.chain().focus().toggleBold().run()}
        onFormatItalic={() => editor?.chain().focus().toggleItalic().run()}
        onFormatUnderline={() => editor?.chain().focus().toggleUnderline().run()}
        onFormatAlign={(align) => editor?.chain().focus().setTextAlign(align).run()}
        onZoomChange={setZoom}
        onToggleRuler={() => setShowRuler(!showRuler)}
        showRuler={showRuler}
        onToggleNavSidebar={() => setShowNavSidebar(!showNavSidebar)}
        showNavSidebar={showNavSidebar}
        onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        onOpenWordCount={() => setShowWordCount(true)}
        onOpenSpellCheck={() => setShowSpellCheck(true)}
        onOpenRecovery={() => {
          const draft = StorageService.getRecoverableDraft();
          if (draft) setActiveRecoveryDraft(draft);
          else alert('No recovery drafts currently stored.');
        }}
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenAbout={() => setShowAboutModal(true)}
        onOpenShortcuts={() => setShowShortcutsModal(true)}
      />

      {/* 3. Office-Style Ribbon Toolbar */}
      <RibbonToolbar
        editor={editor}
        onOpenSearch={() => {
          setNavDefaultTab('search');
          setShowNavSidebar(true);
        }}
        onOpenSpellCheck={() => setShowSpellCheck(true)}
        onOpenWordCount={() => setShowWordCount(true)}
        onOpenRecovery={() => {
          const draft = StorageService.getRecoverableDraft();
          if (draft) setActiveRecoveryDraft(draft);
        }}
        onExportDocx={handleExportDocx}
        onExportPdf={handleExportPdf}
        onOpenSettings={() => setShowSettingsModal(true)}
        currentZoom={zoom}
        onZoomChange={setZoom}
        showRuler={showRuler}
        onToggleRuler={() => setShowRuler(!showRuler)}
        showNavSidebar={showNavSidebar}
        onToggleNavSidebar={() => setShowNavSidebar(!showNavSidebar)}
        pageSettings={pageSettings}
        onUpdatePageSettings={setPageSettings}
      />

      {/* 4. Document Recovery Alert Banner */}
      {activeRecoveryDraft && (
        <RecoveryBanner
          draft={activeRecoveryDraft}
          onRestore={handleRestoreDraft}
          onDiscard={handleDiscardDraft}
        />
      )}

      {/* 5. Horizontal Ruler */}
      {showRuler && (
        <Ruler
          pageWidth={(pageSettings.orientation === 'landscape' ? 1056 : 816) * (zoom / 100)}
          marginLeft={pageSettings.margins.left * (zoom / 100)}
          marginRight={pageSettings.margins.right * (zoom / 100)}
          onMarginChange={(newLeft, newRight) => {
            const scale = zoom / 100;
            setPageSettings({
              ...pageSettings,
              margins: {
                ...pageSettings.margins,
                left: Math.round(newLeft / scale),
                right: Math.round(newRight / scale),
              },
            });
          }}
        />
      )}

      {/* 6. Workspace Body (Navigation Sidebar + Editor Canvas + Proofing Panel) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Navigation Sidebar */}
        {showNavSidebar && (
          <NavigationSidebar
            editor={editor}
            defaultTab={navDefaultTab}
            onClose={() => setShowNavSidebar(false)}
          />
        )}

        {/* Multi-Page Document Canvas */}
        <EditorCanvas
          editor={editor}
          zoom={zoom}
          documentTitle={documentTitle}
          totalPages={Math.max(1, Math.ceil(stats.words / 450))}
          pageSettings={pageSettings}
          onUpdatePageSettings={setPageSettings}
        />

        {/* Proofing / Spell Check Assistant */}
        {showSpellCheck && (
          <SpellCheckPanel
            editor={editor}
            issues={spellIssues}
            onRefresh={() => updateDocumentStats(editor)}
            onClose={() => setShowSpellCheck(false)}
          />
        )}
      </div>

      {/* 7. Bottom Status Bar */}
      <StatusBar
        currentPage={1}
        totalPages={Math.max(1, Math.ceil(stats.words / 450))}
        wordCount={stats.words}
        charCount={stats.characters}
        issueCount={spellIssues.length}
        zoom={zoom}
        onZoomChange={setZoom}
        onOpenWordCount={() => setShowWordCount(true)}
        onOpenSpellCheck={() => setShowSpellCheck(true)}
        isDirty={isDirty}
      />

      {/* Dialog Modals */}
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
        onSaveSettings={setPageSettings}
        onClose={() => setShowSettingsModal(false)}
      />
    </div>
  );
};
