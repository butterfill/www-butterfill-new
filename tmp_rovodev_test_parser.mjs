// Test script for the improved BibTeX parser
import { parseBibtex, generatePlainText } from './src/lib/citation-utils.ts';

const testBibtex = `@article{dellagatta:2017_drawn,
    author = {{della Gatta}, Francesco and Garbarini, Francesca and Rabuffetti, Marco and Vigan{\\`o}, Luca and Butterfill, Stephen A. and Sinigaglia, Corrado},
    date-added = {2017-05-13 08:42:29 +0000},
    doi = {10.1016/j.cognition.2017.04.008},
    journal = {Cognition},
    pages = {53--60},
    timestamp = {2017-05-13T08:42:05Z},
    title = {Drawn Together: {{When}} Motor Representations Ground Joint Actions},
    volume = {165},
    year = {2017}
}`;

console.log('Testing BibTeX parser...');
console.log('Input BibTeX:');
console.log(testBibtex);
console.log('\n---\n');

const parsed = parseBibtex(testBibtex);
console.log('Parsed fields:');
console.log('Title:', parsed.title);
console.log('Author:', parsed.author);
console.log('Year:', parsed.year);
console.log('Journal:', parsed.journal);
console.log('Volume:', parsed.volume);
console.log('Pages:', parsed.pages);
console.log('DOI:', parsed.doi);

console.log('\n---\n');
const plainText = generatePlainText(parsed);
console.log('Generated plain text citation:');
console.log(plainText);