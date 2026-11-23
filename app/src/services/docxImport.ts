// Styled DOCX importer: reads the OOXML directly so fonts, sizes, colors, alignment,
// spacing, lists, tables, images, links and page setup survive the import.
// Output is HTML whose inline styles are understood by the editor's extensions.
import JSZip from 'jszip';
import type { PageSettings } from '../types';

export interface StyledImportResult {
  html: string;
  warnings: string[];
  pageSettings: Partial<PageSettings>;
}

// ---------- small XML helpers (namespace-prefix agnostic) ----------
const ln = (el: Element): string => el.localName || el.nodeName.split(':').pop() || '';
const kids = (el: Element | null | undefined, name?: string): Element[] => {
  const out: Element[] = [];
  if (!el) return out;
  for (let n = el.firstChild; n; n = n.nextSibling) {
    if (n.nodeType === 1 && (!name || ln(n as Element) === name)) out.push(n as Element);
  }
  return out;
};
const kid = (el: Element | null | undefined, name: string): Element | null => kids(el, name)[0] || null;
const attr = (el: Element | null | undefined, name: string): string | null => {
  if (!el) return null;
  return el.getAttribute(`w:${name}`) ?? el.getAttribute(`r:${name}`) ?? el.getAttribute(name);
};
const descendants = (el: Element, name: string, out: Element[] = []): Element[] => {
  for (const c of kids(el)) {
    if (ln(c) === name) out.push(c);
    descendants(c, name, out);
  }
  return out;
};
const isOn = (el: Element | null): boolean | undefined => {
  if (!el) return undefined;
  const v = attr(el, 'val');
  return !(v === '0' || v === 'false' || v === 'off' || v === 'none');
};
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const parseXml = (xml: string): Document => new DOMParser().parseFromString(xml, 'application/xml');

// ---------- property models ----------
interface RunProps {
  font?: string; size?: number; color?: string; bold?: boolean; italic?: boolean;
  underline?: boolean; strike?: boolean; highlight?: string; vert?: string; caps?: boolean;
}
interface ParaProps {
  jc?: string; before?: number; after?: number; line?: number; lineRule?: string;
  left?: number; numId?: string; ilvl?: number; pageBreakBefore?: boolean;
}
const merge = <T extends object>(a: T, b: T): T => {
  const out: any = { ...a };
  for (const [k, v] of Object.entries(b)) if (v !== undefined) out[k] = v;
  return out;
};

const HIGHLIGHTS: Record<string, string> = {
  yellow: '#FFFF00', green: '#00FF00', cyan: '#00FFFF', magenta: '#FF00FF', blue: '#0000FF', red: '#FF0000',
  darkBlue: '#000080', darkCyan: '#008080', darkGreen: '#008000', darkMagenta: '#800080', darkRed: '#800000',
  darkYellow: '#808000', darkGray: '#808080', lightGray: '#C0C0C0', black: '#000000', white: '#FFFFFF',
};
const MIME: Record<string, string> = {
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', bmp: 'image/bmp', webp: 'image/webp', svg: 'image/svg+xml',
};

interface Theme { major?: string; minor?: string }

function parseRPr(el: Element | null, theme: Theme): RunProps {
  const p: RunProps = {};
  if (!el) return p;
  const fonts = kid(el, 'rFonts');
  if (fonts) {
    const themeKey = attr(fonts, 'asciiTheme') || attr(fonts, 'hAnsiTheme');
    const direct = attr(fonts, 'ascii') || attr(fonts, 'hAnsi');
    if (themeKey) p.font = themeKey.startsWith('major') ? theme.major : theme.minor;
    if (direct && !themeKey) p.font = direct;
    if (!p.font && direct) p.font = direct;
  }
  const sz = kid(el, 'sz');
  if (sz && attr(sz, 'val')) p.size = parseInt(attr(sz, 'val')!, 10) / 2;
  const color = kid(el, 'color');
  const cv = attr(color, 'val');
  if (cv && cv !== 'auto' && /^[0-9a-fA-F]{6}$/.test(cv)) p.color = `#${cv.toUpperCase()}`;
  const b = isOn(kid(el, 'b')); if (b !== undefined) p.bold = b;
  const i = isOn(kid(el, 'i')); if (i !== undefined) p.italic = i;
  const u = kid(el, 'u'); if (u) p.underline = attr(u, 'val') !== 'none';
  const s = isOn(kid(el, 'strike')) ?? isOn(kid(el, 'dstrike')); if (s !== undefined) p.strike = s;
  const caps = isOn(kid(el, 'caps')); if (caps !== undefined) p.caps = caps;
  const hl = kid(el, 'highlight');
  if (hl) { const v = attr(hl, 'val'); p.highlight = v && v !== 'none' ? HIGHLIGHTS[v] : ''; }
  const shd = kid(el, 'shd');
  const fill = attr(shd, 'fill');
  if (!p.highlight && fill && fill !== 'auto' && /^[0-9a-fA-F]{6}$/.test(fill)) p.highlight = `#${fill.toUpperCase()}`;
  const va = kid(el, 'vertAlign'); if (va) p.vert = attr(va, 'val') || undefined;
  return p;
}

function parsePPr(el: Element | null): ParaProps {
  const p: ParaProps = {};
  if (!el) return p;
  const jc = attr(kid(el, 'jc'), 'val'); if (jc) p.jc = jc;
  const sp = kid(el, 'spacing');
  if (sp) {
    if (attr(sp, 'before') != null) p.before = parseInt(attr(sp, 'before')!, 10);
    if (attr(sp, 'after') != null) p.after = parseInt(attr(sp, 'after')!, 10);
    if (attr(sp, 'line') != null) p.line = parseInt(attr(sp, 'line')!, 10);
    if (attr(sp, 'lineRule')) p.lineRule = attr(sp, 'lineRule')!;
  }
  const ind = kid(el, 'ind');
  const left = attr(ind, 'left') ?? attr(ind, 'start');
  if (left != null) p.left = parseInt(left, 10);
  const np = kid(el, 'numPr');
  if (np) {
    const id = attr(kid(np, 'numId'), 'val'); if (id != null) p.numId = id;
    const lv = attr(kid(np, 'ilvl'), 'val'); if (lv != null) p.ilvl = parseInt(lv, 10);
  }
  if (isOn(kid(el, 'pageBreakBefore'))) p.pageBreakBefore = true;
  return p;
}

interface StyleDef { id: string; type: string; name: string; basedOn?: string; isDefault: boolean; p: ParaProps; r: RunProps }

class Importer {
  warnings = new Set<string>();
  styles = new Map<string, StyleDef>();
  defaultP: ParaProps = {};
  defaultR: RunProps = {};
  defaultParaStyle?: string;
  theme: Theme = {};
  rels = new Map<string, { target: string; external: boolean }>();
  numbering = new Map<string, Map<number, { fmt: string; start: number }>>();
  numToAbstract = new Map<string, string>();
  media = new Map<string, string>();
  listStack: { tag: string; ilvl: number; numId: string }[] = [];

  constructor(private zip: JSZip) {}

  private async text(path: string): Promise<string | null> {
    const f = this.zip.file(path);
    return f ? f.async('string') : null;
  }

  async load() {
    const themeXml = await this.text('word/theme/theme1.xml');
    if (themeXml) {
      const d = parseXml(themeXml);
      const face = (tag: string) => {
        const el = descendants(d.documentElement, tag)[0];
        const latin = el ? kid(el, 'latin') : null;
        return latin?.getAttribute('typeface') || undefined;
      };
      this.theme = { major: face('majorFont'), minor: face('minorFont') };
    }
    const stylesXml = await this.text('word/styles.xml');
    if (stylesXml) {
      const d = parseXml(stylesXml);
      const root = d.documentElement;
      const dd = kid(root, 'docDefaults');
      this.defaultR = parseRPr(kid(kid(dd, 'rPrDefault'), 'rPr'), this.theme);
      this.defaultP = parsePPr(kid(kid(dd, 'pPrDefault'), 'pPr'));
      for (const s of kids(root, 'style')) {
        const id = attr(s, 'styleId');
        if (!id) continue;
        const def: StyleDef = {
          id, type: attr(s, 'type') || 'paragraph', name: (attr(kid(s, 'name'), 'val') || '').toLowerCase(),
          basedOn: attr(kid(s, 'basedOn'), 'val') || undefined, isDefault: attr(s, 'default') === '1',
          p: parsePPr(kid(s, 'pPr')), r: parseRPr(kid(s, 'rPr'), this.theme),
        };
        this.styles.set(id, def);
        if (def.type === 'paragraph' && def.isDefault) this.defaultParaStyle = id;
      }
    }
    const relsXml = await this.text('word/_rels/document.xml.rels');
    if (relsXml) this.loadRels(relsXml, this.rels);
    const numXml = await this.text('word/numbering.xml');
    if (numXml) {
      const root = parseXml(numXml).documentElement;
      const abstracts = new Map<string, Map<number, { fmt: string; start: number }>>();
      for (const a of kids(root, 'abstractNum')) {
        const levels = new Map<number, { fmt: string; start: number }>();
        for (const l of kids(a, 'lvl')) {
          levels.set(parseInt(attr(l, 'ilvl') || '0', 10), {
            fmt: attr(kid(l, 'numFmt'), 'val') || 'decimal',
            start: parseInt(attr(kid(l, 'start'), 'val') || '1', 10),
          });
        }
        abstracts.set(attr(a, 'abstractNumId') || '', levels);
      }
      for (const n of kids(root, 'num')) {
        const id = attr(n, 'numId') || '';
        const abs = attr(kid(n, 'abstractNumId'), 'val') || '';
        this.numToAbstract.set(id, abs);
        if (abstracts.has(abs)) this.numbering.set(id, abstracts.get(abs)!);
      }
    }
  }

  private loadRels(xml: string, into: Map<string, { target: string; external: boolean }>) {
    for (const r of kids(parseXml(xml).documentElement, 'Relationship')) {
      into.set(r.getAttribute('Id') || '', {
        target: r.getAttribute('Target') || '',
        external: r.getAttribute('TargetMode') === 'External',
      });
    }
  }

  // ----- style resolution -----
  private chain(id: string | undefined): StyleDef[] {
    const out: StyleDef[] = [];
    const seen = new Set<string>();
    while (id && !seen.has(id)) {
      seen.add(id);
      const s = this.styles.get(id);
      if (!s) break;
      out.unshift(s);
      id = s.basedOn;
    }
    return out;
  }
  private resolveParaStyle(id?: string): { p: ParaProps; r: RunProps; name: string } {
    let p = this.defaultP, r = this.defaultR, name = '';
    for (const s of this.chain(id || this.defaultParaStyle)) { p = merge(p, s.p); r = merge(r, s.r); name = s.name; }
    return { p, r, name };
  }
  private resolveCharStyle(id?: string): RunProps {
    let r: RunProps = {};
    for (const s of this.chain(id)) r = merge(r, s.r);
    return r;
  }

  // ----- inline content -----
  private async runToHtml(run: Element, base: RunProps, state: { skipField: number }): Promise<string> {
    const rPr = kid(run, 'rPr');
    const direct = parseRPr(rPr, this.theme);
    const charStyle = this.resolveCharStyle(attr(kid(rPr, 'rStyle'), 'val') || undefined);
    const props = merge(merge(base, charStyle), direct);

    let out = '';
    let buf = '';
    const flush = () => {
      if (!buf) return;
      out += this.wrap(buf, props);
      buf = '';
    };
    for (const c of kids(run)) {
      switch (ln(c)) {
        case 't': {
          if (state.skipField > 0) break;
          let t = c.textContent || '';
          if (props.caps) t = t.toUpperCase();
          buf += esc(t).replace(/ {2,}/g, (m) => ' ' + '\u00a0'.repeat(m.length - 1));
          break;
        }
        case 'tab': if (state.skipField === 0) buf += '\u00a0\u00a0\u00a0\u00a0'; break;
        case 'noBreakHyphen': buf += '-'; break;
        case 'br':
        case 'cr':
          flush();
          out += attr(c, 'type') === 'page' ? '\u0000PB\u0000' : '<br>';
          break;
        case 'drawing': flush(); out += await this.drawingToHtml(c); break;
        case 'pict': flush(); this.warnings.add('Text boxes and shapes are not supported and were skipped.'); break;
        case 'footnoteReference': case 'endnoteReference': this.warnings.add('Footnotes and endnotes were not imported.'); break;
        default: break;
      }
    }
    flush();
    return out;
  }

  private wrap(html: string, p: RunProps): string {
    let h = html;
    if (p.vert === 'superscript') h = `<sup>${h}</sup>`;
    else if (p.vert === 'subscript') h = `<sub>${h}</sub>`;
    if (p.strike) h = `<s>${h}</s>`;
    if (p.underline) h = `<u>${h}</u>`;
    if (p.italic) h = `<em>${h}</em>`;
    if (p.bold) h = `<strong>${h}</strong>`;
    if (p.highlight) h = `<mark data-color="${p.highlight}" style="background-color: ${p.highlight}">${h}</mark>`;
    const style: string[] = [];
    if (p.font) style.push(`font-family: "${p.font.replace(/["'<>&]/g, '')}"`);
    if (p.size) style.push(`font-size: ${p.size}pt`);
    if (p.color) style.push(`color: ${p.color}`);
    return style.length ? `<span style='${style.join('; ')}'>${h}</span>` : h;
  }

  private async drawingToHtml(drawing: Element): Promise<string> {
    const blip = descendants(drawing, 'blip')[0];
    if (!blip) { this.warnings.add('Some drawings or charts could not be imported.'); return ''; }
    const rid = blip.getAttribute('r:embed');
    const rel = rid ? this.rels.get(rid) : undefined;
    if (!rel) return '';
    const path = rel.target.startsWith('/') ? rel.target.slice(1) : `word/${rel.target}`;
    const ext = (path.split('.').pop() || '').toLowerCase();
    const mime = MIME[ext];
    if (!mime) { this.warnings.add(`Images in .${ext} format are not supported and were skipped.`); return ''; }
    const file = this.zip.file(path);
    if (!file) return '';
    let b64 = this.media.get(path);
    if (!b64) { b64 = await file.async('base64'); this.media.set(path, b64); }
    const extent = descendants(drawing, 'extent')[0];
    const cx = extent ? parseInt(extent.getAttribute('cx') || '0', 10) : 0;
    const cy = extent ? parseInt(extent.getAttribute('cy') || '0', 10) : 0;
    const size = cx && cy ? ` width="${Math.round(cx / 9525)}" height="${Math.round(cy / 9525)}"` : '';
    return `<img src="data:${mime};base64,${b64}"${size}>`;
  }

  private async inline(parent: Element, base: RunProps, state: { skipField: number }): Promise<string> {
    let out = '';
    for (const c of kids(parent)) {
      switch (ln(c)) {
        case 'r': out += await this.runToHtml(c, base, state); break;
        case 'hyperlink': {
          const inner = await this.inline(c, base, state);
          const rid = attr(c, 'id');
          const rel = rid ? this.rels.get(rid) : undefined;
          out += rel && rel.external && /^(https?:|mailto:)/i.test(rel.target) ? `<a href="${esc(rel.target)}">${inner}</a>` : inner;
          break;
        }
        case 'ins': case 'smartTag': case 'fldSimple': case 'sdtContent':
          out += await this.inline(c, base, state); break;
        case 'sdt': out += await this.inline(kid(c, 'sdtContent') || c, base, state); break;
        case 'AlternateContent': {
          const choice = kid(c, 'Choice');
          if (choice && descendants(choice, 'blip').length) out += await this.inline(choice, base, state);
          else this.warnings.add('Text boxes and shapes are not supported and were skipped.');
          break;
        }
        default: break; // del, bookmarks, proofErr, pPr ...
      }
    }
    return out;
  }

  // ----- blocks -----
  private closeLists(): string {
    let out = '';
    while (this.listStack.length) { this.listStack.pop(); out += '</li></' + (this.lastTag.pop() || 'ul') + '>'; }
    return out;
  }
  private lastTag: string[] = [];

  private openListItem(ilvl: number, numId: string): string {
    const lvl = this.numbering.get(numId)?.get(ilvl);
    const fmt = lvl?.fmt || 'bullet';
    const tag = fmt === 'bullet' || fmt === 'none' ? 'ul' : 'ol';
    let out = '';
    while (this.listStack.length && this.listStack[this.listStack.length - 1].ilvl > ilvl) {
      this.listStack.pop(); out += '</li></' + (this.lastTag.pop() || 'ul') + '>';
    }
    const top = this.listStack[this.listStack.length - 1];
    if (top && top.ilvl === ilvl) {
      if (top.tag === tag && top.numId === numId) {
        out += '</li><li>';
        return out;
      }
      this.listStack.pop(); out += '</li></' + (this.lastTag.pop() || 'ul') + '>';
    }
    const start = lvl && tag === 'ol' && lvl.start !== 1 ? ` start="${lvl.start}"` : '';
    out += `<${tag}${start}><li>`;
    this.listStack.push({ tag, ilvl, numId });
    this.lastTag.push(tag);
    return out;
  }

  private async paragraph(p: Element): Promise<string> {
    const pPr = kid(p, 'pPr');
    const styleId = attr(kid(pPr, 'pStyle'), 'val') || undefined;
    const st = this.resolveParaStyle(styleId);
    const props = merge(st.p, parsePPr(pPr));
    const heading = /^heading (\d)$/.exec(st.name);
    const tag = heading ? `h${Math.min(3, Math.max(1, parseInt(heading[1], 10)))}` : 'p'; // editor supports H1-H3

    const inner = await this.inline(p, st.r, { skipField: 0 });

    const style: string[] = [];
    const align = props.jc === 'both' || props.jc === 'distribute' ? 'justify' : props.jc === 'center' ? 'center'
      : props.jc === 'right' || props.jc === 'end' ? 'right' : props.jc === 'left' || props.jc === 'start' ? 'left' : '';
    if (align) style.push(`text-align: ${align}`);
    if (props.line && (!props.lineRule || props.lineRule === 'auto')) style.push(`line-height: ${Math.round((props.line / 240) * 100) / 100}`);
    if ((props.before || 0) > 0) style.push('margin-top: 12pt');
    if (props.after === 0) style.push('margin-bottom: 0px');
    const inList = !!props.numId && props.numId !== '0' && this.numbering.has(props.numId);
    if (!inList && props.left && props.left > 0) style.push(`margin-left: ${Math.min(8, Math.round(props.left / 360)) * 24}px`);
    if (st.r.font) style.push(`font-family: "${st.r.font.replace(/["'<>&]/g, '')}"`);
    if (st.r.size) style.push(`font-size: ${st.r.size}pt`);
    const styleAttr = style.length ? ` style='${style.join('; ')}'` : '';

    const parts = inner.split('\u0000PB\u0000');
    const pageBreak = '<div data-wordo-page-break="true" class="wordo-page-break"></div>';
    let html = '';
    if (props.pageBreakBefore) html += pageBreak;
    parts.forEach((part, idx) => {
      const last = idx === parts.length - 1;
      if (idx > 0) html += pageBreak;
      if (part || (parts.length === 1)) html += `<${tag}${styleAttr}>${part}</${tag}>`;
      else if (!last) html += '';
    });

    if (inList) {
      const item = this.openListItem(props.ilvl || 0, props.numId!);
      // inside <li> the paragraph is plain; drop block-level extras
      return item + html.replace(pageBreak, '');
    }
    return this.closeLists() + html;
  }

  private async table(tbl: Element): Promise<string> {
    const grid = kids(kid(tbl, 'tblGrid'), 'gridCol').map((g) => Math.round(parseInt(attr(g, 'w') || '0', 10) / 15));
    interface Cell { col: number; span: number; vm: string | null; html: string; rowspan: number; skip: boolean; header: boolean }
    const rows: Cell[][] = [];
    for (const tr of kids(tbl, 'tr')) {
      const header = !!kid(kid(tr, 'trPr'), 'tblHeader');
      const cells: Cell[] = [];
      let col = 0;
      for (const tc of kids(tr, 'tc')) {
        const tcPr = kid(tc, 'tcPr');
        const span = parseInt(attr(kid(tcPr, 'gridSpan'), 'val') || '1', 10);
        const vmEl = kid(tcPr, 'vMerge');
        const vm = vmEl ? (attr(vmEl, 'val') === 'restart' ? 'restart' : 'cont') : null;
        const html = vm === 'cont' ? '' : await this.blocks(tc);
        cells.push({ col, span, vm, html: html || '<p></p>', rowspan: 1, skip: false, header });
        col += span;
      }
      rows.push(cells);
    }
    const origins = new Map<number, Cell>();
    for (const cells of rows) {
      for (const c of cells) {
        if (c.vm === 'cont' && origins.has(c.col)) { origins.get(c.col)!.rowspan++; c.skip = true; }
        else origins.set(c.col, c);
      }
    }
    let out = '<table><tbody>';
    for (const cells of rows) {
      out += '<tr>';
      for (const c of cells) {
        if (c.skip) continue;
        const widths = grid.slice(c.col, c.col + c.span);
        const cw = widths.length === c.span && widths.every((w) => w > 0) ? ` colwidth="${widths.join(',')}"` : '';
        const tag = c.header ? 'th' : 'td';
        out += `<${tag}${c.span > 1 ? ` colspan="${c.span}"` : ''}${c.rowspan > 1 ? ` rowspan="${c.rowspan}"` : ''}${cw}>${c.html}</${tag}>`;
      }
      out += '</tr>';
    }
    return out + '</tbody></table><p></p>';
  }

  async blocks(container: Element): Promise<string> {
    let out = '';
    const saved = { stack: this.listStack, tags: this.lastTag };
    this.listStack = []; this.lastTag = [];
    const walk = async (parent: Element) => {
      for (const c of kids(parent)) {
        const name = ln(c);
        if (name === 'p') out += await this.paragraph(c);
        else if (name === 'tbl') { out += this.closeLists() + (await this.table(c)); }
        else if (name === 'sdt') await walk(kid(c, 'sdtContent') || c);
        else if (name === 'sdtContent') await walk(c);
      }
    };
    await walk(container);
    out += this.closeLists();
    this.listStack = saved.stack; this.lastTag = saved.tags;
    return out;
  }

  // ----- page setup -----
  async pageSettings(body: Element): Promise<Partial<PageSettings>> {
    const out: Partial<PageSettings> = {};
    const sect = kids(body, 'sectPr').pop() || descendants(body, 'sectPr').pop();
    if (!sect) return out;
    const pg = kid(sect, 'pgSz');
    if (pg) {
      const w = parseInt(attr(pg, 'w') || '0', 10), h = parseInt(attr(pg, 'h') || '0', 10);
      if (w && h) {
        out.orientation = attr(pg, 'orient') === 'landscape' || w > h ? 'landscape' : 'portrait';
        const pw = Math.min(w, h), ph = Math.max(w, h);
        const sizes: [PageSettings['size'], number, number][] = [['a4', 11906, 16838], ['letter', 12240, 15840], ['legal', 12240, 20160]];
        let best = sizes[1], dist = Infinity;
        for (const s of sizes) { const d = Math.abs(s[1] - pw) + Math.abs(s[2] - ph); if (d < dist) { dist = d; best = s; } }
        out.size = best[0];
        if (dist > 400) this.warnings.add('Custom page size was mapped to the nearest standard paper size.');
      }
    }
    const mar = kid(sect, 'pgMar');
    if (mar) {
      const px = (n: string) => Math.round(parseInt(attr(mar, n) || '1440', 10) / 15);
      out.margins = { top: px('top'), bottom: px('bottom'), left: px('left'), right: px('right') };
    }
    const hf = async (kind: 'header' | 'footer') => {
      const refs = kids(sect, `${kind}Reference`);
      const ref = refs.find((r) => attr(r, 'type') === 'default') || refs[0];
      const rid = ref ? attr(ref, 'id') : null;
      const target = rid ? this.rels.get(rid)?.target : undefined;
      if (!target) return null;
      const xml = await this.text(target.startsWith('/') ? target.slice(1) : `word/${target}`);
      if (!xml) return null;
      const root = parseXml(xml).documentElement;
      let hasPage = false;
      const lines: { text: string; jc?: string }[] = [];
      for (const p of descendants(root, 'p')) {
        let text = '', inField = false;
        const instr = descendants(p, 'instrText').map((i) => i.textContent || '').join(' ') + ' ' + descendants(p, 'fldSimple').map((f) => attr(f, 'instr') || '').join(' ');
        if (/\bPAGE\b/i.test(instr)) hasPage = true;
        for (const r of descendants(p, 'r')) {
          const fc = kid(r, 'fldChar');
          const t = fc ? attr(fc, 'fldCharType') : null;
          if (t === 'begin') inField = true;
          if (t === 'end') { inField = false; continue; }
          if (inField || (r.parentNode && ln(r.parentNode as Element) === 'fldSimple')) continue;
          for (const c of kids(r)) {
            if (ln(c) === 't') text += c.textContent || '';
            else if (ln(c) === 'tab') text += '\t';
          }
        }
        if (text.trim() || text.includes('\t')) lines.push({ text, jc: attr(kid(kid(p, 'pPr'), 'jc'), 'val') || undefined });
      }
      const first = lines[0];
      let left = '', right = '';
      if (first) {
        const parts = first.text.split('\t').map((s) => s.trim());
        if (parts.length > 1) { left = parts[0]; right = parts[parts.length - 1]; }
        else if (first.jc === 'right' || first.jc === 'end') right = parts[0];
        else left = parts[0];
      }
      // The exporter adds "Page X of Y" itself when page numbers are on, so drop that boilerplate here
      if (hasPage) {
        left = left.replace(/\s*\b(page|of)\b\s*$/i, '').trim();
        right = right.replace(/\s*\b(page|of)\b\s*$/i, '').trim();
      }
      return { left, right, hasPage };
    };
    const header = await hf('header');
    if (header) { out.headerLeft = header.left; out.headerRight = header.right; }
    const footer = await hf('footer');
    if (footer) { out.footerLeft = footer.left; out.footerRight = footer.right; out.showPageNumbers = footer.hasPage; }
    return out;
  }
}

export async function importDocxStyled(arrayBuffer: ArrayBuffer): Promise<StyledImportResult> {
  const zip = await JSZip.loadAsync(arrayBuffer);
  const docFile = zip.file('word/document.xml');
  if (!docFile) throw new Error('Not a valid .docx file (word/document.xml is missing)');
  const doc = parseXml(await docFile.async('string'));
  const body = kid(doc.documentElement, 'body');
  if (!body) throw new Error('Document body not found');

  const imp = new Importer(zip);
  await imp.load();
  const html = await imp.blocks(body);
  const pageSettings = await imp.pageSettings(body);
  return { html: html || '<p></p>', warnings: Array.from(imp.warnings), pageSettings };
}
