<script>
  export let contentToCopy = '';
  let buttonText = 'Copy for Chat';

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(contentToCopy);
      buttonText = 'Copied!';
      setTimeout(() => { buttonText = 'Copy for Chat'; }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      buttonText = 'Failed to copy';
    }
  }
</script>

<button 
  on:click={copyToClipboard} 
  class="inline-flex items-center justify-center w-auto h-8 rounded-full bg-slate-100 hover:bg-blue-100 dark:bg-slate-700 dark:hover:bg-blue-900/50 transition-colors px-3"
>
  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
  </svg>
  <span class="text-xs font-medium text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">
    {buttonText}
  </span>
</button>