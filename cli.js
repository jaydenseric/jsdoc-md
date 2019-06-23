#!/usr/bin/env node

const yargs = require('yargs')
const DEFAULTS = require('./lib/defaults')
const jsdocMd = require('./lib/jsdocMd')

const { argv } = yargs
  .options({
    'source-glob': {
      alias: 's',
      demandOption: true,
      default: DEFAULTS.sourceGlob,
      describe: 'JSDoc source file glob pattern.',
      type: 'string',
      implies: ['m', 't']
    },
    'markdown-path': {
      alias: 'm',
      demandOption: true,
      default: DEFAULTS.markdownPath,
      describe: 'Path to the markdown file for docs insertion.',
      type: 'string',
      implies: ['s', 't']
    },
    'target-heading': {
      alias: 't',
      demandOption: true,
      default: DEFAULTS.targetHeading,
      describe: 'Markdown file heading to insert docs under.',
      type: 'string',
      implies: ['s', 'm']
    }
  })
  .example(
    '$0',
    `Document .mjs and .js files under the “${DEFAULTS.markdownPath}” “${DEFAULTS.targetHeading}” heading.`
  )
  .example(
    '$0 -s src/**/*.mjs -m README.md -t Docs',
    'Document “src” directory .mjs files under the “README.md” “Docs” heading.'
  )
  .version()
  .describe('version', 'Show npm package version.')
  .alias('version', 'v')
  .help()
  .describe('help', 'Show help.')
  .alias('help', 'h')

const { sourceGlob, markdownPath, targetHeading } = argv

jsdocMd({ sourceGlob, markdownPath, targetHeading })
