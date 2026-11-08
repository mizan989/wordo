import { Node } from '@tiptap/core';

export const PageBreak = Node.create({
  name: 'pageBreak',
  group: 'block',
  atom: true,
  selectable: true,

  parseHTML() {
    return [{ tag: 'div[data-wordo-page-break]' }];
  },

  renderHTML() {
    return ['div', { 'data-wordo-page-break': 'true', class: 'wordo-page-break' }];
  },
});
