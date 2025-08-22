import { describe, it, expect } from 'vitest';
import { formatContributors, parsePageRange, generateJsonLd } from '$lib/jsonld-utils';

describe('JSON-LD Utility Functions', () => {
  describe('formatContributors', () => {
    it('should correctly format a single "First Last" name', () => {
      const input = 'John Doe';
      const expected = [{ '@type': 'Person', 'name': 'John Doe' }];
      const result = formatContributors(input);
      expect(result).toEqual(expected);
    });

    it('should correctly format a "Last, First" name', () => {
      const input = 'Doe, John';
      const expected = [{ '@type': 'Person', 'name': 'John Doe' }];
      const result = formatContributors(input);
      expect(result).toEqual(expected);
    });

    it('should handle multiple authors separated by " and "', () => {
      const input = 'John Doe and Jane Smith';
      const expected = [
        { '@type': 'Person', 'name': 'John Doe' },
        { '@type': 'Person', 'name': 'Jane Smith' }
      ];
      const result = formatContributors(input);
      expect(result).toEqual(expected);
    });

    it('should correctly parse names with LaTeX accents like "Viganò, Luca"', () => {
      const input = 'Viganò, Luca';
      const expected = [{ '@type': 'Person', 'name': 'Luca Viganò' }];
      const result = formatContributors(input);
      expect(result).toEqual(expected);
    });

    it('should handle names with protective braces like "{della Gatta}, Francesco"', () => {
      const input = '{della Gatta}, Francesco';
      const expected = [{ '@type': 'Person', 'name': 'Francesco della Gatta' }];
      const result = formatContributors(input);
      expect(result).toEqual(expected);
    });

    it('should handle a mix of simple and complex names in a single string', () => {
      const input = 'John Doe and {della Gatta}, Francesco and Viganò, Luca';
      const expected = [
        { '@type': 'Person', 'name': 'John Doe' },
        { '@type': 'Person', 'name': 'Francesco della Gatta' },
        { '@type': 'Person', 'name': 'Luca Viganò' }
      ];
      const result = formatContributors(input);
      expect(result).toEqual(expected);
    });

    it('should return an array of Schema.org Person objects', () => {
      const input = 'John Doe';
      const result = formatContributors(input);
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toHaveProperty('@type', 'Person');
      expect(result[0]).toHaveProperty('name');
    });
  });

  describe('parsePageRange', () => {
    it('should parse a simple hyphenated range like "23-47"', () => {
      const input = '23-47';
      const expected = { pageStart: '23', pageEnd: '47' };
      const result = parsePageRange(input);
      expect(result).toEqual(expected);
    });

    it('should parse a range with an en-dash like "123–148"', () => {
      const input = '123–148';  // en-dash
      const expected = { pageStart: '123', pageEnd: '148' };
      const result = parsePageRange(input);
      expect(result).toEqual(expected);
    });

    it('should parse a range with a double-hyphen like "53--60"', () => {
      const input = '53--60';
      const expected = { pageStart: '53', pageEnd: '60' };
      const result = parsePageRange(input);
      expect(result).toEqual(expected);
    });

    it('should handle a single page number like "104601"', () => {
      const input = '104601';
      const expected = { pageStart: '104601', pageEnd: undefined };
      const result = parsePageRange(input);
      expect(result).toEqual(expected);
    });
  });

  describe('generateJsonLd', () => {
    describe('for ScholarlyArticle (writing)', () => {
      it('should generate the correct @type and @context', () => {
        const frontmatter = {
          title: 'Test Article',
          author: 'John Doe',
          date: '2023-01-01',
          slug: 'test-article'
        };
        const result = generateJsonLd(frontmatter, 'writing');
        expect(result).toHaveProperty('@context', 'https://schema.org');
        expect(result).toHaveProperty('@type', 'ScholarlyArticle');
      });

      it('should map title, author, and datePublished correctly', () => {
        const frontmatter = {
          title: 'Test Article',
          author: 'John Doe',
          date: '2023-01-01',
          slug: 'test-article'
        };
        const result = generateJsonLd(frontmatter, 'writing');
        expect(result).toHaveProperty('headline', 'Test Article');
        expect(result).toHaveProperty('author');
        expect(result).toHaveProperty('datePublished', '2023-01-01');
      });

      it('should create an absolute URL for the page', () => {
        const frontmatter = {
          title: 'Test Article',
          author: 'John Doe',
          date: '2023-01-01',
          slug: 'test-article'
        };
        const result = generateJsonLd(frontmatter, 'writing');
        expect(result).toHaveProperty('url');
        expect(result.url).toContain('/writing/test-article');
      });

      it('should create a "Periodical" for isPartOf when a journal is present', () => {
        const frontmatter = {
          title: 'Test Article',
          author: 'John Doe',
          date: '2023-01-01',
          slug: 'test-article',
          journal: 'Nature'
        };
        const result = generateJsonLd(frontmatter, 'writing');
        expect(result).toHaveProperty('isPartOf');
        expect(result.isPartOf).toHaveProperty('@type', 'Periodical');
        expect(result.isPartOf).toHaveProperty('name', 'Nature');
      });

      it('should create a "Book" for isPartOf when a booktitle is present', () => {
        const frontmatter = {
          title: 'Test Article',
          author: 'John Doe',
          date: '2023-01-01',
          slug: 'test-article',
          booktitle: 'Conference Proceedings'
        };
        const result = generateJsonLd(frontmatter, 'writing');
        expect(result).toHaveProperty('isPartOf');
        expect(result.isPartOf).toHaveProperty('@type', 'Book');
        expect(result.isPartOf).toHaveProperty('name', 'Conference Proceedings');
      });

      it('should include a DOI as an identifier and sameAs link', () => {
        const frontmatter = {
          title: 'Test Article',
          author: 'John Doe',
          date: '2023-01-01',
          slug: 'test-article',
          doi: '10.1000/xyz123'
        };
        const result = generateJsonLd(frontmatter, 'writing');
        expect(result).toHaveProperty('identifier', '10.1000/xyz123');
        expect(result).toHaveProperty('sameAs', 'https://doi.org/10.1000/xyz123');
      });

      it('should create an absolute URL for the PDF in the encoding property', () => {
        const frontmatter = {
          title: 'Test Article',
          author: 'John Doe',
          date: '2023-01-01',
          slug: 'test-article',
          pdf_url: '/pdf/test-article.pdf'
        };
        const result = generateJsonLd(frontmatter, 'writing');
        expect(result).toHaveProperty('encoding');
        expect(result.encoding).toHaveProperty('@type', 'MediaObject');
        expect(result.encoding).toHaveProperty('contentUrl');
        expect(result.encoding.contentUrl).toContain('/pdf/test-article.pdf');
      });

      it('should omit properties for missing data (e.g., no DOI, no PDF)', () => {
        const frontmatter = {
          title: 'Test Article',
          author: 'John Doe',
          date: '2023-01-01',
          slug: 'test-article'
        };
        const result = generateJsonLd(frontmatter, 'writing');
        expect(result).not.toHaveProperty('identifier');
        expect(result).not.toHaveProperty('sameAs');
        expect(result).not.toHaveProperty('encoding');
      });
    });

    describe('for EducationalEvent (talks)', () => {
      it('should generate the correct @type for a talk', () => {
        const frontmatter = {
          title: 'Test Talk',
          author: 'John Doe',
          date: '2023-01-01',
          slug: 'test-talk'
        };
        const result = generateJsonLd(frontmatter, 'talks');
        expect(result).toHaveProperty('@type', 'EducationalEvent');
      });

      it('should format startDate and endDate as ISO strings', () => {
        const frontmatter = {
          title: 'Test Talk',
          author: 'John Doe',
          date: '2023-01-01',
          slug: 'test-talk',
          start_time: '14:00',
          end_time: '15:30'
        };
        const result = generateJsonLd(frontmatter, 'talks');
        expect(result).toHaveProperty('startDate');
        expect(result).toHaveProperty('endDate');
        // Should contain the date and time in ISO format
        expect(result.startDate).toContain('2023-01-01');
        expect(result.endDate).toContain('2023-01-01');
      });

      it('should create a Place object for the location', () => {
        const frontmatter = {
          title: 'Test Talk',
          author: 'John Doe',
          date: '2023-01-01',
          slug: 'test-talk',
          place: 'University of Cambridge'
        };
        const result = generateJsonLd(frontmatter, 'talks');
        expect(result).toHaveProperty('location');
        expect(result.location).toHaveProperty('@type', 'Place');
        expect(result.location).toHaveProperty('name', 'University of Cambridge');
      });

      it('should create an Organization object for the event organizer', () => {
        const frontmatter = {
          title: 'Test Talk',
          author: 'John Doe',
          date: '2023-01-01',
          slug: 'test-talk',
          organiser: 'Department of Philosophy'
        };
        const result = generateJsonLd(frontmatter, 'talks');
        expect(result).toHaveProperty('organizer');
        expect(result.organizer).toHaveProperty('@type', 'Organization');
        expect(result.organizer).toHaveProperty('name', 'Department of Philosophy');
      });

      it('should correctly populate the speaker property', () => {
        const frontmatter = {
          title: 'Test Talk',
          author: 'John Doe',
          date: '2023-01-01',
          slug: 'test-talk'
        };
        const result = generateJsonLd(frontmatter, 'talks');
        expect(result).toHaveProperty('speaker');
        expect(Array.isArray(result.speaker)).toBe(true);
        expect(result.speaker[0]).toHaveProperty('@type', 'Person');
        expect(result.speaker[0]).toHaveProperty('name', 'John Doe');
      });

      it('should include handout and slides URLs in hasPart', () => {
        const frontmatter = {
          title: 'Test Talk',
          author: 'John Doe',
          date: '2023-01-01',
          slug: 'test-talk',
          handout_url: '/handouts/test-talk.pdf',
          slides_url: '/slides/test-talk.pdf'
        };
        const result = generateJsonLd(frontmatter, 'talks');
        expect(result).toHaveProperty('hasPart');
        expect(Array.isArray(result.hasPart)).toBe(true);
        expect(result.hasPart).toHaveLength(2);
        expect(result.hasPart[0]).toHaveProperty('@type', 'CreativeWork');
        expect(result.hasPart[1]).toHaveProperty('@type', 'CreativeWork');
      });
    });

    describe('for CourseInstance (teaching)', () => {
      it('should generate a nested Course within a CourseInstance', () => {
        const frontmatter = {
          title: 'Philosophy of Mind',
          author: 'John Doe',
          date: '2023-01-01',
          slug: 'philosophy-of-mind'
        };
        const result = generateJsonLd(frontmatter, 'teaching');
        expect(result).toHaveProperty('@type', 'CourseInstance');
        expect(result).toHaveProperty('course');
        expect(result.course).toHaveProperty('@type', 'Course');
      });

      it('should use the external URL for the Course if provided', () => {
        const frontmatter = {
          title: 'Philosophy of Mind',
          author: 'John Doe',
          date: '2023-01-01',
          slug: 'philosophy-of-mind',
          external_url: 'https://example.com/course'
        };
        const result = generateJsonLd(frontmatter, 'teaching');
        expect(result.course).toHaveProperty('url', 'https://example.com/course');
      });

      it('should correctly parse the provider name from the "place" field', () => {
        const frontmatter = {
          title: 'Philosophy of Mind',
          author: 'John Doe',
          date: '2023-01-01',
          slug: 'philosophy-of-mind',
          place: 'University of Cambridge'
        };
        const result = generateJsonLd(frontmatter, 'teaching');
        expect(result).toHaveProperty('provider');
        expect(result.provider).toHaveProperty('@type', 'Organization');
        expect(result.provider).toHaveProperty('name', 'University of Cambridge');
      });

      it('should map the "lectures" object to an array of CreativeWork objects in hasPart', () => {
        const frontmatter = {
          title: 'Philosophy of Mind',
          author: 'John Doe',
          date: '2023-01-01',
          slug: 'philosophy-of-mind',
          lectures: {
            'lecture-1': { title: 'Introduction', date: '2023-01-15' },
            'lecture-2': { title: 'Dualism', date: '2023-01-22' }
          }
        };
        const result = generateJsonLd(frontmatter, 'teaching');
        expect(result).toHaveProperty('hasPart');
        expect(Array.isArray(result.hasPart)).toBe(true);
        expect(result.hasPart).toHaveLength(2);
        expect(result.hasPart[0]).toHaveProperty('@type', 'CreativeWork');
        expect(result.hasPart[1]).toHaveProperty('@type', 'CreativeWork');
      });

      it('should construct a descriptive name for the CourseInstance from title, term, and year', () => {
        const frontmatter = {
          title: 'Philosophy of Mind',
          author: 'John Doe',
          date: '2023-01-01',
          slug: 'philosophy-of-mind',
          term: 'Spring',
          year: '2023'
        };
        const result = generateJsonLd(frontmatter, 'teaching');
        expect(result).toHaveProperty('name', 'Philosophy of Mind (Spring 2023)');
      });
    });
  });
});