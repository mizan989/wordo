# Word-Client

> **Premium Cross-Platform Desktop Word Processor**  
> Designed for Linux, Windows, and macOS with native desktop behavior, Microsoft Word Online interaction parity, and high-fidelity OpenXML (.docx) import/export.

---

## Overview

**Word-Client** is a modern desktop word processor built with **Tauri 2**, **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Tiptap 3 / ProseMirror**. It provides a distraction-free, page-based editing experience with Microsoft Office styling, typography controls, and resilient offline recovery.

---

## Key Features

- **Document Editing Engine**: Structured ProseMirror document model with rich-text marks, headings, lists, tables, images, code blocks, task checklists, and page breaks.
- **Word Online Formatting Experience**:
  - **Font Scale & Stepping**: Complete Microsoft Office font scale (`8` to `72` pt, including `10.5` pt for CJK/academic typography) with editable custom size input and Grow/Shrink font buttons (<kbd>A^</kbd> / <kbd>Av</kbd>).
  - **Full Font Family Library**: Modern `Aptos` and `Aptos Display` defaults, classic `Calibri`, `Segoe UI`, `Arial`, `Times New Roman`, `Georgia`, `Garamond`, `Consolas`, and more.
  - **10×6 Office Theme Colors Matrix**: Base colors with 5 tiers of tints/shades, standard colors, Automatic, and custom color picker.
  - **15 Standard Word Highlighters**: Full palette of Office highlighters plus "No Color".
  - **Quick Styles Gallery**: Normal, No Spacing, Heading 1, Heading 2, Heading 3, Title, Subtitle, and Blockquote cards.
  - **Format Painter**: Single-click and double-click (pin) to copy and apply formatting across selections.
  - **Case Transformation**: Sentence case, lowercase, UPPERCASE, Capitalize Each Word, and tOGGLE cASE (<kbd>Shift+F3</kbd>).
  - **Line & Paragraph Spacing**: 1.0, 1.15 (Word default), 1.5, 2.0, 2.5, 3.0, and Add/Remove Space Before/After Paragraph.
- **Document Workspace**:
  - **Interactive Ruler**: Draggable margin slider handles for Left and Right page margins with live dimension readouts in inches.
  - **Inline Header & Footer**: Double-click header or footer margins to edit inline.
  - **Page Layout & Orientation**: Letter / A4 page canvas in Portrait or Landscape mode with customizable margin presets (Normal, Narrow, Wide).
  - **Page Colors & Watermarks**: Background tints (Cream, Sepia, Mint, Soft Blue, Dark Slate) and diagonal watermarks (CONFIDENTIAL, DRAFT, DO NOT COPY, URGENT, Custom).
  - **Floating Mini-Toolbar**: Fast-access formatting toolbar appearing directly above active text selections.
- **Native Document Compatibility**:
  - **DOCX Round-Trip**: Seamless `.docx` import and export via OpenXML with embedded image preservation, styled tables, headings, highlights, custom margins, headers/footers, and dynamic page numbering.
  - **Multi-Format Export**: Export to DOCX, PDF, HTML, and TXT.
- **Productivity & Resilience**:
  - **Crash Recovery & Auto-Drafting**: Automatic IndexedDB/local draft snapshots with instant recovery banner upon unexpected exits.
  - **Navigation & Find/Replace**: ProseMirror-native text traversal with live occurrence counts and match replacement.
  - **Spell & Grammar Assistant**: Real-time proofing with issue highlights and replacement suggestions.
  - **Document Statistics**: Live word count, character count, paragraph count, and reading/speaking time estimates.

---

## Keyboard Shortcuts

| Shortcut | Action |
| --- | --- |
| <kbd>Ctrl/Cmd + N</kbd> | New Document |
| <kbd>Ctrl/Cmd + O</kbd> | Open Document |
| <kbd>Ctrl/Cmd + S</kbd> | Save Document |
| <kbd>Ctrl/Cmd + Shift + S</kbd> | Save As |
| <kbd>Ctrl/Cmd + P</kbd> | Print Document |
| <kbd>Ctrl/Cmd + F</kbd> | Find & Replace |
| <kbd>Ctrl/Cmd + K</kbd> | Insert Link |
| <kbd>Ctrl/Cmd + Enter</kbd> | Insert Page Break |
| <kbd>Ctrl/Cmd + ]</kbd> / <kbd>Ctrl/Cmd + Shift + &gt;</kbd> | Grow Font Size |
| <kbd>Ctrl/Cmd + [</kbd> / <kbd>Ctrl/Cmd + Shift + &lt;</kbd> | Shrink Font Size |
| <kbd>Ctrl/Cmd + Space</kbd> | Clear Formatting |
| <kbd>Ctrl/Cmd + Shift + C</kbd> | Copy Formatting (Format Painter) |
| <kbd>Ctrl/Cmd + Shift + V</kbd> | Paste Formatting |
| <kbd>Ctrl/Cmd + Shift + G</kbd> | Document Word Count & Insights |
| <kbd>Ctrl/Cmd + E / L / R / J</kbd> | Align Center / Left / Right / Justify |
| <kbd>Ctrl/Cmd + 1 / 2 / 5</kbd> | Single / Double / 1.5 Line Spacing |
| <kbd>Ctrl/Cmd + =</kbd> | Subscript |
| <kbd>Ctrl/Cmd + Shift + +</kbd> | Superscript |
| <kbd>Shift + F3</kbd> | Toggle Case |

---

## Installation (.deb for Debian / Ubuntu / Kali)

Download the release `.deb` package or use the included package:

```bash
# Install with apt (resolves system dependencies)
sudo apt install ./Word-Client_1.0.0_amd64.deb

# Or with dpkg
sudo dpkg -i Word-Client_1.0.0_amd64.deb
sudo apt install -f
```

---

## Development & Building from Source

### Prerequisites
- Node.js 18+ & npm
- Rust & Cargo (latest stable)
- Linux build dependencies: `libwebkit2gtk-4.1-dev`, `build-essential`, `curl`, `wget`, `file`, `libssl-dev`, `libgtk-3-dev`, `libayatana-appindicator3-dev`, `librsvg2-dev`

### Setup

```bash
# Navigate to the app directory
cd app

# Install dependencies
npm install

# Run in desktop development mode (Vite + Tauri)
npm run tauri dev

# Build the desktop release and Debian package
npm run tauri build -- --bundles deb
```

---

## License

Proprietary / Commercial Distribution. All rights reserved.
