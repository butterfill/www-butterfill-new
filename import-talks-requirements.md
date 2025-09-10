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

The repository generates a static site which is hosted at `https://handouts.butterfill.com/`

The information in `_projects.yaml` should be ignored. All data should be derived from individual talk files (`*.md.njk`) in the `lectures/` folder. (Note that the `*.md.njk` in `lectures/units/` can be ignored for this project as they are components of the talks, not the talks themselves.)

**Content Format:**

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
externalUrl?: string (optional)
featured?: boolean (optional)
---
```

**Notes:**

* `featured` should be set to true when a file is first imported (this is never available in the `*.md.njk` files).
* `handoutUrl` should point to the pdf handout on `https://handouts.butterfill.com/`. For example, the pdf handout URL associated with `bochum_2022_motor_mindreading.md.njk` is `https://handouts.butterfill.com/assets/pdf/bochum_2022_motor_mindreading_handout.pdf`
* `externalUrl?` should always be computed and should point to the location of the HTML verision of the handout on `https://handouts.butterfill.com/`. For example, the URL associated with `bochum_2022_motor_mindreading.md.njk` is `https://handouts.butterfill.com/docs/bochum_2022_motor_mindreading/bochum_2022_motor_mindreading/` (the repetition in the URL is not a mistake).


## Script Requirements

### Core Functionality

1. **Detection of Changes**
   - Compare modification times of source files against target files
   - Track talks that have been added, modified, or removed
   - Maintain a state file to track last import timestamps

2. **Data Extraction**
   - Parse individual `.md.njk` files to extract frontmatter
   - Ignore any `.md.njk` files where `hidden` is `true`.
   - Determine publication URLs for pdf handouts and for HTML handouts

3. **Content Generation**
   - Create Markdown files in the correct directory structure (`[year]/[talk_name].md`)
   - Generate proper YAML frontmatter matching the target schema
   - Handle author name formatting (array to comma-separated string)

### Input Parameters

- `--source-dir`: Path to the talks repository (default: `../../../../writing2/talks/`)
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

**Decision:**
- Use the `lecture_date` from the individual talk file (calendar year)

### 2. Author Name Formatting
**Question:** How should multiple authors be formatted in the target schema?

**Decision:**
- Join with " and ": "Stephen A. Butterfill and John Michael"

### 4. URL Generation Strategy
**Question:** How should handout URLs be determined?

**Decision:**
- Generate URLs based on file existence and naming conventions as illustrated above.

### 5. Content Extraction
**Question:** What content should be included in the body of the generated Markdown files?

**Decision:**
- None. Rather than replicating content, we will link to `https://handouts.butterfill.com/`


### 6. File Naming Convention
**Question:** How should the generated Markdown files be named?

**Decision:**
- Use the original filename without extension: `ceu_vienna_2025.md`

### 7. Incremental vs. Full Import
**Question:** Should the script support incremental imports or always do a full rebuild?

**Decision:**
- Support incremental imports based on file modification times


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