import { describe, it, expect } from 'vitest';
import { renderFulltextFromMarkdown } from '../src/lib/fulltext-from-md.mjs';

describe('Pandoc inline attribute spans', () => {
  it('converts {#id .class} to an empty anchor span', async () => {
    const md = 'Before\n\n{#_ENREF_11 .anchor}\n\nAfter';
    const html = await renderFulltextFromMarkdown(md);
    expect(html).toContain('<span id="_ENREF_11" class="anchor"></span>');
  });

  it('supports multiple classes and keeps placement inline', async () => {
    const md = 'X {#sec-1 .a .b} Y';
    const html = await renderFulltextFromMarkdown(md);
    // Appears inline between X and Y
    expect(html).toMatch(/X\s*<span id=\"sec-1\" class=\"a b\"><\/span>\s*Y/);
  });

  it('converts [text]{.class} into a wrapped span', async () => {
    const md = '[Psychological Review]{.underline}';
    const html = await renderFulltextFromMarkdown(md);
    expect(html).toContain('<span class="underline">Psychological Review</span>');
  });

  it('converts [text]{#id .class} into a wrapped span with id', async () => {
    const md = 'A [X]{#tag .k} B';
    const html = await renderFulltextFromMarkdown(md);
    expect(html).toMatch(/A\s*<span id=\"tag\" class=\"k\">X<\/span>\s*B/);
  });

  it('does not affect links like [text](url)', async () => {
    const md = '[example](https://example.com)';
    const html = await renderFulltextFromMarkdown(md);
    expect(html).toContain('<a href="https://example.com">example</a>');
    expect(html).not.toContain('<span');
  });

  it('does not parse inside code spans or blocks', async () => {
    const md = 'Inline `code {#id .x}`\n\n```\nblock {#id .x}\n```';
    const html = await renderFulltextFromMarkdown(md);
    // Literal braces remain
    expect(html).toContain('code {#id .x}');
    expect(html).toContain('block {#id .x}');
    // No unintended spans for these
    expect(html).not.toMatch(/<span id=\"id\" class=\"x\"><\/span>/);
  });
});
