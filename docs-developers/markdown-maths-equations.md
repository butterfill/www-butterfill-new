# Markdown Maths / Equations (SSR) Quickstart

This site renders LaTeX-style maths inside Markdown at build time (server-side rendering, SSR).

Implementation
- Markdown pipeline (global):
  - remark-math parses maths in Markdown.
  - rehype-katex renders maths to static HTML using KaTeX.
  - Config is in `astro.config.mjs` under `markdown.remarkPlugins` and `markdown.rehypePlugins`.
- Styles: KaTeX CSS is imported once in `src/layouts/BaseLayout.astro`:
  - `import 'katex/dist/katex.min.css'`
- Delimiters supported (both inline and display):
  - Inline: `$...$` and `\(...\)`
  - Display: `$$...$$` and `\[...\]`

Why SSR?
- Better performance and SEO than client-side typesetting. No flash of raw `$...$`.

Where to change things
- Pipeline config: `astro.config.mjs`
  ```js
  import remarkMath from 'remark-math'
  import rehypeKatex from 'rehype-katex'

  export default defineConfig({
    markdown: {
      remarkPlugins: [remarkMath],
      rehypePlugins: [[rehypeKatex, {
        throwOnError: false,
        strict: false,
        macros: {
          "\\sf": "\\mathsf",
          "\\tt": "\\mathtt",
          "\\bf": "\\mathbf",
          "\\it": "\\mathit",
          "\\rm": "\\mathrm",
          "\\upbeta": "\\beta"
        }
      }]]
    }
  })
  ```
- Styles: `src/layouts/BaseLayout.astro` (KaTeX CSS import). Move the import to a different layout if you want to scope maths to fewer pages.

Adding/refining macros
- Edit the `macros` object in `astro.config.mjs` (rehype-katex options). Examples:
  ```js
  macros: {
    "\\upalpha": "\\alpha", // map unsupported upgreek to standard greek
    "\\degC": "{}^{\\circ}\\mathrm{C}", // custom convenience macro
    "\\vect": "\\mathbf{#1}", // macro with 1 arg (use #1, #2,...)
  }
  ```
- Notes:
  - KaTeX macros are string substitutions; use `#1`, `#2` for arguments.
  - After changes to `astro.config.mjs`, restart the dev server to apply.
  - Keep `throwOnError: false` during iteration to avoid build breaks; you can tighten later if desired.

Developing & testing
- Verify SSR is active:
  - `curl -s http://localhost:4321/writing/pascarelli2024_principles/ | grep -n 'class="katex"'`
  - You should see KaTeX markup in the HTML, not raw `$...$`.
- Visual checks:
  - Inline and display maths render correctly in light/dark modes.
  - No interference with footnotes/TOC.

Common pitfalls
- Dev server not restarted: Config changes in `astro.config.mjs` require a restart.
- Unsupported commands: Map them via `macros` or rewrite using supported KaTeX commands:
  - Use `\\operatorname{argmax}` instead of `\\DeclareMathOperator`.
  - Use `\\mathrm{d}` for differentials; `\\mathbf{}`, `\\mathsf{}`, `\\mathtt{}` for fonts.
- Markdown escaping: In paragraphs heavy with `$`, prefer `\(...\)` for inline maths to avoid conflicts (e.g., currency or literals).
- Code blocks/inline code: Maths inside fenced/code spans is not parsed.

Scope
- Maths is enabled for all Markdown content (writing, talks, teaching) by setting the Markdown config globally. If you want to restrict it, move the config into a custom MD processing step or split layouts and CSS imports accordingly.

Related but NOT used here
- The `public/reveal.js` math plugin is only for slide decks; it does not affect article pages.

Troubleshooting
- LaTeX command not recognized (build doesn’t fail due to `throwOnError: false`, but formula doesn’t render as expected):
  - Map it in `macros` (astro.config.mjs) to a KaTeX-supported equivalent.
  - Example mappings:
    - `\\upalpha` → `\\alpha`, `\\upbeta` → `\\beta`, `\\upphi` → `\\phi`, `\\upmu` → `\\mu`
    - Legacy font switches: `\\sf{...}` → `\\mathsf{...}`, `\\tt{...}` → `\\mathtt{...}`, `\\bf{...}` → `\\mathbf{...}`, `\\it{...}` → `\\mathit{...}`, `\\rm{...}` → `\\mathrm{...}`
    - Operators: prefer `\\operatorname{argmin}` / `\\operatorname{argmax}`; for custom ones, define macros like `"\\argmax": "\\operatorname{argmax}"`
    - Degrees: `^\\circ` or define `"\\degC": "{}^{\\circ}\\mathrm{C}"`
    - Differentials: `\\mathrm{d}x` (avoid raw `dx` if you want roman “d”)
- `$` conflicts with plain text (e.g., currency):
  - Use `\(...\)` for inline maths in those paragraphs, or escape literal `$` as `\$`.
- Equation spacing looks off:
  - KaTeX follows TeX spacing rules. Add `\,` (thin), `\:` (medium), `\;` (thick), or `\!` (negative) as needed.
- Display equations need numbering:
  - KaTeX doesn’t provide automatic numbering natively. Consider manual labels or a rehype plugin that injects numbering.
- Dark mode contrast:
  - KaTeX inherits text color. If you need tweaks, target `.katex` in `src/styles/global.css` (e.g., adjust link color inside equations).

Checklist for extending
- [ ] Add/adjust macros in `astro.config.mjs`
- [ ] Restart dev server
- [ ] Confirm KaTeX markup appears in HTML
- [ ] Spot-check pages with equations; add macros as needed
- [ ] (Optional) tighten `throwOnError`/`strict` once content compiles cleanly
