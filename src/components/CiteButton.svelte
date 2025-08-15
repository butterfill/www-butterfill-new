<script>
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { parseBibtex, generateRIS, generatePlainText, generateFilename, downloadFile } from "$lib/citation-utils.js";
  
  export let bibtex = '';
  
  let isOpen = false;
  let copyStatus = '';
  
  async function copyToClipboard(text, format) {
    try {
      await navigator.clipboard.writeText(text);
      copyStatus = `${format} copied!`;
      setTimeout(() => { copyStatus = ''; }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      copyStatus = 'Failed to copy';
      setTimeout(() => { copyStatus = ''; }, 2000);
    }
  }
  
  $: parsed = parseBibtex(bibtex);
  $: risFormat = generateRIS(parsed);
  $: plainTextFormat = generatePlainText(parsed);
  $: filename = generateFilename(parsed);
</script>

<Dialog.Root bind:open={isOpen}>
  <Dialog.Trigger 
    class="inline-flex items-center justify-center w-auto h-8 rounded-full bg-slate-100 hover:bg-blue-100 dark:bg-slate-700 dark:hover:bg-blue-900/50 transition-colors px-3"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
    </svg>
    <span class="text-xs font-medium text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">
      Cite
    </span>
  </Dialog.Trigger>
  
  <Dialog.Content class="sm:max-w-md">
    <Dialog.Header>
      <Dialog.Title>Citation Formats</Dialog.Title>
      <Dialog.Description>
        Choose a citation format to copy or download.
      </Dialog.Description>
    </Dialog.Header>
    
    <div class="space-y-4">
      <!-- BibTeX -->
      <div class="border rounded-lg p-4 dark:border-gray-700">
        <h4 class="font-medium mb-2">BibTeX</h4>
        <div class="flex gap-2">
          <button 
            on:click={() => copyToClipboard(bibtex, 'BibTeX')}
            class="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 rounded transition-colors"
          >
            Copy
          </button>
          <button 
            on:click={() => downloadFile(bibtex, `${filename}.bib`, 'text/plain')}
            class="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded transition-colors"
          >
            Download
          </button>
        </div>
      </div>
      
      <!-- RIS -->
      <div class="border rounded-lg p-4 dark:border-gray-700">
        <h4 class="font-medium mb-2">RIS</h4>
        <div class="flex gap-2">
          <button 
            on:click={() => copyToClipboard(risFormat, 'RIS')}
            class="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 rounded transition-colors"
          >
            Copy
          </button>
          <button 
            on:click={() => downloadFile(risFormat, `${filename}.ris`, 'text/plain')}
            class="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded transition-colors"
          >
            Download
          </button>
        </div>
      </div>
      
      <!-- Plain Text -->
      <div class="border rounded-lg p-4 dark:border-gray-700">
        <h4 class="font-medium mb-2">Plain Text</h4>
        <div class="flex gap-2">
          <button 
            on:click={() => copyToClipboard(plainTextFormat, 'Plain text')}
            class="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 rounded transition-colors"
          >
            Copy
          </button>
          <button 
            on:click={() => downloadFile(plainTextFormat, `${filename}.txt`, 'text/plain')}
            class="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded transition-colors"
          >
            Download
          </button>
        </div>
      </div>
    </div>
    
    {#if copyStatus}
      <div class="mt-4 text-sm text-green-600 dark:text-green-400">
        {copyStatus}
      </div>
    {/if}
  </Dialog.Content>
</Dialog.Root>