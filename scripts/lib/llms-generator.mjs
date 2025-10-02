import fs from 'fs-extra';
import path from 'path';
import yaml from 'yaml';

const SITE_METADATA = {
  siteName: "Stephen Butterfill's Personal Academic Website",
  author: 'Stephen Butterfill',
};

const MAX_LLMS_CHAR_LENGTH = 65000; // ≈16k tokens buffer
const SUMMARY_CHAR_LIMIT = 360;

const COLLECTIONS = [
  { name: 'writing', type: 'publication' },
  { name: 'talks', type: 'talk' },
  { name: 'teaching', type: 'teaching' },
];

const TYPE_LABELS = {
  publication: 'Publication',
  talk: 'Talk',
  teaching: 'Teaching',
};

export async function generateLlmsBundle({
  rootDir = process.cwd(),
  outputDir = path.join(rootDir, 'public', 'llms'),
  writeFiles = true,
  siteMetadata = SITE_METADATA,
} = {}) {
  const items = [];

  for (const collection of COLLECTIONS) {
    const collectionDir = path.join(rootDir, 'src', 'content', collection.name);
    if (!(await fs.pathExists(collectionDir))) {
      continue;
    }
    const collectionItems = await readMarkdownCollection(collectionDir, {
      collection: collection.name,
      type: collection.type,
      root: collectionDir,
    });
    items.push(...collectionItems);
  }

  items.sort((a, b) => a.fullSlug.localeCompare(b.fullSlug));

  const processedItems = items.map(processItem);

  const { llmsText, entries: llmsEntries } = buildLlmsText(processedItems, {
    siteMetadata,
  });

  if (llmsText.length > MAX_LLMS_CHAR_LENGTH) {
    const approxTokens = Math.round(llmsText.length / 4);
    throw new Error(
      `Generated llms.txt would be ~${approxTokens} tokens (${llmsText.length} chars), exceeding the ${Math.round(
        MAX_LLMS_CHAR_LENGTH / 4
      )} token guidance. Adjust summary limits or content.`
    );
  }

  const contentFiles = processedItems
    .filter((item) => item.longForm.content)
    .map((item) => buildContentFileDescriptor(item));

  const metadata = processedItems.map((item) => buildMetadataEntry(item));

  const bundle = {
    llmsText,
    metadata,
    llmsEntries,
    contentFiles,
    counts: {
      total: processedItems.length,
      byType: countBy(processedItems, (item) => item.type),
      withContent: contentFiles.length,
    },
  };

  if (!writeFiles) {
    return bundle;
  }

  await writeBundle({
    bundle,
    rootDir,
    outputDir,
  });

  return bundle;
}

async function writeBundle({ bundle, rootDir, outputDir }) {
  const llmsTxtPath = path.join(rootDir, 'public', 'llms.txt');
  await fs.ensureDir(path.dirname(llmsTxtPath));
  await fs.writeFile(llmsTxtPath, bundle.llmsText, 'utf8');

  await fs.ensureDir(outputDir);
  await fs.emptyDir(outputDir);
  const contentDir = path.join(outputDir, 'content');
  await fs.ensureDir(contentDir);

  const metadataPath = path.join(outputDir, 'metadata.json');
  await fs.writeJson(metadataPath, bundle.metadata, { spaces: 2 });

  for (const file of bundle.contentFiles) {
    const filePath = path.join(outputDir, file.relativePathOnSite);
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, file.contents, 'utf8');
  }

  const indexPath = path.join(outputDir, 'index.json');
  const indexPayload = Object.fromEntries(
    bundle.metadata.map((entry) => [entry.slug, {
      title: entry.title,
      type: entry.type,
      url: entry.url,
      summary: entry.summary,
      contentPath: entry.contentPath,
    }])
  );
  await fs.writeJson(indexPath, indexPayload, { spaces: 2 });
}

function buildContentFileDescriptor(item) {
  const relativePathOnSite = path.posix.join('content', item.collection, `${item.slug}.md`);
  const frontmatterObject = {
    title: item.title,
    authors: item.authors,
    type: TYPE_LABELS[item.type] || item.type,
    collection: item.collection,
    slug: item.fullSlug,
    url: item.url,
    summary: item.summary,
    year: item.year ?? undefined,
    pubDate: item.pubDate ?? undefined,
    event: item.event ?? undefined,
    term: item.term ?? undefined,
    place: item.place ?? undefined,
    featured: item.flags.featured || undefined,
    forthcoming: item.flags.forthcoming || undefined,
    source: item.source,
  };

  const frontmatter = yaml.stringify(removeUndefined(frontmatterObject)).trimEnd();
  const contents = `---\n${frontmatter}\n---\n\n${item.longForm.content.trim()}\n`;

  return {
    relativePathOnSite,
    contents,
  };
}

function buildMetadataEntry(item) {
  return removeUndefined({
    slug: item.fullSlug,
    collection: item.collection,
    type: TYPE_LABELS[item.type] || item.type,
    title: item.title,
    authors: item.authors,
    year: item.year ?? undefined,
    pubDate: item.pubDate ?? undefined,
    event: item.event ?? undefined,
    term: item.term ?? undefined,
    place: item.place ?? undefined,
    featured: item.flags.featured || undefined,
    forthcoming: item.flags.forthcoming || undefined,
    summary: item.summary,
    url: item.url,
    contentPath: item.longForm.content
      ? path.posix.join('llms', 'content', item.collection, `${item.slug}.md`)
      : null,
    source: item.source,
  });
}

function buildLlmsText(items, { siteMetadata }) {
  const entries = items.map((item) => buildLlmsEntry(item));
  const header = [
    `Site: ${siteMetadata.siteName}`,
    `Author: ${siteMetadata.author}`,
    `Generated: ${new Date().toISOString()}`,
    `Items: ${items.length}`,
    '',
    '---',
    '',
  ].join('\n');

  return {
    llmsText: header + entries.join('\n'),
    entries,
  };
}

function buildLlmsEntry(item) {
  const lines = [
    `Title: ${item.title}`,
    `Authors: ${item.authors || 'Unknown'}`,
    `Type: ${TYPE_LABELS[item.type] || item.type}`,
    `URL: ${item.url}`,
  ];

  if (item.year) {
    lines.push(`Year: ${item.year}`);
  }

  if (item.pubDate) {
    lines.push(`Date: ${item.pubDate}`);
  }

  if (item.event) {
    lines.push(`Event: ${item.event}`);
  }

  if (item.term) {
    lines.push(`Term: ${item.term}`);
  }

  if (item.place) {
    lines.push(`Place: ${item.place}`);
  }

  lines.push('', `Summary: ${item.summary}`, '', '---', '');

  return lines.join('\n');
}

async function readMarkdownCollection(dir, { collection, type, root }) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const items = [];

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const nested = await readMarkdownCollection(fullPath, { collection, type, root });
      items.push(...nested);
    } else if (entry.name.endsWith('.md')) {
      const fileContent = await fs.readFile(fullPath, 'utf8');
      const { data, body } = parseFrontmatter(fileContent);
      const relativePath = path.relative(root, fullPath).replace(/\\/g, '/');
      const slug = relativePath.replace(/\.md$/, '');
      const collectionSlug = `${collection}/${slug}`;
      items.push({
        collection,
        type,
        relativePath,
        slug,
        fullSlug: collectionSlug,
        sourcePath: fullPath,
        data: data || {},
        body: body || '',
      });
    }
  }

  return items;
}

function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  if (!match) {
    return { data: {}, body: content };
  }

  const [, frontmatterStr, body] = match;
  let data = {};
  try {
    data = yaml.parse(frontmatterStr) || {};
  } catch (error) {
    console.warn('Failed to parse frontmatter:', error.message);
  }
  return { data, body };
}

function processItem(rawItem) {
  const title = rawItem.data.title || 'Untitled';
  const authors = rawItem.data.authors || rawItem.data.presenter || '';

  const { year, pubDate } = resolveYearAndDate(rawItem);

  const longForm = deriveLongFormContent(rawItem.body);
  const summary = deriveSummary({
    data: rawItem.data,
    body: rawItem.body,
    longForm,
    title,
  });

  const item = {
    ...rawItem,
    title,
    authors,
    year,
    pubDate,
    event: rawItem.data.event || undefined,
    term: rawItem.data.term || undefined,
    place: rawItem.data.place || rawItem.data.address || undefined,
    url: buildRelativeUrl(rawItem.collection, rawItem.slug),
    summary,
    longForm,
    flags: {
      featured: Boolean(rawItem.data.featured),
      forthcoming: Boolean(rawItem.data.isForthcoming),
    },
    source: path.relative(process.cwd(), rawItem.sourcePath).replace(/\\/g, '/'),
  };

  if (!item.longForm.content.trim()) {
    item.longForm.content = '';
  }

  item.summary = limitText(item.summary, SUMMARY_CHAR_LIMIT);

  return item;
}

function deriveLongFormContent(body) {
  const fulltextBlock = extractFulltextBlock(body);

  if (fulltextBlock) {
    const markdown = htmlToMarkdown(fulltextBlock.inner);
    return {
      content: markdown.trim(),
      source: 'fulltext-html',
    };
  }

  const trimmed = body.trim();
  return {
    content: trimmed,
    source: 'markdown-body',
  };
}

function deriveSummary({ data, body, longForm, title }) {
  const candidateTexts = [];

  if (typeof data.abstract === 'string' && data.abstract.trim().length > 0) {
    candidateTexts.push(data.abstract);
  }

  const markdownAbstract = extractMarkdownSection(longForm.content, 'abstract');
  if (markdownAbstract) {
    candidateTexts.push(markdownAbstract);
  }

  const preFulltext = extractPreFulltextMarkdown(body);
  if (preFulltext) {
    candidateTexts.push(preFulltext);
  }

  candidateTexts.push(longForm.content);

  const normalizedTitle = markdownToPlainText(title || '').toLowerCase();

  for (const candidate of candidateTexts) {
    const summary = summariseMarkdown(candidate, { title });
    if (summary) {
      const normalizedSummary = markdownToPlainText(summary)
        .replace(/[.!?\s]+$/g, '')
        .toLowerCase();
      if (normalizedTitle && normalizedSummary === normalizedTitle) {
        continue;
      }
      return summary;
    }
  }

  return 'Summary not available.';
}

function summariseMarkdown(markdown, { title } = {}) {
  if (!markdown) return '';
  const plain = markdownToPlainText(markdown);
  if (!plain) return '';

  let workingText = plain;
  if (title) {
    const normalizedTitle = markdownToPlainText(title)
      .replace(/[\s]+/g, ' ')
      .trim();
    if (normalizedTitle) {
      const titlePattern = new RegExp(`^${escapeRegex(normalizedTitle)}[.!?\s]*`, 'i');
      const stripped = workingText.replace(titlePattern, '').trim();
      if (stripped) {
        workingText = stripped;
      }
    }
  }

  workingText = workingText.replace(/^Abstract[:\s-]*/i, '').trim() || workingText;
  workingText = workingText.replace(/^Summary[:\s-]*/i, '').trim() || workingText;

  const sentences = splitSentences(workingText);
  if (sentences.length === 0) {
    return limitText(workingText || plain, SUMMARY_CHAR_LIMIT);
  }

  let summary = '';
  for (const sentence of sentences) {
    const candidate = summary ? `${summary} ${sentence}` : sentence;
    if (candidate.length > SUMMARY_CHAR_LIMIT) {
      if (!summary) {
        return limitText(sentence, SUMMARY_CHAR_LIMIT);
      }
      return summary.trim();
    }
    summary = candidate;
    if (summary.length >= SUMMARY_CHAR_LIMIT || summary.split('.').length > 4) {
      return summary.trim();
    }
  }

  return summary.trim();
}

function limitText(text, limit) {
  if (text.length <= limit) return text.trim();
  const slice = text.slice(0, limit);
  const lastStop = Math.max(slice.lastIndexOf('.'), slice.lastIndexOf('!'), slice.lastIndexOf('?'));
  if (lastStop > limit * 0.6) {
    return slice.slice(0, lastStop + 1).trim();
  }
  return `${slice.trim()}…`;
}

function splitSentences(text) {
  const matches = text.match(/[^.!?]+[.!?]+/g);
  if (!matches) {
    return [text.trim()].filter(Boolean);
  }
  return matches.map((sentence) => sentence.trim()).filter(Boolean);
}

function extractMarkdownSection(markdown, heading) {
  if (!markdown) return '';
  const pattern = new RegExp(
    `(^|\n)#{1,6}\\s*${escapeRegex(heading)}\\b[\s\S]*?(\n#{1,6}\\s|$)`,
    'i'
  );
  const match = markdown.match(pattern);
  if (!match) return '';
  const section = match[0]
    .replace(new RegExp(`^#{1,6}\\s*${escapeRegex(heading)}\\b`, 'i'), '')
    .trim();
  return section;
}

function extractPreFulltextMarkdown(body) {
  const fulltextMatch = body.indexOf('<div class="fulltext"');
  if (fulltextMatch <= 0) return '';
  return body.slice(0, fulltextMatch).trim();
}

function resolveYearAndDate(item) {
  if (item.type === 'talk') {
    if (item.data.pubDate) {
      const date = toIsoDate(item.data.pubDate);
      return {
        year: date ? date.slice(0, 4) : undefined,
        pubDate: date,
      };
    }
    return { year: undefined, pubDate: undefined };
  }

  if (item.type === 'teaching') {
    return {
      year: item.data.year || undefined,
      pubDate: undefined,
    };
  }

  const year = item.data.year || undefined;
  return { year, pubDate: undefined };
}

function toIsoDate(input) {
  if (!input) return undefined;
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString().slice(0, 10);
}

function buildRelativeUrl(collection, slug) {
  return `/${collection}/${slug}/`;
}

function extractFulltextBlock(body) {
  const startMatch = body.match(/<div\s+class="fulltext"[^>]*>/i);
  if (!startMatch) {
    return null;
  }

  const startIndex = startMatch.index;
  const openingTag = startMatch[0];
  const searchStart = startIndex + openingTag.length;

  const pattern = /<div\b[^>]*>|<\/div>/gi;
  pattern.lastIndex = searchStart;

  let depth = 1;
  let match;
  while ((match = pattern.exec(body)) !== null) {
    if (match[0].startsWith('<div')) {
      depth += 1;
    } else {
      depth -= 1;
      if (depth === 0) {
        const endIndex = match.index;
        const closingLength = match[0].length;
        const inner = body.slice(searchStart, endIndex);
        return {
          inner,
          startIndex,
          endIndex: endIndex + closingLength,
        };
      }
    }
  }

  return null;
}

function htmlToMarkdown(html) {
  if (!html) return '';
  let text = html;

  text = text.replace(/<!--([\s\S]*?)-->/g, '');
  text = text.replace(/<(script|style|svg|math)[^>]*>[\s\S]*?<\/\1>/gi, '');

  text = convertLists(text);

  text = text.replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi, (_, level, content) => {
    const prefix = '#'.repeat(Number(level));
    return `\n${prefix} ${htmlInlineToMarkdown(content).trim()}\n`;
  });

  text = text.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, content) => {
    const inner = htmlInlineToMarkdown(content).trim();
    return inner ? `\n\n${inner}\n\n` : '\n\n';
  });

  text = text.replace(/<br\s*\/?\s*>/gi, '\n');
  text = text.replace(/<div[^>]*>([\s\S]*?)<\/div>/gi, (_, content) => `\n${htmlInlineToMarkdown(content)}\n`);

  text = htmlInlineToMarkdown(text);
  text = text.replace(/\n{3,}/g, '\n\n');

  return text.trim();
}

function convertLists(html) {
  return html.replace(/<(ul|ol)[^>]*>([\s\S]*?)<\/\1>/gi, (_, tag, inner) => {
    const isOrdered = tag.toLowerCase() === 'ol';
    let index = 0;
    const items = [];
    inner.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (match, content) => {
      const bullet = isOrdered ? `${++index}.` : '-';
      const innerText = htmlInlineToMarkdown(content).trim();
      if (innerText) {
        items.push(`${bullet} ${innerText}`);
      }
      return '';
    });
    return `\n${items.join('\n')}\n`;
  });
}

function htmlInlineToMarkdown(input) {
  if (!input) return '';
  let text = input;

  text = text.replace(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_, href, label) => {
    const trimmedHref = href.trim();
    const renderedLabel = htmlInlineToMarkdown(label).trim() || trimmedHref;
    return `${renderedLabel} (${trimmedHref})`;
  });

  text = text.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, (_, content) => `**${htmlInlineToMarkdown(content)}**`);
  text = text.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, (_, content) => `**${htmlInlineToMarkdown(content)}**`);
  text = text.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, (_, content) => `*${htmlInlineToMarkdown(content)}*`);
  text = text.replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, (_, content) => `*${htmlInlineToMarkdown(content)}*`);
  text = text.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_, content) => `\`${htmlInlineToMarkdown(content)}\``);
  text = text.replace(/<sup[^>]*>([\s\S]*?)<\/sup>/gi, (_, content) => `^${htmlInlineToMarkdown(content)}^`);
  text = text.replace(/<sub[^>]*>([\s\S]*?)<\/sub>/gi, (_, content) => `~${htmlInlineToMarkdown(content)}~`);

  text = text.replace(/<[^>]+>/g, '');

  return decodeHtmlEntities(text);
}

function decodeHtmlEntities(text) {
  if (!text) return '';
  return text.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (_, entity) => {
    if (entity[0] === '#') {
      const isHex = entity[1]?.toLowerCase() === 'x';
      const code = isHex ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
      if (Number.isFinite(code)) {
        return String.fromCodePoint(code);
      }
      return '';
    }
    const map = {
      amp: '&',
      lt: '<',
      gt: '>',
      quot: '"',
      apos: "'",
      nbsp: ' ',
      mdash: '—',
      ndash: '–',
      hellip: '…',
    };
    return map[entity.toLowerCase()] || '';
  });
}

function markdownToPlainText(markdown) {
  if (!markdown) return '';
  let text = markdown;
  text = text.replace(/```[\s\S]*?```/g, '');
  text = text.replace(/`([^`]+)`/g, '$1');
  text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, '');
  text = text.replace(/\[[^\]]*\]\(([^)]+)\)/g, (_, url) => ` (${url})`);
  text = text.replace(/[*_~`]/g, '');
  text = text.replace(/^#{1,6}\s*/gm, '');
  text = text.replace(/^>\s*/gm, '');
  text = text.replace(/\r/g, '');
  text = text.replace(/\n{2,}/g, '\n');
  text = text.replace(/\n/g, ' ');
  text = text.replace(/\s+/g, ' ');
  return decodeHtmlEntities(text).trim();
}

function countBy(items, keyFn) {
  return items.reduce((acc, item) => {
    const key = keyFn(item);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function removeUndefined(object) {
  return Object.fromEntries(
    Object.entries(object).filter(([, value]) => value !== undefined && value !== '')
  );
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function __testables() {
  return {
    htmlToMarkdown,
    markdownToPlainText,
    summariseMarkdown,
    extractFulltextBlock,
    deriveLongFormContent,
  };
}
