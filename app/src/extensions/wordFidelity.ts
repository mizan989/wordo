import { Node, mergeAttributes } from '@tiptap/core';
import { Plugin } from '@tiptap/pm/state';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';

const TAB_STOP_PX = 48; // Word's default tab stops: every 0.5 in

/**
 * Sets the width of every tab so it ends on the next default tab stop, measured from the paragraph's left edge.
 * Tabs are real inline boxes, so a tab that would pass the right margin wraps to the next line like in Word.
 */
export function layoutTabs(root: HTMLElement) {
  const tabs = Array.from(root.querySelectorAll<HTMLElement>('.wordo-tab'));
  const byBlock = new Map<Element, HTMLElement[]>();
  for (const t of tabs) {
    const block = t.closest('p, h1, h2, h3, li') || root;
    if (!byBlock.has(block)) byBlock.set(block, []);
    byBlock.get(block)!.push(t);
  }
  byBlock.forEach((list, block) => {
    const cs = getComputedStyle(block);
    const left = block.getBoundingClientRect().left + parseFloat(cs.paddingLeft || '0') + parseFloat(cs.borderLeftWidth || '0');
    for (const t of list) t.style.width = '0px';
    for (const t of list) {
      for (let pass = 0; pass < 3; pass++) {
        const x = t.getBoundingClientRect().left - left;
        const w = (Math.floor((x + 0.5) / TAB_STOP_PX) + 1) * TAB_STOP_PX - x;
        t.style.width = `${Math.max(0, w)}px`;
        if (Math.abs(t.getBoundingClientRect().left - left - x) < 0.5) break; // did not wrap; settled
      }
    }
  });
}

/** Inline tab character. */
export const TabNode = Node.create({
  name: 'tab',
  group: 'inline',
  inline: true,
  atom: true,
  selectable: false,
  parseHTML() {
    return [{ tag: 'span[data-wordo-tab]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes, { 'data-wordo-tab': '', class: 'wordo-tab' })];
  },
  addProseMirrorPlugins() {
    return [
      new Plugin({
        view: (view) => {
          let frame = 0;
          const run = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => layoutTabs(view.dom as HTMLElement));
          };
          run();
          window.addEventListener('resize', run);
          (document as any).fonts?.ready?.then(run);
          return {
            update: run,
            destroy: () => {
              cancelAnimationFrame(frame);
              window.removeEventListener('resize', run);
            },
          };
        },
      }),
    ];
  },
});

// Per-cell inline CSS imported from Word: borders, padding, vertical alignment, shading, row height.
const wdStyleAttribute = {
  wdStyle: {
    default: null,
    parseHTML: (element: HTMLElement) => element.getAttribute('data-wd-style') || null,
    renderHTML: (attributes: Record<string, any>) =>
      attributes.wdStyle ? { 'data-wd-style': attributes.wdStyle, style: attributes.wdStyle } : {},
  },
};

export const WordTableCell = TableCell.extend({
  addAttributes() {
    return { ...this.parent?.(), ...wdStyleAttribute };
  },
});

export const WordTableHeader = TableHeader.extend({
  addAttributes() {
    return { ...this.parent?.(), ...wdStyleAttribute };
  },
});
