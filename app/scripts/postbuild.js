import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

const routes = [
  'create/en/document-editor',
  'create/en/spell-checker',
  'create/en/grammar-checker',
  'create/en/word-counter',
  'en-us',
];

if (fs.existsSync(distDir)) {
  const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');

  for (const route of routes) {
    const targetDir = path.join(distDir, route);
    fs.mkdirSync(targetDir, { recursive: true });

    const depth = route.split('/').length;
    const prefix = '../'.repeat(depth);

    const routeHtml = indexHtml
      .replaceAll('href="./assets/', `href="${prefix}assets/`)
      .replaceAll('src="./assets/', `src="${prefix}assets/`)
      .replaceAll('href="./', `href="${prefix}`)
      .replaceAll('src="./', `src="${prefix}`);

    // Write index.html inside the directory
    fs.writeFileSync(path.join(targetDir, 'index.html'), routeHtml, 'utf8');

    // Also write a copy to route + '.html' (e.g. /create/en/document-editor.html)
    const htmlFilePath = path.join(distDir, `${route}.html`);
    fs.mkdirSync(path.dirname(htmlFilePath), { recursive: true });
    fs.writeFileSync(htmlFilePath, routeHtml, 'utf8');

    console.log(`Generated static entry for /${route}/ and /${route}.html`);
  }
}
