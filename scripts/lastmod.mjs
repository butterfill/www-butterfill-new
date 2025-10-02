import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

// Simple in-memory cache to avoid repeated git/fs lookups per file
const fileDateCache = new Map();

function tryGitIsoDate(filePath) {
  try {
    const out = execSync(`git log -1 --format=%cI -- ${JSON.stringify(filePath)}`,
      { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
    return out || null;
  } catch {
    return null;
  }
}

function tryFsIsoDate(filePath) {
  try {
    const stat = fs.statSync(filePath);
    return stat.mtime.toISOString();
  } catch {
    return null;
  }
}

function extractFrontmatterFallback(filePath) {
  try {
    const src = fs.readFileSync(filePath, 'utf8');
    // naive frontmatter detection
    if (!src.startsWith('---')) return null;
    const end = src.indexOf('\n---', 3);
    const fm = end !== -1 ? src.slice(0, end) : src;
    // Try updatedDate first
    let m = fm.match(/\bupdatedDate:\s*([^\n]+)/);
    if (m) {
      const d = new Date(m[1].trim());
      if (!isNaN(+d)) return d.toISOString();
    }
    // Then pubDate
    m = fm.match(/\bpubDate:\s*([^\n]+)/);
    if (m) {
      const d = new Date(m[1].trim());
      if (!isNaN(+d)) return d.toISOString();
    }
    // Then year
    m = fm.match(/\byear:\s*(\d{4})/);
    if (m) {
      const d = new Date(`${m[1]}-12-31T00:00:00Z`);
      if (!isNaN(+d)) return d.toISOString();
    }
    return null;
  } catch {
    return null;
  }
}

function dateForFile(filePath) {
  if (!filePath) return null;
  const abs = path.resolve(process.cwd(), filePath);
  if (fileDateCache.has(abs)) return fileDateCache.get(abs);
  const gitDate = tryGitIsoDate(abs);
  if (gitDate) {
    fileDateCache.set(abs, gitDate);
    return gitDate;
  }
  const fsDate = tryFsIsoDate(abs);
  if (fsDate) {
    fileDateCache.set(abs, fsDate);
    return fsDate;
  }
  const fmDate = extractFrontmatterFallback(abs);
  if (fmDate) {
    fileDateCache.set(abs, fmDate);
    return fmDate;
  }
  return null;
}

function ensureTrailingSlash(p) {
  return p.endsWith('/') ? p : `${p}/`;
}

function stripTrailingSlash(p) {
  return p !== '/' && p.endsWith('/') ? p.slice(0, -1) : p;
}

function fileCandidatesForPathname(pathname) {
  const p = ensureTrailingSlash(pathname);
  const candidates = [];

  // Static pages
  if (p === '/') {
    candidates.push('src/pages/index.astro');
  }
  if (p === '/hashme-q3/') {
    candidates.push('src/pages/hashme-q3.astro');
  }

  // Section indexes
  if (p === '/writing/') candidates.push('src/pages/writing/index.astro');
  if (p === '/talks/') candidates.push('src/pages/talks/index.astro');
  if (p === '/teaching/') candidates.push('src/pages/teaching/index.astro');

  // Dynamic content: writing
  if (p.startsWith('/writing/') && p !== '/writing/') {
    const slug = stripTrailingSlash(p.replace(/^\/writing\//, ''));
    candidates.push(`src/content/writing/${slug}.md`);
    candidates.push(`src/content/writing/${slug}.mdx`);
    // Optional full-text mirror
    candidates.push(`public/md/${slug}.md`);
  }

  // Dynamic content: talks
  if (p.startsWith('/talks/') && p !== '/talks/') {
    const slug = stripTrailingSlash(p.replace(/^\/talks\//, ''));
    candidates.push(`src/content/talks/${slug}.md`);
    candidates.push(`src/content/talks/${slug}.mdx`);
  }

  // Dynamic content: teaching
  if (p.startsWith('/teaching/') && p !== '/teaching/') {
    const slug = stripTrailingSlash(p.replace(/^\/teaching\//, ''));
    candidates.push(`src/content/teaching/${slug}.md`);
    candidates.push(`src/content/teaching/${slug}.mdx`);
  }

  // Fallback: if none determined, map to a pages .astro with similar path
  if (candidates.length === 0) {
    // try a direct mapping to src/pages
    const rel = stripTrailingSlash(p);
    if (rel && rel !== '/') {
      candidates.push(`src/pages${rel}.astro`);
      candidates.push(`src/pages${rel}/index.astro`);
    }
  }

  return candidates;
}

export async function resolveLastmodForUrl(urlPathname) {
  try {
    const candidates = fileCandidatesForPathname(urlPathname);
    const dates = candidates
      .map(dateForFile)
      .filter(Boolean)
      .map((s) => new Date(s))
      .filter((d) => !isNaN(+d));
    if (dates.length > 0) {
      const max = new Date(Math.max.apply(null, dates));
      return max.toISOString();
    }
  } catch {
    // ignore and fall through
  }
  // Last resort: build time
  return new Date().toISOString();
}

export function __test_only__fileCandidatesForPathname(p) {
  return fileCandidatesForPathname(p);
}

