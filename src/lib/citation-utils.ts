// Shared citation utilities for both CiteButton and CommandPalette

export interface ParsedCitation {
  title: string;
  author: string;
  year: string;
  journal: string;
  booktitle: string;
  volume: string;
  number: string;
  pages: string;
  doi: string;
  publisher: string;
}

// Parse BibTeX to extract citation information
export function parseBibtex(bibtexString: string): ParsedCitation {
  try {
    // Simple regex-based parsing for basic BibTeX fields
    const titleMatch = bibtexString.match(/title\s*=\s*[{"]([^}"]*)[\}"]/i);
    const authorMatch = bibtexString.match(/author\s*=\s*[{"]([^}"]*)[\}"]/i);
    const yearMatch = bibtexString.match(/year\s*=\s*[{"]?(\d{4})[\}"]?/i);
    const journalMatch = bibtexString.match(/journal\s*=\s*[{"]([^}"]*)[\}"]/i);
    const booktitleMatch = bibtexString.match(/booktitle\s*=\s*[{"]([^}"]*)[\}"]/i);
    const volumeMatch = bibtexString.match(/volume\s*=\s*[{"]([^}"]*)[\}"]/i);
    const numberMatch = bibtexString.match(/number\s*=\s*[{"]([^}"]*)[\}"]/i);
    const pagesMatch = bibtexString.match(/pages\s*=\s*[{"]([^}"]*)[\}"]/i);
    const doiMatch = bibtexString.match(/doi\s*=\s*[{"]([^}"]*)[\}"]/i);
    const publisherMatch = bibtexString.match(/publisher\s*=\s*[{"]([^}"]*)[\}"]/i);
    
    return {
      title: titleMatch ? titleMatch[1] : '',
      author: authorMatch ? authorMatch[1] : '',
      year: yearMatch ? yearMatch[1] : '',
      journal: journalMatch ? journalMatch[1] : '',
      booktitle: booktitleMatch ? booktitleMatch[1] : '',
      volume: volumeMatch ? volumeMatch[1] : '',
      number: numberMatch ? numberMatch[1] : '',
      pages: pagesMatch ? pagesMatch[1] : '',
      doi: doiMatch ? doiMatch[1] : '',
      publisher: publisherMatch ? publisherMatch[1] : ''
    };
  } catch (error) {
    console.error('Error parsing BibTeX:', error);
    return {} as ParsedCitation;
  }
}

// Generate RIS format
export function generateRIS(parsed: ParsedCitation): string {
  let ris = '';
  
  // Determine type - default to journal article
  if (parsed.journal) {
    ris += 'TY  - JOUR\n';
  } else if (parsed.booktitle) {
    ris += 'TY  - CHAP\n';
  } else {
    ris += 'TY  - GEN\n';
  }
  
  if (parsed.title) ris += `TI  - ${parsed.title}\n`;
  if (parsed.author) {
    // Split multiple authors and format each
    const authors = parsed.author.split(' and ');
    authors.forEach(author => {
      ris += `AU  - ${author.trim()}\n`;
    });
  }
  if (parsed.year) ris += `PY  - ${parsed.year}\n`;
  if (parsed.journal) ris += `JO  - ${parsed.journal}\n`;
  if (parsed.booktitle) ris += `BT  - ${parsed.booktitle}\n`;
  if (parsed.volume) ris += `VL  - ${parsed.volume}\n`;
  if (parsed.number) ris += `IS  - ${parsed.number}\n`;
  if (parsed.pages) ris += `SP  - ${parsed.pages.split('--')[0]}\nEP  - ${parsed.pages.split('--')[1] || parsed.pages.split('--')[0]}\n`;
  if (parsed.publisher) ris += `PB  - ${parsed.publisher}\n`;
  if (parsed.doi) ris += `DO  - ${parsed.doi}\n`;
  
  ris += 'ER  - \n';
  return ris;
}

// Generate plain text citation (APA style)
export function generatePlainText(parsed: ParsedCitation): string {
  let citation = '';
  
  if (parsed.author) {
    citation += parsed.author.replace(/ and /g, ', ');
  }
  
  if (parsed.year) {
    citation += ` (${parsed.year}).`;
  }
  
  if (parsed.title) {
    citation += ` ${parsed.title}.`;
  }
  
  if (parsed.journal) {
    citation += ` *${parsed.journal}*`;
    if (parsed.volume) {
      citation += `, ${parsed.volume}`;
      if (parsed.number) {
        citation += `(${parsed.number})`;
      }
    }
    if (parsed.pages) {
      citation += `, ${parsed.pages}.`;
    }
  } else if (parsed.booktitle) {
    citation += ` In *${parsed.booktitle}*`;
    if (parsed.pages) {
      citation += ` (pp. ${parsed.pages})`;
    }
    if (parsed.publisher) {
      citation += `. ${parsed.publisher}.`;
    }
  }
  
  if (parsed.doi) {
    citation += ` https://doi.org/${parsed.doi}`;
  }
  
  return citation.trim();
}

// Generate filename from title or use fallback
export function generateFilename(parsed: ParsedCitation): string {
  return parsed.title 
    ? parsed.title.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 50)
    : 'citation';
}

// Get citation content by format
export function getCitationContent(bibtex: string, format: 'bibtex' | 'ris' | 'plaintext'): string {
  if (format === 'bibtex') {
    return bibtex;
  }
  
  const parsed = parseBibtex(bibtex);
  
  if (format === 'ris') {
    return generateRIS(parsed);
  }
  
  if (format === 'plaintext') {
    return generatePlainText(parsed);
  }
  
  return bibtex;
}

// Download file helper
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}