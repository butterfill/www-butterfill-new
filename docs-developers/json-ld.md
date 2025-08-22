# JSON-LD Structured Data Implementation Guide

## Overview

This document explains the implementation of JSON-LD structured data across the website to enhance discoverability and enable better integration with citation tools like Zotero, search engines, and academic databases.

The implementation provides:
- Automatic JSON-LD generation for writing, talks, and teaching content
- Schema.org compliant structured data for ScholarlyArticle, EducationalEvent, and CourseInstance types
- Proper author name parsing and formatting
- Page range parsing for various formats (hyphens, en-dashes, double-hyphens)
- Integration with existing Zotero metadata system

## Architecture

The JSON-LD system consists of several components working together:

### Core Components

1. **`src/lib/jsonld-utils.ts`** - Core utility functions for generating JSON-LD
2. **`src/lib/jsonld-utils.test.ts`** - Comprehensive test suite (30 tests)
3. **Page templates** - `src/pages/writing/[...slug].astro`, `src/pages/talks/[...slug].astro`, `src/pages/teaching/[...slug].astro`
4. **Layout components** - `src/layouts/BaseLayout.astro`, `src/layouts/PageLayout.astro`

### Data Flow

1. **Data Collection**: Each page template collects content metadata from Astro's content collections
2. **JSON-LD Generation**: The `generateJsonLd` function creates Schema.org compliant structured data
3. **Rendering**: JSON-LD is passed through the layout hierarchy and rendered in the `<head>` section
4. **Validation**: Automated tests ensure correctness and handle edge cases

## Key Implementation Details

### JSON-LD Utility Functions

The core functionality is in `src/lib/jsonld-utils.ts` with these key functions:

#### `generateJsonLd(frontmatter, type, slug)`
Main entry point that delegates to specialized functions based on content type:
- `writing` → `createScholarlyArticle()`
- `talks` → `createEducationalEvent()`
- `teaching` → `createCourseInstance()`

#### `formatContributors(authors)`
Handles complex author name parsing:
- Supports "First Last" and "Last, First" formats
- Handles LaTeX accents like "Viganò, Luca"
- Processes protective braces like "{della Gatta}, Francesco"
- Splits multiple authors separated by " and "

#### `parsePageRange(pageRange)`
Parses various page range formats:
- Simple hyphens: "23-47"
- En-dashes: "123–148" 
- Double-hyphens: "53--60"
- Single pages: "104601"

### Content Type Implementations

#### ScholarlyArticle (Writing)
Generated for academic publications with:
- Authors formatted as Schema.org Person objects
- Publication date and journal information
- DOI identifiers and sameAs links
- PDF encoding with content URLs
- Page ranges with start/end pages
- Proper URL construction

#### EducationalEvent (Talks)
Generated for presentations and lectures with:
- Speaker information
- Event start/end dates and times
- Location as Place objects
- Organizer as Organization objects
- Handout and slides as CreativeWork objects

#### CourseInstance (Teaching)
Generated for courses and lectures with:
- Course information as nested Course objects
- Provider/Institution as Organization objects
- Lecture materials as CreativeWork objects
- Proper course instance naming with term/year

## Integration Points

### Page Templates

Each content type's page template:
1. Imports `generateJsonLd` from `src/lib/jsonld-utils.ts`
2. Calls `generateJsonLd(entry.data, contentType, entry.slug)` with content data
3. Passes the result as `jsonLd` prop to the PageLayout

Example from `src/pages/writing/[...slug].astro`:
```javascript
import { generateJsonLd } from '../../lib/jsonld-utils';

// Generate JSON-LD structured data
const jsonLd = generateJsonLd(entry.data, 'writing', entry.slug);

// Pass to PageLayout
<PageLayout title={entry.data.title} jsonLd={jsonLd}>
```

### Layout Components

#### BaseLayout.astro
Renders JSON-LD in the `<head>` section:
```html
<!-- JSON-LD structured data -->
{jsonLd && (
  <script type="application/ld+json" set:html={JSON.stringify(jsonLd, null, 2)}></script>
)}
```

#### PageLayout.astro
Passes JSON-LD through to BaseLayout:
```html
<BaseLayout title={title} jsonLd={jsonLd}>
```

## Testing Strategy

### Comprehensive Test Suite

The implementation includes 30 automated tests in `src/lib/jsonld-utils.test.ts` covering:

#### Author Name Parsing
- Single "First Last" names
- "Last, First" name formats
- Multiple authors with " and " separator
- LaTeX accents and protective braces
- Mixed name formats in single strings

#### Page Range Parsing
- Simple hyphenated ranges
- En-dash and double-hyphen formats
- Single page numbers

#### Content Type Generation
**Writing (ScholarlyArticle):**
- Correct @type and @context
- Title, author, and date mapping
- Absolute URL construction
- Journal/Book isPartOf creation
- DOI identifier and sameAs links
- PDF encoding with content URLs
- Property omission for missing data

**Talks (EducationalEvent):**
- Correct @type generation
- Date/time formatting as ISO strings
- Location as Place objects
- Organizer as Organization objects
- Speaker population
- Handout/slides in hasPart

**Teaching (CourseInstance):**
- Nested Course creation
- External URL handling
- Provider name parsing
- Lecture mapping to CreativeWork objects
- Descriptive name construction

### Running Tests

```bash
npm test
# or
npm test -- --run  # for single run without watching
```

## Adding New Content Types

To add JSON-LD support for a new content type:

### 1. Update jsonld-utils.ts

Add a new case to `generateJsonLd()`:
```typescript
export function generateJsonLd(frontmatter: any, type: string, slug?: string): Record<string, any> {
  const baseUrl = 'https://butterfill.com';
  
  switch (type) {
    case 'writing':
      return createScholarlyArticle({...frontmatter, slug}, baseUrl);
    case 'talks':
      return createEducationalEvent({...frontmatter, slug}, baseUrl);
    case 'teaching':
      return createCourseInstance({...frontmatter, slug}, baseUrl);
    case 'newtype':  // New!
      return createNewType({...frontmatter, slug}, baseUrl);
    default:
      return {};
  }
}
```

Create the specialized function:
```typescript
function createNewType(frontmatter: any, baseUrl: string): Record<string, any> {
  // Implementation following Schema.org guidelines
  return {
    '@context': 'https://schema.org',
    '@type': 'NewType',
    // ... properties
  };
}
```

### 2. Add Tests

Add comprehensive tests in `src/lib/jsonld-utils.test.ts`:
```typescript
describe('for NewType (newtype)', () => {
  it('should generate the correct @type and @context', () => {
    // ... test implementation
  });
  // ... additional tests
});
```

### 3. Update Page Template

In the new content type's page template:
```javascript
import { generateJsonLd } from '../../lib/jsonld-utils';

const jsonLd = generateJsonLd(entry.data, 'newtype', entry.slug);

<PageLayout title={entry.data.title} jsonLd={jsonLd}>
```

## Schema.org Compliance

The implementation follows Schema.org guidelines for:

### ScholarlyArticle
- Proper use of @type and @context
- Author as Person objects with name property
- datePublished in ISO format
- isPartOf for journals (Periodical) and books (Book)
- identifier and sameAs for DOIs
- encoding for PDFs as MediaObject

### EducationalEvent
- startDate and endDate in ISO format
- location as Place objects
- organizer as Organization objects
- speaker as Person objects
- hasPart for related materials

### CourseInstance
- course as nested Course object
- provider as Organization object
- hasPart for lecture materials as CreativeWork objects

## Common Pitfalls

1. **Missing slug parameter**: Always pass the entry.slug to generateJsonLd() for proper URL construction
2. **Incorrect field names**: Content collections use `authors` not `author`, check the content schema
3. **JSON rendering issues**: Use `set:html={JSON.stringify(jsonLd, null, 2)}` not `{JSON.stringify(jsonLd)}`
4. **Layout propagation**: Ensure PageLayout passes jsonLd prop to BaseLayout
5. **Testing edge cases**: Always add tests for new parsing scenarios
6. **Date formatting**: Ensure dates are in proper ISO format for Schema.org compliance

## Debugging Tips

1. **Check generated HTML**: View page source to verify JSON-LD script tag is present
2. **Validate JSON**: Copy JSON-LD content and validate at https://validator.schema.org/
3. **Test with Google**: Use Google's Rich Results Test to verify search engine compatibility
4. **Check console logs**: Tests provide detailed output for debugging failures
5. **Verify URL construction**: Ensure absolute URLs are correctly formed with baseUrl

## Future Enhancements

Ideas for extending the JSON-LD implementation:

- **Additional content types**: Support for projects, datasets, etc.
- **Enhanced author information**: Include ORCID IDs, affiliations
- **Richer metadata**: Add abstracts, keywords, funding information
- **Multilingual support**: Handle content in multiple languages
- **Enhanced relationship mapping**: Link related works, citations
- **Performance optimization**: Memoization for frequently accessed data
- **Extended Schema.org types**: Support for more specific academic types