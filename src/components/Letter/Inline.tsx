import type { ReactNode } from 'react';

const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

/** Render copy with Markdown-style [text](href) links. */
export default function Inline({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  let last = 0;

  for (const match of text.matchAll(LINK)) {
    const [whole, label, href] = match;
    const start = match.index ?? 0;
    if (start > last) parts.push(text.slice(last, start));
    parts.push(
      <a key={start} href={href}>
        {label}
      </a>,
    );
    last = start + whole.length;
  }
  if (last < text.length) parts.push(text.slice(last));

  return <>{parts}</>;
}
