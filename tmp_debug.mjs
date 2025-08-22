import { getCollection } from 'astro:content';

const teachingEntries = await getCollection('teaching');
console.log('Teaching entries and their slugs:');
teachingEntries.forEach(entry => {
  console.log(`${entry.slug}: ${entry.data.title}`);
});