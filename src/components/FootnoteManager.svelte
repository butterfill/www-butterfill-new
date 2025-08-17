<script>
  import { onMount } from 'svelte';

  let sideFootnotes = [];
  let isWideScreen = false;

  onMount(() => {
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    window.addEventListener('fontSettingsChanged', setupSideFootnotes);
    
    if (isWideScreen) {
      setupSideFootnotes();
    }

    setupFootnoteClickHandlers();

    return () => {
      window.removeEventListener('resize', checkScreenSize);
      window.removeEventListener('fontSettingsChanged', setupSideFootnotes);
    };
  });

  function checkScreenSize() {
    isWideScreen = window.innerWidth >= 1200;
    
    if (isWideScreen) {
      setupSideFootnotes();
    } else {
      clearSideFootnotes();
    }
  }

  function setupSideFootnotes() {
    const article = document.querySelector('.fulltext');
    const footnotesSection = document.querySelector('.fulltext .footnotes');
    
    if (!article || !footnotesSection) return;

    // Find all footnote references in the text
    const footnoteRefs = article.querySelectorAll('.footnote-ref');
    const footnoteItems = footnotesSection.querySelectorAll('li[id^="fn"]');
    
    // Create a map of footnote content
    const footnoteContent = new Map();
    footnoteItems.forEach(item => {
      const id = item.id.replace('fn', '');
      const content = item.innerHTML;
      footnoteContent.set(id, content);
    });

    const currentStyle = window.getComputedStyle(article);
    const currentFontSize = currentStyle.fontSize;
    const currentFontFamily = currentStyle.fontFamily;
    const currentLineHeight = currentStyle.lineHeight;

    // Calculate positions for side footnotes
    const newSideFootnotes = [];
    let lastBottom = 0;

    // Calculate paragraph spacing in pixels (1.5em) to match main text paragraph spacing
    const paragraphSpacing = 0;// parseFloat(currentFontSize) * 1.5;

    footnoteRefs.forEach(ref => {
      const footnoteId = ref.getAttribute('href')?.replace('#fn', '');
      if (!footnoteId || !footnoteContent.has(footnoteId)) return;

      // 1. Create a temporary footnote element to measure its properties accurately.
      const tempFootnote = document.createElement('div');
      tempFootnote.className = 'side-footnote';
      // NOTE THAT CHANGING THE MAIN FONT SIZE DOES NOT CHANGE THE FOOTNOTE FONT SIZE
      // tempFootnote.style.cssText = `
      //   position: absolute;
      //   visibility: hidden;
      //   width: 280px;
      //   padding: 0.75rem;
      //   font-family: ${currentFontFamily};
      //   font-size: ${currentFontSize};
      //   line-height: ${currentLineHeight};
      //   font-style: italic;
      // `;
      tempFootnote.style.cssText = `
        position: absolute;
        visibility: hidden;
        width: 280px;
        padding: 0.75rem;
        font-family: ${currentFontFamily};
        font-size: 16px;
        line-height: 26.4px;
        font-style: italic;
      `;
      tempFootnote.innerHTML = `<span class="side-footnote-number">${footnoteId}.</span>${footnoteContent.get(footnoteId)}`;
      article.appendChild(tempFootnote);

      // 2. Measure its height and padding.
      const actualHeight = tempFootnote.offsetHeight;
      const tempStyle = window.getComputedStyle(tempFootnote);
      const paddingTop = parseFloat(tempStyle.paddingTop);
      const paddingBottom = parseFloat(tempStyle.paddingBottom);
      article.removeChild(tempFootnote);

      // 3. Calculate the ideal top position based on the reference mark in the text.
      const articleRect = article.getBoundingClientRect();
      const refRect = ref.getBoundingClientRect();
      const topPosition = (refRect.top - articleRect.top) - 16; // Nudge up slightly

      // 4. Calculate the corrected gap. This is the key fix.
      // We want the visual gap to be 1.5em, so we subtract the padding of the footnotes.
      const correctedGap = Math.max(0, paragraphSpacing - (paddingTop + paddingBottom));

      // 5. Determine the final top position, preventing overlap using the corrected gap.
      const adjustedTop = Math.max(topPosition, lastBottom + correctedGap);

      // 6. Add the calculated footnote to our list and update lastBottom for the next iteration.
      newSideFootnotes.push({
        id: footnoteId,
        content: footnoteContent.get(footnoteId),
        top: adjustedTop,
        ref: ref
      });

      lastBottom = adjustedTop + actualHeight;
    });

    sideFootnotes = newSideFootnotes;

    // Hide the bottom footnotes section when side footnotes are active
    if (footnotesSection && sideFootnotes.length > 0) {
      footnotesSection.classList.add('side-footnotes-active');
    }
  }

  function clearSideFootnotes() {
    sideFootnotes = [];
    const footnotesSection = document.querySelector('.fulltext .footnotes');
    if (footnotesSection) {
      footnotesSection.classList.remove('side-footnotes-active');
    }
  }

  function setupFootnoteClickHandlers() {
    const article = document.querySelector('.fulltext');
    if (!article) return;

    // Handle clicks on footnote references in the main text
    const footnoteRefs = article.querySelectorAll('.footnote-ref');
    footnoteRefs.forEach(ref => {
      ref.addEventListener('click', (event) => {
        event.preventDefault();
        const footnoteId = ref.getAttribute('href')?.replace('#fn', '');
        if (footnoteId) {
          highlightFootnote(footnoteId);
        }
      });
    });

    // Handle clicks on footnotes (both bottom and side)
    const footnoteItems = article.querySelectorAll('.footnotes li[id^="fn"]');
    footnoteItems.forEach(item => {
      item.addEventListener('click', () => {
        const footnoteId = item.id.replace('fn', '');
        highlightFootnoteRef(footnoteId);
      });
    });

    // Handle clicks on side footnotes
    document.addEventListener('click', (event) => {
      const sideFootnote = event.target.closest('.side-footnote');
      if (sideFootnote) {
        const footnoteId = sideFootnote.getAttribute('data-footnote-id');
        if (footnoteId) {
          highlightFootnoteRef(footnoteId);
        }
      }
    });
  }

  function highlightFootnote(footnoteId) {
    // Highlight side footnote if visible
    const sideFootnote = document.querySelector(`[data-footnote-id="${footnoteId}"]`);
    if (sideFootnote && isWideScreen) {
      highlightElement(sideFootnote, 'footnote');
      return;
    }

    // Otherwise highlight bottom footnote
    const bottomFootnote = document.querySelector(`#fn${footnoteId}`);
    if (bottomFootnote) {
      highlightElement(bottomFootnote, 'footnote');
      // Scroll to footnote if it's not visible
      bottomFootnote.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function highlightFootnoteRef(footnoteId) {
    const footnoteRef = document.querySelector(`#fnref${footnoteId}`);
    if (footnoteRef) {
      // Scroll to the reference first to ensure it's visible
      footnoteRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Add a small delay to ensure scrolling completes before highlighting
      setTimeout(() => {
        highlightElement(footnoteRef, 'ref');
      }, 300);
    }
  }

  function highlightElement(element, type) {
    // Store original styles
    const originalTransform = element.style.transform;
    const originalBoxShadow = element.style.boxShadow;
    const originalBackground = element.style.background;

    // Apply highlight styles
    if (type === 'footnote') {
      element.style.transform = 'scale(1.02)';
      element.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.3)';
      element.style.background = 'rgba(59, 130, 246, 0.05)';
    } else if (type === 'ref') {
      element.style.transform = 'scale(1.1)';
      element.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.5)';
      element.style.background = 'rgba(59, 130, 246, 0.1)';
    }

    // Remove highlight after animation
    setTimeout(() => {
      element.style.transform = originalTransform;
      element.style.boxShadow = originalBoxShadow;
      element.style.background = originalBackground;
    }, 800);
  }
</script>

{#if isWideScreen && sideFootnotes.length > 0}
  <div class="side-footnotes">
    {#each sideFootnotes as footnote}
      <div 
        class="side-footnote" 
        style="top: {footnote.top}px"
        data-footnote-id={footnote.id}
      >
        <span class="side-footnote-number">{footnote.id}.</span>
        {@html footnote.content}
      </div>
    {/each}
  </div>
{/if}

<style>
  /* Remove footnote back links from side footnotes since they're not needed */
  :global(.side-footnote .footnote-back) {
    display: none;
  }
</style>