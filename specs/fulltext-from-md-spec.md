**Title**
- Inject Full Text from public/md when missing

**Goals**
- When a writing page lacks an inline `<div class="fulltext">…</div>`, render full text from `public/md/<slug>.md` without modifying source content files.
- Preserve existing behaviour when fulltext is present in `src/content/writing/<slug>.md`.
- Produce HTML with required wrappers/classes: `.fulltext`, `.abstract`, and GitHub‑style footnote markup compatible with `FootnoteManager`.

**Context**
- Route: `src/pages/writing/[...slug].astro` (renders `Content` from Astro Content).
- Source: `src/content/writing/<slug>.md` may or may not include `<div class="fulltext">`.
- External longform: `public/md/<slug>.md` contains Markdown (with GFM footnotes and an optional `# Abstract` section).
- Consumers: `FootnoteManager.svelte` expects `.fulltext` and `.footnotes` structure for positioning/interaction.

**Approach**
- Detection: At build time per page, check `entry.body.includes('<div class=\"fulltext\"')`.
- If missing and `public/md/<slug>.md` exists, generate HTML on the fly and inject it into the page render; do not write back to `src/content`.
- Generation pipeline (server‑side):
  - Read `public/md/<slug>.md`.
  - Parse and convert to HTML using `remark` → `remark-gfm` (footnotes), `remark-math` → `rehype-katex` → `rehype-stringify`.
  - Extract an abstract: find a top‑level heading `^#\s*Abstract\b` and capture its following block up to the next heading. Wrap as `<div class=\"abstract\">…</div>`.
  - Wrap the entire converted body as `<div class=\"fulltext\">…</div>`, inserting the abstract div at the top (if found) before the rest of the body (with the abstract section removed from the body).
  - Ensure footnote HTML matches existing expectations: references like `<a href=\"#fnN\" class=\"footnote-ref\" id=\"fnrefN\"><sup>N</sup></a>` and a bottom section `<section id=\"footnotes\" class=\"footnotes footnotes-end-of-document\">…</section>` with back links `<a class=\"footnote-back\" …>↩︎</a>`.

**HTML Structure**
- Wrapper: `<div class=\"fulltext\"> … </div>`
- Optional abstract: `<div class=\"abstract\"> <p><strong>Abstract.</strong> …</p> </div>`
- Body: converted HTML from `public/md/<slug>.md` (minus abstract section if extracted)
- Footnotes: ordered list under `.footnotes` as produced by GFM footnotes

**Wiring in `[...slug].astro`**
- Compute `contentHasFulltext = entry.body.includes('<div class=\"fulltext\"')`.
- Compute `hasMarkdownFile` and `markdownContent` (already present).
- If `!contentHasFulltext && hasMarkdownFile`:
  - `const fulltextHtml = await renderFulltextFromMarkdown(markdownContent)`.
  - Inject `{@html fulltextHtml}` inside the `.footnote-manager-container` before `<FootnoteManager />` so selectors target the injected `.fulltext`.
- Else: render `<Content />` as today; no injection.

**Helper**
- Add `src/lib/fulltext-from-md.mjs` exporting `renderFulltextFromMarkdown(markdown: string): Promise<string>` that implements the pipeline and returns the final HTML string (including wrappers and abstract div).
- Unit‑test the helper with representative fixtures (with/without abstract; with footnotes).

**Build Behaviour**
- No mutation of `src/content/writing/*` files.
- Changes to files in `public/md/*` are reflected on next build because the HTML is generated at render time for each page.

**Edge Cases**
- Missing `public/md/<slug>.md`: do nothing (page renders without fulltext).
- Abstract not present: omit the `.abstract` div.
- Non‑GFM footnote styles: untouched; only GFM footnotes yield `.footnotes` structure.

**Acceptance Criteria**
- For a writing page lacking inline fulltext but having `public/md/<slug>.md`, the rendered HTML contains a single `.fulltext` block, an `.abstract` block when applicable, and interactive footnotes managed by `FootnoteManager`.
- For pages already containing `.fulltext` in source content, the output is unchanged.
