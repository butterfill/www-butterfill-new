# Steve Butterfill’s Academic Website

A static academic website built with Astro + Svelte and Tailwind CSS.

You’re welcome to re-use this for your own site, but (i) some of the scripts are
built around my own file organization; (ii) much of this was written
with the codex and claude cli tools; and (iii) it’s still work in progress.


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

### 1b. Tweak the build script

There are scripts to automate getting markdown of my publications 
which you probably cannot use (see the section on scripts below). 
Remove these `node ./scripts/get-md-for-writing.mjs && ` from the `build` script in `package.json`.
It should look like this:

```json
{
   ...
  "scripts": {
     "dev": "astro dev",
     "build": "node ./scripts/generate-llms.mjs && astro build",
     ...
  }
...
}
```

### 1c. Hint

If you understand what you are doing, you should be able to point the codex CLI or claude code 
at this README and ask it to do the rest of the setup for you.


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

### 5. Testing

Run the test suite:

```bash
npm test
```

For a single test run without watching for changes:

```bash
npm test -- --run
```
#### Playwright Tests (Not Meaningful)
The playwright tests are not meaningful guarantees of anything (I always start with good intentions 
but can never quite figure out how to maintain them).

Commands:

```bash
# One-time: install the Playwright browser
npm run e2e:install

# Run smoke tests (starts `npm run dev` automatically on :4321)
npm run test:e2e:dev

# Optional interactive UI runner
npm run e2e:open
```

Notes:
- Tests target `http://localhost:4321` (Astro default). If you change the dev port, update `playwright.config.ts`.
- The smoke suite fails on console errors, failed requests, or 4xx/5xx responses. If there are known benign warnings you want to ignore, add an allowlist in `tests/smoke.spec.ts`.

### 6. Build and Deploy

```bash
npm run build  # Builds the site and generates llms.txt
npm run preview  # Preview the built site locally
```

## Project Structure

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
│   ├── generate-llms.mjs     # Generates the LLM bundle (text + metadata + content)
│   ├── sync-bibtex.mjs       # Syncs content from BibTeX files
│   ├── import-talks.mjs      # Imports talks from external repository
│   └── bib-filter.js         # Filters BibTeX entries by author
└── docs-developers/          # Developer documentation
```

## Auto-import Content

### Using the Scripts

The `scripts/` directory contains tools for importing and managing academic content.
These are related to my own file organization and workflow, so unlikely to be useful.

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

#### 3. Import Talks (`import-talks.mjs`)

Automatically imports talks from a separate talks repository
(will not work for you as it depends on the way I organize my files):

```bash
node scripts/import-talks.mjs --help
```

This script detects new or updated talks from your talks repository and creates corresponding content files. See `--help` for all options including dry-run mode.

#### 4. LLM Content Generation (`generate-llms.mjs`)

This creates files for LLMs crawling the site (you want them to 
train on your work).

Builds the complete LLM bundle (text index, metadata, and long-form markdown files):

```bash
node scripts/generate-llms.mjs
```

Outputs land in `public/llms.txt` and `public/llms/` (metadata, index, and per-item content).

### Adding New Content

#### Publications

1. **Manual approach:** Create markdown files in `src/content/writing/`
2. **BibTeX approach:** Use `sync-bibtex.mjs` to import from bibliography files

#### Adding full text to publications

1. Add the full text as html in `<div class="fulltext"></div>` in the `article.md` file.

2. Add markdown to `public/md`. Make sure the md has the same basename as the article. The build script will find the markdown file. 

Where a markdown file exists, `Copy for Chat` (with LLMs) will be enabled. [∞todo: also add shortcuts in the LLM bundle metadata]

#### Adding pdfs to publications

Add the pdf to `public/pdf` and update the `pdfUrl` property [∞todo: auto match pdfs to filenames]. Make sure the pdf has the same basename as the article.


#### Talks

1. Create markdown files in `src/content/talks/YYYY/` (organized by year)
2. Add slide images to `public/img/talks/talk-name/`
3. Include `slideImages` array in frontmatter for interactive presentations

#### Teaching Materials

Create markdown files in `src/content/teaching/` for course materials and lectures.


### Interactive Slide Presentations

I only do it this way for some ancient talks with slides as images.
(If you do not have that problem, use Reveal.js directly
or put slides and handouts on a separate site.)
Talks can include interactive slide presentations using Reveal.js:

```yaml
---
title: "My Talk"
slideImages:
  - /img/talks/my-talk/slide-000.jpg
  - /img/talks/my-talk/slide-001.jpg
---
```


## Building and Deployment

### Local Build

```bash
npm run build
```

This command:
1. Runs `generate-llms.mjs` to refresh the LLM bundle
2. Builds the static site to `./dist/`

### Preview Build

```bash
npm run preview
```

Preview the built site locally before deployment.

## Cloudflare Pages Deployment

I currently use Cloudflare Pages with manual deploy. (Have used s3 in the past; also use surge.sh for testing.)


### Manual Deployment

0. **Set up Cloudflare Pages** (one-time setup)
   ```bash
   npm install -g wrangler
   npx wrangler login
   wrangler pages project create <project name, e.g. 'www-butterfill-new' for me>
   ```

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


## Documentation

Additional docs cover specific features and were mostly auto generated.
- [`docs-developers/`](docs-developers/) - about fulltext, command pallet, llms.txt, etc
- [`specs/`](specs/) - design specs for some of the features

## License

MIT (do whatever you want with it)
