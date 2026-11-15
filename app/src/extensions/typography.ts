import { Extension } from '@tiptap/core';

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
  if (serifFonts.includes(font)) return 'serif';
  if (monoFonts.includes(font)) return 'monospace';
  return '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif';
};

export const TypographyExtension = Extension.create({
  name: 'typographyExtension',

  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
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
            parseHTML: (element) => element.style.lineHeight || null,
            renderHTML: (attributes) => {
              if (!attributes.lineHeight) {
                return {};
              }
              return {
                style: `line-height: ${attributes.lineHeight}`,
              };
            },
          },
          spaceBefore: {
            default: false,
            parseHTML: (element) => element.style.marginTop === '12pt',
            renderHTML: (attributes) => {
              if (!attributes.spaceBefore) return {};
              return {
                style: 'margin-top: 12pt',
              };
            },
          },
          spaceAfter: {
            default: true,
            parseHTML: (element) => element.style.marginBottom !== '0px',
            renderHTML: (attributes) => {
              if (attributes.spaceAfter === false) {
                return {
                  style: 'margin-bottom: 0px',
                };
              }
              return {};
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
