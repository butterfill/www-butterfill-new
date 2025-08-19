# Academic Website

A static academic website built with Astro + Svelte and Tailwind CSS.

You’re welcome to re-use this for your own site.

## How to Re-use This Site

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### 1. Installation

Clone this repository and install dependencies:

```bash
git clone <your-fork-url>
cd <project-directory>
npm install
cd scripts && npm install && cd ..
```

### 2. Replace Personal Information

**Essential replacements** (search and replace these throughout the codebase):

1. **Name and Identity**:
   - Replace `Stephen A. Butterfill` and `Stephen Butterfill` with your name
   - Replace `Butterfill` in navigation (see `src/layouts/BaseLayout.astro` line 79)

2. **Email Address**:
   - Update `s.butterfill@warwick.ac.uk` in `src/components/EmailModal.svelte` (line 6)

3. **Site Title and Description**:
   - Update page titles in `src/pages/index.astro` (line 48)
   - Update the hero section description (lines 61-63)
   - Update the personal bio section (lines 257-277)

4. **Footer**:
   - Update copyright in `src/layouts/BaseLayout.astro` (line 108)

### 3. Content Setup

**Remove existing content and add yours**:

```bash
# Remove all existing content
rm -rf src/content/writing/*
rm -rf src/content/talks/*  
rm -rf src/content/teaching/*
rm -rf public/md/*
```

**Add your content**:

1. **Publications**: Create `.md` files in `src/content/writing/` (see Content Management section below)
2. **Talks**: Create `.md` files in `src/content/talks/`
3. **Teaching**: Create `.md` files in `src/content/teaching/`

### 4. Development

Start the development server:

```bash
npm run dev
```

Visit `http://localhost:4321` to see your site.

### 5. Build and Deploy

```bash
npm run build  # Builds the site and generates llms.txt
npm run preview  # Preview the built site locally
```

## 📁 Project Structure

```text
/
├── public/                    # Static assets
│   ├── pdf/                  # Academic papers and talk handouts
│   ├── img/talks/            # Slide images organized by talk
│   └── _redirects            # Cloudflare redirect rules
├── src/
│   ├── content/              # Content collections
│   │   ├── writing/          # Academic publications
│   │   ├── talks/            # Conference talks (organized by year)
│   │   └── teaching/         # Course materials
│   ├── components/           # Reusable UI components
│   ├── layouts/              # Page layouts
│   └── pages/                # Site pages and routing
├── scripts/                  # Content management scripts
│   ├── generate-llms.mjs     # Generates LLM-friendly content file
│   ├── sync-bibtex.mjs       # Syncs content from BibTeX files
│   └── bib-filter.js         # Filters BibTeX entries by author
└── docs-developers/          # Developer documentation
```

## 📝 Content Management

### Using the Scripts

The `scripts/` directory contains tools for importing and managing academic content:

#### 1. BibTeX Content Sync (`sync-bibtex.mjs`)

You can create the entries in writing manually, but if you already have them as bibtex
then this script will import them for you:

```bash
cd scripts
node sync-bibtex.mjs path/to/your/bibliography.bib
```

This script:
- Parses BibTeX entries
- Creates markdown files in `src/content/writing/`
- Extracts metadata (title, authors, year, journal, etc.)

#### 2. BibTeX Filtering (`bib-filter.js`)

*You don't need to use this directly as it’s called by `sync-bibtex.mjs`. 

Filters BibTeX files by author name:

```bash
cd scripts
node bib-filter.js input.bib --keyword "your-name" > filtered.bib
```

Options:
- `--keyword, -k`: Author name to filter by (default: "butterfill")
- Automatically excludes conference abstracts and thesis entries
- Filters out entries with "submitted", "progress", or "preparation" in year field

#### 3. LLM Content Generation (`generate-llms.mjs`)

Creates a consolidated text file for LLM consumption:

```bash
node scripts/generate-llms.mjs
```

This generates `public/llms.txt` containing all publications and talks in a format optimized for Large Language Models.

### Adding New Content

#### Publications

1. **Manual approach:** Create markdown files in `src/content/writing/`
2. **BibTeX approach:** Use `sync-bibtex.mjs` to import from bibliography files

#### Adding full text to publications

1. Add the full text as html in `<div class="fulltext"></div>` in the `article.md` file.

2. Add markdown to `public/md`. Make sure the md has the same basename as the article. The build script will find the markdown file. 

Where a markdown file exists, `Copy for Chat` (with LLMs) will be enabled. [∞todo: also add link to full text in the `LLMS.txt` file]

#### Adding pdfs to publications

Add the pdf to `public/pdf` and update the `pdfUrl` property [∞todo: auto match pdfs to filenames]. Make sure the pdf has the same basename as the article.


#### Talks

1. Create markdown files in `src/content/talks/YYYY/` (organized by year)
2. Add slide images to `public/img/talks/talk-name/`
3. Include `slideImages` array in frontmatter for interactive presentations

#### Teaching Materials

Create markdown files in `src/content/teaching/` for course materials and lectures.


### Interactive Slide Presentations

Talks can include interactive slide presentations using Reveal.js:

```markdown
---
title: "My Talk"
slideImages:
  - /img/talks/my-talk/slide-000.jpg
  - /img/talks/my-talk/slide-001.jpg
---
```


## 🏗️ Building and Deployment

### Local Build

```bash
npm run build
```

This command:
1. Runs `generate-llms.mjs` to create the LLM content file
2. Builds the static site to `./dist/`

### Preview Build

```bash
npm run preview
```

Preview the built site locally before deployment.

## ☁️ Cloudflare Pages Deployment

This site is optimized for deployment on Cloudflare Pages.

### Automatic Deployment

1. **Connect your repository** to Cloudflare Pages
2. **Configure build settings:**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node.js version: 18+

3. **Environment variables** (if needed):
   - No special environment variables required for basic deployment

### Manual Deployment

1. **Build the site:**
   ```bash
   npm run build
   ```

2. **Deploy to Cloudflare Pages:**
   ```bash
   npx wrangler pages deploy dist
   ```

### Redirects

The site includes redirect rules in `public/_redirects` for maintaining backward compatibility with old URL structures. These are automatically handled by Cloudflare Pages.

You probably do not want these as they’re specific to my old site.


### Content Collections

Content is managed using Astro's content collections:
- `writing`: Academic publications
- `talks`: Conference presentations
- `teaching`: Educational materials

## 📚 Documentation

Additional documentation for developers:
- [`docs-developers/generate-llms-script.md`](docs-developers/generate-llms-script.md) - LLM content generation
- [`docs-developers/reveal-js-slides-for-talks.md`](docs-developers/reveal-js-slides-for-talks.md) - Slide presentations
- [`docs-developers/command-menu.md`](docs-developers/command-menu.md) - Command palette system


## 📄 License

MIT (do whatever you want with it)