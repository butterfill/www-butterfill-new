<script>
  import { createEventDispatcher } from 'svelte';
  
  export let slug = '';
  export let contentType = 'writing'; // 'writing', 'talks', or 'teaching'
  
  let isLoading = false;
  let feedback = '';
  let feedbackType = ''; // 'success' or 'error'
  
  const dispatch = createEventDispatcher();
  
  async function openInVSCode() {
    if (isLoading) return;
    
    isLoading = true;
    feedback = '';
    feedbackType = '';
    
    try {
      // Determine the file path based on content type
      const filePath = `${contentType}/${slug}.md`;
      
      const response = await fetch('/api/open-source', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filePath }),
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        feedback = 'Opened in VS Code!';
        feedbackType = 'success';
        // Dispatch event for command palette
        dispatch('sourceOpened', { success: true });
      } else {
        feedback = result.error || 'Failed to open file';
        feedbackType = 'error';
        // Dispatch event for command palette
        dispatch('sourceOpened', { success: false, error: result.error });
      }
    } catch (error) {
      console.error('Error opening file:', error);
      feedback = 'Network error';
      feedbackType = 'error';
      dispatch('sourceOpened', { success: false, error: 'Network error' });
    } finally {
      isLoading = false;
      // Clear feedback after 2 seconds
      setTimeout(() => {
        feedback = '';
        feedbackType = '';
      }, 2000);
    }
  }
</script>

<button 
  class="inline-flex items-center justify-center w-auto h-8 rounded-full bg-slate-100 hover:bg-blue-100 dark:bg-slate-700 dark:hover:bg-blue-900/50 transition-colors px-3 relative"
  on:click={openInVSCode}
  disabled={isLoading}
  title="Edit Source"
>
  {#if isLoading}
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-600 dark:text-slate-400 animate-spin" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
    </svg>
  {:else}
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
  {/if}
  <span class="text-xs font-medium text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">
    Edit Source
  </span>
  
  {#if feedback}
    <div 
      class="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs rounded whitespace-nowrap z-10
        {feedbackType === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}
        {feedbackType === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : ''}"
    >
      {feedback}
    </div>
  {/if}
</button>

<style>
  button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
</style>