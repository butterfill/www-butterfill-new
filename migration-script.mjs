import fs from 'fs-extra';
import path from 'path';
import CSON from 'cson-parser';
import pug from 'pug';
import yaml from 'yaml';

// --- CONFIGURATION ---
// Path to the source content in the OLD project directory
const OLD_DOCS_DIR = '../www-butterfill-old/src/documents';
const OLD_FILES_DIR = '../www-butterfill-old/src/files';

// Path to the destination content in the NEW project directory
const NEW_CONTENT_DIR = 'src/content';
const PUBLIC_DIR = 'public';

// --- CORE FUNCTIONS ---

/**
 * Finds all relevant source files from the old project directory.
 * @returns {Promise<string[]>} A promise that resolves to an array of relative file paths.
 */
async function findSourceFiles() {
  if (!await fs.pathExists(OLD_DOCS_DIR)) {
    console.error(`Error: Source directory not found at ${path.resolve(OLD_DOCS_DIR)}`);
    console.error('Please make sure the www-butterfill-old directory is in the same parent folder as www-butterfill-new.');
    process.exit(1);
  }

  const allFiles = await fs.readdir(OLD_DOCS_DIR, { recursive: true });

  return allFiles.filter(file => {
    const fullPath = path.join(OLD_DOCS_DIR, file);
    if (!fs.statSync(fullPath).isFile()) {
      return false; // Ignore directories
    }

    // Normalize path separators to always be '/' for consistent matching
    const normalizedPath = file.replace(/\\/g, '/');
    const parts = normalizedPath.split('/');
    const collection = parts[0];

    // Only include files from the root of 'writing', 'talks', or 'teaching' directories
    return ['writing', 'talks', 'teaching'].includes(collection) &&
           (file.endsWith('.html') || file.endsWith('.html.md') || file.endsWith('.jade'));
  });
}

/**
 * Extracts the CSON/YAML frontmatter and the body from a file's content.
 * @param {string} content The content of the file.
 * @returns {{frontmatter: string|null, body: string}}
 */
function extractFrontmatter(content) {
  const match = content.match(/^---\s*c?s?o?n?\s*\r?\n([\s\S]*?)\r?\n---/);
  if (match) {
    return {
      frontmatter: match[1],
      body: content.slice(match[0].length),
    };
  }
  return { frontmatter: null, body: content };
}

/**
 * Transforms the old CSON frontmatter object to the new schema.
 * @param {object} oldData The parsed CSON frontmatter.
 * @param {string} oldFilePath The relative path of the old file.
 * @returns {{newData: object, bodyAbstract: string}}
 */
function transformFrontmatter(oldData, oldFilePath) {
  if (!oldData) return { newData: {}, bodyAbstract: '' };

  const newData = {};
  const normalizedPath = oldFilePath.replace(/\\/g, '/');

  // --- Common fields ---
  newData.title = oldData.title || 'Untitled';
  newData.authors = oldData.authors || 'Unknown';

  if (oldData.date) {
    try {
      // Create a valid Date object before converting to ISO string
      newData.pubDate = new Date(oldData.date);
    } catch (e) {
      console.warn(`Invalid date format for ${oldFilePath}: ${oldData.date}`);
    }
  }

  // --- Collection-specific fields ---
  if (normalizedPath.startsWith('writing/')) {
    newData.year = oldData.year ? parseInt(oldData.year, 10) : (newData.pubDate ? newData.pubDate.getFullYear() : undefined);
    if (isNaN(newData.year)) delete newData.year;

    if (oldData.isForthcoming !== undefined) newData.isForthcoming = oldData.isForthcoming;
    if (oldData.journal) newData.journal = oldData.journal;
    if (oldData.booktitle) newData.booktitle = oldData.booktitle;
    if (oldData.volume) newData.volume = String(oldData.volume);
    if (oldData.number) newData.number = String(oldData.number);
    if (oldData.pages) newData.pages = oldData.pages;
    if (oldData.doi) newData.doi = oldData.doi;
  } else if (normalizedPath.startsWith('talks/')) {
    if (oldData.date_end && newData.pubDate) {
        const startDate = newData.pubDate;
        // Handles cases where date_end is just the day of the month
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth(), parseInt(oldData.date_end, 10));
        newData.endDate = endDate;
    }
    if (oldData.event) newData.event = oldData.event;
    if (oldData.address) newData.address = oldData.address;
  } else if (normalizedPath.startsWith('teaching/')) {
    if (oldData.year) newData.year = String(oldData.year);
    if (oldData.term) newData.term = oldData.term;
    if (oldData.place) newData.place = oldData.place;
    if (oldData.lectures) newData.lectures = oldData.lectures;
    if (oldData.abstract) newData.abstract = oldData.abstract;
  }

  // --- Abstract to body ---
  let bodyAbstract = '';
  if (oldData.abstract && !normalizedPath.startsWith('teaching/')) {
      bodyAbstract = `## Abstract\n\n${oldData.abstract.trim()}\n\n`;
  }

  return { newData, bodyAbstract };
}

/**
 * Processes the body of a file, converting Jade to HTML if necessary.
 * @param {string} body The body content of the file.
 * @param {string} oldFilePath The relative path of the old file.
 * @returns {string} The processed body content.
 */
function processBody(body, oldFilePath) {
  if (oldFilePath.endsWith('.jade')) {
    try {
      // Render pug with pretty option to make the HTML readable
      return pug.render(body, { pretty: true });
    } catch (e) {
      console.error(`Error rendering pug for ${oldFilePath}:`, e);
      return `<!-- PUG_RENDER_ERROR: ${e.message} -->\n${body}`;
    }
  }
  return body.trim();
}

/**
 * Handles copying assets (PDFs, images) and updating frontmatter with new paths.
 * @param {object} newData - The frontmatter object to update.
 * @param {object} oldData - The original frontmatter data.
 * @param {string} oldFilePath - The relative path of the old file.
 */
async function handleAssets(newData, oldData, oldFilePath) {
  const basename = path.basename(oldFilePath, path.extname(oldFilePath)).replace(/\.html$/, '');
  const normalizedPath = oldFilePath.replace(/\\/g, '/');

  // PDFs for publications
  if (oldData.pdf && normalizedPath.startsWith('writing/')) {
    const oldPdfPath = path.join(OLD_FILES_DIR, 'pdf', `${basename}.pdf`);
    if (await fs.pathExists(oldPdfPath)) {
      const newPdfPath = path.join(PUBLIC_DIR, 'pdf', `${basename}.pdf`);
      await fs.ensureDir(path.dirname(newPdfPath));
      await fs.copy(oldPdfPath, newPdfPath);
      newData.pdfUrl = `/pdf/${basename}.pdf`;
    }
  }

  // PDFs for talks (handouts and slides)
  if (normalizedPath.startsWith('talks/')) {
    if (oldData.handout) {
      const oldPdfPath = path.join(OLD_FILES_DIR, 'pdf', 'talks', `${basename}.handout.pdf`);
      if (await fs.pathExists(oldPdfPath)) {
        const newPdfPath = path.join(PUBLIC_DIR, 'pdf', 'talks', `${basename}.handout.pdf`);
        await fs.ensureDir(path.dirname(newPdfPath));
        await fs.copy(oldPdfPath, newPdfPath);
        newData.handoutUrl = `/pdf/talks/${basename}.handout.pdf`;
      }
    }
    if (oldData.slides) {
      const oldPdfPath = path.join(OLD_FILES_DIR, 'pdf', 'talks', `${basename}.slides.pdf`);
      if (await fs.pathExists(oldPdfPath)) {
        const newPdfPath = path.join(PUBLIC_DIR, 'pdf', 'talks', `${basename}.slides.pdf`);
        await fs.ensureDir(path.dirname(newPdfPath));
        await fs.copy(oldPdfPath, newPdfPath);
        newData.slidesUrl = `/pdf/talks/${basename}.slides.pdf`;
      }
    }
  }

  // Deck.js slide images for talks
  if (oldData.deckslides && normalizedPath.startsWith('talks/')) {
    const oldImgDirPath = path.join(OLD_DOCS_DIR, 'img', 'talks', basename);
    if (await fs.pathExists(oldImgDirPath)) {
      const newImgDirPath = path.join(PUBLIC_DIR, 'img', 'talks', basename);
      await fs.ensureDir(newImgDirPath);
      await fs.copy(oldImgDirPath, newImgDirPath);
      
      const imageFiles = (await fs.readdir(oldImgDirPath)).filter(f => !f.startsWith('.'));
      imageFiles.sort(); 
      newData.slideImages = imageFiles.map(file => `/img/talks/${basename}/${file}`);
    }
  }
}

/**
 * Generates a redirect rule string for a given file.
 * @param {string} oldFilePath - The relative path of the old file from OLD_DOCS_DIR.
 * @returns {string|null} A redirect rule string or null if not applicable.
 */
function generateRedirectRule(oldFilePath) {
  const normalizedPath = oldFilePath.replace(/\\/g, '/');
  const parts = normalizedPath.split('/');
  const collection = parts[0];

  const oldUrl = `/${normalizedPath}`.replace(/\.jade$/, '.html');
  const slug = path.basename(normalizedPath, path.extname(normalizedPath)).replace(/\.html$/, '');
  const newUrl = `/${collection}/${slug}/`;

  return `${oldUrl}    ${newUrl}    301`;
}

/**
 * Main migration function.
 */
async function main() {
  console.log('Starting migration...');

  // 1. Clear existing content and asset directories
  console.log('Clearing old content...');
  await fs.emptyDir(path.join(NEW_CONTENT_DIR, 'writing'));
  await fs.emptyDir(path.join(NEW_CONTENT_DIR, 'talks'));
  await fs.emptyDir(path.join(NEW_CONTENT_DIR, 'teaching'));
  await fs.emptyDir(path.join(PUBLIC_DIR, 'pdf'));
  await fs.emptyDir(path.join(PUBLIC_DIR, 'img'));
  console.log('Old content cleared.');

  const redirects = [];
  const sourceFiles = await findSourceFiles();
  console.log(`Found ${sourceFiles.length} source files to migrate.`);

  if (sourceFiles.length === 0) {
    console.error("No source files found. Check the OLD_CONTENT_DIR path and the filter logic in findSourceFiles.");
    return;
  }

  for (const oldFilePath of sourceFiles) {
    const fullOldPath = path.join(OLD_DOCS_DIR, oldFilePath);
    const content = await fs.readFile(fullOldPath, 'utf-8');

    const { frontmatter: fmString, body: rawBody } = extractFrontmatter(content);
    
    let oldData = {};
    if (fmString) {
        try {
            oldData = CSON.parse(fmString);
        } catch (e) {
            console.error(`Could not parse CSON for ${oldFilePath}. Error: ${e.message}`);
            continue; // Skip this file
        }
    }

    const { newData, bodyAbstract } = transformFrontmatter(oldData, oldFilePath);
    
    await handleAssets(newData, oldData, oldFilePath);

    const processedBody = processBody(rawBody, oldFilePath);

    const redirectRule = generateRedirectRule(oldFilePath);
    if (redirectRule) {
        redirects.push(redirectRule);
    }

    const yamlFrontmatter = yaml.stringify(newData);
    const newContent = `---\n${yamlFrontmatter}---\n\n${bodyAbstract}${processedBody}`;

    const normalizedPath = oldFilePath.replace(/\\/g, '/');
    const collection = normalizedPath.split('/')[0];
    const slug = path.basename(oldFilePath, path.extname(oldFilePath)).replace(/\.html$/, '');
    const newFilePath = path.join(NEW_CONTENT_DIR, collection, `${slug}.md`);
    
    await fs.ensureDir(path.dirname(newFilePath));
    await fs.writeFile(newFilePath, newContent);
  }

  const redirectsFilePath = path.join(PUBLIC_DIR, '_redirects');
  await fs.writeFile(redirectsFilePath, redirects.join('\n'));
  console.log(`Generated ${redirects.length} redirects in ${redirectsFilePath}`);

  console.log('Migration completed successfully!');
}

main().catch(console.error);