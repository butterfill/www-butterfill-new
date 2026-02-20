# q3 Hashme Hard Mode

## Overview

The `src/pages/hashme-q3.astro` page now supports an optional **Hard mode** password in addition to the existing q3 password generation flow.

The original generation path remains unchanged:
- standard password generation still uses `public/q3-browser.js`
- extension password generation still uses `public/q3-browser.js` with `domain + extension`

Hard mode is additive and can be toggled on/off in the UI.

## UI and UX behavior

Hard mode adds:
- a checkbox toggle (`#hard-mode-enabled`)
- a result block (`#hard-result-container`) displayed below the existing results
- click-to-copy support matching the existing result behavior
- index row formatting (`1 2 3 ...`) matching the existing display style

When the toggle is off, the hard-mode block is hidden.

When the toggle is on:
- with valid matched inputs: hard-mode password is generated and displayed
- with missing inputs: placeholder text is shown
- with mismatched inputs: mismatch warning text is shown

## Cookie persistence

Hard-mode state is persisted in a cookie:
- name: `q3_hashme_hard_mode`
- values: `1` (enabled) or `0` (disabled)
- attributes: `Max-Age=31536000; Path=/; SameSite=Lax`

The toggle initializes from this cookie on page load.

## Argon2id integration

Hard mode uses the `argon2id` npm package (OpenPGPJS implementation) as an ES module import in the Astro page script:

```js
import loadArgon2idWasm from 'argon2id';
```

The module is lazily instantiated and cached in-memory in the browser so repeated generations do not repeatedly reinitialize wasm.

## Hard mode derivation details

`generateHardModePassword(masterPassword, domain)` performs:

1. Normalize domain for hard-mode hashing:
   - `normalizedDomain = domain.trim().toLowerCase()`

2. Canonicalize domain for hard mode:
   - trim whitespace
   - if possible parse as URL host (or `https://<input>` host)
   - lowercase and strip trailing dots
   - empty input is valid and remains empty

3. Build Argon2 input material:
   - password seed: `SHA-256("hashme-hard-mode-v2:password:" + masterPassword + "\\0" + canonicalDomain)`
   - salt: first 16 bytes of `SHA-256("hashme-hard-mode-v2:salt:" + canonicalDomain)`

4. Run Argon2id with required parameters:
   - `memorySize: 256 * 1024` (256 MiB)
   - `passes: 4` (time cost)
   - `parallelism: 1`
   - `tagLength: 128`

5. Convert Argon2 output bytes into a 13-character password:
   - ensure at least one uppercase, lowercase, digit, and symbol
   - fill remaining characters from full allowed alphabet
   - use rejection sampling (unbiased mapping, no modulo bias)
   - deterministically shuffle character order

## Security/performance notes

- All operations remain in-browser; no passwords are sent to a server.
- Argon2id at 256 MiB and 4 passes is intentionally heavier than the legacy flow.
- The implementation keeps legacy output fully available while adding a stronger optional derivation path.
- Hard mode output is cleared immediately on keydown, then recomputed after debounce.

## Files touched

- `src/pages/hashme-q3.astro`
  - hard-mode toggle and result block
  - cookie read/write
  - argon2id module load
  - hard-mode derivation
  - generalized copy-to-clipboard for all result blocks

- `package.json` / `package-lock.json`
  - adds `argon2id`
