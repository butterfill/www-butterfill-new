<script lang="ts">
  import { onMount } from 'svelte';
  // REMOVED: import { goto } from '$app/navigation'; // This was incorrect.

  import * as Command from '$lib/components/ui/command';

  interface ContextualAction {
    label: string;
    action: string;
    url?: string;
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
  function handleActionSelect(action: ContextualAction) {
    switch (action.action) {
      case 'openUrl':
        if (action.url) {
          window.open(action.url, '_blank');
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
    {#if contextualActions.length > 0}
      <Command.Group heading="Page Actions">
        {#each contextualActions as action}
          <Command.Item onSelect={() => handleActionSelect(action)}>
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