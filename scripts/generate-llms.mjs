import fs from 'fs-extra';
import path from 'path';
import yaml from 'yaml';

// Function to parse frontmatter and content from markdown files
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { data: {}, body: content };
  }
  
  const [, frontmatterStr, body] = match;
  const data = yaml.parse(frontmatterStr);
  
  return { data, body };
}

// Function to recursively read all markdown files from a directory
async function readMarkdownFiles(dir) {
  const items = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Recursively read subdirectories
      const subItems = await readMarkdownFiles(fullPath);
      items.push(...subItems);
    } else if (entry.name.endsWith('.md')) {
      const content = await fs.readFile(fullPath, 'utf-8');
      const { data, body } = parseFrontmatter(content);
      items.push({ data, body, type: path.basename(dir) === 'writing' ? 'writing' : 'talk' });
    }
  }
  
  return items;
}

// Read all writing content files
const writingDir = path.join(process.cwd(), 'src/content/writing');
const writingItems = await readMarkdownFiles(writingDir);

// Read all talks content files
const talksDir = path.join(process.cwd(), 'src/content/talks');
const talkItems = await readMarkdownFiles(talksDir);

// Combine all items
const allItems = [...writingItems, ...talkItems];

let fullText = "Site: Stephen Butterfill's Personal Academic Website\nAuthor: Stephen Butterfill\n\n---\n\n";

for (const item of allItems) {
  // Use the raw markdown body
  const cleanText = item.body;

  fullText += `Title: ${item.data.title || 'Untitled'}\n`;
  fullText += `Authors: ${item.data.authors || 'Unknown'}\n`;
  
  // Handle different date/year formats for writing vs talks
  if (item.type === 'talk' && item.data.pubDate) {
    const year = new Date(item.data.pubDate).getFullYear();
    fullText += `Year: ${year}\n`;
    if (item.data.event) {
      fullText += `Event: ${item.data.event}\n`;
    }
  } else if (item.data.year) {
    fullText += `Year: ${item.data.year}\n`;
    if (item.data.journal) {
      fullText += `Journal: ${item.data.journal}\n`;
    }
  } else {
    fullText += `Year: Unknown\n`;
  }
  
  fullText += `Type: ${item.type === 'talk' ? 'Talk' : 'Publication'}\n\n`;
  fullText += `${cleanText}\n\n---\n\n`;
}

await fs.writeFile('public/llms.txt', fullText);
console.log('Successfully generated llms.txt');