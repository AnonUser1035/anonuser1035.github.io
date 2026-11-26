/** Small HTML helpers and the page shell every route shares. */
import { NAME } from '../data/content.ts';
import { FONTS, KEYWORDS, OG_IMAGE, SITE_URL, THEME_COLORS } from '../site.ts';

/** Escape text and attribute values. */
export function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

/** Copy with Markdown-style [text](href) links. */
export function inline(text: string): string {
  let html = '';
  let last = 0;
  for (const match of text.matchAll(LINK)) {
    const [whole, label, href] = match;
    const start = match.index ?? 0;
    html += `${esc(text.slice(last, start))}<a href="${esc(href)}">${esc(label)}</a>`;
    last = start + whole.length;
  }
  return html + esc(text.slice(last));
}

/** Structured data, with `<` escaped so it can never close the script. */
export function jsonLd(data: Record<string, unknown>): string {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return `<script type="application/ld+json">${json}</script>`;
}

export interface PageMeta {
  /** Page name; the homepage leaves it out and is titled with the name. */
  title?: string;
  description: string;
  /** Canonical path for og:url. Leave out for the 404 page. */
  path?: `/${string}`;
  noindex?: boolean;
}

export interface DocumentOptions {
  meta: PageMeta;
  body: string;
  /** Minified CSS, inlined. */
  css: string;
  /** Minified script, inlined at the end of the body. */
  script?: string;
  /** Google Analytics measurement ID (production only). */
  gaId?: string;
}

function head({ title, description, path, noindex }: PageMeta): string {
  const fullTitle = title ? `${title} | ${NAME}` : NAME;
  const image = new URL(OG_IMAGE.url, SITE_URL).toString();
  const meta = (key: 'name' | 'property', id: string, content: string) =>
    `<meta ${key}="${id}" content="${esc(content)}">`;

  return [
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<meta name="theme-color" content="${THEME_COLORS.light}" media="(prefers-color-scheme: light)">`,
    `<meta name="theme-color" content="${THEME_COLORS.dark}" media="(prefers-color-scheme: dark)">`,
    `<title>${esc(fullTitle)}</title>`,
    meta('name', 'description', description),
    meta('name', 'author', NAME),
    meta('name', 'keywords', KEYWORDS.join(',')),
    meta('name', 'creator', NAME),
    noindex
      ? meta('name', 'robots', 'noindex')
      : meta('name', 'robots', 'index, follow') +
        meta(
          'name',
          'googlebot',
          'index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1',
        ),
    meta('property', 'og:title', fullTitle),
    meta('property', 'og:description', description),
    path ? meta('property', 'og:url', new URL(path, SITE_URL).toString()) : '',
    meta('property', 'og:site_name', NAME),
    meta('property', 'og:locale', 'en_US'),
    meta('property', 'og:image', image),
    meta('property', 'og:image:width', String(OG_IMAGE.width)),
    meta('property', 'og:image:height', String(OG_IMAGE.height)),
    meta('property', 'og:image:alt', OG_IMAGE.alt),
    meta('property', 'og:type', 'website'),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:title', fullTitle),
    meta('name', 'twitter:description', description),
    meta('name', 'twitter:image', image),
    '<link rel="icon" href="/icon.svg" type="image/svg+xml">',
    '<link rel="apple-touch-icon" href="/apple-touch-icon.png">',
    ...FONTS.map(
      (href) =>
        `<link rel="preload" href="${href}" as="font" type="font/woff2" crossorigin>`,
    ),
  ].join('');
}

/**
 * Google Analytics, queued immediately but fetched only after the page has
 * loaded, so its 180 KB script never competes with the page itself.
 */
function analytics(id: string): string {
  if (!/^G-[A-Z0-9]+$/.test(id)) {
    throw new Error(`Unexpected Google Analytics ID: ${id}`);
  }
  const src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  return (
    '<script>window.dataLayer=window.dataLayer||[];' +
    'function gtag(){dataLayer.push(arguments)}' +
    `gtag('js',new Date());gtag('config','${id}');` +
    "addEventListener('load',()=>{const s=document.createElement('script');" +
    `s.async=true;s.src='${src}';document.head.append(s)})</script>`
  );
}

export function document({
  meta,
  body,
  css,
  script,
  gaId,
}: DocumentOptions): string {
  return (
    `<!doctype html><html lang="en"><head>${head(meta)}` +
    `<style>${css}</style></head><body>${body}` +
    (script ? `<script>${script}</script>` : '') +
    (gaId ? analytics(gaId) : '') +
    '</body></html>\n'
  );
}
