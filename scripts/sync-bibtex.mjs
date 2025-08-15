#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import prompts from 'prompts';
import chalk from 'chalk';
import matter from 'gray-matter';
import bibtexParse from '@orcid/bibtex-parse-js';
import { filterBibtex } from './bib-filter.js';

const BIBTEX_PATH = path.resolve(process.env.HOME, 'endnote/phd_biblio.bib');
const CONTENT_DIR = path.resolve(process.cwd(), 'src/content/writing');

/**
 * Normalizes a title for comparison by removing punctuation and converting to lowercase.
 * @param {string} title The title to normalize.
 * @returns {string} The normalized title.
 */
const normalizeTitle = (title) => {
  return title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, ' ').trim();
};

/**
 * Extracts the citation key from a BibTeX entry string.
 * @param {string} bibtexString The BibTeX string.
 * @returns {string|null} The citation key or null if not found.
 */
const extractCitationKey = (bibtexString) => {
  if (!bibtexString) return null;
  
  // Parse the BibTeX string to get the entry
  try {
    const parsed = bibtexParse.toJSON(bibtexString);
    return parsed.length > 0 ? parsed[0].citationKey : null;
  } catch (error) {
    return null;
  }
};

/**
 * Reads and parses the BibTeX file.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of BibTeX entries.
 */
async function getBibtexEntries() {
  try {
    const bibtexContent = await fs.readFile(BIBTEX_PATH, 'utf8');
    const filteredBibtex = filterBibtex(bibtexContent);
    return bibtexParse.toJSON(filteredBibtex);
  } catch (error) {
    console.error(chalk.red(`Error reading BibTeX file: ${error.message}`));
    process.exit(1);
  }
}

/**
 * Reads and parses all markdown files in the content directory.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of file objects with parsed frontmatter.
 */
async function getContentFiles() {
  try {
    const filenames = await fs.readdir(CONTENT_DIR);
    const files = await Promise.all(
      filenames
        .filter(name => name.endsWith('.md'))
        .map(async (name) => {
          const filePath = path.join(CONTENT_DIR, name);
          const content = await fs.readFile(filePath, 'utf8');
          const { data, content: body } = matter(content);
          return {
            filename: name,
            filePath,
            ...data,
            body,
          };
        })
    );
    return files;
  } catch (error) {
    console.error(chalk.red(`Error reading content files: ${error.message}`));
    process.exit(1);
  }
}

/**
 * Creates a new content file from a BibTeX entry.
 * @param {Object} entry The BibTeX entry.
 */
async function createFile(entry) {
  const { title, author: authors, year, journal, booktitle, volume, number, pages, doi, abstract } = entry.entryTags;
  const newFilePath = path.join(CONTENT_DIR, `${entry.citationKey.replace(/:/g, '')}.md`);

  const bibtex = bibtexParse.toBibtex([entry], false);

  const frontmatter = {
    title,
    authors,
    year: parseInt(year, 10),
    journal,
    booktitle,
    volume,
    number,
    pages,
    doi,
    bibtex,
  };

  const content = `--- 
${Object.entries(frontmatter)
  .filter(([, value]) => value !== undefined)
  .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
  .join('\n')}
---

${abstract || ''}
`;

  console.log(chalk.green(`\nCreating new file: ${newFilePath}`));
  console.log(content);

  const response = await prompts({
    type: 'select',
    name: 'action',
    message: 'Create this file?',
    choices: [
      { title: 'Yes', value: 'yes' },
      { title: 'Skip', value: 'skip' },
      { title: 'Quit', value: 'quit' },
    ],
  });

  if (response.action === 'yes') {
    await fs.writeFile(newFilePath, content);
    console.log(chalk.green('File created.'));
  } else if (response.action === 'quit') {
    process.exit(0);
  } else {
    console.log(chalk.yellow('Skipped.'));
  }
}

/**
 * Deeply compares two objects for equality.
 * @param {Object} obj1 The first object.
 * @param {Object} obj2 The second object.
 * @returns {boolean} True if the objects are equal, false otherwise.
 */
function deepEqual(obj1, obj2) {
    if (obj1 === obj2) return true;

    if (obj1 && typeof obj1 === 'object' && obj2 && typeof obj2 === 'object') {
        if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;

        for (const key in obj1) {
            if (Object.prototype.hasOwnProperty.call(obj1, key)) {
                if (!Object.prototype.hasOwnProperty.call(obj2, key)) return false;
                if (!deepEqual(obj1[key], obj2[key])) return false;
            }
        }
        return true;
    }
    return false;
}

/**
 * Updates an existing content file with data from a BibTeX entry.
 * @param {Object} file The content file object.
 * @param {Object} entry The BibTeX entry.
 */
async function updateFile(file, entry) {
  const bibtex = bibtexParse.toBibtex([entry], false);

  if (file.bibtex) {
    const existingBibtex = bibtexParse.toJSON(file.bibtex);
    // The bibtex file has a `date-modified` field that we should ignore in the comparison.
    if(existingBibtex[0].entryTags) delete existingBibtex[0].entryTags['date-modified'];
    if(entry.entryTags) delete entry.entryTags['date-modified'];

    if (deepEqual(existingBibtex[0], entry)) {
      return;
    }
  }

  const newFrontmatter = { ...file, bibtex };
  delete newFrontmatter.filePath;
  delete newFrontmatter.filename;
  delete newFrontmatter.body;


  const newContent = `--- 
${Object.entries(newFrontmatter)
  .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
  .join('\n')}
---

${file.body}
`;

  if (matter(await fs.readFile(file.filePath, 'utf8')).content !== newContent) {
    console.log(chalk.blue(`\nUpdating file: ${file.filePath}`));
    console.log(newContent);

    const response = await prompts({
        type: 'select',
        name: 'action',
        message: 'Update this file?',
        choices: [
          { title: 'Yes', value: 'yes' },
          { title: 'Skip', value: 'skip' },
          { title: 'Quit', value: 'quit' },
        ],
      });

      if (response.action === 'yes') {
        await fs.writeFile(file.filePath, newContent);
        console.log(chalk.blue('File updated.'));
      } else if (response.action === 'quit') {
        process.exit(0);
      } else {
        console.log(chalk.yellow('Skipped.'));
      }
  }
}


/**
 * Main function to run the CLI.
 */
async function main() {
  const bibtexEntries = await getBibtexEntries();
  const contentFiles = await getContentFiles();

  // Extract citation keys from existing files
  const existingCitationKeys = new Set();
  contentFiles.forEach(file => {
    const key = extractCitationKey(file.bibtex);
    if (key) {
      existingCitationKeys.add(key);
    }
  });

  const matchedFiles = [];
  const processedBibtexEntries = new Set();
  const filesWithoutPdf = [];

  for (const entry of bibtexEntries) {
    const normalizedEntryTitle = normalizeTitle(entry.entryTags.title);
    const matchedFile = contentFiles.find(
      (file) => normalizeTitle(file.title) === normalizedEntryTitle
    );

    if (matchedFile) {
      matchedFiles.push(matchedFile);
      if (!matchedFile.pdfUrl) {
        filesWithoutPdf.push(matchedFile);
      }
      await updateFile(matchedFile, entry);
      processedBibtexEntries.add(entry);
    }
  }

  const unmatchedFiles = contentFiles.filter(
    (file) => !matchedFiles.some((matched) => matched.filePath === file.filePath)
  );

  // Filter BibTeX entries to only include those that don't already have corresponding files
  // This prevents trying to create files for entries that already exist with slightly different titles
  const unmatchedBibtex = bibtexEntries.filter((entry) => {
    // Skip entries that have already been processed (matched with existing files)
    if (processedBibtexEntries.has(entry)) {
      return false;
    }
    
    // Skip entries that already have files with matching citation keys
    if (existingCitationKeys.has(entry.citationKey)) {
      return false;
    }
    
    // Additionally check if there's a file with a similar title that might have been missed
    const normalizedEntryTitle = normalizeTitle(entry.entryTags.title);
    const hasExistingFile = contentFiles.some(
      (file) => normalizeTitle(file.title) === normalizedEntryTitle
    );
    
    return !hasExistingFile;
  });

  console.log(chalk.bold('\n--- Reports ---'));

  if (unmatchedFiles.length > 0) {
    console.log(chalk.yellow('\nFiles without a matching BibTeX entry:'));
    console.table(unmatchedFiles.map((f) => ({ Title: f.title, File: f.filename })));
  }

  if (filesWithoutPdf.length > 0) {
    console.log(chalk.yellow('\nFiles missing pdfUrl:'));
    console.table(filesWithoutPdf.map((f) => ({ Title: f.title, File: f.filename })));
  }

  if (unmatchedBibtex.length > 0) {
    console.log(chalk.green('\nBibTeX entries without a matching file:'));
    for (const entry of unmatchedBibtex) {
      await createFile(entry);
    }
  }

  console.log(chalk.bold('\n--- Sync complete ---'));
}



main();