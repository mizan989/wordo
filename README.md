# Wordo

![Wordo logo](app/src/assets/wordo-logo.png)

Wordo is an independent desktop word processor built with Tauri 2, React, TypeScript, and Tiptap/ProseMirror. It is not a client for Microsoft Word.

## Current capabilities

- Rich text editing with headings, lists, links, images, tables, common text formatting, and local recovery drafts.
- Blank document startup, explicit templates, native desktop open/save dialogs, recent-document reopening, and Save As.
- DOCX import through Mammoth and DOCX generation through the `docx` package.
- HTML and plain text open/export, document settings, print, and print-to-PDF through the platform print dialog.
- Page size, orientation, and margins affect the editing canvas and DOCX export. Explicit page breaks are distinct from horizontal rules.

DOCX import/export is best-effort. Complex Word layouts, including table geometry, headers/footers, floating objects, and advanced typography, may not round-trip identically. The editing canvas does not yet implement true flowing multi-page pagination. PDF output uses the platform print engine.

## Development

Requirements: Node.js/npm, Rust/Cargo, and Tauri's Linux system dependencies when building on Linux.

```sh
cd app
npm install
npm run dev          # Vite development server
npm run tauri:dev    # Desktop development app
npm run build        # Production frontend and generated static pages
npm run tauri:build  # Desktop bundles; runs the frontend build first
npx tsc --noEmit     # TypeScript check
```

There is no automated test suite configured yet. Tauri keeps the existing application identifier `com.wordclient.desktop` and the existing local recovery storage keys so current user data remains accessible across the rename.

## Linux packages

Tauri produces installer names from the Wordo product name and version. Install a generated Debian package with:

```sh
sudo apt install ./Wordo_1.0.0_amd64.deb
```

## Naming

Wordo is a standalone word processor, not a Word client application.

## License

Proprietary / Commercial Distribution. All rights reserved.
