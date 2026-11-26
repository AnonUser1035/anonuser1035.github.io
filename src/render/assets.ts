/**
 * Reads the stylesheets and client scripts and minifies them just enough to
 * inline. Deliberately simple: the sources avoid the constructs these regexes
 * can't handle (comment markers inside strings, statements that rely on
 * automatic semicolon insertion across lines).
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path: string) => readFileSync(join(SRC, path), 'utf8');

export function minifyCss(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};,>])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

export function minifyJs(js: string): string {
  return js
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('//'))
    .join('\n');
}

/** Stylesheets from src/styles, in order. */
export const styles = (names: string[]) =>
  minifyCss(names.map((name) => read(`styles/${name}.css`)).join('\n'));

/** Client scripts from src/client, in order, each its own IIFE. */
export const scripts = (names: string[]) =>
  names.map((name) => minifyJs(read(`client/${name}.js`))).join('\n');
