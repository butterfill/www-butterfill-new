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

<button on:click={copyToClipboard} class="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300 dark:hover:bg-slate-600">
  {buttonText}
</button>