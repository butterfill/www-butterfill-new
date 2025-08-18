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
    // 'KeyF': () => toggleModal(),
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
    
    // Apply initial settings with a small delay to ensure DOM is ready
    setTimeout(() => {
      applyFontSettings();
    }, 100);
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
      const fontSizeValue = fontSizes[fontSize].value;
      fulltext.style.fontSize = fontSizeValue;
      
      // Calculate width to maintain approximately 80 characters per line
      // 36em is based on manual checks
      const targetWidth = '36em';
      fulltext.style.maxWidth = targetWidth;
    }

    // Use a data-attribute for font family for more robust CSS targeting
    document.body.setAttribute('data-font-family', fontFamily);

    // Trigger footnote repositioning after font changes
    const event = new CustomEvent('fontSettingsChanged');
    window.dispatchEvent(event);
  }

  function handleKeydown(event) {
    if (!showModal && event.ctrlKey && event.code === 'KeyF') {
      showModal = true;
    }

    // Ignore all other shortcuts unless the modal is open
    if (!showModal) {
      return;
    }

    // Ignore shortcuts if any modifier keys are pressed
    if (event.metaKey || event.altKey || event.ctrlKey) {
      return;
    }

    // Handle Escape key
    if (event.key === 'Escape' && showModal) {
      showModal = false;
      return;
    }

    // Handle shortcuts
    const shortcut = shortcuts[event.code];
    if (shortcut) {
      event.preventDefault();
      shortcut();
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
    <!-- Aa icon -->
    <text x="2" y="14" font-family="serif" font-size="12" font-weight="bold">A</text>
    <text x="11" y="16" font-family="serif" font-size="8">a</text>
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
        <p><kbd>F</kbd> - Open this modal</p>
        <p><kbd>S/M/L/X</kbd> - Font sizes</p>
        <p><kbd>R/N</kbd> - Serif/Sans fonts</p>
        <p><kbd>Esc</kbd> - Close modal</p>
      </div>
    </div>
  </div>
{/if}