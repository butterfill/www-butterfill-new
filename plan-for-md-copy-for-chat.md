# Plan: Enhanced Copy for Chat with Markdown Content

## Overview
We need to extend the "Copy for Chat" functionality to include full article text from markdown files when available. The system should only show the copy button if a corresponding markdown file exists, and format the content with specific instructions for LLM consumption.

## Requirements Summary
1. **Server-side approach**: Check for markdown files at build time
2. **File location**: Store markdown files in `src/assets/md/`
3. **Raw markdown**: No processing of markdown content
4. **Conditional display**: Hide copy button if no markdown file exists
5. **Specific format**: Use structured format with instructions and citations

## Current System Analysis

### Existing Components
- **CopyForChat.svelte**: Simple component that copies `contentToCopy` prop to clipboard
- **[...slug].astro**: Creates `textForLLM` variable with basic metadata + `entry.body`
- **Content flow**: `[...slug].astro` → `textForLLM` → `CopyForChat` component

### Current Content Format
```
Title: Three strategies for shared intention...
Authors: Butterfill, Stephen A.
Year: 2025

---

<div class="fulltext">
[HTML content from entry.body]
</div>
```

## Implementation Plan

### Step 1: Set up markdown file structure
**Goal**: Organize markdown files in the correct location

**Tasks**:
1. Create directory `src/assets/md/` if it doesn't exist
2. Move `public/md/butterfill2025_three.md` to `src/assets/md/butterfill2025_three.md`
3. Verify file is accessible from Astro build process

**How to test**: 
- Confirm file exists at `src/assets/md/butterfill2025_three.md`
- Build should not fail

### Step 2: Modify [...slug].astro to check for markdown files
**Goal**: At build time, detect if a markdown file exists for the current article

**Tasks**:
1. Import Node.js `fs` module at the top of the script section
2. Extract the slug from `entry.slug` (this should match the markdown filename)
3. Construct the path to the markdown file: `src/assets/md/${entry.slug}.md`
4. Use `fs.existsSync()` to check if the file exists
5. Create a boolean variable `hasMarkdownFile` to track this

**Code location**: In the script section of `src/pages/writing/[...slug].astro`, after getting the entry but before creating `textForLLM`

**How to test**:
- For `butterfill2025_three`, `hasMarkdownFile` should be `true`
- For other articles without markdown files, `hasMarkdownFile` should be `false`

### Step 3: Read markdown content when file exists
**Goal**: Load the raw markdown content from the file system

**Tasks**:
1. Create a variable `markdownContent` initialized to empty string
2. If `hasMarkdownFile` is true:
   - Use `fs.readFileSync()` to read the markdown file
   - Store the raw content in `markdownContent`
   - Handle any potential file reading errors with try/catch

**Code location**: Same script section, after the file existence check

**How to test**:
- Log `markdownContent.length` to verify content is loaded
- Verify content starts with expected markdown (e.g., title, headers)

### Step 4: Get citation information
**Goal**: Extract the formatted citation for the new content structure

**Tasks**:
1. The citation is already available from the `CitationDisplay` component
2. We need to get the same formatted citation text that component generates
3. Create a function to format the citation using the same logic as `CitationDisplay`
4. Store the formatted citation in a `formattedCitation` variable

**Code location**: Same script section, can reuse existing `bibtexData`, `entry.data.authors`, etc.

**How to test**:
- Verify `formattedCitation` contains properly formatted citation text
- Should match what appears on the page in the CitationDisplay component

### Step 5: Create enhanced content format
**Goal**: Build the new structured content format with instructions

**Tasks**:
1. Create a new variable `enhancedTextForLLM` 
2. Build the content using template literals with the specified format:
   ```javascript
   const enhancedTextForLLM = `<instructions>
   You are a professor of philosophy who will be asked questions about the <article> below.
   Please read this carefully and ensure that your answers are based on the article only.
   Give exact, word-for-word quotes from the article to support your points.

   If your tools include web search, you may find it useful to consult \`https://butterfill.com/llms.txt\` for information about related work. If you do consult related works, please be sure to correctly identify each source you rely on in answering the user's questions.
   </instructions>

   <article>
   Title: ${entry.data.title}
   Authors: ${entry.data.authors}
   Year: ${entry.data.year}

   <citation>
   ${formattedCitation}
   </citation>

   <full-text>
   ${markdownContent}
   </full-text>
   </article>`;
   ```

**Code location**: Same script section, after markdown content is loaded

**How to test**:
- Verify the content includes all required sections
- Check that markdown content is included raw (no HTML conversion)

### Step 6: Conditionally render CopyForChat component
**Goal**: Only show the copy button when markdown file exists

**Tasks**:
1. Modify the template section of `[...slug].astro`
2. Wrap the `CopyForChat` component in a conditional block
3. Pass the enhanced content when available, original content otherwise
4. Update the contextual actions array to only include "Copy for Chat" when markdown exists

**Code location**: In the template section where `CopyForChat` is currently rendered

**Current code**:
```astro
<CopyForChat contentToCopy={textForLLM} client:load />
```

**New code**:
```astro
{hasMarkdownFile && (
  <CopyForChat contentToCopy={enhancedTextForLLM} client:load />
)}
```

**How to test**:
- For articles with markdown files: Copy button appears and copies enhanced content
- For articles without markdown files: Copy button does not appear

### Step 7: Update contextual actions
**Goal**: Ensure the command palette also reflects the conditional copy functionality

**Tasks**:
1. Modify the `pageActions` array creation logic
2. Only add the "Copy for Chat" action when `hasMarkdownFile` is true
3. Use the enhanced content for the action when available

**Code location**: In the script section where `pageActions` is built

**Current logic**:
```javascript
// Add Copy for Chat as second item
pageActions.push({
  label: 'Copy for Chat',
  action: 'copyToClipboard',
  text: textForLLM
});
```

**New logic**:
```javascript
// Add Copy for Chat only if markdown file exists
if (hasMarkdownFile) {
  pageActions.push({
    label: 'Copy for Chat',
    action: 'copyToClipboard',
    text: enhancedTextForLLM
  });
}
```

**How to test**:
- Command palette (Cmd+K) should only show "Copy for Chat" for articles with markdown files

### Step 8: Error handling and edge cases
**Goal**: Handle potential issues gracefully

**Tasks**:
1. Add try/catch around file operations
2. Handle cases where file exists but is unreadable
3. Handle cases where file is empty
4. Add console logging for debugging (can be removed later)

**Code location**: Around the file reading operations in step 3

**How to test**:
- Test with corrupted/unreadable markdown file
- Test with empty markdown file
- Verify graceful fallback behavior

### Step 9: Testing and validation
**Goal**: Ensure the feature works correctly across different scenarios

**Test cases**:
1. **Article with markdown file** (`butterfill2025_three`):
   - Copy button appears
   - Clicking copies enhanced content with instructions
   - Content includes raw markdown
   - Citation is properly formatted
   
2. **Article without markdown file** (any other article):
   - Copy button does not appear
   - Command palette doesn't show copy option
   - Page renders normally otherwise

3. **Content validation**:
   - Enhanced content follows exact specified format
   - Markdown content is raw (no HTML conversion)
   - Instructions are exactly as specified
   - Citation matches what's displayed on page

**How to test**:
- Navigate to `http://localhost:4321/writing/butterfill2025_three/`
- Verify copy button appears and works
- Navigate to another article, verify copy button is hidden
- Test command palette behavior on both types of articles

## Definition of Done

### Functional Requirements ✅
- [ ] Copy button only appears when corresponding markdown file exists in `src/assets/md/`
- [ ] Clicking copy button copies content in the exact specified format
- [ ] Content includes raw markdown from the file (no processing)
- [ ] Citation is properly formatted and matches page display
- [ ] Command palette reflects the conditional copy functionality

### Technical Requirements ✅
- [ ] Markdown files are stored in `src/assets/md/` directory
- [ ] File existence check happens at build time (server-side)
- [ ] No client-side fetching or runtime file system access
- [ ] Error handling for file reading issues
- [ ] No breaking changes to existing functionality

### Quality Requirements ✅
- [ ] Code is clean and well-commented
- [ ] No console errors or warnings
- [ ] Performance impact is minimal (file checks only at build time)
- [ ] Works consistently across different articles

### Testing Requirements ✅
- [ ] Tested with article that has markdown file
- [ ] Tested with article that doesn't have markdown file  
- [ ] Content format exactly matches specification
- [ ] Command palette behavior is correct
- [ ] No regressions in existing copy functionality

## Files to Modify
1. `src/pages/writing/[...slug].astro` - Main implementation
2. `src/assets/md/butterfill2025_three.md` - Move existing file here
3. Create additional markdown files as needed for testing

## Dependencies
- Node.js `fs` module (already available in Astro build environment)
- No additional npm packages required

## Potential Gotchas
1. **File path resolution**: Ensure the path to `src/assets/md/` is correctly resolved in the Astro build context
2. **Build vs. dev mode**: File system access might behave differently in development vs. production builds
3. **Citation formatting**: Make sure the citation format exactly matches what CitationDisplay component shows
4. **Markdown escaping**: Ensure special characters in markdown don't break the template literal formatting