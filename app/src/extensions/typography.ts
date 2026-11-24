import { Extension } from '@tiptap/core';
import { wordToCssLineHeight } from '../services/fontMetrics';

export const FONT_SIZE_STEPS = [8, 9, 10, 10.5, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];

const getFontFallback = (font: string) => {
  const serifFonts = [
    'Times New Roman',
    'Georgia',
    'Cambria',
    'Garamond',
    'Palatino Linotype',
    'Aptos Serif',
    'Sitka Text',
    'Sitka Heading',
    'Sitka Display',
    'Constantia',
  ];
  const monoFonts = ['Consolas', 'Courier New', 'Cascadia Code', 'Cascadia Mono', 'Aptos Mono'];
  const scriptFonts = ['Brush Script MT', 'Lucida Handwriting', 'Monotype Corsiva', 'Segoe Script', 'Edwardian Script ITC'];
  if (serifFonts.includes(font) || /imprint|bodoni|caslon|baskerville|didot|garamond|antiqua|bookman|century (schoolbook|old)|serif$/i.test(font)) return 'serif';
  if (monoFonts.includes(font) || /mono|courier|consolas|console/i.test(font)) return 'monospace';
  if (scriptFonts.includes(font) || /script|hand/i.test(font)) return 'cursive';
  return '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif';
};

export const TypographyExtension = Extension.create({
  name: 'typographyExtension',

  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          // Word "outline" text effect: hollow letters with a stroke in the given color
          wdOutline: {
            default: null,
            parseHTML: (element) => element.getAttribute('data-wd-outline') || null,
            renderHTML: (attributes) =>
              attributes.wdOutline
                ? {
                    'data-wd-outline': attributes.wdOutline,
                    style: `-webkit-text-stroke: 0.75pt ${attributes.wdOutline}; -webkit-text-fill-color: transparent`,
                  }
                : {},
          },
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize?.replace('pt', '') || null,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {};
              }
              const size =
                attributes.fontSize.toString().includes('px') ||
                attributes.fontSize.toString().includes('pt')
                  ? attributes.fontSize
                  : `${attributes.fontSize}pt`;
              return {
                style: `font-size: ${size}`,
              };
            },
          },
          fontFamily: {
            default: null,
            parseHTML: (element) => element.style.fontFamily?.replace(/['"]/g, '') || null,
            renderHTML: (attributes) => {
              if (!attributes.fontFamily) {
                return {};
              }
              const fallback = getFontFallback(attributes.fontFamily);
              return {
                style: `font-family: "${attributes.fontFamily}", ${fallback}`,
              };
            },
          },
        },
      },
      {
        types: ['paragraph', 'heading'],
        attributes: {
          fontFamily: {
            default: null,
            parseHTML: (element) => element.style.fontFamily?.replace(/['"]/g, '') || null,
            renderHTML: (attributes) => {
              if (!attributes.fontFamily) return {};
              const fallback = getFontFallback(attributes.fontFamily);
              return {
                style: `font-family: "${attributes.fontFamily}", ${fallback}`,
              };
            },
          },
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize?.replace('pt', '') || null,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              const size =
                attributes.fontSize.toString().includes('px') ||
                attributes.fontSize.toString().includes('pt')
                  ? attributes.fontSize
                  : `${attributes.fontSize}pt`;
              return {
                style: `font-size: ${size}`,
              };
            },
          },
          lineHeight: {
            default: null,
            // Stored as Word's line multiple (1.0 = single, 1.15, 1.5 ...). CSS line-height is relative to the
            // font size, Word's is relative to the font's own line height, so convert when rendering.
            parseHTML: (element) => element.getAttribute('data-wd-line') || element.style.lineHeight || null,
            renderHTML: (attributes) => {
              if (!attributes.lineHeight) {
                return {};
              }
              const multiple = parseFloat(attributes.lineHeight);
              if (!isFinite(multiple)) return {};
              return {
                'data-wd-line': String(attributes.lineHeight),
                style: `line-height: ${wordToCssLineHeight(multiple, attributes.fontFamily)}`,
              };
            },
          },
          spaceBefore: {
            default: false,
            parseHTML: (element) => parseFloat(element.style.marginTop || '0') > 0,
            renderHTML: (attributes) => {
              if (!attributes.spaceBefore || attributes.marginTop != null) return {};
              return {
                style: 'margin-top: 12pt',
              };
            },
          },
          spaceAfter: {
            default: true,
            parseHTML: (element) => parseFloat(element.style.marginBottom || '1') !== 0,
            renderHTML: (attributes) => {
              if (attributes.spaceAfter === false && attributes.marginBottom == null) {
                return {
                  style: 'margin-bottom: 0px',
                };
              }
              return {};
            },
          },
          // Exact Word spacing in points (null = use the legacy boolean spaceBefore/spaceAfter)
          marginTop: {
            default: null,
            parseHTML: (element) => {
              const v = element.getAttribute('data-wd-before');
              if (v != null) return parseFloat(v);
              return element.style.marginTop ? parseFloat(element.style.marginTop) : null;
            },
            renderHTML: (attributes) =>
              attributes.marginTop == null ? {} : { 'data-wd-before': String(attributes.marginTop), style: `margin-top: 0; padding-top: ${attributes.marginTop}pt` },
          },
          marginBottom: {
            default: null,
            parseHTML: (element) => (element.style.marginBottom ? parseFloat(element.style.marginBottom) : null),
            renderHTML: (attributes) =>
              attributes.marginBottom == null ? {} : { style: `margin-bottom: ${attributes.marginBottom}pt` },
          },
          // Paragraph borders, stored as JSON: {"bottom":{"style":"double","size":4,"color":"FF0000","space":1}, ...}
          wdBorder: {
            default: null,
            parseHTML: (element) => element.getAttribute('data-wd-border') || null,
            renderHTML: (attributes) => {
              if (!attributes.wdBorder) return {};
              try {
                const b = JSON.parse(attributes.wdBorder);
                const css: string[] = [];
                for (const side of ['top', 'right', 'bottom', 'left']) {
                  const d = b[side];
                  if (!d) continue;
                  const px = Math.max(1, Math.round(((d.size || 4) / 8) * (96 / 72)));
                  const style = d.style === 'double' ? 'double' : d.style === 'dashed' ? 'dashed' : d.style === 'dotted' ? 'dotted' : 'solid';
                  const width = style === 'double' ? Math.max(3, px * 3) : px;
                  css.push(`border-${side}: ${width}px ${style} ${d.color ? '#' + d.color : '#000'}`);
                  if (d.space) css.push(`padding-${side}: ${d.space}pt`);
                }
                return { 'data-wd-border': attributes.wdBorder, style: css.join('; ') };
              } catch {
                return {};
              }
            },
          },
          indent: {
            default: 0,
            parseHTML: (element) => {
              const ml = element.style.marginLeft;
              if (ml && ml.includes('px')) {
                return Math.min(8, Math.max(0, Math.round(parseInt(ml, 10) / 24)));
              }
              return 0;
            },
            renderHTML: (attributes) => {
              if (!attributes.indent || attributes.indent <= 0) {
                return {};
              }
              return {
                style: `margin-left: ${attributes.indent * 24}px`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (size: string | number) =>
        ({ editor, chain }: any) => {
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
              return chain()
                .focus()
                .setTextSelection({ from, to })
                .setMark('textStyle', { fontSize: `${size}` })
                .setTextSelection(selection.from)
                .run();
            }
            return chain()
              .focus()
              .setMark('textStyle', { fontSize: `${size}` })
              .updateAttributes('paragraph', { fontSize: `${size}` })
              .run();
          }
          return chain().focus().setMark('textStyle', { fontSize: `${size}` }).run();
        },
      setFontFamily:
        (font: string) =>
        ({ editor, chain }: any) => {
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
              return chain()
                .focus()
                .setTextSelection({ from, to })
                .setMark('textStyle', { fontFamily: font })
                .setTextSelection(selection.from)
                .run();
            }
            return chain()
              .focus()
              .setMark('textStyle', { fontFamily: font })
              .updateAttributes('paragraph', { fontFamily: font })
              .run();
          }
          return chain().focus().setMark('textStyle', { fontFamily: font }).run();
        },
      growFontSize:
        () =>
        ({ editor, chain }: any) => {
          const currentVal = editor.getAttributes('textStyle')?.fontSize;
          const currentSize = currentVal ? parseFloat(currentVal) : 11;
          let nextSize = 12;

          for (let i = 0; i < FONT_SIZE_STEPS.length; i++) {
            if (FONT_SIZE_STEPS[i] > currentSize) {
              nextSize = FONT_SIZE_STEPS[i];
              break;
            }
          }
          if (currentSize >= 72) {
            nextSize = currentSize + 10;
          }

          return chain().focus().setMark('textStyle', { fontSize: `${nextSize}` }).run();
        },
      shrinkFontSize:
        () =>
        ({ editor, chain }: any) => {
          const currentVal = editor.getAttributes('textStyle')?.fontSize;
          const currentSize = currentVal ? parseFloat(currentVal) : 11;
          let prevSize = 8;

          for (let i = FONT_SIZE_STEPS.length - 1; i >= 0; i--) {
            if (FONT_SIZE_STEPS[i] < currentSize) {
              prevSize = FONT_SIZE_STEPS[i];
              break;
            }
          }
          if (currentSize > 72) {
            prevSize = currentSize - 10;
          }

          return chain().focus().setMark('textStyle', { fontSize: `${prevSize}` }).run();
        },
      setLineHeight:
        (lineHeight: string) =>
        ({ commands }: any) => {
          return commands.updateAttributes('paragraph', { lineHeight });
        },
      toggleSpaceBefore:
        () =>
        ({ editor, commands }: any) => {
          const current = editor.getAttributes('paragraph')?.spaceBefore;
          return commands.updateAttributes('paragraph', { spaceBefore: !current });
        },
      toggleSpaceAfter:
        () =>
        ({ editor, commands }: any) => {
          const current = editor.getAttributes('paragraph')?.spaceAfter ?? true;
          return commands.updateAttributes('paragraph', { spaceAfter: !current });
        },
      indentParagraph:
        () =>
        ({ editor, commands }: any) => {
          const currentIndent = editor.getAttributes('paragraph')?.indent || 0;
          if (currentIndent < 8) {
            return commands.updateAttributes('paragraph', { indent: currentIndent + 1 });
          }
          return false;
        },
      outdentParagraph:
        () =>
        ({ editor, commands }: any) => {
          const currentIndent = editor.getAttributes('paragraph')?.indent || 0;
          if (currentIndent > 0) {
            return commands.updateAttributes('paragraph', { indent: currentIndent - 1 });
          }
          return false;
        },
      transformCase:
        (type: 'sentence' | 'lower' | 'upper' | 'title' | 'toggle') =>
        ({ editor, state }: any) => {
          const { from, to, empty } = state.selection;
          if (empty) return false;

          const text = state.doc.textBetween(from, to, ' ');
          if (!text) return false;

          let converted = text;
          if (type === 'upper') {
            converted = text.toUpperCase();
          } else if (type === 'lower') {
            converted = text.toLowerCase();
          } else if (type === 'title') {
            converted = text.replace(/\b\w/g, (char: string) => char.toUpperCase());
          } else if (type === 'sentence') {
            converted = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c: string) => c.toUpperCase());
          } else if (type === 'toggle') {
            converted = text
              .split('')
              .map((c: string) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()))
              .join('');
          }

          return editor.chain().focus().insertContent(converted).run();
        },
    } as any;
  },
});
