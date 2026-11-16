import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Editor, EditorContent } from '@tiptap/react';
import { PageSettings } from '../types';
import { FloatingMiniToolbar } from './FloatingMiniToolbar';
import { EditorContextMenu } from './EditorContextMenu';

interface EditorCanvasProps {
  editor: Editor | null;
  zoom: number;
  documentTitle: string;
  pageSettings?: PageSettings;
  onUpdatePageSettings?: (settings: PageSettings) => void;
  paperTheme?: 'white' | 'dark' | 'sepia';
  onOpenTranslate?: (text: string) => void;
  onReadAloud?: (text: string) => void;
}

interface PageBreakInfo {
  top: number;
  pageNumber: number;
}

export const EditorCanvas: React.FC<EditorCanvasProps> = ({
  editor,
  zoom,
  documentTitle,
  pageSettings,
  onUpdatePageSettings,
  paperTheme = 'white',
  onOpenTranslate,
  onReadAloud,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentAreaRef = useRef<HTMLDivElement>(null);
  const [editingHeader, setEditingHeader] = useState(false);
  const [editingFooter, setEditingFooter] = useState(false);
  const [headerVal, setHeaderVal] = useState('');
  const [footerVal, setFooterVal] = useState('');
  const [pageBreaks, setPageBreaks] = useState<PageBreakInfo[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [contextMenu, setContextMenu] = useState<{ isOpen: boolean; x: number; y: number }>({
    isOpen: false,
    x: 0,
    y: 0,
  });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!editor) return;

    const coords = { left: e.clientX, top: e.clientY };
    const pos = editor.view.posAtCoords(coords);
    const { selection } = editor.state;

    if (pos && (selection.empty || pos.pos < selection.from || pos.pos > selection.to)) {
      editor.chain().focus().setTextSelection(pos.pos).run();
    }

    setContextMenu({
      isOpen: true,
      x: e.clientX,
      y: e.clientY,
    });
  };

  // Standard Letter / A4 / Legal page dimension at 96 DPI
  const paperDimensions =
    pageSettings?.size === 'a4'
      ? [794, 1123]
      : pageSettings?.size === 'legal'
      ? [816, 1344]
      : [816, 1056];
  const isLandscape = pageSettings?.orientation === 'landscape';
  const pageWidthPx = isLandscape ? paperDimensions[1] : paperDimensions[0];
  const pageMinHeightPx = isLandscape ? paperDimensions[0] : paperDimensions[1];

  const marginTop = pageSettings?.margins?.top ?? 96;
  const marginBottom = pageSettings?.margins?.bottom ?? 96;
  const marginLeft = pageSettings?.margins?.left ?? 64;
  const marginRight = pageSettings?.margins?.right ?? 64;

  const deskGap = 32;
  const breakGapTotal = marginBottom + deskGap + marginTop;

  const headerLeftText = (pageSettings?.headerLeft ?? pageSettings?.headerText ?? '').replace('{title}', documentTitle);
  const headerRightText = pageSettings?.headerRight ?? '';
  const footerLeftText = pageSettings?.footerLeft ?? pageSettings?.footerText ?? '';
  const footerRightText = pageSettings?.footerRight ?? '';
  const showPageNumbers = pageSettings?.showPageNumbers !== false;

  const pageBgColor =
    paperTheme === 'sepia'
      ? '#fbf0d9'
      : paperTheme === 'dark'
      ? '#1e1e1e'
      : pageSettings?.pageColor || '#ffffff';
  const watermarkText = pageSettings?.watermarkText;

  const isDarkPageBg = (hex: string) => {
    const c = hex.replace('#', '');
    if (c.length !== 6) return false;
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.45;
  };

  const isDarkPage = isDarkPageBg(pageBgColor);
  const isSepiaPage = paperTheme === 'sepia';

  const getEffectiveSettings = (): PageSettings => {
    return (
      pageSettings || {
        size: 'a4',
        orientation: 'portrait',
        margins: { top: 96, bottom: 96, left: 96, right: 96 },
        showPageNumbers: true,
      }
    );
  };

  const paperName = pageSettings?.size === 'a4' ? 'A4' : pageSettings?.size === 'legal' ? 'Legal' : 'Letter';
  const printOrientation = isLandscape ? 'landscape' : 'portrait';

  // Usable vertical content height per page
  const pageContentHeight = Math.max(300, pageMinHeightPx - marginTop - marginBottom);

  /**
   * Recalculates page flow and margins without inserting unmanaged foreign DOM nodes into ProseMirror.
   * Modifies CSS margins on block elements so text flows across pages naturally,
   * while rendering page break dividers (footer, desk gap, header) in non-intrusive overlays.
   */
  const recalculatePagination = useCallback(() => {
    if (!editor || !contentAreaRef.current) return;
    const pmRoot = contentAreaRef.current.querySelector('.ProseMirror') as HTMLElement | null;
    if (!pmRoot) return;

    const children = Array.from(pmRoot.children) as HTMLElement[];
    if (children.length === 0) {
      setPageBreaks([]);
      setTotalPages(1);
      return;
    }

    // Step 1: Reset dynamic top margins and manual break heights before measuring
    for (const child of children) {
      child.style.marginTop = '';
      if (child.hasAttribute('data-wordo-page-break') || child.classList.contains('wordo-page-break')) {
        child.style.height = '';
      }
    }

    // Step 2: Measure blocks and compute break points
    let currentTop = 0;
    let pageCount = 1;
    const newBreaks: PageBreakInfo[] = [];

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const isManualBreak =
        child.hasAttribute('data-wordo-page-break') || child.classList.contains('wordo-page-break');

      if (isManualBreak) {
        const remaining = Math.max(0, pageContentHeight - (currentTop % pageContentHeight));
        child.style.height = `${remaining + breakGapTotal}px`;
        child.style.boxSizing = 'border-box';
        child.style.border = 'none';

        newBreaks.push({
          top: currentTop + remaining,
          pageNumber: pageCount,
        });

        pageCount++;
        currentTop = 0;
      } else {
        const childHeight = child.offsetHeight;

        if (currentTop > 0 && currentTop + childHeight > pageContentHeight) {
          // Automatic page break needed before this element
          const remaining = Math.max(0, pageContentHeight - currentTop);
          child.style.marginTop = `${remaining + breakGapTotal}px`;

          newBreaks.push({
            top: currentTop + remaining,
            pageNumber: pageCount,
          });

          pageCount++;
          currentTop = childHeight;
        } else {
          currentTop += childHeight;
        }
      }
    }

    setPageBreaks(newBreaks);
    setTotalPages(pageCount);
  }, [editor, pageContentHeight, breakGapTotal]);

  // Recalculate pagination on content changes and window resize
  useEffect(() => {
    if (!editor) return;

    const timer = setTimeout(() => {
      recalculatePagination();
    }, 40);

    const handleUpdate = () => {
      recalculatePagination();
    };

    const handleFocus = () => {
      setEditingHeader(false);
      setEditingFooter(false);
    };

    editor.on('update', handleUpdate);
    editor.on('focus', handleFocus);
    window.addEventListener('resize', handleUpdate);

    return () => {
      clearTimeout(timer);
      editor.off('update', handleUpdate);
      editor.off('focus', handleFocus);
      window.removeEventListener('resize', handleUpdate);
    };
  }, [editor, recalculatePagination]);

  if (!editor) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Loading editor...
      </div>
    );
  }

  const canvasHeight = Math.max(
    pageMinHeightPx,
    totalPages * pageMinHeightPx + (totalPages - 1) * deskGap
  );

  return (
    <div
      ref={containerRef}
      onContextMenu={handleContextMenu}
      className="wordo-canvas-scroll flex-1 overflow-auto bg-[var(--app-bg)] p-8 flex flex-col items-center transition-colors print:p-0 print:bg-white relative"
    >
      <style>{`
        @media print {
          @page {
            size: ${paperName} ${printOrientation};
            margin: 0;
          }
          .wordo-page-break {
            break-before: page !important;
            page-break-before: always !important;
            height: 0 !important;
            min-height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
          }
          .wordo-page-overlay-break {
            display: none !important;
          }
        }
      `}</style>

      {/* Floating Selection Mini Toolbar */}
      <FloatingMiniToolbar editor={editor} />

      {/* Right Click Tool Menu (MS Word Context Menu) */}
      <EditorContextMenu
        editor={editor}
        isOpen={contextMenu.isOpen}
        x={contextMenu.x}
        y={contextMenu.y}
        onClose={() => setContextMenu((prev) => ({ ...prev, isOpen: false }))}
        onOpenTranslate={onOpenTranslate}
        onReadAloud={onReadAloud}
      />

      {/* Zoom transform container */}
      <div
        style={{
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'top center',
          transition: 'transform 0.1s ease-out',
        }}
        className="wordo-print-scale flex flex-col items-center space-y-8 pb-16 print:space-y-0 print:pb-0"
      >
        {/* Document Page Canvas */}
        <div
          id="wordo-page-canvas"
          className={`border border-[var(--border-color)] print:border-none print:shadow-none print-page relative flex flex-col transition-colors overflow-visible ${
            isSepiaPage
              ? 'text-[#382e20]'
              : isDarkPage
              ? 'text-[#f1f5f9] dark-page-mode'
              : 'text-[#1D1D1F]'
          }`}
          style={{
            width: `${pageWidthPx}px`,
            minHeight: `${canvasHeight}px`,
            backgroundColor: pageBgColor,
            boxShadow: 'var(--shadow-sheet)',
            borderRadius: '2px',
            boxSizing: 'border-box',
            ['--page-bg' as any]: pageBgColor,
          }}
        >
          {/* Watermark Overlay (if configured) */}
          {watermarkText && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
              <span
                className="text-gray-400/20 font-bold tracking-widest uppercase transform -rotate-45"
                style={{
                  fontSize: `${Math.max(48, Math.min(110, 800 / (watermarkText.length || 1)))}px`,
                  letterSpacing: '0.2em',
                }}
              >
                {watermarkText}
              </span>
            </div>
          )}

          {/* Page 1 Header (margin zone) */}
          <div
            onDoubleClick={() => {
              if (pageSettings?.headerText || headerLeftText) {
                setHeaderVal(pageSettings?.headerText || headerLeftText);
                setEditingHeader(true);
              } else {
                editor.chain().focus('start').run();
              }
            }}
            onClick={() => {
              if (!pageSettings?.headerText && !headerLeftText) {
                editor.chain().focus('start').run();
              }
            }}
            title={headerLeftText ? "Double-click to edit header" : undefined}
            className={`flex items-center justify-between text-[11px] text-gray-400 border-b border-transparent ${
              headerLeftText ? 'hover:border-gray-300 cursor-pointer' : 'cursor-text'
            } select-none transition-colors relative z-10`}
            style={{
              paddingTop: `${Math.max(16, marginTop / 4)}px`,
              paddingBottom: '8px',
              paddingLeft: `${marginLeft}px`,
              paddingRight: `${marginRight}px`,
            }}
          >
            {editingHeader ? (
              <div className="flex items-center space-x-2 w-full print:hidden" onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  autoFocus
                  value={headerVal}
                  onChange={(e) => setHeaderVal(e.target.value)}
                  onBlur={() => {
                    if (onUpdatePageSettings) {
                      onUpdatePageSettings({
                        ...getEffectiveSettings(),
                        headerText: headerVal,
                        headerLeft: headerVal,
                      });
                    }
                    setEditingHeader(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      (e.target as HTMLInputElement).blur();
                    } else if (e.key === 'Escape') {
                      setEditingHeader(false);
                    }
                  }}
                  className="px-1 py-0.5 border-b border-gray-300 bg-transparent text-xs w-full text-[#1D1D1F] outline-none"
                  placeholder="Enter page header text..."
                />
              </div>
            ) : (
              <>
                <span className="truncate max-w-[300px]">{headerLeftText}</span>
                <span>{headerRightText}</span>
              </>
            )}
          </div>

          {/* Editable Document Body */}
          <div
            ref={contentAreaRef}
            onClick={(e) => {
              if (editingHeader) setEditingHeader(false);
              if (editingFooter) setEditingFooter(false);
              if (e.target === e.currentTarget) {
                editor.chain().focus('end').run();
              }
            }}
            className="flex-1 cursor-text transition-all min-h-[600px] relative z-10"
            style={{
              paddingTop: `${Math.max(16, marginTop / 2)}px`,
              paddingBottom: `${Math.max(16, marginBottom / 2)}px`,
              paddingLeft: `${marginLeft}px`,
              paddingRight: `${marginRight}px`,
            }}
          >
            <EditorContent editor={editor} className="tiptap-content font-sans text-sm min-h-[500px]" />
          </div>

          {/* Page Break Overlays (Page footers, physical desk gaps, page headers between pages) */}
          {Array.from({ length: Math.max(0, totalPages - 1) }).map((_, idx) => {
            const pageNum = idx + 1;
            const topOffset = pageNum * pageMinHeightPx + idx * deskGap - marginBottom;
            return (
              <div
                key={`page_break_${pageNum}`}
                className="wordo-page-overlay-break absolute left-0 right-0 pointer-events-none select-none z-20 flex flex-col justify-between"
                style={{
                  top: `${topOffset}px`,
                  height: `${breakGapTotal}px`,
                }}
              >
                {/* Footer of ending page */}
                <div
                  className="flex items-center justify-between text-[11px] text-[var(--text-muted)] py-1 border-t border-[var(--border-subtle)]"
                  style={{
                    paddingLeft: `${marginLeft}px`,
                    paddingRight: `${marginRight}px`,
                    height: `${marginBottom}px`,
                    boxSizing: 'border-box',
                  }}
                >
                  <span>{footerLeftText}</span>
                  <span>{showPageNumbers ? `Page ${pageNum} of ${totalPages}` : footerRightText}</span>
                </div>

                {/* Desk gap between paper sheets */}
                <div
                  className="w-full bg-[var(--app-bg)] border-y border-[var(--border-color)]"
                  style={{ height: `${deskGap}px` }}
                />

                {/* Header of starting page */}
                <div
                  className="flex items-center justify-between text-[11px] text-[var(--text-muted)] py-1 border-b border-[var(--border-subtle)]"
                  style={{
                    paddingLeft: `${marginLeft}px`,
                    paddingRight: `${marginRight}px`,
                    height: `${marginTop}px`,
                    boxSizing: 'border-box',
                  }}
                >
                  <span className="truncate max-w-[300px]">{headerLeftText}</span>
                  <span>{headerRightText}</span>
                </div>
              </div>
            );
          })}

          {/* Last Page Footer (margin zone) */}
          <div
            onDoubleClick={() => {
              if (pageSettings?.footerText || footerLeftText) {
                setFooterVal(pageSettings?.footerText || footerLeftText);
                setEditingFooter(true);
              } else {
                editor.chain().focus('end').run();
              }
            }}
            onClick={() => {
              if (!pageSettings?.footerText && !footerLeftText) {
                editor.chain().focus('end').run();
              }
            }}
            title={footerLeftText ? "Double-click to edit footer" : undefined}
            className={`flex items-center justify-between text-[11px] text-gray-400 border-t border-transparent ${
              footerLeftText ? 'hover:border-gray-300 cursor-pointer' : 'cursor-text'
            } select-none transition-colors relative z-10`}
            style={{
              paddingTop: '8px',
              paddingBottom: `${Math.max(16, marginBottom / 4)}px`,
              paddingLeft: `${marginLeft}px`,
              paddingRight: `${marginRight}px`,
            }}
          >
            {editingFooter ? (
              <div className="flex items-center space-x-2 w-full print:hidden" onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  autoFocus
                  value={footerVal}
                  onChange={(e) => setFooterVal(e.target.value)}
                  onBlur={() => {
                    if (onUpdatePageSettings) {
                      onUpdatePageSettings({
                        ...getEffectiveSettings(),
                        footerText: footerVal,
                        footerLeft: footerVal,
                      });
                    }
                    setEditingFooter(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      (e.target as HTMLInputElement).blur();
                    } else if (e.key === 'Escape') {
                      setEditingFooter(false);
                    }
                  }}
                  className="px-1 py-0.5 border-b border-gray-300 bg-transparent text-xs w-full text-[#1D1D1F] outline-none"
                  placeholder="Enter page footer text..."
                />
              </div>
            ) : (
              <>
                <span>{footerLeftText}</span>
                <span>{showPageNumbers ? `Page ${totalPages} of ${totalPages}` : footerRightText}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
