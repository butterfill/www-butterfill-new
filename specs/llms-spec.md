# LLM Content Bundle Refresh

## Background
- The current generator (`scripts/generate-llms.mjs`) concatenates metadata and **full** markdown/HTML bodies for writing and talk entries into a single `public/llms.txt` (~1.3 MB).
- A handful of writing entries include embedded `<div class="fulltext">` HTML, so the export reproduces entire articles, while most items contribute only short stubs.
- Teaching content (`src/content/teaching`) and other collections are excluded, leaving gaps in academic coverage.
- Large, monolithic text files are unwieldy for LLM ingestion pipelines that benefit from structured metadata, chunking, and predictable summaries.

## Goals
1. Keep the site useful to LLMs by providing structured, lightweight discovery data and access to long-form content without bloating a single file.
2. Extend coverage to all relevant academic content (writing, talks, teaching; future-ready for more collections).
3. Produce deterministic, maintainable output that integrates into the existing build pipeline and is easy to validate.

## Requirements
- Preserve a human-readable `llms.txt`, but restrict it to concise summaries plus key metadata per item (no full articles).
- Output structured metadata (JSON or NDJSON) that enumerates every included item with fields useful for downstream ingestion (type, title, authors, dates, urls, summary, file references, etc.).
- Export long-form bodies as separate, reusable, per-item markdown/plain-text files to allow targeted retrieval and chunking.
- Detect and normalise `<div class="fulltext">` blocks by converting embedded HTML to markdown/plain text; retain original markdown if no fulltext block exists.
- Include teaching items (and be easily configurable for other collections) with schema-aware handling of their metadata.
- Ensure generated artefacts live under `public/llms/` (or equivalent) so they are deployed with the static site.
- Add guardrails (docs/tests) so regressions in coverage or file size are caught early.

## Proposed Outputs
- `public/llms.txt`: ordered list where each entry includes a header (`Title`, `Authors`, `Type`, `Year/Date`, `URL`) and a short summary paragraph. No full bodies.
- `public/llms/metadata.json`: array of objects capturing canonical metadata, summary, content file path, slug, tags/flags (featured, forthcoming, etc.). Consider `metadata.ndjson` if streaming is needed.
- `public/llms/content/{slug}.md`: per-item markdown (or `.txt`) containing the cleaned long-form content. Only created when a substantive body exists.
- Optional `public/llms/index.json` for quick lookups (e.g., mapping slug → metadata) if useful for consumers.

## Content Processing Pipeline
1. **Collection Aggregation**
   - Gather writing, talks, teaching (and future collections) via a shared helper that records the source collection and infers slugs.
   - For talks/teaching, extract relevant metadata (event, location, term, urls) and normalise dates to ISO strings.
2. **Body Extraction & Cleaning**
   - If body contains `<div class="fulltext">…</div>`, isolate that section; otherwise use the existing markdown body.
   - Convert HTML fragments to markdown/plain text (e.g., via Turndown or a remark plugin) while preserving semantic cues (headings, emphasis, links).
   - Strip trailing whitespace, fix unescaped entities, and ensure deterministic line endings.
3. **Summary Generation**
   - Prefer explicit summaries (`Abstract`, frontmatter `abstract`, leading paragraphs before `<div class="fulltext">`).
   - Fallback: take the first N sentences (configurable, e.g., 2–3 sentences or 600 characters max) of the cleaned body.
   - Persist summary both in `llms.txt` and metadata output.
4. **Output Assembly**
   - Write per-item content files under `public/llms/content/` when bodies exceed the summary.
   - Build metadata structures referencing these files and write to JSON/NDJSON.
   - Compose the lightweight `llms.txt` from metadata + summaries.
5. **Validation**
   - Track counts per collection, total file size, and missing summaries.
   - Add a simple Vitest (or Node script) that runs in CI/build to assert expected invariants (e.g., metadata count matches Astro collection entries, `llms.txt` size below threshold).

## Build & Tooling Changes
- Update `scripts/generate-llms.mjs` to implement the new pipeline, retaining its integration with `npm run build`.
- Introduce helper utilities (e.g., `scripts/lib/content-utils.mjs`) if complexity grows.
- Ensure `fs-extra` usage accounts for new directories (create `public/llms/content` as needed).
- Document new outputs and usage in `docs-developers/generate-llms-script.md` and README.
- Consider optional CLI flags (e.g., `--content-only`, `--pretty-json`) for future flexibility.

## Testing & Verification
- Unit/integration tests for summary extraction, HTML→markdown conversion, and metadata assembly using representative fixtures (including entries with/without `<div class="fulltext">`).
- Post-generation sanity check script (e.g., `npm run check:llms`) that verifies file presence, counts, and size constraints.
- Manual QA: spot-check a few entries in the generated bundle to confirm summaries match expectations and long-form content renders cleanly.

## Decisions (Resolved Questions)
- Use a single JSON metadata file; no NDJSON variant needed.
- Long-form exports must include a frontmatter block alongside the body for reuse.
- No additional handling for PDF-only content is required beyond referencing existing links.
- Keep `llms.txt` plus individual content files within ~10–15k tokens to avoid exhausting LLM context.
