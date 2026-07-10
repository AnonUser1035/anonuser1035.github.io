import { describe, expect, it } from 'vitest';

import projects from '../projects';

describe('projects data', () => {
  it('exports an array of projects', () => {
    expect(Array.isArray(projects)).toBe(true);
    expect(projects.length).toBeGreaterThan(0);
  });

  it('each project has required properties', () => {
    for (const project of projects) {
      expect(project).toHaveProperty('title');
      expect(project).toHaveProperty('date');
      expect(project).toHaveProperty('desc');

      expect(typeof project.title).toBe('string');
      expect(typeof project.date).toBe('string');
      expect(typeof project.desc).toBe('string');
    }
  });

  it('project titles are non-empty', () => {
    for (const project of projects) {
      expect(project.title.trim().length).toBeGreaterThan(0);
    }
  });

  it('project descriptions are non-empty', () => {
    for (const project of projects) {
      expect(project.desc.trim().length).toBeGreaterThan(0);
    }
  });

  it('dates are valid date strings', () => {
    for (const project of projects) {
      const date = new Date(project.date);
      expect(date.toString()).not.toBe('Invalid Date');
    }
  });

  it('links are valid URLs or internal routes when present', () => {
    // External demos use absolute http(s) URLs; internal projects link to a
    // site route beginning with "/".
    const linkRegex = /^(https?:\/\/.+|\/.*)$/;

    for (const project of projects) {
      if (project.link) {
        expect(project.link).toMatch(linkRegex);
      }
    }
  });

  it('has unique project titles', () => {
    const titles = projects.map((p) => p.title);
    const uniqueTitles = new Set(titles);

    expect(uniqueTitles.size).toBe(titles.length);
  });
});
