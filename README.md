# Academic Website

A static academic website built with Astro, featuring academic publications, talks, and teaching materials. This site includes interactive slide presentations, content management scripts, and is optimized for deployment on Cloudflare Pages.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   npm install
   ```

2. **Install script dependencies:**
   ```bash
   cd scripts
   npm install
   cd ..
   ```

3. **Set up Reveal.js assets (for slide presentations):**
   ```bash
   mkdir -p public/reveal.js/dist
   cp -r node_modules/reveal.js/dist/* public/reveal.js/dist/
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

Visit `http://localhost:4321` to see your site.

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

Imports academic publications from BibTeX files and creates markdown files:

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

#### Talks

1. Create markdown files in `src/content/talks/YYYY/` (organized by year)
2. Add slide images to `public/img/talks/talk-name/`
3. Include `slideImages` array in frontmatter for interactive presentations

#### Teaching Materials

Create markdown files in `src/content/teaching/` for course materials and lectures.

## 🎨 Features

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

### Command Palette

Press `Ctrl+K` (or `Cmd+K` on Mac) to open the command palette for quick navigation.

### Citation Display

Academic publications include formatted citations and copy-to-clipboard functionality.

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

### Custom Domain

To use a custom domain:
1. Add your domain in the Cloudflare Pages dashboard
2. Update DNS settings to point to Cloudflare
3. Configure SSL/TLS settings as needed

## 🛠️ Development

### Available Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Start development server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview build locally |
| `npm run astro ...` | Run Astro CLI commands |

### Key Technologies

- **Astro**: Static site generator with component islands
- **Svelte**: Interactive UI components
- **Tailwind CSS**: Utility-first CSS framework
- **Reveal.js**: Interactive slide presentations
- **TypeScript**: Type-safe development

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