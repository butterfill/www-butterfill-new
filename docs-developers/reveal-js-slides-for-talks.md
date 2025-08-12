# Reveal.js Slides for Talks

This document explains how the reveal.js slide presentation system is implemented for talk pages in the Astro static site.

## Overview

Talk pages can display interactive slide presentations using reveal.js. When a talk has `slideImages` defined in its frontmatter, the slides are automatically rendered as an interactive presentation that users can navigate through.

## How It Works

### 1. Content Structure

Talk content files are located in `src/content/talks/` and use markdown with frontmatter. To enable slides, add a `slideImages` array to the frontmatter:

```markdown
---
title: "My Talk Title"
authors: "Author Name"
pubDate: 2024-01-01T00:00:00.000Z
slideImages:
  - /img/talks/my-talk/slide-000.jpg
  - /img/talks/my-talk/slide-001.jpg
  - /img/talks/my-talk/slide-002.jpg
---

## Abstract
Your talk content here...
```

### 2. Static Assets Setup

Reveal.js assets must be copied to the `public/` directory so they can be served statically:

```bash
# From the project root
mkdir -p public/reveal.js/dist
cp -r node_modules/reveal.js/dist/* public/reveal.js/dist/
```

This copies:
- `reveal.css` - Core reveal.js styles
- `reveal.js` - Main reveal.js library
- `theme/` directory - Various presentation themes

### 3. Component Architecture

#### Talk Page Template (`src/pages/talks/[...slug].astro`)

The talk page template conditionally renders the Slides component when `slideImages` exist:

```astro
{entry.data.slideImages && entry.data.slideImages.length > 0 && (
  <div class="my-8">
    <h2 class="text-2xl font-bold mb-4">Slides</h2>
    <Slides images={entry.data.slideImages} />
  </div>
)}
```

#### Slides Component (`src/components/Slides.astro`)

The Slides component handles the reveal.js integration:

**Key Features:**
- **HTML Structure**: Creates the required `.reveal > .slides > section` hierarchy
- **Asset Loading**: Links to reveal.js CSS and JavaScript files
- **CSS Overrides**: Uses `!important` styles to override Tailwind CSS conflicts
- **Initialization**: Robust JavaScript initialization with retry logic
- **Responsive Images**: Slides contain images with proper sizing

**Critical Implementation Details:**

1. **Fixed Dimensions**: The reveal container has explicit dimensions to prevent layout issues
2. **CSS Conflicts Resolution**: Uses `!important` to override Tailwind CSS that might hide slides
3. **Retry Logic**: JavaScript initialization retries if reveal.js hasn't loaded yet
4. **Embedded Mode**: Uses `embedded: true` to integrate within the page layout

## Adding Slides to a New Talk

### Step 1: Prepare Slide Images

1. Create a directory in `public/img/talks/` for your talk:
   ```
   public/img/talks/my-new-talk/
   ```

2. Add your slide images (typically JPG or PNG):
   ```
   public/img/talks/my-new-talk/slide-000.jpg
   public/img/talks/my-new-talk/slide-001.jpg
   public/img/talks/my-new-talk/slide-002.jpg
   ```

### Step 2: Update Talk Frontmatter

Add the `slideImages` array to your talk's markdown file:

```markdown
---
title: "My New Talk"
authors: "Your Name"
pubDate: 2024-01-01T00:00:00.000Z
slideImages:
  - /img/talks/my-new-talk/slide-000.jpg
  - /img/talks/my-new-talk/slide-001.jpg
  - /img/talks/my-new-talk/slide-002.jpg
---
```

### Step 3: Test

1. Start the dev server: `npm run dev`
2. Navigate to your talk page: `http://localhost:4321/talks/YYYY/your-talk-slug`
3. Verify slides appear and are navigable with arrow keys

## Troubleshooting

### Slides Flash and Disappear

This usually indicates CSS conflicts. Check:
1. Reveal.js assets are properly copied to `public/reveal.js/dist/`
2. CSS overrides in the Slides component are working
3. Browser console for JavaScript errors

### Slides Don't Initialize

Check browser console for:
- "Initializing Reveal.js..." message
- "Reveal.js initialized successfully" message
- Any JavaScript errors

Common issues:
- Reveal.js files not found (404 errors)
- JavaScript loading order problems
- CSS conflicts preventing display

### Images Don't Load

Verify:
1. Image paths in frontmatter are correct (start with `/`)
2. Images exist in the `public/` directory
3. Image file names match exactly (case-sensitive)

## Technical Notes

### Why Copy Assets to Public?

Astro serves the `public/` directory as static assets. Node modules aren't accessible to the browser, so reveal.js files must be copied to `public/` during setup.

### CSS Conflicts with Tailwind

Tailwind CSS can interfere with reveal.js styles. The Slides component uses:
- `!important` declarations to override Tailwind
- Explicit positioning and display properties
- Fixed dimensions to prevent layout collapse

### Embedded vs Fullscreen Mode

The implementation uses `embedded: true` to integrate slides within the page layout rather than taking over the entire viewport. This allows slides to coexist with other page content.

## Dependencies

- `reveal.js` npm package (installed in package.json)
- Static asset copying (manual step during setup)
- Astro's static site generation
- Compatible with Tailwind CSS (with overrides)