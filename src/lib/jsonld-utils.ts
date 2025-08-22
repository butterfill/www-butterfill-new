// Utility functions for generating JSON-LD structured data

/**
 * Format contributor names according to Schema.org Person format
 * Handles various name formats including:
 * - "First Last"
 * - "Last, First"
 * - Names with LaTeX accents like "Viganò, Luca"
 * - Names with protective braces like "{della Gatta}, Francesco"
 * 
 * @param authors - String containing author names, potentially separated by " and "
 * @returns Array of Schema.org Person objects
 */
export function formatContributors(authors: string): Array<{ '@type': string; name: string }> {
  if (!authors) return [];
  
  // Split by " and " to handle multiple authors
  const authorList = authors.split(' and ');
  
  return authorList.map(author => {
    // Remove protective braces
    let cleanAuthor = author.replace(/\{([^}]+)\}/g, '$1');
    
    // Handle LaTeX accents (basic implementation)
    cleanAuthor = cleanAuthor
      .replace(/\\`o/g, 'ò')
      .replace(/\\'e/g, 'é')
      .replace(/\\`a/g, 'à')
      .replace(/\\`u/g, 'ù')
      .replace(/\\`i/g, 'ì')
      .replace(/\\`e/g, 'è');
    
    // Check if it's in "Last, First" format
    if (cleanAuthor.includes(',')) {
      const parts = cleanAuthor.split(',').map(part => part.trim());
      const lastName = parts[0];
      const firstName = parts.slice(1).join(' ');
      return {
        '@type': 'Person',
        'name': `${firstName} ${lastName}`.trim()
      };
    }
    
    // Already in "First Last" format
    return {
      '@type': 'Person',
      'name': cleanAuthor
    };
  });
}

/**
 * Parse page range strings into start and end pages
 * Handles various formats:
 * - Simple hyphen: "23-47"
 * - En-dash: "123–148"
 * - Double-hyphen: "53--60"
 * - Single page: "104601"
 * 
 * @param pageRange - String representing page range
 * @returns Object with pageStart and pageEnd properties
 */
export function parsePageRange(pageRange: string): { pageStart?: string; pageEnd?: string } {
  if (!pageRange) return {};
  
  // Handle various dash formats
  const normalizedRange = pageRange
    .replace(/–/g, '-')  // Replace en-dash with hyphen
    .replace(/--/g, '-'); // Replace double-hyphen with single hyphen
  
  // Check if it's a range or single page
  if (normalizedRange.includes('-')) {
    const [start, end] = normalizedRange.split('-').map(p => p.trim());
    return {
      pageStart: start,
      pageEnd: end
    };
  }
  
  // Single page
  return {
    pageStart: normalizedRange
  };
}

/**
 * Generate JSON-LD structured data based on frontmatter and content type
 * 
 * @param frontmatter - Object containing page metadata
 * @param type - Content type: 'writing', 'talks', or 'teaching'
 * @param slug - Page slug for URL construction
 * @returns JSON-LD object compliant with Schema.org
 */
export function generateJsonLd(frontmatter: any, type: string, slug?: string): Record<string, any> {
  const baseUrl = 'https://butterfill.com'; // In production, this should be configurable
  
  switch (type) {
    case 'writing':
      return createScholarlyArticle({...frontmatter, slug}, baseUrl);
    case 'talks':
      return createEducationalEvent({...frontmatter, slug}, baseUrl);
    case 'teaching':
      return createCourseInstance({...frontmatter, slug}, baseUrl);
    default:
      return {};
  }
}

/**
 * Create a ScholarlyArticle JSON-LD object
 * 
 * @param frontmatter - Page metadata with slug
 * @param baseUrl - Base URL for constructing absolute URLs
 * @returns ScholarlyArticle JSON-LD object
 */
function createScholarlyArticle(frontmatter: any, baseUrl: string): Record<string, any> {
  const jsonLd: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    'headline': frontmatter.title,
    'author': formatContributors(frontmatter.authors || frontmatter.author),
    'datePublished': frontmatter.pubDate || frontmatter.date || `${frontmatter.year}-01-01`
  };
  
  // Add URL
  if (frontmatter.slug) {
    jsonLd.url = `${baseUrl}/writing/${frontmatter.slug}`;
  }
  
  // Add isPartOf for journal or book
  if (frontmatter.journal) {
    jsonLd.isPartOf = {
      '@type': 'Periodical',
      'name': frontmatter.journal
    };
  } else if (frontmatter.booktitle) {
    jsonLd.isPartOf = {
      '@type': 'Book',
      'name': frontmatter.booktitle
    };
  }
  
  // Add pages if available
  if (frontmatter.pages) {
    const pages = parsePageRange(frontmatter.pages);
    if (pages.pageStart) jsonLd.pageStart = pages.pageStart;
    if (pages.pageEnd) jsonLd.pageEnd = pages.pageEnd;
  }
  
  // Add DOI
  if (frontmatter.doi) {
    jsonLd.identifier = frontmatter.doi;
    jsonLd.sameAs = `https://doi.org/${frontmatter.doi}`;
  }
  
  // Add PDF encoding
  if (frontmatter.pdfUrl) {
    jsonLd.encoding = {
      '@type': 'MediaObject',
      'contentUrl': frontmatter.pdfUrl.startsWith('http') ? 
        frontmatter.pdfUrl : 
        `${baseUrl}${frontmatter.pdfUrl}`
    };
  }
  
  return jsonLd;
}

/**
 * Create an EducationalEvent JSON-LD object
 * 
 * @param frontmatter - Page metadata with slug
 * @param baseUrl - Base URL for constructing absolute URLs
 * @returns EducationalEvent JSON-LD object
 */
function createEducationalEvent(frontmatter: any, baseUrl: string): Record<string, any> {
  const jsonLd: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'EducationalEvent',
    'name': frontmatter.title,
    'startDate': frontmatter.pubDate || frontmatter.date,
    'endDate': frontmatter.endDate || frontmatter.pubDate || frontmatter.date,
    'speaker': formatContributors(frontmatter.authors || frontmatter.author)
  };
  
  // Add time if available
  if (frontmatter.startTime) {
    jsonLd.startDate = `${frontmatter.pubDate || frontmatter.date}T${frontmatter.startTime}`;
  }
  
  if (frontmatter.endTime) {
    jsonLd.endDate = `${frontmatter.endDate || frontmatter.pubDate || frontmatter.date}T${frontmatter.endTime}`;
  }
  
  // Add location
  if (frontmatter.address) {
    jsonLd.location = {
      '@type': 'Place',
      'name': frontmatter.address
    };
  }
  
  // Add organizer
  if (frontmatter.event) {
    jsonLd.organizer = {
      '@type': 'Organization',
      'name': frontmatter.event
    };
  }
  
  // Add handout and slides
  const hasPart: Array<Record<string, any>> = [];
  
  if (frontmatter.handoutUrl) {
    hasPart.push({
      '@type': 'CreativeWork',
      'name': 'Handout',
      'url': frontmatter.handoutUrl.startsWith('http') ? 
        frontmatter.handoutUrl : 
        `${baseUrl}${frontmatter.handoutUrl}`
    });
  }
  
  if (frontmatter.slidesUrl) {
    hasPart.push({
      '@type': 'CreativeWork',
      'name': 'Slides',
      'url': frontmatter.slidesUrl.startsWith('http') ? 
        frontmatter.slidesUrl : 
        `${baseUrl}${frontmatter.slidesUrl}`
    });
  }
  
  if (hasPart.length > 0) {
    jsonLd.hasPart = hasPart;
  }
  
  return jsonLd;
}

/**
 * Create a CourseInstance JSON-LD object
 * 
 * @param frontmatter - Page metadata with slug
 * @param baseUrl - Base URL for constructing absolute URLs
 * @returns CourseInstance JSON-LD object
 */
function createCourseInstance(frontmatter: any, baseUrl: string): Record<string, any> {
  // Construct course instance name
  let courseName = frontmatter.title;
  if (frontmatter.term && frontmatter.year) {
    courseName += ` (${frontmatter.term} ${frontmatter.year})`;
  } else if (frontmatter.term) {
    courseName += ` (${frontmatter.term})`;
  } else if (frontmatter.year) {
    courseName += ` (${frontmatter.year})`;
  }
  
  const jsonLd: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'CourseInstance',
    'name': courseName
  };
  
  // Add course
  const course: Record<string, any> = {
    '@type': 'Course',
    'name': frontmatter.title
  };
  
  // Add course URL if available
  if (frontmatter.url) {
    course.url = frontmatter.url;
  } else if (frontmatter.slug) {
    course.url = `${baseUrl}/teaching/${frontmatter.slug}`;
  }
  
  jsonLd.course = course;
  
  // Add provider
  if (frontmatter.place) {
    jsonLd.provider = {
      '@type': 'Organization',
      'name': frontmatter.place
    };
  }
  
  // Add lectures
  if (frontmatter.lectures && typeof frontmatter.lectures === 'object') {
    const hasPart = Object.entries(frontmatter.lectures).map(([key, lecture]: [string, any]) => ({
      '@type': 'CreativeWork',
      'name': lecture as string
    }));
    
    if (hasPart.length > 0) {
      jsonLd.hasPart = hasPart;
    }
  }
  
  return jsonLd;
}