<script>
  import { onMount } from 'svelte';

  let headings = [];
  let activeId = '';
  let showModal = false;
  let observer;

  // Keyboard shortcuts mapping
  const shortcuts = {
    'KeyT': () => toggleModal(),
    'Digit1': () => jumpToSection(0),
    'Digit2': () => jumpToSection(1),
    'Digit3': () => jumpToSection(2),
    'Digit4': () => jumpToSection(3),
    'Digit5': () => jumpToSection(4),
    'Digit6': () => jumpToSection(5),
    'Digit7': () => jumpToSection(6),
    'Digit8': () => jumpToSection(7),
    'Digit9': () => jumpToSection(8),
    'Digit0': () => jumpToSection(9),
  };

  onMount(() => {
    extractHeadings();
    setupIntersectionObserver();
  });

  function extractHeadings() {
    const article = document.querySelector('.fulltext');
    if (!article) return;

    const headingElements = article.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings = Array.from(headingElements).map((heading, index) => ({
      id: heading.id,
      text: heading.textContent,
      level: parseInt(heading.tagName.charAt(1)),
      element: heading,
      shortcut: index < 10 ? (index + 1) % 10 : null // 1-9, then 0 for 10th item
    }));

    // Add References and Footnotes sections if they exist
    const references = article.querySelector('.references, #refs');
    if (references) {
      headings.push({
        id: references.id || 'references',
        text: 'References',
        level: 1,
        element: references,
        shortcut: headings.length < 10 ? (headings.length + 1) % 10 : null
      });
    }

    const footnotes = article.querySelector('.footnotes');
    if (footnotes) {
      headings.push({
        id: footnotes.id || 'footnotes',
        text: 'Footnotes',
        level: 1,
        element: footnotes,
        shortcut: headings.length < 10 ? (headings.length + 1) % 10 : null
      });
    }
  }

  function setupIntersectionObserver() {
    const options = {
      rootMargin: '-20% 0px -35% 0px',
      threshold: 0
    };

    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          activeId = entry.target.id;
        }
      });
    }, options);

    headings.forEach(heading => {
      if (heading.element) {
        observer.observe(heading.element);
      }
    });
  }

  function toggleModal() {
    showModal = !showModal;
  }

  function jumpToSection(index) {
    if (index < headings.length) {
      scrollToHeading(headings[index].id);
    }
  }

  function scrollToHeading(id) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      showModal = false;
    }
  }

  function handleKeydown(event) {
    // ignore if modal is not open
    if (!showModal && !event.ctrlKey && !event.metaKey) {
      return;
    }

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

<!-- Floating TOC Button -->
{#if headings.length > 0}
  <button 
    class="toc-modal-trigger"
    on:click={toggleModal}
    aria-label="Open table of contents (T)"
    title="Table of Contents (T)"
  >
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <!-- List icon -->
      <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
    </svg>
  </button>
{/if}

<!-- TOC Modal -->
{#if showModal}
  <div class="toc-modal" on:click={handleModalClick}>
    <div class="toc-modal-content">
      <div class="toc-modal-header">
        <h2 class="toc-modal-title">Table of Contents</h2>
        <button 
          class="toc-modal-close"
          on:click={() => showModal = false}
          aria-label="Close table of contents"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <!-- X icon -->
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
      
      <ul class="toc-list">
        {#each headings as heading, index}
          <li class="toc-item level-{heading.level}">
            <a 
              href="#{heading.id}"
              class="toc-link"
              class:active={activeId === heading.id}
              on:click|preventDefault={() => scrollToHeading(heading.id)}
            >
              <span>{heading.text}</span>
              {#if heading.shortcut !== null}
                <span class="toc-shortcut">{heading.shortcut}</span>
              {/if}
            </a>
          </li>
        {/each}
      </ul>
      
      <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgb(226, 232, 240); font-size: 0.75rem; color: rgb(107, 114, 128);">
        <p><strong>Keyboard shortcuts:</strong></p>
        <p><kbd>T</kbd> - Toggle this modal</p>
        <p><kbd>1-9, 0</kbd> - Jump to sections</p>
        <p><kbd>Esc</kbd> - Close modal</p>
      </div>
    </div>
  </div>
{/if}