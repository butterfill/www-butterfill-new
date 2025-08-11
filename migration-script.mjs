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


