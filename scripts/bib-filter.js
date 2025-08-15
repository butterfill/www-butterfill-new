#!/usr/bin/env node

const fs = require('fs');
const bibtexParse = require('@orcid/bibtex-parse-js');

/**
 * Filters a BibTeX string to include only entries where the author field
 * contains the given keyword (case-insensitive).
 *
 * @param {string} bibtexContent The content of the BibTeX file.
 * @param {string} keyword The keyword to search for in the author field.
 * @returns {string} A new BibTeX string containing only the matching entries.
 */
function filterBibtex(bibtexContent, keyword = 'butterfill') {
  const json = bibtexParse.toJSON(bibtexContent);
  const lowerCaseKeyword = keyword.toLowerCase();

  const filteredJson = json.filter(entry => {
    if (entry.entryTags && entry.entryTags.author) {
      return entry.entryTags.author.toLowerCase().includes(lowerCaseKeyword);
    }
    return false;
  });

  return bibtexParse.toBibtex(filteredJson, false);
}

// CLI functionality
if (require.main === module) {
  const yargs = require('yargs/yargs');
  const { hideBin } = require('yargs/helpers');

  const argv = yargs(hideBin(process.argv))
    .usage('Usage: $0 <filename> [options]')
    .demandCommand(1, 'You must provide a filename.')
    .option('keyword', {
      alias: 'k',
      describe: 'Keyword to filter authors by',
      default: 'butterfill',
      type: 'string',
    })
    .help()
    .argv;

  const filename = argv._[0];

  fs.readFile(filename, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file: ${err.message}`);
      process.exit(1);
    }

    try {
      const filteredBibtex = filterBibtex(data, argv.keyword);
      console.log(filteredBibtex);
    } catch (e) {
      console.error(`Error processing BibTeX file: ${e.message}`);
      process.exit(1);
    }
  });
}

// Export for library use
module.exports = {
  filterBibtex,
};