import { readFileSync } from 'node:fs';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';

const sourcePath = 'src/content/writing/apperly2025_mindreading.md';
const fulltextPath = 'public/md/apperly2025_mindreading.md';

describe('published Apperly, Devine & Butterfill article', () => {
  it('uses the published Cognition metadata', () => {
    const source = matter(readFileSync(sourcePath, 'utf8'));

    expect(source.data.title).toBe(
      'Mindreading as asynchronous coordination: The MAC account of theory of mind performance, and individual differences'
    );
    expect(source.data.authors).toBe(
      'Apperly, Ian A. and Devine, Rory T. and Butterfill, Stephen A.'
    );
    expect(source.data.year).toBe(2026);
    expect(source.data.journal).toBe('Cognition');
    expect(source.data.volume).toBe('274');
    expect(source.data.pages).toBe('106569');
    expect(source.data.doi).toBe('10.1016/j.cognition.2026.106569');
    expect(source.data.bibtex).toContain('@article{apperly:2026_mindreading');
    expect(source.data.bibtex).toContain('journal = {Cognition}');
  });

  it('uses the final MAC abstract and full text rather than the MAJA draft', () => {
    const fulltext = readFileSync(fulltextPath, 'utf8');

    expect(fulltext).toContain('# Abstract');
    expect(fulltext).toContain(
      'so is essentially a coordination activity. It is asynchronous coordination because'
    );
    expect(fulltext).toContain('The MAC (Mindreading as Asynchronous Coordination) account');
    expect(fulltext).toContain('# 6. General summary and conclusion');
    expect(fulltext).not.toContain('M-A-J-A');
    expect(fulltext).not.toContain('asynchronous joint activity');
  });
});
