**Title**
- Fetch missing writing full-text Markdown

**Goals**
- On build, ensure `public/md/<slug>.md` exists for every writing entry whose page is generated from `src/content/writing/<slug>.md`.
- For entries missing `public/md/<slug>.md`, attempt to locate and copy an authoritative `.md` via `cite2md <bibtexKey>`.
- Log a clear summary of which slugs are missing, found, copied, or unresolved.

**Scope & Inputs**
- Source entries: files under `src/content/writing/*.md` (basename = route slug).
- Existing full-text targets: `public/md/<slug>.md`.
- Frontmatter field: `bibtex` contains a full BibTeX entry string including the cite key, e.g. `@article{key, ...}`.
- External resolver: CLI `cite2md <key>` prints the absolute/relative path to a `.md` file if known; non‑zero exit or empty output means not found.

**Outputs**
- Create or overwrite nothing unless a target is missing; for missing targets that are successfully resolved, copy to `public/md/<slug>.md`.
- Console report grouped as: Already present, Copied, Missing `bibtex`, Key parse failed, Not found via `cite2md`, and Errors.

**Algorithm**
- Enumerate slugs: list `src/content/writing/*.md`, map each to `slug = basename(file, '.md')`.
- For each `slug`:
  - If `public/md/<slug>.md` exists → record as Already present; continue.
  - Read frontmatter via `gray-matter`; obtain `data.bibtex` (string). If absent/empty → record as Missing `bibtex`; continue.
  - Extract BibTeX key from the `bibtex` string using regex `@\w+\{([^,]+),` → capture group 1 as `key`. If no match → record as Key parse failed; continue.
  - Invoke `cite2md <key>` and capture stdout (trim). If exit code != 0 or stdout empty → record as Not found via `cite2md`; continue.
  - Verify the reported path exists and ends with `.md`. If not, record as Not found via `cite2md`.
  - Ensure `public/md/` exists; copy the resolved file to `public/md/<slug>.md` (rename on copy so basename matches `slug`).
  - Record as Copied.
- After processing all slugs, print a concise summary with counts and lists per category; exit with code 0 regardless, but include a final line like `Unresolved: N` for visibility.

**Build Hook**
- Add a script `scripts/get-md-for-writing.mjs` implementing the algorithm and wire it into the build chain before other generators:
  - package.json `build`: `node ./scripts/get-md-for-writing.mjs && node ./scripts/generate-llms.mjs && astro build`

**Implementation Notes**
- Use Node ESM, `fs/promises` and `path` (no glob needed beyond directory read; or `fast-glob` if preferred but not required).
- Use `gray-matter` to read frontmatter safely; handle multi‑line `bibtex` strings.
- Use `child_process` `spawnSync` to call `cite2md` with inherited env and no shell interpolation; set a short timeout if desired.
- Treat only missing targets; do not overwrite existing `public/md/<slug>.md`.
- Keep logs succinct: one line per action, then a grouped summary at the end.

**Edge Cases**
- `bibtex` present but malformed: logged under Key parse failed.
- `cite2md` returns a path whose file is unreadable or not `.md`: treat as Not found via `cite2md`.
- Slugs containing spaces or unusual characters: use filesystem‑safe copy and ensure target is exactly `<slug>.md`.
- Directory `public/md/` absent: create recursively before first copy.

**Acceptance Criteria**
- Running `npm run build` attempts resolution for every `src/content/writing/*.md` without a corresponding `public/md/<slug>.md`.
- When `cite2md` can locate a corresponding `.md`, the file is copied to `public/md/<slug>.md` (basename equals slug).
- Build logs list unresolved slugs; build does not fail solely due to unresolved items.
