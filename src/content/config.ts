import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Schema for 'writing' (publications)
const writingCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    authors: z.string(),
    pubDate: z.date().optional(),
    year: z.number(),
    isForthcoming: z.boolean().optional(),
    journal: z.string().optional(),
    booktitle: z.string().optional(),
    volume: z.string().optional(),
    number: z.string().optional(),
    pages: z.string().optional(),
    doi: z.string().optional(),
    pdfUrl: z.string().optional(), // Will only be present if a PDF exists
    bibtex: z.string().optional(), // BibTeX citation data
    featured: z.boolean().optional(), // For highlighting featured publications
  }),
});

// Schema for 'talks'
const talksCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    authors: z.string(),
    pubDate: z.date(),
    endDate: z.date().optional(),
    event: z.string().optional(),
    address: z.string().optional(),
    handoutUrl: z.string().optional(),
    slidesUrl: z.string().optional(),
    externalUrl: z.string().optional(),
    slideImages: z.array(z.string()).optional(), // For Reveal.js slide decks
    featured: z.boolean().optional(),
  }),
});

// Schema for 'teaching' (courses)
const teachingCollection = defineCollection({
    schema: z.object({
        title: z.string(),
        // Fields that are required for main teaching entries but optional for lectures
        year: z.string().optional(),
        term: z.string().optional(),
        authors: z.string().optional(),
        place: z.string().optional(),
        abstract: z.string().optional(),
        // Optional URL for external teaching content
        url: z.string().optional(),
        // Optional lectures object for internal teaching content
        // Defines an object where keys are strings (e.g., '01') and values are strings (lecture titles)
        lectures: z.record(z.string()).optional(),
        featured: z.boolean().optional(),
    }),
});

export const collections = {
  'writing': writingCollection,
  'talks': talksCollection,
  'teaching': teachingCollection,
};
