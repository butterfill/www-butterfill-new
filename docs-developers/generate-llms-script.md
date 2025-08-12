# LLM Text Generation Script Documentation

## Overview

The `generate-llms.mjs` script creates a consolidated text file (`public/llms.txt`) containing all academic content from the website. This file is designed to be consumed by Large Language Models (LLMs) to provide context about Stephen Butterfill's academic work.

## How It Works

### Purpose
The script combines all publications and talks into a single, LLM-friendly text format that includes:
- Publications from the `writing` collection
- Talks from the `talks` collection
- Metadata (title, authors, year, journal/event)
- Full content body in markdown format

### File Location
- **Script**: `scripts/generate-llms.mjs`
- **Output**: `public/llms.txt`

### Integration with Build Process
The script runs automatically during the build process:
```json
{
  "scripts": {
    "build": "node ./scripts/generate-llms.mjs && astro build"
  }
}
```

## Technical Implementation

### Dependencies
The script uses these Node.js modules:
- `fs-extra`: For file system operations
- `path`: For handling file paths
- `yaml`: For parsing YAML frontmatter

### Key Functions

#### 1. `parseFrontmatter(content)`
Extracts YAML frontmatter and markdown body from content files.

```javascript
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { data: {}, body: content };
  }
  
  const [, frontmatterStr, body] = match;
  const data = yaml.parse(frontmatterStr);
  
  return { data, body };
}
```

#### 2. `readMarkdownFiles(dir)`
Recursively reads all `.md` files from a directory and its subdirectories.

- Handles nested folder structures (like `talks/2013/`, `talks/2014/`, etc.)
- Parses frontmatter for each file
- Adds a `type` field to distinguish between 'writing' and 'talk' content

### Content Processing

The script processes two content collections:

#### Writing Collection (`src/content/writing/`)
- **Frontmatter fields**: `title`, `authors`, `year`, `journal`, etc.
- **Structure**: Flat directory with `.md` files
- **Example**: `minimal_theory_of_mind.html.md`

#### Talks Collection (`src/content/talks/`)
- **Frontmatter fields**: `title`, `authors`, `pubDate`, `event`, etc.
- **Structure**: Nested by year (`2012/`, `2013/`, etc.)
- **Example**: `talks/2013/two_systems_two_theories.html.md`

### Output Format

Each item in the generated file follows this structure:

```
Title: [Title]
Authors: [Authors]
Year: [Year]
[Journal: [Journal Name]] // For publications
[Event: [Event Name]]     // For talks
Type: [Publication|Talk]

[Full markdown content]

---
```

## How to Modify the Script

### Adding New Content Types

1. **Add a new collection directory** (e.g., `src/content/books/`)
2. **Update the script** to read from the new directory:
   ```javascript
   const booksDir = path.join(process.cwd(), 'src/content/books');
   const bookItems = await readMarkdownFiles(booksDir);
   const allItems = [...writingItems, ...talkItems, ...bookItems];
   ```
3. **Handle new frontmatter fields** in the processing loop

### Modifying Output Format

To change how content appears in the output file, modify the loop in the main section:

```javascript
for (const item of allItems) {
  // Customize the output format here
  fullText += `Title: ${item.data.title || 'Untitled'}\n`;
  // Add new fields or change formatting
}
```

### Adding Filtering or Sorting

To filter or sort content before processing:

```javascript
// Example: Only include items from 2020 onwards
const filteredItems = allItems.filter(item => {
  const year = item.type === 'talk' 
    ? new Date(item.data.pubDate).getFullYear()
    : item.data.year;
  return year >= 2020;
});

// Example: Sort by year (newest first)
const sortedItems = allItems.sort((a, b) => {
  const yearA = a.type === 'talk' 
    ? new Date(a.data.pubDate).getFullYear()
    : a.data.year;
  const yearB = b.type === 'talk' 
    ? new Date(b.data.pubDate).getFullYear()
    : b.data.year;
  return yearB - yearA;
});
```

## Running the Script

### Standalone Execution
```bash
node ./scripts/generate-llms.mjs
```

### As Part of Build Process
```bash
npm run build
```

## Troubleshooting

### Common Issues

1. **"ERR_UNSUPPORTED_ESM_URL_SCHEME" Error**
   - This occurs if you try to import Astro-specific modules (like `astro:content`)
   - Solution: Use direct file system operations instead

2. **Missing Content**
   - Check that the directory structure matches what the script expects
   - Ensure `.md` files have proper frontmatter format

3. **YAML Parsing Errors**
   - Verify frontmatter syntax in content files
   - Check for special characters that need escaping

### Debugging Tips

1. **Add logging** to see what files are being processed:
   ```javascript
   console.log(`Processing: ${fullPath}`);
   ```

2. **Check file counts**:
   ```javascript
   console.log(`Found ${writingItems.length} writing items`);
   console.log(`Found ${talkItems.length} talk items`);
   ```

3. **Validate output** by checking the generated file size and content

## Future Enhancements

Potential improvements for the script:
- Add content validation (check for required frontmatter fields)
- Include teaching materials from the `teaching` collection
- Add metadata about file modification dates
- Implement incremental updates (only process changed files)
- Add support for different output formats (JSON, XML, etc.)