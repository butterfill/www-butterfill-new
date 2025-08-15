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

// Helper function to extract field value with proper brace balancing
function extractBibtexField(bibtexString: string, fieldName: string): string {
  const regex = new RegExp(`${fieldName}\\s*=\\s*([{"])`, 'i');
  const match = bibtexString.match(regex);
  
  if (!match) return '';
  
  const delimiter = match[1];
  const startIndex = match.index! + match[0].length - 1;
  
  if (delimiter === '"') {
    // Handle quoted strings - find closing quote not preceded by backslash
    let i = startIndex + 1;
    while (i < bibtexString.length) {
      if (bibtexString[i] === '"' && bibtexString[i - 1] !== '\\') {
        return bibtexString.substring(startIndex + 1, i);
      }
      i++;
    }
  } else {
    // Handle braced strings - count braces to find matching closing brace
    let braceCount = 1;
    let i = startIndex + 1;
    
    while (i < bibtexString.length && braceCount > 0) {
      if (bibtexString[i] === '{') {
        braceCount++;
      } else if (bibtexString[i] === '}') {
        braceCount--;
      }
      i++;
    }
    
    if (braceCount === 0) {
      return bibtexString.substring(startIndex + 1, i - 1);
    }
  }
  
  return '';
}

// Helper function to clean BibTeX field content
function cleanBibtexField(value: string): string {
  if (!value) return '';
  
  // Remove protective braces around words (e.g., {della Gatta} -> della Gatta)
  // But preserve intentional formatting braces (e.g., {{When}} -> When)
  let cleaned = value;
  
  // Handle double braces first ({{word}} -> word)
  cleaned = cleaned.replace(/\{\{([^}]+)\}\}/g, '$1');
  
  // Remove single protective braces around individual words
  cleaned = cleaned.replace(/\{([^{}]+)\}/g, '$1');
  
  // Handle LaTeX accents and special characters
  cleaned = cleaned.replace(/\\`\{?([aeiouAEIOU])\}?/g, (match, letter) => {
    const accents: { [key: string]: string } = {
      'a': 'à', 'e': 'è', 'i': 'ì', 'o': 'ò', 'u': 'ù',
      'A': 'À', 'E': 'È', 'I': 'Ì', 'O': 'Ò', 'U': 'Ù'
    };
    return accents[letter] || letter;
  });
  
  // Handle other common LaTeX accents
  cleaned = cleaned.replace(/\\'\{?([aeiouAEIOU])\}?/g, (match, letter) => {
    const accents: { [key: string]: string } = {
      'a': 'á', 'e': 'é', 'i': 'í', 'o': 'ó', 'u': 'ú',
      'A': 'Á', 'E': 'É', 'I': 'Í', 'O': 'Ó', 'U': 'Ú'
    };
    return accents[letter] || letter;
  });
  
  cleaned = cleaned.replace(/\\\^\{?([aeiouAEIOU])\}?/g, (match, letter) => {
    const accents: { [key: string]: string } = {
      'a': 'â', 'e': 'ê', 'i': 'î', 'o': 'ô', 'u': 'û',
      'A': 'Â', 'E': 'Ê', 'I': 'Î', 'O': 'Ô', 'U': 'Û'
    };
    return accents[letter] || letter;
  });
  
  // Clean up extra whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  return cleaned;
}

// Parse BibTeX to extract citation information
export function parseBibtex(bibtexString: string): ParsedCitation {
  try {
    const title = cleanBibtexField(extractBibtexField(bibtexString, 'title'));
    const author = cleanBibtexField(extractBibtexField(bibtexString, 'author'));
    const year = extractBibtexField(bibtexString, 'year').replace(/[{}]/g, '');
    const journal = cleanBibtexField(extractBibtexField(bibtexString, 'journal'));
    const booktitle = cleanBibtexField(extractBibtexField(bibtexString, 'booktitle'));
    const volume = extractBibtexField(bibtexString, 'volume').replace(/[{}]/g, '');
    const number = extractBibtexField(bibtexString, 'number').replace(/[{}]/g, '');
    const pages = extractBibtexField(bibtexString, 'pages').replace(/[{}]/g, '');
    const doi = extractBibtexField(bibtexString, 'doi').replace(/[{}]/g, '');
    const publisher = cleanBibtexField(extractBibtexField(bibtexString, 'publisher'));
    
    return {
      title,
      author,
      year,
      journal,
      booktitle,
      volume,
      number,
      pages,
      doi,
      publisher
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