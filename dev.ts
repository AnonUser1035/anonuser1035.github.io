/**
 * Dev server: builds with --dev, serves .dev/ on http://localhost:3000 (and
 * the local network, for phones), and rebuilds and reloads on every change.
 */
import { spawnSync } from 'node:child_process';
import { readFileSync, statSync, watch } from 'node:fs';
import { createServer, type ServerResponse } from 'node:http';
import { networkInterfaces } from 'node:os';
import { extname, join, resolve, sep } from 'node:path';

const ROOT = resolve('.dev');
const PORT = Number(process.env.PORT ?? 3000);
const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.pdf': 'application/pdf',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};
const clients = new Set<ServerResponse>();

function build(): boolean {
  const result = spawnSync(process.execPath, ['build.ts', '--dev'], {
    stdio: 'inherit',
  });
  return result.status === 0;
}

function file(path: string): string | null {
  const full = resolve(ROOT, `.${path}`);
  if (full !== ROOT && !full.startsWith(ROOT + sep)) return null;
  try {
    return statSync(full).isDirectory() ? join(full, 'index.html') : full;
  } catch {
    return null;
  }
}

build();

createServer((req, res) => {
  const { pathname } = new URL(req.url ?? '/', 'http://localhost');
  if (pathname === '/__reload') {
    res.writeHead(200, {
      'content-type': 'text/event-stream',
      'cache-control': 'no-cache',
    });
    res.write(': connected\n\n');
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }
  const path = file(decodeURIComponent(pathname));
  try {
    if (!path) throw new Error('not found');
    const body = readFileSync(path);
    res.writeHead(200, { 'content-type': TYPES[extname(path)] ?? '' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'content-type': TYPES['.html'] });
    res.end(readFileSync(join(ROOT, '404.html')));
  }
}).listen(PORT, () => {
  const lan = Object.values(networkInterfaces())
    .flat()
    .find((net) => net?.family === 'IPv4' && !net.internal)?.address;
  console.log(`\nDev site: http://localhost:${PORT}`);
  if (lan) console.log(`On your phone (same Wi-Fi): http://${lan}:${PORT}`);
});

let timer: ReturnType<typeof setTimeout> | undefined;
const rebuild = () => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    if (build()) for (const client of clients) client.write('data: reload\n\n');
  }, 60);
};
watch('src', { recursive: true }, rebuild);
watch('public', { recursive: true }, rebuild);
watch('build.ts', rebuild);
