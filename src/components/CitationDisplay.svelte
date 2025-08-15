<script>
  import { parseBibtex, generatePlainText } from '$lib/citation-utils';
  
  export let bibtex = '';
  export let authors = '';
  export let year = '';
  export let journal = '';
  export let doi = '';
  
  let copyStatus = '';
  
  $: parsed = parseBibtex(bibtex);
  $: plainTextCitation = generatePlainText(parsed);
  
  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(plainTextCitation);
      copyStatus = 'Copied!';
      setTimeout(() => { copyStatus = ''; }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      copyStatus = 'Failed to copy';
      setTimeout(() => { copyStatus = ''; }, 2000);
    }
  }
</script>

{#if bibtex}
  <div class="mb-4 text-sm text-slate-600 dark:text-slate-400">
    <div class="flex items-start">
      <div class="flex-grow">
        {@html plainTextCitation.replace(/\*/g, '')}
      </div>
      <button 
        on:click={copyToClipboard}
        class="ml-2 flex-shrink-0 p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        title="Copy citation"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </button>
    </div>
    {#if copyStatus}
      <div class="mt-1 text-xs text-green-600 dark:text-green-400">
        {copyStatus}
      </div>
    {/if}
  </div>
{:else}
  <div class="mb-4 text-sm text-slate-600 dark:text-slate-400">
    <p><strong>Authors:</strong> {authors}</p>
    <p><strong>Published:</strong> {year}</p>
    {#if journal}
      <p><strong>Journal:</strong> {journal}</p>
    {/if}
    {#if doi}
      <p>
        <strong>DOI:</strong> 
        <a 
          href={`http://dx.doi.org/${doi}`} 
          target="_blank" 
          class="ml-2 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
        >
          {doi}
          <svg xmlns="http://www.w3.org/2000/svg" class="inline-block w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </p>
    {/if}
  </div>
{/if}