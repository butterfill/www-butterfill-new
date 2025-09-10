<script lang="ts">
  // This component acts as a trigger for the command palette
  // It dispatches a custom event that the CommandPalette component listens for
  function openCommandPalette() {
    // Dispatch a custom event that the CommandPalette component will listen for
    window.dispatchEvent(new CustomEvent('open-command-palette'));
  }
</script>

<button
  on:click={openCommandPalette}
  class="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
>
  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
  <span>Search...</span>
  <kbd class="hidden sm:inline-block px-1.5 py-0.5 text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded">
    ⌘K
  </kbd>
</button>
