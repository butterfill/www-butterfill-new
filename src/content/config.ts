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
    slideImages: z.array(z.string()).optional(), // For Reveal.js slide decks
  }),
});

// Schema for 'teaching' (courses)
const teachingCollection = defineCollection({
    loader: glob({ pattern: '*.md', base: './src/content/teaching' }),
    schema: z.object({
        title: z.string(),
        year: z.string(),
        term: z.string(),
        authors: z.string(),
        place: z.string(),
        abstract: z.string(),
        // Defines an object where keys are strings (e.g., '01') and values are strings (lecture titles)
        lectures: z.record(z.string()),
    }),
});

export const collections = {
  'writing': writingCollection,
  'talks': talksCollection,
  'teaching': teachingCollection,
};