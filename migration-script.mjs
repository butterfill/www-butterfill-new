import fs from 'fs-extra';
import path from 'path';
import CSON from 'cson-parser';
import pug from 'pug';
import yaml from 'yaml';

// Path to the source content in the OLD project directory
const OLD_CONTENT_DIR = '../www-butterfill-old/src/documents';

// Path to the destination content in the NEW project directory
const NEW_CONTENT_DIR = 'src/content';
const PUBLIC_DIR = 'public';


async function findSourceFiles() {
  // Note: The path must exist relative to where you run the script.
  if (!await fs.pathExists(OLD_CONTENT_DIR)) {
    console.error(`Error: Source directory not found at ${path.resolve(OLD_CONTENT_DIR)}`);
    console.error('Please make sure the www-butterfill-old directory is in the same parent folder as www-butterfill-new.');
    process.exit(1);
  }
  const allFiles = await fs.readdir(OLD_CONTENT_DIR, { recursive: true });
  return allFiles.filter(file => {
    const fullPath = path.join(OLD_CONTENT_DIR, file);
    return fs.statSync(fullPath).isFile() &&
            (file.endsWith('.html') || file.endsWith('.html.md') || file.endsWith('.jade'));
  });
}

/**
 * Extracts the CSON frontmatter and the body from a file's content.
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

  // --- Common fields ---
  newData.title = oldData.title || 'Untitled';
  newData.authors = oldData.authors || 'Unknown';

  if (oldData.date) {
    try {
      newData.pubDate = new Date(oldData.date).toISOString();
    } catch (e) {
      console.warn(`Invalid date format for ${oldFilePath}: ${oldData.date}`);
    }
  }

  // --- Collection-specific fields ---
  const isWriting = oldFilePath.includes('/writing/');
  const isTalk = oldFilePath.includes('/talks/');
  const isTeaching = oldFilePath.includes('/teaching/');

  if (isWriting) {
    newData.year = oldData.year ? parseInt(oldData.year, 10) : (newData.pubDate ? new Date(newData.pubDate).getFullYear() : undefined);
    if (isNaN(newData.year)) delete newData.year;

    if (oldData.isForthcoming !== undefined) newData.isForthcoming = oldData.isForthcoming;
    if (oldData.journal) newData.journal = oldData.journal;
    if (oldData.booktitle) newData.booktitle = oldData.booktitle;
    if (oldData.volume) newData.volume = String(oldData.volume);
    if (oldData.number) newData.number = String(oldData.number);
    if (oldData.pages) newData.pages = oldData.pages;
    if (oldData.doi) newData.doi = oldData.doi;
  } else if (isTalk) {
    if (oldData.date_end) {
        const startDate = new Date(oldData.date);
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth(), parseInt(oldData.date_end, 10));
        newData.endDate = endDate.toISOString();
    }
    if (oldData.event) newData.event = oldData.event;
    if (oldData.address) newData.address = oldData.address;
  } else if (isTeaching) {
    if (oldData.year) newData.year = String(oldData.year);
    if (oldData.term) newData.term = oldData.term;
    if (oldData.place) newData.place = oldData.place;
    if (oldData.lectures) newData.lectures = oldData.lectures;
    if (oldData.abstract) newData.abstract = oldData.abstract;
  }

  // --- Abstract to body ---
  let bodyAbstract = '';
  if (oldData.abstract && (isWriting || isTalk)) {
      bodyAbstract = `## Abstract\n\n${oldData.abstract}\n\n`;
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
      return pug.render(body, { pretty: true });
    } catch (e) {
      console.error(`Error rendering pug for ${oldFilePath}:`, e);
      return `<!-- PUG_RENDER_ERROR: ${e.message} -->\n${body}`;
    }
  }
  return body;
}

/**
 * Handles copying assets (PDFs, images) and updating frontmatter with new paths.
 * @param {object} newData - The frontmatter object to update.
 * @param {object} oldData - The original frontmatter data.
 * @param {string} oldFilePath - The relative path of the old file.
 */
async function handleAssets(newData, oldData, oldFilePath) {
  const basename = path.basename(oldFilePath, path.extname(oldFilePath)).replace(/\.html$/, '');
  const OLD_ASSET_DIR = '../www-butterfill-old/src/files';
  const OLD_IMG_DIR = '../www-butterfill-old/src/documents/img';

  // PDFs for publications
  if (oldData.pdf && oldFilePath.includes('/writing/')) {
    const oldPdfPath = path.join(OLD_ASSET_DIR, 'pdf', `${basename}.pdf`);
    if (await fs.pathExists(oldPdfPath)) {
      const newPdfPath = path.join(PUBLIC_DIR, 'pdf', `${basename}.pdf`);
      await fs.ensureDir(path.dirname(newPdfPath));
      await fs.copy(oldPdfPath, newPdfPath);
      newData.pdfUrl = `/pdf/${basename}.pdf`;
    }
  }

  // PDFs for talks (handouts and slides)
  if (oldFilePath.includes('/talks/')) {
    if (oldData.handout) {
      const oldPdfPath = path.join(OLD_ASSET_DIR, 'pdf', 'talks', `${basename}.handout.pdf`);
      if (await fs.pathExists(oldPdfPath)) {
        const newPdfPath = path.join(PUBLIC_DIR, 'pdf', 'talks', `${basename}.handout.pdf`);
        await fs.ensureDir(path.dirname(newPdfPath));
        await fs.copy(oldPdfPath, newPdfPath);
        newData.handoutUrl = `/pdf/talks/${basename}.handout.pdf`;
      }
    }
    if (oldData.slides) {
      const oldPdfPath = path.join(OLD_ASSET_DIR, 'pdf', 'talks', `${basename}.slides.pdf`);
      if (await fs.pathExists(oldPdfPath)) {
        const newPdfPath = path.join(PUBLIC_DIR, 'pdf', 'talks', `${basename}.slides.pdf`);
        await fs.ensureDir(path.dirname(newPdfPath));
        await fs.copy(oldPdfPath, newPdfPath);
        newData.slidesUrl = `/pdf/talks/${basename}.slides.pdf`;
      }
    }
  }

  // Deck.js slide images for talks
  if (oldData.deckslides && oldFilePath.includes('/talks/')) {
    const oldImgDirPath = path.join(OLD_IMG_DIR, 'talks', basename);
    if (await fs.pathExists(oldImgDirPath)) {
      const newImgDirPath = path.join(PUBLIC_DIR, 'img', 'talks', basename);
      await fs.ensureDir(newImgDirPath);
      await fs.copy(oldImgDirPath, newImgDirPath);
      
      const imageFiles = await fs.readdir(oldImgDirPath);
      imageFiles.sort(); 
      newData.slideImages = imageFiles.map(file => `/img/talks/${basename}/${file}`);
    }
  }
}

/**
 * Generates a redirect rule string for a given file.
 * @param {string} oldFilePath - The relative path of the old file from OLD_CONTENT_DIR.
 * @returns {string|null} A redirect rule string or null if not applicable.
 */
function generateRedirectRule(oldFilePath) {
  // Ignore files that are not in a collection directory or are index files.
  if (!oldFilePath.match(/\/(writing|talks|teaching)\/) || path.basename(oldFilePath).startsWith('index.')) {
    return null;
  }

  const oldUrl = `/${oldFilePath.replace(/\\/g, '/').replace(/\.jade$/, '.html')}`;
  
  let collection = '';
  if (oldFilePath.includes('/writing/')) {
    collection = 'writing';
  } else if (oldFilePath.includes('/talks/')) {
    collection = 'talks';
  } else if (oldFilePath.includes('/teaching/')) {
    collection = 'teaching';
  }

  const slug = path.basename(oldFilePath, path.extname(oldFilePath)).replace(/\.html$/, '');
  const newUrl = `/${collection}/${slug}/`;

  return `${oldUrl}    ${newUrl}    301`;
}

/**
 * Writes the redirects to the _redirects file.
 * @param {string[]} redirectRules - An array of redirect rules.
 */
async function writeRedirectsFile(redirectRules) {
  const redirectsFilePath = path.join(PUBLIC_DIR, '_redirects');
  await fs.ensureDir(PUBLIC_DIR);
  await fs.writeFile(redirectsFilePath, redirectRules.join('\n'));
  console.log(`Generated ${redirectRules.length} redirects in ${redirectsFilePath}`);
}
