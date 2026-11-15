import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const scriptPath = path.join(__dirname, 'generate_site.py');

const isWin = process.platform === 'win32';
let cmd = isWin ? 'python' : 'python3';
let res = spawnSync(cmd, [scriptPath], { stdio: 'inherit' });

if ((res.error || res.status !== 0) && isWin) {
  res = spawnSync('python3', [scriptPath], { stdio: 'inherit' });
} else if ((res.error || res.status !== 0) && !isWin) {
  res = spawnSync('python', [scriptPath], { stdio: 'inherit' });
}

process.exit(res.status ?? (res.error ? 1 : 0));
