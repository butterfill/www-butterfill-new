import { describe, it, expect } from 'vitest';
import { renderFulltextFromMarkdown } from '../src/lib/fulltext-from-md.mjs';

describe('renderFulltextFromMarkdown', () => {
  it('wraps output in .fulltext and converts footnotes', async () => {
    const md = 'Para[^1].\n\n[^1]: Footnote text.';
    const html = await renderFulltextFromMarkdown(md);

    expect(html).toContain('<div class="fulltext">');
    // In-text reference anchor and sup
    expect(html).toMatch(/class=\"[^\"]*footnote-ref[^\"]*\"/);
    expect(html).toContain('id="fnref1"');
    expect(html).toContain('href="#fn1"');
    expect(html).toContain('<sup>1</sup>');

    // Footnotes section and list item id
    expect(html).toMatch(/<section[^>]*class=\"[^\"]*footnotes[^\"]*\"/);
    expect(html).toContain('id="footnotes"');
    expect(html).toContain('<li id="fn1"');

    // Back link normalization
    expect(html).toContain('class="footnote-back"');
    expect(html).toContain('href="#fnref1"');
    expect(html).toContain('↩︎');
  });

  it('extracts and prefixes Abstract section', async () => {
    const md = '# Abstract\nThis is the abstract.\n\n# Heading\nBody.';
    const html = await renderFulltextFromMarkdown(md);

    // Has abstract block with prefix
    expect(html).toMatch(/<div class=\"abstract\">[\s\S]*<strong>Abstract\.<\/strong> This is the abstract\./);
    // The Abstract heading itself should not appear in the body
    expect(html).not.toMatch(/>\s*Abstract\s*</);
    // Body heading remains
    expect(html).toMatch(/<h1[^>]*>Heading<\/h1>/);
  });

  it('adds stable unique ids to generated headings', async () => {
    const md = '# 1. Outline\nBody.\n\n# 1. Outline\nMore.\n\n## Mapping & selection\nDetails.';
    const html = await renderFulltextFromMarkdown(md);

    expect(html).toContain('<h1 id="section-1-outline">1. Outline</h1>');
    expect(html).toContain('<h1 id="section-1-outline-2">1. Outline</h1>');
    expect(html).toContain('<h2 id="section-mapping-selection">Mapping &#x26; selection</h2>');
  });

  it('does not create footnotes section when marks have no definitions', async () => {
    const md = 'Para[^1].';
    const html = await renderFulltextFromMarkdown(md);

    expect(html).toContain('<div class="fulltext">');
    expect(html).not.toContain('class="footnotes');
    expect(html).not.toContain('class="footnote-ref"');
    // The literal marker should remain
    expect(html).toContain('[^1]');
  });
});

