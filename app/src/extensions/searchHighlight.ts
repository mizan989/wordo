import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

export interface SearchMatch {
  from: number;
  to: number;
}

export interface SearchHighlightState {
  matches: SearchMatch[];
  activeIndex: number;
}

export const searchHighlightPluginKey = new PluginKey<SearchHighlightState>('searchHighlight');

export const SearchHighlightExtension = Extension.create({
  name: 'searchHighlight',

  addProseMirrorPlugins() {
    return [
      new Plugin<SearchHighlightState>({
        key: searchHighlightPluginKey,
        state: {
          init() {
            return { matches: [], activeIndex: -1 };
          },
          apply(tr, prev) {
            const meta = tr.getMeta(searchHighlightPluginKey);
            if (meta) {
              return meta;
            }
            if (!tr.docChanged || prev.matches.length === 0) {
              return prev;
            }
            // Map positions through document changes
            const mappedMatches: SearchMatch[] = [];
            for (const m of prev.matches) {
              const from = tr.mapping.map(m.from);
              const to = tr.mapping.map(m.to);
              if (from < to) {
                mappedMatches.push({ from, to });
              }
            }
            return {
              matches: mappedMatches,
              activeIndex: Math.min(prev.activeIndex, mappedMatches.length - 1),
            };
          },
        },
        props: {
          decorations(state) {
            const data = searchHighlightPluginKey.getState(state);
            if (!data || !data.matches || data.matches.length === 0) {
              return DecorationSet.empty;
            }
            const decos = data.matches.map((m, idx) => {
              const isActive = idx === data.activeIndex;
              return Decoration.inline(m.from, m.to, {
                class: isActive ? 'search-result-active' : 'search-result-match',
              });
            });
            return DecorationSet.create(state.doc, decos);
          },
        },
      }),
    ];
  },
});
