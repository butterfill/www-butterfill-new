<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog';
  
  let open = false;
  let copyStatus: 'idle' | 'success' | 'error' = 'idle';
  
  const email = 's.butterfill@warwick.ac.uk';
  
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      copyStatus = 'success';
      console.log('Email copied to clipboard');
      // Reset status after 2 seconds
      setTimeout(() => {
        copyStatus = 'idle';
      }, 2000);
    } catch (err) {
      copyStatus = 'error';
      console.error('Failed to copy email:', err);
      // Reset status after 2 seconds
      setTimeout(() => {
        copyStatus = 'idle';
      }, 2000);
    }
  }
  
  function openEmailApp() {
    window.location.href = `mailto:${email}`;
    open = false;
  }
  
  function toggleModal() {
    open = !open;
  }
</script>

<!-- Email icon button -->
<button
  on:click={toggleModal}
  class="ml-2 p-1 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
  aria-label="Contact email"
>
  <!-- Email icon -->
  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
</button>

<Dialog.Root bind:open>
  
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content class="sm:max-w-md">
      <Dialog.Header>
        <Dialog.Title>Contact Email</Dialog.Title>
        <Dialog.Description>
          I’m always happy to get questions and objections :)
        </Dialog.Description>
      </Dialog.Header>
      
      <div class="flex items-center space-x-2 py-4">
        <div class="flex-1 text-sm font-mono bg-slate-100 dark:bg-slate-800 p-3 rounded border">
          {email}
        </div>
      </div>
      
      <div class="flex justify-end space-x-2">
        <button
          on:click={copyEmail}
          class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border h-10 px-4 py-2 {copyStatus === 'success' ? 'border-green-500 bg-green-50 text-green-700 hover:bg-green-100' : copyStatus === 'error' ? 'border-red-500 bg-red-50 text-red-700 hover:bg-red-100' : 'border-slate-200 dark:border-slate-700 bg-background hover:text-blue-600 dark:hover:text-blue-400'}"
        >
          {#if copyStatus === 'success'}
            <!-- Check icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Copied!
          {:else if copyStatus === 'error'}
            <!-- X icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Error
          {:else}
            <!-- Copy icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy
          {/if}
        </button>
        
        <button
          on:click={openEmailApp}
          class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-200 dark:border-slate-700 bg-background hover:text-blue-600 dark:hover:text-blue-400 h-10 px-4 py-2"
        >
          <!-- Mail icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Open Email App
        </button>
      </div>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>