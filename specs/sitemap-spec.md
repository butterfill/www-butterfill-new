**Title**
- Add sitemap.xml with accurate ISO-8601 lastmod

**Goals**
- Generate `dist/sitemap.xml` at build time.
- Include all public HTML routes (home, section indexes, dynamic content pages).
- Exclude API endpoints and any non-public/internal routes.
- Provide `<lastmod>` per URL using an accurate ISO‑8601 timestamp.
- Advertise sitemap via `robots.txt`.

**Context**
- Framework: Astro v5 with Svelte, Cloudflare adapter.
- Content sources:
  - Static pages: `src/pages/index.astro`, `src/pages/hashme-q3.astro`, section indexes in `src/pages/*/index.astro`.
  - Dynamic pages from content collections:
    - Writing: `src/pages/writing/[...slug].astro` → `src/content/writing/<slug>.md` (plus optional `public/md/<slug>.md`).
    - Talks: `src/pages/talks/[...slug].astro` → `src/content/talks/<slug>.md`.
    - Teaching: `src/pages/teaching/[...slug].astro` → `src/content/teaching/<slug>.md` (slugs may be nested).
  - API endpoints to exclude: under `src/pages/api/*`.

**Approach**
- Use the official `@astrojs/sitemap` integration.
- Configure canonical site URL and a `serialize` hook to set `lastmod` for each URL.
- Compute `lastmod` from version control (git) for the source file(s) backing each route, with sensible fallbacks when git is unavailable.

**lastmod Strategy (per-URL)**
- Primary source of truth: last commit time of the relevant source file(s) using git. Command: `git log -1 --format=%cI -- <path>` which returns strict ISO‑8601.
- If multiple files back one URL (e.g., writing detail page uses both a content entry and optional full-text in `public/md`), use the max of their times.
- Fallback order if git or the repo history is not available:
  1) Filesystem mtime of the same source file(s): `fs.statSync(path).mtime.toISOString()`.
  2) Content frontmatter fields when available (best-effort):
     - Writing: prefer a dedicated `updatedDate: date` if we add it; otherwise `pubDate` if present; otherwise derive from `year` (e.g., `${year}-12-31T00:00:00Z`).
     - Talks: `endDate || pubDate`.
     - Teaching: if entries have dates, use them; else fall back to build time.
  3) Build end time as a last resort.

**URL → Source File Mapping**
- `/` → `src/pages/index.astro`.
- `/hashme-q3` → `src/pages/hashme-q3.astro`.
- `/writing/` → `src/pages/writing/index.astro`.
- `/writing/<slug>/` → `src/content/writing/<slug>.md` and, if present, `public/md/<slug>.md` (use the latest of the two).
- `/talks/` → `src/pages/talks/index.astro`.
- `/talks/<slug>/` → `src/content/talks/<slug>.md`.
- `/teaching/` → `src/pages/teaching/index.astro`.
- `/teaching/<slug or nested>/` → `src/content/teaching/<slug>.md` (slug equals the content slug, which may include `/`).
- Exclude any URL that starts with `/api/` or that is not HTML content.

**Implementation Plan**
- Dependencies
  - Add `@astrojs/sitemap` to `dependencies`.

- `astro.config.mjs`
  - Add the integration and set the canonical site URL.
  - Provide a `serialize` function to set `lastmod`, `changefreq`, and `priority` as needed.

  Example (illustrative):
  `import sitemap from '@astrojs/sitemap'`
  `export default defineConfig({
     site: 'https://www.butterfill.com',
     integrations: [svelte(), tailwind(), sitemap({
       filter: (page) => !page.includes('/api/'),
       serialize: (item) => ({
         // lastmod will be filled in a post-process step below
       }),
     })],
  })`

- Helper: `scripts/lastmod.mjs`
  - Export `getGitIsoDate(filePath)` and `getFsIsoDate(filePath)`.
  - Export `resolveLastmodForUrl(url)` that applies the mapping and fallback logic above and returns an ISO‑8601 string.
  - Cache results per file to avoid repeated git calls.

- Wiring lastmod into the sitemap
  - Option A (preferred): Use `sitemap().serialize` if available in Astro v5 to set `lastmod`:
    - `serialize: (item) => ({ lastmod: resolveLastmodForUrl(new URL(item.url).pathname) })`.
  - Option B: Add a small `astro:build:done` integration to post-process the generated `dist/sitemap.xml` and inject `<lastmod>` values for each `<loc>` (use the same resolver function). This is a safe fallback if the integration API changes.

- `robots.txt`
  - Add `public/robots.txt` with `Sitemap: https://www.butterfill.com/sitemap.xml`.

**Edge Cases**
- Nested teaching slugs: use the exact content slug to map to `src/content/teaching/<slug>.md`.
- Missing content file (should not happen for generated routes): fall back to the page component `.astro` file.
- Missing git (e.g., CI without history): FS mtime and frontmatter fallbacks ensure valid ISO‑8601 values.
- Ensure trailing slash handling matches final route output when parsing URLs.

**Acceptance Criteria**
- `dist/sitemap.xml` exists after `npm run build`.
- Every included `<url>` has a `<loc>` rooted at `https://www.butterfill.com/` and a `<lastmod>` in strict ISO‑8601 (e.g., `2025-01-31T15:04:05Z` or with timezone offset).
- Sitemap excludes `/api/*` and non-HTML routes.
- `public/robots.txt` includes a `Sitemap:` line pointing to the canonical URL.

**QA / Validation**
- Local check: open `dist/sitemap.xml`, validate against a regex like `\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2})` for each `<lastmod>`.
- Spot-check a writing page where `public/md/<slug>.md` recently changed; confirm `<lastmod>` reflects the newer of the two files via `git log -1 --format=%cI`.
- Use Google Search Console’s sitemap tester after deploy.

**Task Breakdown**
- Add dependency and config changes to `astro.config.mjs` (set `site`, add `sitemap()` integration, exclude `/api/*`).
- Implement `scripts/lastmod.mjs` with:
  - `getGitIsoDate`, `getFsIsoDate`, `resolveLastmodForUrl`.
  - URL-to-file path mapping as specified.
- Hook resolver into `serialize` or post-process `dist/sitemap.xml` in an `astro:build:done` hook.
- Add `public/robots.txt` with sitemap URL.
- Add a minimal test (optional) to assert sitemap presence and ISO‑8601 format.

**Open Questions**
- Should we add an `updatedDate` field to content schemas (`src/content/config.ts`) to override git/FS dates when desired? If yes, incorporate it at the top of the fallback order for content pages.
- Include additional static pages (e.g., if more `.astro` pages are added under `src/pages`)? The integration handles this automatically, but we can whitelist/blacklist specific routes if needed.

