# LLM Bundle Generation

## Overview

`scripts/generate-llms.mjs` assembles an LLM-friendly bundle from the site's academic content. The bundle now consists of three deployable artefacts:

- `public/llms.txt` – lightweight catalogue with high-signal summaries (< ~15k tokens total)
- `public/llms/metadata.json` – structured metadata for every item (publications, talks, teaching)
- `public/llms/content/` – per-item markdown files containing long-form text plus reusable frontmatter

These files allow LLM pipelines to discover relevant material quickly, fetch detailed content on demand, and stay within context limits.

## How It Works

1. **Content aggregation** – the generator reads markdown from `src/content/{writing,talks,teaching}` (additional collections can be added) and parses frontmatter + body.
2. **Long-form extraction** – if a writing entry provides `<div class="fulltext">…</div>`, the inner HTML is converted to markdown; otherwise the raw markdown body is used.
3. **Summary generation** – deterministic summaries are derived from frontmatter abstracts, explicit `# Abstract` sections, or the opening paragraphs of long-form content. Summaries are truncated to ~360 characters to honour the 10–15k token target for `llms.txt`.
4. **Metadata modelling** – normalised fields (title, authors, year/date, event/term/place flags, featured/forthcoming booleans) are recorded alongside source file paths and generated content locations.
5. **Output assembly** – the script writes the text catalogue, metadata JSON, index lookup (`public/llms/index.json`), and long-form markdown files containing fresh frontmatter for reuse.

## Output Formats

### `public/llms.txt`
```
Site: Stephen Butterfill's Personal Academic Website
Author: Stephen Butterfill
Generated: 2025-10-02T18:11:25.850Z
Items: 152

---
Title: …
Authors: …
Type: Publication|Talk|Teaching
URL: /writing/example/
Year: 2024
Date: 2024-03-12 (talks only)
Event/Term/Place: optional lines when relevant

Summary: Concise paragraph (<= ~360 chars)

---
```

### `public/llms/metadata.json`
Array of objects:
```json
{
  "slug": "writing/example",
  "collection": "writing",
  "type": "Publication",
  "title": "Example Entry",
  "authors": "Surname, Name",
  "year": 2024,
  "pubDate": "2024-03-12",
  "event": "Conference Name",
  "summary": "First sentences…",
  "url": "/writing/example/",
  "contentPath": "llms/content/writing/example.md",
  "source": "src/content/writing/example.md",
  "featured": true,
  "forthcoming": false
}
```

### `public/llms/content/<collection>/<slug>.md`
```markdown
---
title: Example Entry
authors: Example Author
type: Publication
collection: writing
slug: writing/example
url: /writing/example/
summary: First sentences…
year: 2024
source: src/content/writing/example.md
---

# Long-form markdown body…
```

An auxiliary `public/llms/index.json` maps `slug -> { title, type, url, summary, contentPath }` for quick lookups.

## Running the Script

- **Standalone:** `node scripts/generate-llms.mjs`
- **Build pipeline:** automatically invoked via `npm run build`

The script rewrites `public/llms.txt` and the entire `public/llms/` folder each run.

## Test Coverage

A Vitest suite (`tests/llms-generator.spec.ts`) exercises the generator in dry-run mode. It checks:
- Bundle size stays within configured limits
- Metadata counts align with processed content
- Long-form descriptors include frontmatter + body for publication entries

Run with `npm test -- llms-generator.spec.ts` (or `npm test` for full suite). If the environment blocks Vitest worker IPC, rerun with `VITEST_POOL=forks` (already configured in `vitest.config.ts`).

## Extending the Bundle

- **Include another collection:** add it to `COLLECTIONS` in `scripts/lib/llms-generator.mjs`, supply a `type` label, and ensure relevant metadata fields are handled.
- **Adjust summary policy:** tweak `SUMMARY_CHAR_LIMIT` or update `summariseMarkdown` to change truncation behaviour.
- **Change size cap:** modify `MAX_LLMS_CHAR_LENGTH` (char-based) if a different token budget is desired.
- **Alternate serialisations:** reuse the returned bundle from `generateLlmsBundle({ writeFiles: false })` to emit CSV/NDJSON or to stream content elsewhere.

## Troubleshooting

| Issue | Likely Cause | Fix |
| --- | --- | --- |
| `Generated llms.txt would be … tokens` | Summaries push the text catalogue past the 10–15k token window. | Reduce `SUMMARY_CHAR_LIMIT`, prune optional lines, or split more content into per-item files. |
| Missing teaching entries | `src/content/teaching` file lacked valid frontmatter or summary text. | Confirm titles and optional abstracts are present; run generator again. |
| Summaries read “Summary not available.” | No abstract/intro text was found. | Add an `abstract` field or opening paragraph to the source markdown. |
| Tests fail with IPC `Channel closed` | Worker threads blocked in runtime environment. | Vitest is configured for forked workers; rerun with `npm test --run`. |

## Key Files

- `scripts/lib/llms-generator.mjs` – core implementation (exportable for tests/tools)
- `scripts/generate-llms.mjs` – thin CLI wrapper
- `tests/llms-generator.spec.ts` – generator regression tests
- `specs/llms-spec.md` – design specification and decisions
