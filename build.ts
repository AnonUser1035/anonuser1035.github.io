/**
 * Builds the static site.
 *
 *   node build.ts         production build into out/ (GA from GA_TRACKING_ID)
 *   node build.ts --dev   dev build into .dev/ that reloads itself on rebuild
 *                         (npm run dev serves it)
 */
import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { gzipSync } from 'node:zlib';

import { renderSite } from './src/render/site.ts';

const dev = process.argv.includes('--dev');
const out = dev ? '.dev' : 'out';

const files = renderSite(
  dev ? { dev } : { gaId: process.env.GA_TRACKING_ID || undefined },
);

rmSync(out, { recursive: true, force: true });
cpSync('public', out, { recursive: true });
for (const [path, body] of Object.entries(files)) {
  mkdirSync(dirname(join(out, path)), { recursive: true });
  writeFileSync(join(out, path), body);
}

const home = files['index.html'];
const kb = (bytes: number) => `${(bytes / 1024).toFixed(1)} KB`;
console.log(
  `Built ${out}/: index.html ${kb(home.length)} (${kb(gzipSync(home).length)} gzipped)`,
);
