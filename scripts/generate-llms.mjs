import { getCollection } from 'astro:content';
import fs from 'fs-extra';

const publications = await getCollection('writing');
let fullText = "Site: Stephen Butterfill's Personal Academic Website\nAuthor: Stephen Butterfill\n\n---\n\n";

for (const pub of publications) {
  // Use the raw markdown body instead of trying to strip HTML from the component
  const cleanText = pub.body;

  fullText += `Title: ${pub.data.title}\n`;
  fullText += `Authors: ${pub.data.authors}\n`;
  fullText += `Year: ${pub.data.year}\n\n`;
  fullText += `${cleanText}\n\n---\n\n`;
}

await fs.writeFile('public/llms.txt', fullText);
console.log('Successfully generated llms.txt');