# Command Menu Documentation

## Overview

The command menu is a searchable interface that allows users to quickly navigate to pages and execute actions. It's triggered by pressing `Cmd/Ctrl + K` or clicking the search button in the header.

## Architecture

The command menu consists of several components working together:

### Core Components

1. **`CommandPalette.svelte`** - The main component that renders the dialog and handles filtering
2. **`SearchTrigger.svelte`** - The button in the header that opens the command menu
3. **UI Components** - Located in `src/lib/components/ui/command/`
   - `command-dialog.svelte` - The modal dialog wrapper
   - `command-input.svelte` - The search input field
   - `command-list.svelte` - Container for search results
   - `command-item.svelte` - Individual result items
   - `command-group.svelte` - Groups of related items

### Data Flow

1. **Data Collection**: `BaseLayout.astro` fetches all content at build time from the `writing`, `talks`, and `teaching` collections
2. **Data Formatting**: Content is transformed into a simple `{ title, url }` structure
3. **Filtering**: Custom filtering logic in `CommandPalette.svelte` filters pages based on user input
4. **Rendering**: Filtered results are displayed in groups

## Key Implementation Details

### Custom Filtering (Important!)

We use **custom filtering logic** instead of the built-in bits-ui filtering:

```javascript
// In CommandPalette.svelte
$: filteredPages = inputValue === ''
  ? allPages
  : allPages.filter(page =>
      page.title.toLowerCase().includes(inputValue.toLowerCase())
    );
```

**Why?** The bits-ui Command component has built-in search functionality that was conflicting with our custom logic, causing inconsistent behavior when users typed, deleted, and retyped search terms.

**Solution:** We disable bits-ui filtering with `shouldFilter={false}` on the Command.Dialog:

```svelte
<Command.Dialog bind:open shouldFilter={false}>
```

This ensures only our custom filtering runs, giving us full control over the search behavior.

## Adding New Content Types

To add a new content type (e.g., "projects"):

### 1. Update BaseLayout.astro

```javascript
// Add to the content fetching
const projects = await getCollection('projects');

// Add to the allPages array
const allPages = [
  ...writing.map(item => ({ title: item.data.title, url: `/writing/${item.slug}/` })),
  ...talks.map(item => ({ title: item.data.title, url: `/talks/${item.slug}/` })),
  ...teaching.map(item => ({ title: item.data.title, url: `/teaching/${item.slug}/` })),
  ...projects.map(item => ({ title: item.data.title, url: `/projects/${item.slug}/` })), // New!
];
```

### 2. (Optional) Add Separate Group

If you want projects to appear in their own group:

```svelte
<!-- In CommandPalette.svelte -->
<!-- Add after the existing groups -->
<Command.Group heading="Projects">
  {#each filteredProjects.slice(0, 10) as project (project.url)}
    <Command.Item onSelect={() => handlePageSelect(project.url)}>
      <span>{project.title}</span>
    </Command.Item>
  {/each}
</Command.Group>
```

And add the filtering logic:

```javascript
// Add reactive statement for projects
$: filteredProjects = inputValue === ''
  ? projectPages
  : projectPages.filter(page =>
      page.title.toLowerCase().includes(inputValue.toLowerCase())
    );
```

## Adding Contextual Actions

Contextual actions are page-specific commands (like "Copy URL", "Edit Page", etc.).

### 1. Define Action Types

```javascript
// In your page component or layout
const contextualActions = [
  {
    label: "Copy Page URL",
    action: "copyUrl",
    url: Astro.url.href
  },
  {
    label: "Edit on GitHub", 
    action: "openUrl",
    url: `https://github.com/your-repo/edit/main/src/content/writing/${slug}.md`
  }
];
```

### 2. Handle New Actions

Update the `handleActionSelect` function in `CommandPalette.svelte`:

```javascript
function handleActionSelect(action: ContextualAction) {
  switch (action.action) {
    case 'openUrl':
      if (action.url) {
        window.open(action.url, '_blank');
      }
      break;
    case 'copyUrl': // New action type
      if (action.url) {
        navigator.clipboard.writeText(action.url);
        // Optionally show a toast notification
      }
      break;
    default:
      console.warn('Unknown action type:', action.action);
  }
  open = false;
}
```

## Extending Filtering Logic

The current filtering is simple substring matching. Here are examples of more advanced filtering:

### Fuzzy Search

```javascript
// Install a fuzzy search library like 'fuse.js'
import Fuse from 'fuse.js';

// Create Fuse instance
const fuse = new Fuse(allPages, {
  keys: ['title'],
  threshold: 0.3, // Adjust sensitivity
});

// Update filtering logic
$: filteredPages = inputValue === ''
  ? allPages
  : fuse.search(inputValue).map(result => result.item);
```

### Multi-field Search

```javascript
// Search in both title and content (if available)
$: filteredPages = inputValue === ''
  ? allPages
  : allPages.filter(page => {
      const searchText = inputValue.toLowerCase();
      return page.title.toLowerCase().includes(searchText) ||
             (page.excerpt && page.excerpt.toLowerCase().includes(searchText)) ||
             (page.tags && page.tags.some(tag => tag.toLowerCase().includes(searchText)));
    });
```

### Search with Prefixes

```javascript
// Support commands like "writing: machine learning" or "talks: 2023"
$: filteredPages = inputValue === ''
  ? allPages
  : (() => {
      const [prefix, ...searchTerms] = inputValue.toLowerCase().split(':');
      const searchTerm = searchTerms.join(':').trim();
      
      if (searchTerm && ['writing', 'talks', 'teaching'].includes(prefix.trim())) {
        const type = prefix.trim();
        return allPages.filter(page => 
          page.url.includes(`/${type}/`) && 
          page.title.toLowerCase().includes(searchTerm)
        );
      }
      
      // Fallback to normal search
      return allPages.filter(page =>
        page.title.toLowerCase().includes(inputValue.toLowerCase())
      );
    })();
```

## Styling and Theming

The command menu uses Tailwind classes and supports dark mode:

- **Dialog**: Styled in `command-dialog.svelte`
- **Input**: Styled in `command-input.svelte` 
- **Items**: Styled in `command-item.svelte`

Key styling points:
- Uses `dark:` prefixes for dark mode variants
- Focus states use blue colors (`focus:ring-blue-500`)
- Selected items use blue backgrounds (`aria-selected:bg-blue-100`)

## Keyboard Navigation

The bits-ui Command component provides built-in keyboard navigation:
- **Arrow keys**: Navigate between items
- **Enter**: Select highlighted item
- **Escape**: Close dialog
- **Cmd/Ctrl + K**: Toggle dialog

## Performance Considerations

- **Build-time data**: All page data is fetched at build time, not runtime
- **Filtering**: Happens client-side for instant results
- **Slicing**: Results are limited to 10 items per group (`slice(0, 10)`)
- **Keyed loops**: Use `(page.url)` keys for efficient Svelte updates

## Common Pitfalls

1. **Don't re-enable bits-ui filtering** - Keep `shouldFilter={false}` to avoid conflicts
2. **Remember to slice results** - Large result sets can hurt performance
3. **Use unique keys** - Always provide keys in `{#each}` loops for proper updates
4. **Handle missing data** - Check for optional fields before using them
5. **Test with empty states** - Ensure the "No results found" message appears correctly

## Debugging Tips

1. **Check the console** - Unknown action types log warnings
2. **Inspect filteredPages** - Add `console.log(filteredPages)` to debug filtering
3. **Test keyboard shortcuts** - Ensure Cmd/Ctrl + K works across different browsers
4. **Verify data structure** - Check that `allPages` has the expected `{ title, url }` format

## Future Enhancements

Ideas for extending the command menu:

- **Recent pages**: Track and show recently visited pages
- **Bookmarks**: Allow users to bookmark frequently accessed pages
- **Search history**: Remember previous searches
- **Keyboard shortcuts**: Add more shortcuts for common actions
- **Categories**: Group results by content type, date, or tags
- **Preview**: Show page excerpts or thumbnails in results