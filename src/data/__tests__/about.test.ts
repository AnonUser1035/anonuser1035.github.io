import { describe, expect, it } from 'vitest';

import { aboutMarkdown } from '../about';

describe('about data', () => {
  it('exports aboutMarkdown as a string', () => {
    expect(typeof aboutMarkdown).toBe('string');
    expect(aboutMarkdown.length).toBeGreaterThan(0);
  });

  it('contains the intro section', () => {
    expect(aboutMarkdown).toContain('# Intro');
    expect(aboutMarkdown).toContain('Johns Hopkins');
    expect(aboutMarkdown).toContain('Neuro Safety Systems');
  });

  it('keeps the focused-ultrasound throughline in the intro', () => {
    expect(aboutMarkdown).toContain('focused ultrasound');
    expect(aboutMarkdown).toContain('EMT');
  });

  it('points to the resume and publications for the full record', () => {
    expect(aboutMarkdown).toContain('(/resume)');
    expect(aboutMarkdown).toContain('(/publications)');
  });

  it('contains the outside-the-lab section', () => {
    expect(aboutMarkdown).toContain('# Outside the lab');
    expect(aboutMarkdown).toContain('Iranian Cultural Society');
  });

  it('contains valid markdown links', () => {
    // Check for markdown link format [text](url)
    const linkRegex = /\[.+?\]\(.+?\)/g;
    const links = aboutMarkdown.match(linkRegex);

    expect(links).not.toBeNull();
    expect(links!.length).toBeGreaterThan(4);
  });

  it('contains properly formatted headers', () => {
    // Check for markdown headers
    const headerRegex = /^#+ .+$/gm;
    const headers = aboutMarkdown.match(headerRegex);

    expect(headers).not.toBeNull();
    expect(headers!.length).toBeGreaterThanOrEqual(2);
  });
});
