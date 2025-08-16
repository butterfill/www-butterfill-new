# Article Fulltext Implementation Guide

This document explains the implementation of fulltext articles with advanced features like side footnotes, table of contents, and interactive highlighting.

## Overview

The fulltext article system provides:
- Responsive footnote positioning (side footnotes on wide screens, bottom footnotes on narrow screens)
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
    └── TableOfContents (modal trigger)
```

**CRITICAL**: The `.fulltext` container must have `position: relative` for footnote positioning to work correctly.

### 2. FootnoteManager Component (`src/components/FootnoteManager.svelte`)

Handles responsive footnote positioning and interactive highlighting.

#### Positioning Logic (FRAGILE - Handle with Care)

**Horizontal Positioning:**
```css
.side-footnotes {
  position: absolute;
  left: calc(600px + 50px); /* fulltext max-width + gap */
}
```

**Why this works:**
- `.fulltext` has `max-width: 600px`
- Side footnotes positioned `600px + 50px` from the left edge of `.fulltext`
- Creates exactly 50px gap between main text and footnotes

**DANGER ZONES:**
1. **Never change `.fulltext` max-width without updating footnote positioning**
2. **Never use `position: fixed` for footnotes** - breaks scrolling behavior
3. **Never use viewport-based calculations** - creates inconsistent positioning

#### Vertical Positioning

```javascript
// Get position relative to article container
const articleRect = article.getBoundingClientRect();
const refRect = ref.getBoundingClientRect();
const topPosition = refRect.top - articleRect.top;
```

**Why this works:**
- Uses `getBoundingClientRect()` for accurate positioning
- Calculates relative to article container, not viewport
- Works correctly on page reload at any scroll position

**DANGER ZONES:**
1. **Never use `offsetTop` calculations** - breaks on page reload when scrolled
2. **Never add `window.scrollY`** - creates double-scroll offset
3. **Never use viewport coordinates** - breaks relative positioning

#### Screen Size Breakpoints

```javascript
isWideScreen = window.innerWidth >= 1200;
```

- **< 1200px**: Bottom footnotes only
- **≥ 1200px**: Side footnotes with bottom footnotes hidden

### 3. TableOfContents Component (`src/components/TableOfContents.svelte`)

Universal modal-based navigation with keyboard shortcuts.

#### Design Principles
- **Universal**: Same experience on all devices
- **Non-intrusive**: Doesn't affect existing layout
- **Keyboard-first**: Full keyboard navigation

#### Keyboard Shortcuts
- `T` - Toggle modal
- `1-9, 0` - Jump to sections (first 10)
- `Esc` - Close modal

## CSS Architecture

### Typography Consistency

All footnotes use the same typography as main text:

```css
.fulltext .footnotes ol,
.side-footnotes {
  font-family: Georgia, Charter, "Times New Roman", serif;
  font-size: 1em; /* Same as main text */
  font-style: italic;
  line-height: 1.65; /* Same as main text */
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

### Footnote Highlighting

**Click footnote mark → Highlight footnote:**
- Side footnotes: Immediate highlight (no scroll needed)
- Bottom footnotes: Scroll to footnote + highlight

**Click footnote → Highlight footnote mark:**
- Scroll footnote mark to center of viewport
- 300ms delay before highlighting (ensures smooth scroll completion)
- Works for both side and bottom footnotes

### Event Handling

```javascript
// Handle side footnote clicks
document.addEventListener('click', (event) => {
  const sideFootnote = event.target.closest('.side-footnote');
  if (sideFootnote) {
    const footnoteId = sideFootnote.getAttribute('data-footnote-id');
    highlightFootnoteRef(footnoteId);
  }
});
```

## Common Pitfalls & Solutions

### 1. Footnote Positioning Issues

**Problem**: Footnotes appear in wrong location
**Cause**: Usually horizontal positioning calculation is wrong
**Solution**: Verify `.fulltext` max-width matches CSS calculation

**Problem**: Footnotes don't scroll with content
**Cause**: Using `position: fixed` instead of `position: absolute`
**Solution**: Always use `position: absolute` for side footnotes

**Problem**: Footnotes misaligned on page reload when scrolled
**Cause**: Using `offsetTop` or adding `window.scrollY`
**Solution**: Use `getBoundingClientRect()` relative calculations only

### 2. Layout Conflicts

**Problem**: TOC interferes with existing layout
**Cause**: Using grid or sidebar positioning
**Solution**: Use modal-only approach with floating button

**Problem**: Changes affect elements outside `.fulltext`
**Cause**: CSS selectors too broad or layout changes too aggressive
**Solution**: Scope all changes to `.fulltext` and descendants

### 3. Responsive Behavior

**Problem**: Features break on mobile
**Cause**: Assuming desktop-only usage
**Solution**: Always implement mobile-first with progressive enhancement

## Testing Checklist

Before making changes, test:

1. **Footnote positioning**:
   - [ ] Side footnotes appear 50px right of main text (wide screens)
   - [ ] Footnotes align vertically with their marks
   - [ ] Footnotes scroll with content
   - [ ] Positioning correct on page reload when scrolled

2. **Interactive highlighting**:
   - [ ] Click footnote mark → highlights footnote
   - [ ] Click footnote → scrolls to and highlights mark
   - [ ] Works for both side and bottom footnotes

3. **Responsive behavior**:
   - [ ] Side footnotes on wide screens (≥1200px)
   - [ ] Bottom footnotes on narrow screens (<1200px)
   - [ ] TOC modal works on all screen sizes

4. **Layout preservation**:
   - [ ] No changes to elements above/below `.fulltext`
   - [ ] Existing article layout unchanged
   - [ ] No horizontal scrollbars introduced

## File Structure

```
src/
├── components/
│   ├── FootnoteManager.svelte    # Side footnote positioning & highlighting
│   └── TableOfContents.svelte    # Modal TOC with keyboard shortcuts
├── layouts/
│   └── PageLayout.astro          # Simple layout (no grid)
├── pages/writing/
│   └── [...slug].astro           # Article page integration
└── styles/
    └── global.css                # Footnote & TOC styling
```

## Future Considerations

### Adding New Features
- Always test footnote positioning after layout changes
- Ensure new features don't break existing responsive behavior
- Maintain keyboard accessibility for all interactions

### Performance
- Footnote positioning recalculates on window resize
- TOC extraction happens once on component mount
- Intersection Observer used for active section tracking

### Accessibility
- All interactive elements have proper ARIA labels
- Keyboard navigation fully supported
- Focus management in modal interactions

## Emergency Fixes

If footnotes break completely:

1. **Check `.fulltext` positioning**: Must be `position: relative`
2. **Verify CSS calculations**: `left: calc(600px + 50px)` for side footnotes
3. **Confirm JavaScript positioning**: Use `getBoundingClientRect()` only
4. **Test screen size detection**: `window.innerWidth >= 1200`

The most common issue is horizontal positioning - always verify the gap calculation matches the actual `.fulltext` width.