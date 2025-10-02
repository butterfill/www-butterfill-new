import { describe, it, expect } from 'vitest';

describe('generateLlmsBundle', () => {
  it('produces metadata and summaries within configured limits', async () => {
    const { generateLlmsBundle } = await import('../scripts/lib/llms-generator.mjs');
    const bundle = await generateLlmsBundle({ writeFiles: false });

    expect(bundle.metadata.length).toBeGreaterThan(0);
    expect(bundle.counts.byType.publication).toBeGreaterThan(0);
    expect(bundle.counts.total).toEqual(bundle.metadata.length);
    expect(bundle.llmsText.length).toBeLessThanOrEqual(65000);

    const publication = bundle.metadata.find((entry) => entry.slug === 'writing/apperly2025_mindreading');
    expect(publication).toBeDefined();
    expect(publication?.summary?.length ?? 0).toBeGreaterThan(40);
  });

  it('creates content descriptors with frontmatter for long-form items', async () => {
    const { generateLlmsBundle } = await import('../scripts/lib/llms-generator.mjs');
    const bundle = await generateLlmsBundle({ writeFiles: false });

    const contentFile = bundle.contentFiles.find((file) =>
      file.relativePathOnSite === 'content/writing/apperly2025_mindreading.md'
    );

    expect(contentFile).toBeDefined();
    expect(contentFile?.contents.startsWith('---')).toBe(true);
    expect(contentFile?.contents.includes('summary: ')).toBe(true);
  });
});
