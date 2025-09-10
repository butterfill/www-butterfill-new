# Import Talks Script Requirements

## Overview

This document outlines the requirements for a script that automatically imports talk content from the `talks/` repository into the `www-butterfill-new/` personal academic website. The script should detect new or updated talks and create appropriate content files with proper metadata and links.

## Repository Structure Analysis

### Source Repository: `talks/`

The talks repository uses a custom static site generator called "rmx" with the following structure:

**Main Content Location:**
- Source files: `talks/rmx/src/lectures/`
- Configuration: `talks/rmx/src/lectures/_projects.yaml`
- Individual talk files: `talks/rmx/src/lectures/*.md.njk` (Nunjucks templates)
- Talk units/sections: `talks/rmx/src/lectures/units/[talk_name]/`

**Content Format:**
- **Projects file** (`_projects.yaml`): Contains metadata for each talk including:
  - `id`: Unique identifier (UUID)
  - `title`: Talk title
  - `type`: Content type (always "talk" for our purposes)
  - `year`: Academic year (e.g., "2024-25")
  - `authors`: Array of author names
  - `status`: "complete", "in progress", etc.
  - `parents`: Array of parent content IDs
  - `url`: Optional array of published URLs

- **Individual talk files** (`*.md.njk`): Nunjucks templates with YAML frontmatter containing:
  - `title`: Talk title
  - `subtitle`: Optional subtitle
  - `lecture_date`: Date in YYYY-MM-DD format
  - `lecture_place`: Venue/location
  - `authors`: Array of author names
  - `slides`: Configuration for slide generation
  - `images`: Image theme identifier
  - `units`: Array of content unit references
  - `title_slide`: Boolean
  - `hidden`: Boolean

**Generated Output:**
- PDF handouts: `talks/rmx/raw/index/handout/jekyll/common/assets/pdf/[talk_name]_handout.pdf`
- Slide URLs: Based on `rmx-config.yaml` settings, typically `https://handouts.butterfill.com/docs/[talk_name]/`

### Target Repository: `www-butterfill-new/`

The personal website uses Astro with content collections:

**Target Location:**
- Content files: `www-butterfill-new/src/content/talks/[year]/[talk_name].md`
- Schema definition: `www-butterfill-new/src/content/config.ts`

**Required Format:**
Markdown files with YAML frontmatter matching the talks collection schema:
```yaml
---
title: string
authors: string (comma-separated)
pubDate: Date (ISO format)
endDate?: Date (optional)
event?: string (optional)
address?: string (optional)
handoutUrl?: string (optional)
slidesUrl?: string (optional)
slideImages?: string[] (optional)
featured?: boolean (optional)
---
```

## Script Requirements

### Core Functionality

1. **Detection of Changes**
   - Compare modification times of source files against target files
   - Track talks that have been added, modified, or removed
   - Maintain a state file to track last import timestamps

2. **Data Extraction**
   - Parse `_projects.yaml` to get talk metadata
   - Parse individual `.md.njk` files to extract frontmatter
   - Extract abstract/content from the `<handout>` section if present
   - Determine publication URLs for handouts and slides

3. **Content Generation**
   - Create Markdown files in the correct directory structure (`[year]/[talk_name].md`)
   - Generate proper YAML frontmatter matching the target schema
   - Include talk abstract/description in the content body
   - Handle author name formatting (array to comma-separated string)

4. **URL Generation**
   - Handout URLs: Check for existence of PDF files and generate URLs
   - Slide URLs: Use configuration from `rmx-config.yaml` or `_projects.yaml` URLs

### Input Parameters

- `--source-dir`: Path to the talks repository (default: `../talks`)
- `--target-dir`: Path to the www-butterfill-new repository (default: `.`)
- `--dry-run`: Preview changes without writing files
- `--force`: Force regeneration of all talks
- `--verbose`: Detailed logging output

### Output

- Created/updated Markdown files in `src/content/talks/`
- Summary report of changes made
- Error log for any failed imports

## Questions and Assumptions

### 1. Year Categorization
**Question:** How should talks be categorized by year for the directory structure?

**Options:**
- Use the `year` field from `_projects.yaml` (academic year format like "2024-25")
- Use the `lecture_date` from the individual talk file (calendar year)
- Use the file modification date

**Assumption Made:** Use the calendar year extracted from `lecture_date` when available, falling back to the current year from the `year` field in `_projects.yaml`. This provides more intuitive chronological organization.

### 2. Author Name Formatting
**Question:** How should multiple authors be formatted in the target schema?

**Options:**
- Join with commas: "Stephen A. Butterfill, John Michael"
- Join with " and ": "Stephen A. Butterfill and John Michael"
- Use first author only for simplicity

**Assumption Made:** Join multiple authors with commas and spaces, as this is the most common academic format and matches existing patterns in the target repository.

### 3. Talk Status Filtering
**Question:** Should all talks be imported regardless of status, or only completed ones?

**Options:**
- Import all talks (including "in progress")
- Import only talks with status "complete"
- Make it configurable

**Assumption Made:** Import only talks with status "complete" by default, with an optional flag `--include-drafts` to include "in progress" talks. This prevents incomplete content from appearing on the public website.

### 4. URL Generation Strategy
**Question:** How should handout and slide URLs be determined?

**Options:**
- Always use the URLs from `_projects.yaml` if available
- Generate URLs based on file existence and naming conventions
- Hybrid approach: prefer explicit URLs, fall back to generated ones

**Assumption Made:** Use a hybrid approach - prefer explicit URLs from `_projects.yaml`, but generate standard URLs based on naming conventions for handouts and slides when explicit URLs are not available.

### 5. Content Extraction
**Question:** What content should be included in the body of the generated Markdown files?

**Options:**
- Extract abstract from the `<handout>` section
- Include the full handout content
- Keep only the frontmatter with no body content
- Extract a summary from the first paragraph

**Assumption Made:** Extract and include the abstract/summary from the first few paragraphs of the `<handout>` section, stopping at the first heading or after a reasonable length (e.g., 500 characters). This provides useful preview content without overwhelming the talks listing page.

### 6. File Naming Convention
**Question:** How should the generated Markdown files be named?

**Options:**
- Use the original filename without extension: `ceu_vienna_2025.md`
- Use a slug generated from the title: `joint-action-at-the-roots-of-ethical-cognition.md`
- Use the talk ID from `_projects.yaml`

**Assumption Made:** Use the original filename without the `.md.njk` extension, as this maintains consistency with the source repository and avoids potential conflicts from title-based slugs.

### 7. Incremental vs. Full Import
**Question:** Should the script support incremental imports or always do a full rebuild?

**Options:**
- Always do a full import (simpler but slower)
- Support incremental imports based on file modification times
- Hybrid: incremental by default, full import with flag

**Assumption Made:** Support incremental imports by default using file modification times and a state file, with a `--force` flag for full rebuilds. This makes the script efficient for regular use while allowing complete regeneration when needed.

## Implementation Notes

- The script should be written in Node.js/JavaScript to match the existing toolchain
- Use existing dependencies where possible (yaml, gray-matter, fs-extra)
- Follow the existing code style and patterns from other scripts in the repository
- Include comprehensive error handling and logging
- Provide clear success/failure feedback to the user

## Success Criteria

1. All completed talks from the source repository are successfully imported
2. Generated files pass Astro's content collection validation
3. URLs for handouts and slides are correctly generated and accessible
4. The script can be run repeatedly without creating duplicates or errors
5. Changes to source talks are properly detected and updated in the target repository