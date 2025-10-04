**Title**
- Inject Full Text from public/md when missing

**Goals**
- When a writing page lacks an inline `<div class="fulltext">…</div>`, render full text from `public/md/<slug>.md` without modifying source content files.
- Preserve existing behaviour when fulltext is present in `src/content/writing/<slug>.md`.
- Produce HTML with required wrappers/classes: `.fulltext`, `.abstract`, and footnotes converted from Markdown to HTML (GFM footnotes) with markup compatible with `FootnoteManager`.
 - Parse Pandoc inline attribute spans like `{#_ENREF_11 .anchor}` into empty HTML spans for anchoring, preserving their ids/classes in the final HTML.

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
  - Parse and convert to HTML using `remark` → `remark-gfm` (enable footnotes), `remark-math` → `rehype-katex` → `rehype-stringify`.
  - Pandoc span support: add a small `remark` plugin that detects inline tokens of the form `{#id .class1 .class2}` and converts them to raw HTML spans `<span id="id" class="class1 class2"></span>` in mdast before HTML conversion. Do not transform inside code blocks or code spans.
  - Footnote HTML normalization: if the emitted HTML differs from the expected markup (see Footnotes section), post‑process the HTML string using a light DOM transform (e.g., `node-html-parser` or `cheerio`) to:
    - Ensure each in‑text footnote mark is an anchor with class `footnote-ref` whose text is wrapped in a `<sup>` element, and that it carries a stable `id="fnrefN"` and `href="#fnN"` pairing.
    - Ensure the footnote list renders inside a bottom block with class `.footnotes` (`<section id="footnotes" class="footnotes footnotes-end-of-document">…</section>`), with each item as `<li id="fnN">… <a class="footnote-back" href="#fnrefN">↩︎</a></li>`.
  - Extract an abstract: find a top‑level heading `^#\s*Abstract\b` and capture its following block up to the next heading. Wrap as `<div class=\"abstract\">…</div>`.
  - Wrap the entire converted body as `<div class=\"fulltext\">…</div>`, inserting the abstract div at the top (if found) before the rest of the body (with the abstract section removed from the body).
  - Ensure footnote HTML matches existing expectations: references like `<a href=\"#fnN\" class=\"footnote-ref\" id=\"fnrefN\"><sup>N</sup></a>` and a bottom section `<section id=\"footnotes\" class=\"footnotes footnotes-end-of-document\">…</section>` with back links `<a class=\"footnote-back\" …>↩︎</a>`.

**HTML Structure**
- Wrapper: `<div class=\"fulltext\"> … </div>`
- Optional abstract: `<div class=\"abstract\"> <p><strong>Abstract.</strong> …</p> </div>`
- Body: converted HTML from `public/md/<slug>.md` (minus abstract section if extracted)
- Footnotes: ordered list under `.footnotes` as produced by GFM footnotes
 - Pandoc spans: zero‑width anchors rendered as `<span id="…" class="…"></span>` at their inline positions

**Footnotes**
- Input syntax (Markdown):
  - In‑text: `... text.[^1] more text ...`
  - Definition block (anywhere in the document):
    - `[^1]: Footnote text supporting paragraphs`
    - Optional multi‑paragraph footnotes: indent subsequent paragraphs by 4 spaces.
- Expected output (HTML):
  - In‑text mark: `<a href="#fn1" class="footnote-ref" id="fnref1"><sup>1</sup></a>`
    - Either `fn1`/`fnref1` or `fnN`/`fnrefN` numeric pattern is acceptable, but IDs must pair consistently between mark and list item.
  - Bottom block: `<section id="footnotes" class="footnotes footnotes-end-of-document"> <ol> <li id="fn1">… <a href="#fnref1" class="footnote-back" aria-label="Back to content">↩︎</a></li> … </ol> </section>`
  - The presence of `.footnotes` is mandatory so `FootnoteManager` can select and manage the list.
  - If the HTML emitter outputs `<sup id="fnref1"><a ...>1</a></sup>`, normalize to the anchor‑outer form shown above so the clickable area includes the superscript, matching existing CSS/JS expectations.

**Implementation Notes (Footnotes)**
- Prefer `remark-gfm` to parse the footnotes; this yields consistent mdast nodes for references and definitions.
- Some HTML serializers emit different wrapping order for `<sup>` and `<a>`. Add a small normalization pass over the resulting HTML to enforce the anchor‑outer pattern and class names used by the site.
- Add stable `id`/`href` pairs using the form `fnN` and `fnrefN` (no hyphens) if the upstream library uses hyphenated IDs like `fn-1`; update both references and list item IDs to match.

**Pandoc Inline Spans**
- Input syntax (no inner text): `{#id .class1 .class2}`.
- Output HTML: `<span id="id" class="class1 class2"></span>` (omit `class` attribute if no classes present).
- Input syntax (with inner text): `[Text here]{#id .class1 .class2}`.
- Output HTML: `<span id="id" class="class1 class2">Text here</span>` (HTML‑escape text as needed).
 - Input syntax (empty text): `[]{#id .class1}` → Output HTML: `<span id="id" class="class1"></span>` (no literal `[]` text should appear).
- Parsing rules:
  - Recognize `id` after `#` and any number of space‑separated `.class` tokens.
  - Ignore inside code fences and inline code.
  - Preserve placement inline; commonly used for citation/section anchors.

**Wiring in `[...slug].astro`**
- Compute `contentHasFulltext = entry.body.includes('<div class=\"fulltext\"')`.
- Compute `hasMarkdownFile` and `markdownContent` (already present).
- If `!contentHasFulltext && hasMarkdownFile`:
  - `const fulltextHtml = await renderFulltextFromMarkdown(markdownContent)`.
  - Inject `{@html fulltextHtml}` inside the `.footnote-manager-container` before `<FootnoteManager />` so selectors target the injected `.fulltext`.
- Else: render `<Content />` as today; no injection.

**Helper**
- Add `src/lib/fulltext-from-md.mjs` exporting `renderFulltextFromMarkdown(markdown: string): Promise<string>` that implements the pipeline and returns the final HTML string (including wrappers and abstract div).
- Unit‑test the helper with representative fixtures (with/without abstract; with footnotes). Include cases verifying:
  - `[ ^1 ]` references become clickable `<a class="footnote-ref"><sup>1</sup></a>` elements.
  - Footnote list renders under `.footnotes` with matching `id`/`href` pairs and back‑links.
  - Multi‑paragraph footnotes preserve paragraphs inside the corresponding `<li>`.

**Build Behaviour**
- No mutation of `src/content/writing/*` files.
- Changes to files in `public/md/*` are reflected on next build because the HTML is generated at render time for each page.

**Edge Cases**
- Missing `public/md/<slug>.md`: do nothing (page renders without fulltext).
- Abstract not present: omit the `.abstract` div.
- Non‑GFM footnote styles: untouched; only GFM footnotes yield `.footnotes` structure.
 - Documents without footnote definitions but with marks: leave marks as plain text; do not inject an empty `.footnotes` section.
 - Duplicate footnote labels (e.g., `[^a]` used twice): rely on parser behavior to de‑duplicate; emit a single list item and multiple references to it.

**Acceptance Criteria**
- For a writing page lacking inline fulltext but having `public/md/<slug>.md`, the rendered HTML contains a single `.fulltext` block, an `.abstract` block when applicable, and interactive footnotes managed by `FootnoteManager`.
- For pages already containing `.fulltext` in source content, the output is unchanged.
- A sample input like:
  - `Paragraph with a note.[^1]` and `[^1]: Footnote text.`
  results in HTML where the paragraph contains `<a class="footnote-ref" id="fnref1" href="#fn1"><sup>1</sup></a>` and the page contains a bottom `<section class="footnotes">…<li id="fn1">Footnote text <a class="footnote-back" href="#fnref1">↩︎</a></li>…</section>`.
 - A sample input like `{#_ENREF_11 .anchor}` renders `<span id="_ENREF_11" class="anchor"></span>` at that position in the output.
