import React, { useRef, useState } from 'react';
import { Editor, EditorContent } from '@tiptap/react';
import { PageSettings } from '../types';
import { FloatingMiniToolbar } from './FloatingMiniToolbar';

interface EditorCanvasProps {
  editor: Editor | null;
  zoom: number;
  documentTitle: string;
  totalPages?: number;
  pageSettings?: PageSettings;
  onUpdatePageSettings?: (settings: PageSettings) => void;
}

export const EditorCanvas: React.FC<EditorCanvasProps> = ({
  editor,
  zoom,
  documentTitle,
  totalPages = 1,
  pageSettings,
  onUpdatePageSettings,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [editingHeader, setEditingHeader] = useState(false);
  const [editingFooter, setEditingFooter] = useState(false);
  const [headerVal, setHeaderVal] = useState('');
  const [footerVal, setFooterVal] = useState('');

  if (!editor) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Loading editor...
      </div>
    );
  }

  // Standard Letter / A4 page dimension at 96 DPI: ~816px width, ~1056px height
  const pageWidthPx = pageSettings?.orientation === 'landscape' ? 1056 : 816;
  const pageMinHeightPx = pageSettings?.orientation === 'landscape' ? 816 : 1056;

  const headerLeftText = (pageSettings?.headerLeft || pageSettings?.headerText || documentTitle).replace('{title}', documentTitle);
  const headerRightText = pageSettings?.headerRight !== undefined ? pageSettings.headerRight : 'Corporate Office';
  const footerLeftText = (pageSettings?.footerLeft || (pageSettings?.footerText !== undefined ? pageSettings.footerText : 'Confidential & Proprietary')) || '';
  const footerRightText = pageSettings?.showPageNumbers !== false ? `Page 1 of ${totalPages}` : (pageSettings?.footerRight || '');

  // Page background color styling
  const pageBgColor = pageSettings?.pageColor || '#ffffff';
  const watermarkText = pageSettings?.watermarkText;

  // Luminance calculation to dynamically adapt text color on dark tinted pages
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

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-auto bg-[#eaeaea] dark:bg-[#181818] p-8 flex flex-col items-center transition-colors print:p-0 print:bg-white relative"
    >
      {/* Floating Selection Mini Toolbar */}
      <FloatingMiniToolbar editor={editor} />

      {/* Zoom transform container */}
      <div
        style={{
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'top center',
          transition: 'transform 0.1s ease-out',
        }}
        className="flex flex-col items-center space-y-8 pb-16 print:space-y-0 print:pb-0"
      >
        {/* Document Page Canvas */}
        <div
          id="word-client-page-canvas"
          className={`shadow-xl border border-gray-300 dark:border-gray-800 print:border-none print:shadow-none print-page relative flex flex-col transition-colors overflow-hidden ${
            isDarkPage ? 'text-[#f1f5f9] dark-page-mode' : 'text-[#242424]'
          }`}
          style={{
            width: `${pageWidthPx}px`,
            minHeight: `${pageMinHeightPx}px`,
            backgroundColor: pageBgColor,
            boxSizing: 'border-box',
            ['--page-bg' as any]: pageBgColor,
          }}
        >
          {/* Watermark Overlay (if configured) */}
          {watermarkText && (
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden"
            >
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

          {/* Page Header (margin zone) */}
          <div
            onDoubleClick={() => {
              setHeaderVal(pageSettings?.headerText || headerLeftText);
              setEditingHeader(true);
            }}
            title="Double-click to edit header"
            className="flex items-center justify-between text-[11px] text-gray-400 border-b border-transparent hover:border-gray-300 select-none transition-colors relative z-10 cursor-pointer"
            style={{
              paddingTop: `${Math.max(16, (pageSettings?.margins?.top ?? 96) / 4)}px`,
              paddingBottom: '8px',
              paddingLeft: `${pageSettings?.margins?.left ?? 64}px`,
              paddingRight: `${pageSettings?.margins?.right ?? 64}px`,
            }}
          >
            {editingHeader ? (
              <div className="flex items-center space-x-2 w-full" onClick={(e) => e.stopPropagation()}>
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
                  className="px-2 py-0.5 border border-[#185abd] rounded bg-white text-xs w-full text-gray-800 outline-none"
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

          {/* Editable Document Body (dynamic margins) */}
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                editor.chain().focus('end').run();
              }
            }}
            className="flex-1 cursor-text transition-all min-h-[600px] relative z-10"
            style={{
              paddingTop: `${Math.max(16, (pageSettings?.margins?.top ?? 96) / 2)}px`,
              paddingBottom: `${Math.max(16, (pageSettings?.margins?.bottom ?? 96) / 2)}px`,
              paddingLeft: `${pageSettings?.margins?.left ?? 64}px`,
              paddingRight: `${pageSettings?.margins?.right ?? 64}px`,
            }}
          >
            <EditorContent editor={editor} className="tiptap-content font-sans text-sm min-h-[500px]" />
          </div>

          {/* Page Footer (margin zone) */}
          <div
            onDoubleClick={() => {
              setFooterVal(pageSettings?.footerText || footerLeftText);
              setEditingFooter(true);
            }}
            title="Double-click to edit footer"
            className="flex items-center justify-between text-[11px] text-gray-400 border-t border-transparent hover:border-gray-300 select-none transition-colors relative z-10 cursor-pointer"
            style={{
              paddingTop: '8px',
              paddingBottom: `${Math.max(16, (pageSettings?.margins?.bottom ?? 96) / 4)}px`,
              paddingLeft: `${pageSettings?.margins?.left ?? 64}px`,
              paddingRight: `${pageSettings?.margins?.right ?? 64}px`,
            }}
          >
            {editingFooter ? (
              <div className="flex items-center space-x-2 w-full" onClick={(e) => e.stopPropagation()}>
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
                  className="px-2 py-0.5 border border-[#185abd] rounded bg-white text-xs w-full text-gray-800 outline-none"
                  placeholder="Enter page footer text..."
                />
              </div>
            ) : (
              <>
                <span>{footerLeftText}</span>
                <span>{footerRightText}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
