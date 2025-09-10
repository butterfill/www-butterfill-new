Test Plan – www-butterfill-new

Summary
- Stack: Astro 5 + Svelte 5, Tailwind, Cloudflare adapter (Workers), Vitest present. No existing E2E tooling. Notable UI: Command palette, dialogs, footnotes/TOC, theme/font toggles, copy-to-clipboard, slides.
- Goal: Introduce a layered test strategy that starts with fast smoke checks, then exercises tricky interactive components, and finally expands toward high-confidence coverage across routes and behaviors.

Requirements & Objectives
- Smoke confidence: Key routes load, no console errors, no 404/500 requests, basic SSR hydration succeeds.
- Critical interactions: Keyboard-driven command menu; dialogs and modals; copy-to-clipboard; theme/font toggles; footnotes/TOC behavior; navigation actions in the command palette.
- Content integrity: Markdown+math (remark-math/rehype-katex) renders; JSON-LD utilities behave; links to assets (PDFs/reveal.js) respond.
- Maintainable: Fast local feedback (Vitest/unit + selective component tests); E2E used surgically for flows and keyboard interactions.
- Cloudflare-aware: Validate a representative runtime for SSR where needed; avoid false positives from Node-only previews.

Limitations & Risks (Cloudflare + Playwright)
- Preview command: `astro preview` is not supported with `@astrojs/cloudflare`. Representative E2E of the worker must use `wrangler dev` (Miniflare). Using `astro dev` is convenient but not fully representative of Cloudflare runtime.
- Worker runtime differences: Web Streams, Request/Response semantics, and global bindings may behave differently vs Node dev server; E2E against `wrangler dev` catches these.
- Port and startup coordination: Playwright must await `wrangler dev` becoming ready and target a stable port.
- Clipboard and permissions: Headless browsers can restrict clipboard; prefer Playwright APIs or feature flags to simulate clipboard in tests.
- Heavy pages/assets: `public/` contains many PDFs and reveal.js; E2E should block external requests and avoid downloading large assets by scoping routes.
- Svelte component testing: Choose either Playwright Component Testing for Svelte or Vitest + @testing-library/svelte. Svelte 5 support is required; ensure tooling versions match.

Tooling Strategy
- Unit/Integration: Vitest
  - Environment: `jsdom` for DOM-oriented utils and simple component logic.
  - Targets: `src/lib/*.ts` (already has `jsonld-utils.test.ts`), small pure functions, rendering logic that doesn’t require full browser features.
- Component interaction: Prefer Vitest + @testing-library/svelte for most components; reserve Playwright for keyboard-heavy and focus management cases.
- End-to-End (selected flows): Playwright
  - Phase 1: run against `astro dev` for speed to detect obvious regressions. (Implemented in repo.)
  - Phase 2/3: later, when available, add a job that runs against `wrangler dev` to validate Cloudflare runtime parity.
- Accessibility: add `axe-core` checks (component-level and a few E2E pages).

Phase 1 – Smoke (site loads without console errors)
- Scope
  - A minimal set of canonical URLs: `/`, a representative writing page, a talk page, and a teaching page. Expandable via a generated list later.
  - Ensure each page renders and hydrates with no console errors, and no failed network requests (4xx/5xx, missing assets).
- Implementation
  - Playwright E2E “smoke” suite against `astro dev` for speed. Implemented files:
    - `playwright.config.ts` (webServer: `npm run dev`, baseURL `http://localhost:4321`)
    - `tests/smoke.spec.ts` (asserts no console errors, no failed/4xx/5xx requests, and header nav visible for: `/`, `/writing/apperly2025_mindreading/`, `/talks/2012/cuny_2011/`, `/teaching/joint_action_and_the_emergence/`).
    - `package.json` scripts: `test:e2e:dev`, `e2e:open`, `e2e:install`.
  - Allowlist for warnings can be added later if needed.
- Output
  - A Playwright config with a `smoke` project and helper to collect console/network issues.
  - CI job: run on PRs and `main` with Chromium; store console/network logs on failure.

Phase 2 – Tricky Components (interaction/keyboard behaviors)
- Targets
  - Command Palette (`src/components/CommandPalette.svelte`):
    - Opens via Ctrl/Cmd+K and via `window` custom event.
    - Filters items as you type; arrow navigation; Enter selects.
    - Executes actions: navigate to a URL; copy/download citation (mock `navigator.clipboard`, stub download); DEV-only `open-source` action posts to `/api/open-source`.
  - Dialogs/Modals (`src/lib/components/ui/dialog/*`, `EmailModal.svelte`): focus trap, Esc to close, click-overlay to close.
  - Footnote/TOC (`FootnoteManager.svelte`, `TableOfContents.svelte`): anchor jumps, active section highlighting.
  - Theme/Font toggles: toggles update DOM classes; preference persisted in `localStorage`.
  - Copy buttons (`CopyForChat.svelte`, `CiteButton.svelte`): success path + error logging.
- Implementation
  - Prefer Vitest + @testing-library/svelte (jsdom) for logic-centric assertions when feasible.
  - Use Playwright (page or component tests) for keyboard navigation, focus/aria expectations, and clipboard behaviors.
  - Stub network for `/api/open-source` and gate those tests to `import.meta.env.DEV` or mock the guard.
- Output
  - Component test suites per target with clear fixtures, aria-role queries, and keyboard sequences.
  - A focused Playwright project `interactions` covering keyboard/focus flows and clipboard/download edge cases.

Phase 3 – Toward Full Coverage
- Routes & content
  - Generate a stable sample of routes from content collections (e.g., pick the 10 newest per section) and crawl them for render/links/images/math blocks.
  - Validate math rendering exists on pages with LaTeX markup (presence of KaTeX-rendered nodes).
  - Link health (internal): intercept navigations and assert targets return 200 (without crawling external domains).
- JSON-LD & SEO
  - Unit tests for `jsonld-utils.ts` beyond the existing test; add schema validation of emitted JSON-LD where applicable.
- Cross-runtime parity
  - Duplicate a small subset of E2E flows to run under `wrangler dev` to catch Workers-specific issues (streams, headers, env access).
- Optional visual diffs
  - If desired, add basic screenshot diffs on 2–3 key pages with stable rendering (avoid pages with dynamic timestamps or highlight effects).

Local Developer Experience (no CI yet)
- Scripts
  - `test:unit` → Vitest (jsdom)
  - `test:e2e:dev` → runs Playwright smoke suite against `astro dev`
  - `e2e:install` → installs Playwright Chromium browser locally (optional)
- Run locally:
  - `npm install`
  - `npm run e2e:install` (first time)
  - `npm run test:e2e:dev`
  - For an interactive runner: `npm run e2e:open`

Cloudflare Parity (deferred)
- No `wrangler dev` integration yet; add later when available with a tiny parity subset.

Open Questions, Assumptions, Options
1) Which routes are “must cover” in Phase 1?
   - Assumption: `/`, one writing page, one talk page, one teaching page.
   - Options: (a) Manually curate a short list; (b) Generate from content collections; (c) Use sitemap if available.

2) Runtime for smoke tests: Node dev vs Cloudflare worker?
   - Assumption: Phase 1 uses `astro dev` for speed; parity is deferred.
   - Options: (a) Only `astro dev` (fast, less representative); (b) Only `wrangler dev` (representative, slower); (c) Hybrid: fast default + tiny CF subset in CI (recommended).

3) Component testing approach for Svelte 5?
   - Assumption: Start with Vitest + @testing-library/svelte for breadth; use Playwright only where keyboard/focus fidelity matters.
   - Options: (a) Vitest-only; (b) Playwright Component Testing; (c) Mixed (recommended).

4) Clipboard and download in headless tests?
   - Assumption: Use Playwright’s `navigator.clipboard` emulation and assert DOM feedback/logging; mock `downloadFile` where possible.
   - Options: (a) Mock at component level (unit); (b) Use Playwright permissions and validate downloaded artifact via intercept; (c) Assert side-effects only.

5) Acceptable console output policy?
   - Assumption: Fail on errors; allow warnings initially with an allowlist.
   - Options: (a) Error-only gate; (b) Error+warning gate; (c) Strict mode by project area.

6) Accessibility coverage depth?
   - Assumption: Add axe checks on a few key pages and for the command palette modal.
   - Options: (a) Smoke-only; (b) Expand to all major templates; (c) Full a11y CI gate.

7) CI environment and concurrency?
   - Assumption: GitHub Actions with Ubuntu runners; Chromium only initially.
   - Options: (a) Add WebKit/Firefox later; (b) Shard Playwright projects; (c) Cache deps and Playwright browsers.

8) Cloudflare parity scope?
   - Assumption: A tiny representative subset (home + one content page + one command palette flow) runs under `wrangler dev` in CI.
   - Options: (a) Only parity in nightly; (b) On PR label; (c) Always (slower).

Next Steps
- Confirm answers to the questions above to lock scope for Phase 1.
- Add Playwright + @testing-library/svelte to devDependencies and minimal configs.
- Implement Phase 1 smoke suite and wire a CI job.
- Identify and prioritize Phase 2 component tests (start with CommandPalette).
