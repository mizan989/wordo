// Word's "single" line spacing is the font's own line height (ascent + descent + line gap),
// while CSS unitless line-height multiplies the font SIZE. These factors convert between the two.
// Values are (hhea ascender + descender + lineGap) / unitsPerEm of the Windows fonts; the open,
// metric-compatible replacements (Carlito, Caladea, Tinos, Arimo, Cousine, Gelasio, Selawik) match them.
const FACTORS: Record<string, number> = {
  calibri: 1.2207, 'calibri light': 1.2207, carlito: 1.2207,
  cambria: 1.1719, caladea: 1.1719,
  'times new roman': 1.1499, tinos: 1.1499, 'liberation serif': 1.1499,
  arial: 1.1499, arimo: 1.1499, 'liberation sans': 1.1499, helvetica: 1.1499,
  georgia: 1.1362, gelasio: 1.1362,
  'courier new': 1.1328, cousine: 1.1328, 'liberation mono': 1.1328,
  'segoe ui': 1.3301, selawik: 1.3301,
  verdana: 1.2153, tahoma: 1.2070, 'trebuchet ms': 1.1621,
  consolas: 1.1704, 'lucida console': 1.1328,
  'book antiqua': 1.2002, 'palatino linotype': 1.2002, garamond: 1.1211,
  aptos: 1.2, 'aptos narrow': 1.2, 'aptos display': 1.2,
  'imprint mt shadow': 1.215,
};
export const DEFAULT_LINE_FACTOR = 1.15;

// Exact factors read from fonts the user imported (override the table above)
const MEASURED = new Map<string, number>();
export function registerLineFactor(font: string, factor: number) {
  MEASURED.set(font.replace(/["']/g, '').trim().toLowerCase(), factor);
}

export function lineHeightFactor(font?: string | null): number {
  if (!font) return FACTORS.calibri;
  const key = font.split(',')[0].replace(/["']/g, '').trim().toLowerCase();
  return MEASURED.get(key) ?? FACTORS[key] ?? DEFAULT_LINE_FACTOR;
}

/** Word line multiple (1.0 = single) -> CSS unitless line-height for this font. */
export const wordToCssLineHeight = (multiple: number, font?: string | null): number =>
  Math.round(multiple * lineHeightFactor(font) * 1000) / 1000;

/** CSS unitless line-height -> Word line multiple for this font. */
export const cssToWordLineHeight = (cssLineHeight: number, font?: string | null): number =>
  cssLineHeight / lineHeightFactor(font);

/** True if a font family appears to be installed (browser only; returns true when it cannot tell). */
export function isFontAvailable(font: string): boolean {
  if (typeof document === 'undefined') return true;
  try {
    const name0 = font.replace(/["']/g, '').toLowerCase();
    // Fonts declared with @font-face (bundled or aliased) count as available
    const faces: any = (document as any).fonts;
    if (faces && typeof faces.forEach === 'function') {
      let declared = false;
      faces.forEach((f: any) => { if (String(f.family).replace(/["']/g, '').toLowerCase() === name0) declared = true; });
      if (declared) return true;
    }
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return true;
    const sample = 'mmmmmmmmmmlliWWWW@#0123456789';
    const width = (family: string) => {
      ctx.font = `72px ${family}`;
      return ctx.measureText(sample).width;
    };
    const name = font.replace(/["']/g, '');
    return ['monospace', 'serif', 'sans-serif'].some((base) => width(`"${name}", ${base}`) !== width(base));
  } catch {
    return true;
  }
}
