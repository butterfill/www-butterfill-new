#!/usr/bin/env node
import fs from 'fs-extra';
import path from 'path';
import matter from 'gray-matter';
import yaml from 'yaml';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

// Utility: read YAML-like frontmatter from .md.njk safely
async function parseFrontmatter(filePath) {
  const raw = await fs.readFile(filePath, 'utf-8');
  const parsed = matter(raw);
  return { data: parsed.data || {}, content: parsed.content || '' };
}

function toAuthorsString(authors) {
  if (Array.isArray(authors) && authors.length > 0) {
    return authors.join(' and ');
  }
  if (typeof authors === 'string' && authors.trim()) {
    return authors.trim();
  }
  return 'Stephen A. Butterfill';
}

function toISODate(value) {
  if (!value) return null;
  try {
    // Accept YYYY-MM-DD or Date object
    const d = typeof value === 'string' ? new Date(value) : value;
    if (Number.isNaN(d.getTime())) return null;
    return d.toISOString().slice(0, 10);
  } catch {
    return null;
  }
}

function talkNameFromFilename(filename) {
  // Strip extensions like .md.njk
  return filename.replace(/\.md\.njk$/i, '');
}

function computeUrls(talkName) {
  // Public URLs as per requirements
  const handoutUrl = `https://handouts.butterfill.com/assets/pdf/${talkName}_handout.pdf`;
  const externalUrl = `https://handouts.butterfill.com/docs/${talkName}/${talkName}/`;
  return { handoutUrl, externalUrl };
}

async function fileExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function loadState(statePath) {
  try {
    const txt = await fs.readFile(statePath, 'utf-8');
    return JSON.parse(txt);
  } catch {
    return { talks: {}, lastRun: null };
  }
}

async function saveState(statePath, state) {
  await fs.ensureDir(path.dirname(statePath));
  await fs.writeFile(statePath, JSON.stringify(state, null, 2));
}

function targetTalkPath(baseDir, year, talkName) {
  return path.join(baseDir, 'src/content/talks', String(year), `${talkName}.md`);
}

function previewTalkPath(previewBaseDir, year, talkName) {
  return path.join(previewBaseDir, 'src/content/talks', String(year), `${talkName}.md`);
}

function generateFrontmatter(doc) {
  const fmObj = { ...doc };
  // Render YAML with stable ordering
  const order = [
    'title',
    'authors',
    'pubDate',
    'endDate',
    'event',
    'address',
    'handoutUrl',
    'externalUrl',
    'slideImages',
    'featured',
  ];
  const sorted = {};
  for (const key of order) {
    if (fmObj[key] !== undefined) sorted[key] = fmObj[key];
  }
  for (const key of Object.keys(fmObj)) {
    if (!order.includes(key)) sorted[key] = fmObj[key];
  }
  const yamlStr = yaml.stringify(sorted).trim();
  return `---\n${yamlStr}\n---\n`;
}

async function main() {
  const argv = await yargs(hideBin(process.argv))
    .option('source-dir', {
      type: 'string',
      describe: 'Path to the talks repository',
      default: path.join(process.cwd(), '..', '..', 'talks'),
    })
    .option('target-dir', {
      type: 'string',
      describe: 'Path to the www-butterfill-new repository root',
      default: process.cwd(),
    })
    .option('dry-run', {
      type: 'boolean',
      describe: 'Preview changes without writing to src/ (default: off)',
      default: false,
    })
    .option('force', {
      type: 'boolean',
      describe: 'Force regeneration of all talks',
      default: false,
    })
    .option('verbose', {
      type: 'boolean',
      describe: 'Verbose logging output',
      default: false,
    })
    .option('preview-dir', {
      type: 'string',
      describe: 'Directory to write preview files when --dry-run is set',
      default: path.join(process.cwd(), '.import-talks-preview'),
    })
    .parse();

  const sourceDir = argv['source-dir'];
  const targetDir = argv['target-dir'];
  const dryRun = argv['dry-run'];
  const force = argv['force'];
  const verbose = argv['verbose'];
  const previewDir = argv['preview-dir'];

  const lecturesDir = path.join(sourceDir, 'rmx', 'src', 'lectures');
  const statePath = path.join(targetDir, '.cache', 'import-talks-state.json');

  if (!(await fileExists(lecturesDir))) {
    console.error(`Source lectures directory not found: ${lecturesDir}`);
    process.exit(1);
  }

  const entries = await fs.readdir(lecturesDir, { withFileTypes: true });
  const talkFiles = entries
    .filter((e) => e.isFile() && e.name.endsWith('.md.njk'))
    .map((e) => path.join(lecturesDir, e.name));

  if (talkFiles.length === 0) {
    console.log('No talks found to import.');
    return;
  }

  const state = await loadState(statePath);
  const changes = { created: [], updated: [], skipped: [], hidden: [], errors: [] };

  for (const file of talkFiles) {
    const filename = path.basename(file);
    const talkName = talkNameFromFilename(filename);
    let fm;
    try {
      ({ data: fm } = await parseFrontmatter(file));
    } catch (err) {
      changes.errors.push({ talk: talkName, reason: `Frontmatter parse failed: ${err.message}` });
      continue;
    }

    if (fm.hidden === true) {
      if (verbose) console.log(`Skipping hidden talk: ${talkName}`);
      changes.hidden.push(talkName);
      continue;
    }

    const lectureDate = toISODate(fm.lecture_date);
    if (!lectureDate) {
      changes.errors.push({ talk: talkName, reason: 'Missing or invalid lecture_date' });
      continue;
    }
    const year = new Date(lectureDate).getFullYear();

    const authorsStr = toAuthorsString(fm.authors);
    const address = typeof fm.lecture_place === 'string' ? fm.lecture_place : undefined;

    const { handoutUrl, externalUrl } = computeUrls(talkName);

    // Determine if this would be a new file in target
    const targetPath = targetTalkPath(targetDir, year, talkName);
    const isNew = !(await fileExists(targetPath));

    const frontmatterDoc = {
      title: fm.title || talkName,
      authors: authorsStr,
      pubDate: lectureDate,
      address,
      handoutUrl,
      externalUrl,
      featured: isNew ? true : undefined,
    };

    const out = generateFrontmatter(frontmatterDoc);

    // Change detection via mtime
    const stat = await fs.stat(file);
    const mtimeMs = stat.mtimeMs;
    const prev = state.talks[talkName];
    const changed = force || !prev || prev.mtimeMs !== mtimeMs;

    if (!changed) {
      changes.skipped.push(talkName);
      continue;
    }

    // When dry-run, write into preview dir to allow inspection without touching src/
    if (dryRun) {
      const previewPath = previewTalkPath(previewDir, year, talkName);
      await fs.ensureDir(path.dirname(previewPath));
      await fs.writeFile(previewPath, out, 'utf-8');
      if (isNew) changes.created.push(`${talkName} (preview)`);
      else changes.updated.push(`${talkName} (preview)`);
    } else {
      // Real write
      const realPath = targetPath;
      await fs.ensureDir(path.dirname(realPath));
      await fs.writeFile(realPath, out, 'utf-8');
      if (isNew) changes.created.push(talkName);
      else changes.updated.push(talkName);
    }

    // Update state
    state.talks[talkName] = { mtimeMs };
  }

  state.lastRun = new Date().toISOString();
  await saveState(statePath, state);

  // Summary
  console.log('Import Talks Summary');
  console.log(`  Created: ${changes.created.length}`);
  console.log(`  Updated: ${changes.updated.length}`);
  console.log(`  Skipped: ${changes.skipped.length}`);
  console.log(`  Hidden:  ${changes.hidden.length}`);
  console.log(`  Errors:  ${changes.errors.length}`);
  if (changes.errors.length && verbose) {
    for (const e of changes.errors) console.error('  Error:', e);
  }
  if (verbose) {
    if (changes.created.length) console.log('  Created items:', changes.created.join(', '));
    if (changes.updated.length) console.log('  Updated items:', changes.updated.join(', '));
    if (changes.skipped.length) console.log('  Skipped items:', changes.skipped.join(', '));
    if (changes.hidden.length) console.log('  Hidden items:', changes.hidden.join(', '));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
