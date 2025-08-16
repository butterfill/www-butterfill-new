<script>
  import { onMount } from 'svelte';

  let showModal = false;
  let fontSize = 'medium';
  let fontFamily = 'serif';

  // Font size options
  const fontSizes = {
    'small': { label: 'Small', value: '16px', shortcut: 'S' },
    'medium': { label: 'Medium', value: '18px', shortcut: 'M' },
    'large': { label: 'Large', value: '20px', shortcut: 'L' },
    'xlarge': { label: 'Extra Large', value: '22px', shortcut: 'X' }
  };

  // Font family options
  const fontFamilies = {
    'serif': { 
      label: 'Serif', 
      value: 'Georgia, Charter, "Times New Roman", serif',
      shortcut: 'R'
    },
    'sans': { 
      label: 'Sans Serif', 
      value: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      shortcut: 'N'
    }
  };

  // Keyboard shortcuts mapping
  const shortcuts = {
    'KeyF': () => toggleModal(),
    'KeyS': () => setFontSize('small'),
    'KeyM': () => setFontSize('medium'),
    'KeyL': () => setFontSize('large'),
    'KeyX': () => setFontSize('xlarge'),
    'KeyR': () => setFontFamily('serif'),
    'KeyN': () => setFontFamily('sans'),
  };

  onMount(() => {
    // Load saved preferences
    const savedFontSize = localStorage.getItem('font-size');
    const savedFontFamily = localStorage.getItem('font-family');
    
    if (savedFontSize && fontSizes[savedFontSize]) {
      fontSize = savedFontSize;
    }
    
    if (savedFontFamily && fontFamilies[savedFontFamily]) {
      fontFamily = savedFontFamily;
    }
    
    // Apply initial settings
    applyFontSettings();
  });

  function toggleModal() {
    showModal = !showModal;
  }

  function setFontSize(size) {
    if (fontSizes[size]) {
      fontSize = size;
      saveFontSettings();
      applyFontSettings();
    }
  }

  function setFontFamily(family) {
    if (fontFamilies[family]) {
      fontFamily = family;
      saveFontSettings();
      applyFontSettings();
    }
  }

  function saveFontSettings() {
    localStorage.setItem('font-size', fontSize);
    localStorage.setItem('font-family', fontFamily);
  }

  function applyFontSettings() {
    const fulltext = document.querySelector('.fulltext');
    if (fulltext) {
      fulltext.style.fontSize = fontSizes[fontSize].value;
      fulltext.style.fontFamily = fontFamilies[fontFamily].value;
    }

    // Also apply to side footnotes
    const sideFootnotes = document.querySelector('.side-footnotes');
    if (sideFootnotes) {
      sideFootnotes.style.fontSize = fontSizes[fontSize].value;
      sideFootnotes.style.fontFamily = fontFamilies[fontFamily].value;
    }
  }

  function handleKeydown(event) {
    // Handle Escape key
    if (event.key === 'Escape' && showModal) {
      showModal = false;
      return;
    }

    // Handle shortcuts (only when modal is not open or when Ctrl/Cmd is pressed)
    if (!showModal || event.ctrlKey || event.metaKey) {
      const shortcut = shortcuts[event.code];
      if (shortcut) {
        event.preventDefault();
        shortcut();
      }
    }
  }

  function handleModalClick(event) {
    if (event.target === event.currentTarget) {
      showModal = false;
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- Floating Font Settings Button -->
<button 
  class="font-settings-trigger"
  on:click={toggleModal}
  aria-label="Font settings (F)"
  title="Font Settings (F)"
>
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <!-- Font/Text icon -->
    <path d="M4 4h12v2H4V4zm0 4h12v2H4V8zm0 4h8v2H4v-2z"/>
    <path d="M16 12h2v2h-2v-2zm0 4h2v2h-2v-2z"/>
  </svg>
</button>

<!-- Font Settings Modal -->
{#if showModal}
  <div class="font-modal" on:click={handleModalClick}>
    <div class="font-modal-content">
      <div class="font-modal-header">
        <h2 class="font-modal-title">Font Settings</h2>
        <button 
          class="font-modal-close"
          on:click={() => showModal = false}
          aria-label="Close font settings"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <!-- X icon -->
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
      
      <!-- Font Size Section -->
      <div class="font-section">
        <h3 class="font-section-title">Font Size</h3>
        <div class="font-options">
          {#each Object.entries(fontSizes) as [key, option]}
            <button
              class="font-option"
              class:active={fontSize === key}
              on:click={() => setFontSize(key)}
            >
              <span class="font-option-label">{option.label}</span>
              <span class="font-option-shortcut">{option.shortcut}</span>
            </button>
          {/each}
        </div>
      </div>

      <!-- Font Family Section -->
      <div class="font-section">
        <h3 class="font-section-title">Font Family</h3>
        <div class="font-options">
          {#each Object.entries(fontFamilies) as [key, option]}
            <button
              class="font-option"
              class:active={fontFamily === key}
              on:click={() => setFontFamily(key)}
            >
              <span class="font-option-label">{option.label}</span>
              <span class="font-option-shortcut">{option.shortcut}</span>
            </button>
          {/each}
        </div>
      </div>
      
      <div class="font-modal-help">
        <p><strong>Keyboard shortcuts:</strong></p>
        <p><kbd>F</kbd> - Toggle this modal</p>
        <p><kbd>S/M/L/X</kbd> - Font sizes</p>
        <p><kbd>R/N</kbd> - Serif/Sans fonts</p>
        <p><kbd>Esc</kbd> - Close modal</p>
      </div>
    </div>
  </div>
{/if}