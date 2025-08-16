# Article Fulltext Implementation Guide

This document explains the implementation of fulltext articles with advanced features like side footnotes, table of contents, and interactive highlighting.

## Overview

The fulltext article system provides:
- Responsive footnote positioning (side footnotes on wide screens, bottom footnotes on narrow screens)
- Dynamic font size and style settings that persist across sessions.
- Universal table of contents modal with keyboard shortcuts
- Interactive footnote highlighting
- Clean typography matching academic standards

## Key Components

### 1. Layout Structure

```
PageLayout.astro
├── Article title
├── Citation display
└── .fulltext container (position: relative)
    ├── Article content (max-width: 600px)
    ├── FootnoteManager (handles side footnotes)
    ├── TableOfContents (modal trigger)
    └── FontSettings (modal trigger)
```

**CRITICAL**: The `.fulltext` container must have `position: relative` for footnote positioning to work correctly.

### 2. FootnoteManager Component (`src/components/FootnoteManager.svelte`)

Handles responsive footnote positioning and interactive highlighting. It automatically re-calculates footnote positions when the window is resized or when font settings are changed.

#### Positioning Logic (FRAGILE - Handle with Care)

**Horizontal Positioning:**
```css
.side-footnotes {
  position: absolute;
  left: calc(600px + 50px); /* fulltext max-width + gap */
}
```

**Vertical Positioning:**
Calculated in JavaScript using `getBoundingClientRect()` relative to the article container. This is robust against page scroll.

**Overlap Prevention:**
The script calculates the actual height of each footnote (using the current font settings) and ensures that each new footnote is positioned below the previous one, preventing vertical overlap.

**DANGER ZONES:**
1. **Never change `.fulltext` max-width without updating footnote positioning**
2. **Never use `position: fixed` for footnotes** - breaks scrolling behavior
3. **Never use `offsetTop` or `window.scrollY`** - creates misalignments

### 3. FontSettings Component (`src/components/FontSettings.svelte`)

Provides a modal to control the font size and family (serif/sans-serif) for the article text.

#### Persistence
- Font settings are saved to `localStorage` and applied on page load.
- Font size is applied as an inline style to the `.fulltext` element.
- Font family is applied by setting a `data-font-family` attribute on the `<body>` element, which is then used by CSS rules in `global.css`.

#### Keyboard Shortcuts
- All shortcuts are **unmodified keys** (do not use `Cmd`, `Ctrl`, or `Alt`).
- `F` - Toggle font settings modal
- `S/M/L/X` - Adjust font size
- `R/N` - Switch between Serif and Sans-serif fonts
- `Esc` - Close modal

### 4. TableOfContents Component (`src/components/TableOfContents.svelte`)

Universal modal-based navigation with keyboard shortcuts.

#### Keyboard Shortcuts
- `T` - Toggle modal
- `1-9, 0` - Jump to sections (first 10)
- `Esc` - Close modal

## CSS Architecture

### Font Styling
The base font styles are defined in `global.css` for the `.fulltext` element. The `FontSettings` component overrides these. The font family is controlled by CSS rules targeting the `data-font-family` attribute on the body:
```css
body[data-font-family='serif'] .fulltext {
  font-family: Georgia, Charter, "Times New Roman", serif;
}
body[data-font-family='sans'] .fulltext {
  font-family: ui-sans-serif, system-ui, /* ... */, sans-serif;
}
```

### Responsive Footnote Hiding
```css
@media (min-width: 1200px) {
  .fulltext .footnotes.side-footnotes-active {
    display: none;
  }
}
```

## Interactive Features

### Event Handling
- The `FontSettings` component dispatches a `fontSettingsChanged` custom event on the `window` object whenever a setting is changed.
- The `FootnoteManager` component listens for this event and triggers a full recalculation of footnote positions to adapt to the new text size and flow.

### Footnote Highlighting
- **Click footnote mark → Highlight footnote:**
  - Side footnotes: Immediate highlight.
  - Bottom footnotes: Scroll to footnote + highlight.
- **Click footnote → Highlight footnote mark:**
  - Scrolls footnote mark to center of viewport.
  - Highlights after a 300ms delay to ensure smooth scroll completion.

## Testing Checklist

Before making changes, test:

1. **Footnote positioning**:
   - [ ] Side footnotes appear 50px right of main text (wide screens).
   - [ ] Footnotes align vertically with their marks.
   - [ ] **Footnotes do not overlap after increasing font size.**
   - [ ] Positioning correct on page reload when scrolled.

2. **Font Settings**:
   - [ ] Font size and family changes apply correctly.
   - [ ] **Settings persist correctly after a page reload.**
   - [ ] **Changing font size/style triggers footnote relayout.**
   - [ ] Keyboard shortcuts work without modifier keys.

3. **Interactive highlighting**:
   - [ ] Click footnote mark → highlights footnote.
   - [ ] Click footnote → scrolls to and highlights mark.

4. **Responsive behavior**:
   - [ ] Side footnotes on wide screens (≥1200px), bottom on narrow (<1200px).
   - [ ] Modals (TOC, Font Settings) work on all screen sizes.

## File Structure

```
src/
├── components/
│   ├── FontSettings.svelte         # Font controls
│   ├── FootnoteManager.svelte    # Side footnote positioning & highlighting
│   └── TableOfContents.svelte    # Modal TOC with keyboard shortcuts
├── layouts/
│   └── PageLayout.astro          # Simple layout (no grid)
├── pages/writing/
│   └── [...slug].astro           # Article page integration
└── styles/
    └── global.css                # Footnote & TOC styling
```
