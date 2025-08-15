<script lang="ts">
  import { onMount } from 'svelte';
  // REMOVED: import { goto } from '$app/navigation'; // This was incorrect.

  import * as Command from '$lib/components/ui/command';
  import { getCitationContent, generateFilename, parseBibtex, downloadFile } from '$lib/citation-utils.js';

  interface ContextualAction {
    label: string;
    action: string;
    url?: string;
    text?: string;
    bibtex?: string;
    format?: 'bibtex' | 'ris' | 'plaintext';
  }

  // Props passed from Astro
  export let allPages: { url: string; title: string }[] = [];
  export let contextualActions: ContextualAction[] = [];

  // Internal state for the component
  let open = false;
  let inputValue = '';

  // Reactive statement to filter pages based on user input
  $: filteredPages = inputValue === ''
    ? allPages
    : allPages.filter(page =>
        page.title.toLowerCase().includes(inputValue.toLowerCase())
      );

  // Reactive statement to filter contextual actions based on user input
  $: filteredContextualActions = inputValue === ''
    ? contextualActions
    : contextualActions.filter(action =>
        action.label.toLowerCase().includes(inputValue.toLowerCase())
      );

  // Keyboard shortcut listener (Cmd/Ctrl + K) and custom event listener
  onMount(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        open = !open;
      }
    };

    const openFromTrigger = () => {
      open = true;
    };

    document.addEventListener('keydown', down);
    window.addEventListener('open-command-palette', openFromTrigger);
    
    return () => {
      document.removeEventListener('keydown', down);
      window.removeEventListener('open-command-palette', openFromTrigger);
    };
  });

  // Function to handle selecting a page
  function handlePageSelect(url: string) {
    // CORRECTED: Use the standard browser API for navigation.
    window.location.href = url;
    open = false;
  }

  // Function to execute a contextual action
  async function handleActionSelect(action: ContextualAction) {
    switch (action.action) {
      case 'openUrl':
        if (action.url) {
          window.open(action.url, '_blank');
        }
        break;
      case 'copyToClipboard':
        if (action.text) {
          try {
            await navigator.clipboard.writeText(action.text);
            console.log('Copied to clipboard');
          } catch (err) {
            console.error('Failed to copy: ', err);
          }
        }
        break;
      case 'copyCitation':
        if (action.bibtex && action.format) {
          try {
            const content = getCitationContent(action.bibtex, action.format);
            await navigator.clipboard.writeText(content);
            console.log(`Copied ${action.format} citation to clipboard`);
          } catch (err) {
            console.error('Failed to copy citation: ', err);
          }
        }
        break;
      case 'downloadCitation':
        if (action.bibtex && action.format) {
          try {
            const content = getCitationContent(action.bibtex, action.format);
            const parsed = parseBibtex(action.bibtex);
            const filename = generateFilename(parsed);
            const extensions = { bibtex: 'bib', ris: 'ris', plaintext: 'txt' };
            const extension = extensions[action.format] || 'txt';
            downloadFile(content, `${filename}.${extension}`, 'text/plain');
            console.log(`Downloaded ${action.format} citation`);
          } catch (err) {
            console.error('Failed to download citation: ', err);
          }
        }
        break;
      // Add more action types here as needed
      default:
        console.warn('Unknown action type:', action.action);
    }
    open = false;
  }
</script>

<Command.Dialog bind:open shouldFilter={false}>
  <Command.Input placeholder="Type a command or search..." bind:value={inputValue} />
  <Command.List>
    <Command.Empty>No results found.</Command.Empty>

    <!-- Contextual Actions Group -->
    {#if filteredContextualActions.length > 0}
      <Command.Group heading="Page Actions">
        {#each filteredContextualActions as action}
          <Command.Item onSelect={() => handleActionSelect(action)}>
            {#if action.action === 'copyToClipboard'}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
            {:else if action.action === 'copyCitation'}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
            {:else if action.action === 'downloadCitation'}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            {:else if action.action === 'openUrl'}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
              </svg>
            {/if}
            <span>{action.label}</span>
          </Command.Item>
        {/each}
      </Command.Group>
    {/if}

    <!-- Pages Group -->
    <Command.Group heading="Navigate">
      {#each filteredPages.slice(0, 10) as page (page.url)}
        <Command.Item onSelect={() => handlePageSelect(page.url)}>
          <span>{page.title}</span>
        </Command.Item>
      {/each}
    </Command.Group>
  </Command.List>
</Command.Dialog>