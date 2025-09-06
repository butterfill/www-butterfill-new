High-priority issues

1) Slides.astro points to non-existent reveal.js asset paths
- File: src/components/Slides.astro
- Problem: Links reference /reveal.js/dist/reveal.css and /reveal.js/dist/reveal.js, but the repository provides assets under public/reveal.js/css and public/reveal.js/js (no dist directory).
- Impact: Slides will fail to render (404s) on talk pages with slideImages.
- Suggestion: Update paths to:
  - /reveal.js/css/reveal.css
  - /reveal.js/css/theme/black.css
  - /reveal.js/js/reveal.js
  Or, alternatively, copy the node_modules/reveal.js/dist assets into public/reveal.js/dist and keep current paths. Align code and docs.

2) Hard-coded base URL in JSON-LD generation
- File: src/lib/jsonld-utils.ts (generateJsonLd)
- Problem: Uses baseUrl = 'https://butterfill.com'. This will be wrong in preview/staging or forks.
- Impact: Structured data contains incorrect absolute URLs.
- Suggestion: Derive base URL from runtime (e.g., Astro.url.origin in the page and pass it down), or gate to import.meta.env for environment configuration.

3) Potential build/runtime break: importing TS modules with a .js suffix
- Files:
  - src/components/CiteButton.svelte (imports $lib/components/ui/dialog/index.js and $lib/citation-utils.js)
  - src/lib/components/ui/command/command-dialog.svelte (imports $lib/components/ui/dialog/index.js)
  - src/components/CommandPalette.svelte (imports $lib/citation-utils.js)
- Problem: The actual files are TypeScript (.ts). Importing them with a .js suffix can fail in some toolchains or break type support/SSR.
- Impact: Builds or editor tooling may intermittently break; portability suffers.
- Suggestion: Import without extension (recommended) or use the correct .ts source path. Example: import * as Dialog from '$lib/components/ui/dialog'; and import { ... } from '$lib/citation-utils';

4) sync-bibtex comparison bug likely forces unnecessary rewrites
- File: scripts/sync-bibtex.mjs
- Location: updateFile(), around line ~277
- Problem: Compares matter(await fs.readFile(file.filePath, 'utf8')).content (body only) to newContent (frontmatter + body). They are different by construction, so the script will think every file needs updating.
- Impact: Unnecessary writes and noisy prompts during sync; potential churn in version control.
- Suggestion: Compare the full original file text to newContent (readFile(...), not matter(...).content), or compare parsed frontmatter objects + body separately.

5) Command injection and path validation risk in /api/open-source
- File: src/pages/api/open-source.js
- Problem: The endpoint shells out to exec('code "${fullPath}"') with user-provided filePath (wrapped in quotes but not validated). Also assumes VS Code CLI exists.
- Impact: In dev, a crafted filePath could attempt to escape quotes; also fails on systems without the code CLI.
- Suggestions:
  - Validate filePath strictly (allow only [writing|talks|teaching]/.../*.md under src/content).
  - Use spawn with args array instead of exec string.
  - Return a clearer error when the code command is not found.
  - Confirm endpoint is blocked in production (it is), keep it that way.

6) Reveal.js documentation and implementation mismatch
- Files: docs-developers/reveal-js-slides-for-talks.md and src/components/Slides.astro
- Problem: Docs instruct copying assets to public/reveal.js/dist but the repository currently contains public/reveal.js/js and public/reveal.js/css instead.
- Impact: Confusion for maintainers, broken links (see Issue #1).
- Suggestion: Pick one approach and apply consistently to both docs and code.

Medium-priority issues

7) Empty package.json name
- File: package.json
- Problem: "name" is empty string.
- Impact: Minor; may affect tooling and publishing.
- Suggestion: Set a valid package name (e.g., "butterfill-academic-site").

8) Inconsistent import style for Dialog module
- Files:
  - src/components/EmailModal.svelte uses import * as Dialog from '$lib/components/ui/dialog';
  - src/components/CiteButton.svelte and src/lib/components/ui/command/command-dialog.svelte use '$lib/components/ui/dialog/index.js'.
- Impact: Inconsistent style can cause friction and errors; see Issue #3.
- Suggestion: Standardize on extensionless imports pointing to the folder index (recommended).

9) Potentially brittle reliance on local HOME path in sync-bibtex
- File: scripts/sync-bibtex.mjs
- Problem: Default BIBTEX_PATH resolves to path.resolve(process.env.HOME, 'endnote/phd_biblio.bib').
- Impact: Non-portable default; confusing error messages on other machines.
- Suggestion: Make path a required CLI argument or fallback to a project-local default; provide clear error guidance.

10) svelte.config.js likely unnecessary or misconfigured
- File: svelte.config.js
- Problem: Imports vitePreprocess from '@astrojs/svelte'. Typically vitePreprocess is imported from '@sveltejs/vite-plugin-svelte'. Astro does not require a svelte.config.js in many setups.
- Impact: Might be harmless, but could be misleading or cause subtle preprocess differences.
- Suggestion: Verify necessity; if needed, import from '@sveltejs/vite-plugin-svelte' or remove file.

11) Mixed asset directories with double slashes in path listing
- Paths: public//reveal.js//... and public//md
- Problem: Double slashes in stored paths (as listed in workspace structure) indicate inconsistent copying.
- Impact: Risk of relative path mistakes in code and tooling.
- Suggestion: Normalize directories to public/reveal.js/... and public/md/ uniformly.

12) JSON-LD for talks: organizer vs address semantics
- File: src/lib/jsonld-utils.ts (createEducationalEvent)
- Problem: event is mapped to organizer (Organization) and address to Place.name. This is acceptable, but some consumers expect location.address and organizer.name/brand separation with richer fields.
- Impact: Reduced richness of structured data.
- Suggestion: Consider using location: { @type: Place, address: { @type: PostalAddress, ... } } when that data is available; keep current as fallback.

13) TableOfContents component depends on .fulltext container
- File: src/components/TableOfContents.svelte
- Problem: It queries document.querySelector('.fulltext') which only exists for certain articles (e.g., ones coming from public/md using embedded <div class="fulltext">). For Markdown rendered via Astro Content, headings might not be inside an element with .fulltext.
- Impact: TOC may not appear for many articles.
- Suggestion: Expand query to find headings within the rendered article container (e.g., the .markdown-body-container used in writing pages) as a fallback.

14) Cloudflare adapter and Node APIs
- Files: Astro pages using fs/path (e.g., src/pages/writing/[...slug].astro) and /api/open-source.js using child_process.
- Problem: Cloudflare runtime doesn’t support Node APIs, but these usages occur at build-time (pages) or are dev-only (API). If accidentally executed at runtime in Cloudflare, they would fail.
- Impact: Potential runtime errors if deployment/route config changes.
- Suggestion: Keep these clearly build-only/dev-only and add comments/guards where appropriate.

15) Vitest path alias plugin only active for tests
- File: vitest.config.ts
- Problem: The tsconfig paths plugin is only configured for tests. Runtime relies on Astro’s path alias support, which usually works. Mixed explicit .js imports (Issue #3) may interfere.
- Impact: Potential confusion if aliases stop resolving outside of Astro tooling.
- Suggestion: Standardize imports (Issue #3); no action otherwise if dev/build are fine.

16) q3-browser: password character policy may be overly restrictive
- File: public/q3-browser.js
- Problem: pwMeetsRequirements bans some common symbols ('?', '@', quotes, backslash, backtick, tilde). This may deviate from common password policies and reduce entropy.
- Impact: Users may get less compatible/usable outputs for some sites.
- Suggestion: Document the rationale or relax the banned set; consider making the banned set configurable.

17) generate-llms.mjs does not include teaching content
- File: scripts/generate-llms.mjs
- Problem: As noted in docs, teaching collection is not included in the llms.txt output.
- Impact: LLM context file misses teaching materials.
- Suggestion: Extend script to include teaching if desired (docs already suggest this as a future enhancement).

18) Migration script references external sibling paths
- File: migration-script.mjs
- Problem: Hardcoded references to ../www-butterfill-old directories. Safe as a standalone tool, but can confuse contributors.
- Impact: N/A at runtime; maintenance clarity.
- Suggestion: Add README note or move to a separate tooling repo/folder.

19) Minor: Unused import in content config
- File: src/content/config.ts
- Problem: Imports glob from 'astro/loaders' but never uses it.
- Impact: Minor lint warning.
- Suggestion: Remove unused import.

20) Accessibility and UX enhancements
- Files: Multiple components (e.g., CommandPalette, Slides, EmailModal)
- Suggestions:
  - Slides.astro: ensure ARIA roles and focus management when embedded.
  - CommandPalette: focus trap while open, return focus to trigger on close.
  - EmailModal: ensure button label reflects state for screen readers.

If you'd like, I can prioritize fixes and open PRs in this order: (1) Slides asset paths + docs alignment, (2) import path cleanup (.js → extensionless), (3) sync-bibtex comparison fix, (4) JSON-LD base URL handling, (5) /api/open-source validation and spawn usage.
