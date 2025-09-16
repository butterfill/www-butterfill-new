#!/usr/bin/env node

// Standalone CLI for filtering BibTeX entries using the library function in bib-filter.js
// This CLI avoids external argument parsing dependencies and provides a clear help page.

const fs = require('fs');
const path = require('path');
const os = require('os');
// Note: we lazy-require the library only when needed so that `--help` works even if
// optional dependencies of the library are not installed.
let filterBibtex = null;

const DEFAULT_BIB = '~/endnote/phd_biblio.bib';
const DEFAULT_KEYWORD = 'butterfill';

function expandTilde(p) {
  if (!p) return p;
  if (p === '~') return os.homedir();
  if (p.startsWith('~/')) return path.join(os.homedir(), p.slice(2));
  return p;
}

function printHelp() {
  const help = `
Usage: bib-filter [options]

Filter a .bib file to include only entries where the author field contains the
specified keyword (case-insensitive). Excludes entries of type @conference and
@phdthesis, and excludes entries whose year field contains 'submitted',
'progress' or 'preparation' (case-insensitive).

Options:
  -b, --bib <path>       Path to the .bib file
                         (default: ${DEFAULT_BIB})
  -k, --keyword <word>   Filter word to search for in the author field
                         (default: ${DEFAULT_KEYWORD})
  -K, --keys             Output only citation keys, one per line
  -h, --help             Show this help message and exit

Examples:
  bib-filter --bib ~/endnote/phd_biblio.bib --keyword butterfill
  bib-filter -b ./library.bib -k smith
  bib-filter -K              # print only citation keys for the default inputs
  bib-filter                 # uses defaults: ${DEFAULT_BIB} and "${DEFAULT_KEYWORD}"
`;
  process.stdout.write(help);
}

function parseArgs(argv) {
  const args = { bib: DEFAULT_BIB, keyword: DEFAULT_KEYWORD, keysOnly: false, help: false };
  const list = argv.slice(2);
  for (let i = 0; i < list.length; i++) {
    const cur = list[i];
    switch (cur) {
      case '-h':
      case '--help':
        args.help = true;
        break;
      case '-b':
      case '--bib':
        if (i + 1 >= list.length) {
          console.error('Error: Missing value for ' + cur);
          process.exit(2);
        }
        args.bib = list[++i];
        break;
      case '-k':
      case '--keyword':
        if (i + 1 >= list.length) {
          console.error('Error: Missing value for ' + cur);
          process.exit(2);
        }
        args.keyword = list[++i];
        break;
      case '-K':
      case '--keys':
        args.keysOnly = true;
        break;
      default:
        if (cur.startsWith('-')) {
          console.error(`Error: Unknown option ${cur}`);
          process.exit(2);
        } else {
          // Allow a positional .bib file as a convenience
          args.bib = cur;
        }
    }
  }
  return args;
}

(function main() {
  const argv = parseArgs(process.argv);
  if (argv.help) {
    printHelp();
    process.exit(0);
  }

  const bibPath = expandTilde(argv.bib);

  try {
    // Lazy load here so help works even if dependencies for the library aren't installed
    if (!filterBibtex) {
      ({ filterBibtex } = require('./bib-filter'));
    }
    const bibContent = fs.readFileSync(bibPath, 'utf8');

    if (argv.keysOnly) {
      // Use the library to filter to matching entries, then parse to extract citation keys
      const filteredBibtex = filterBibtex(bibContent, argv.keyword);
      const bibtexParse = require('@orcid/bibtex-parse-js');
      const json = bibtexParse.toJSON(filteredBibtex);
      const keys = json.map(e => e.citationKey).filter(Boolean);
      process.stdout.write(keys.join('\n'));
      if (keys.length > 0) process.stdout.write('\n');
    } else {
      const output = filterBibtex(bibContent, argv.keyword);
      process.stdout.write(output);
    }
  } catch (err) {
    if (err && err.code === 'ENOENT') {
      console.error(`Error: .bib file not found at: ${bibPath}`);
    } else {
      console.error(`Error: ${err.message}`);
    }
    process.exit(1);
  }
})();
