'use strict';

const { readFileSync } = require('fs');
const globby = require('globby');
const codeToJsdocComments = require('../private/codeToJsdocComments');
const jsdocCommentToMember = require('../private/jsdocCommentToMember');
const mdFileReplaceSection = require('../private/mdFileReplaceSection');
const membersToMdAst = require('../private/membersToMdAst');

/**
 * Scrapes JSDoc from source files to populate a markdown file documentation
 * section. Source files are excluded via `.gitignore` files.
 * @kind function
 * @name jsdocMd
 * @param {object} [options] Options.
 * @param {string} [options.cwd] A directory path to scope the search for source and .gitignore files, defaulting to `process.cwd()`.
 * @param {string} [options.sourceGlob='**\/*.{mjs,js}'] JSDoc source file glob pattern.
 * @param {string} [options.markdownPath='readme.md'] Path to the markdown file for docs insertion.
 * @param {string} [options.targetHeading='API'] Markdown file heading to insert docs under.
 * @example <caption>Ways to `import`.</caption>
 * ```js
 * import { jsdocMd } from 'jsdoc-md';
 * ```
 *
 * ```js
 * import jsdocMd from 'jsdoc-md/public/jsdocMd.js';
 * ```
 * @example <caption>Ways to `require`.</caption>
 * ```js
 * const { jsdocMd } = require('jsdoc-md');
 * ```
 *
 * ```js
 * const jsdocMd = require('jsdoc-md/public/jsdocMd');
 * ```
 * @example <caption>Customizing all options.</caption>
 * ```js
 * const { jsdocMd } = require('jsdoc-md');
 *
 * jsdocMd({
 *   cwd: '/path/to/project',
 *   sourceGlob: 'index.mjs',
 *   markdownPath: 'README.md',
 *   targetHeading: 'Docs',
 * });
 * ```
 */
module.exports = function jsdocMd({
  cwd = process.cwd(),
  sourceGlob = '**/*.{mjs,js}',
  markdownPath = 'readme.md',
  targetHeading = 'API',
} = {}) {
  const members = [];

  for (const path of globby.sync(sourceGlob, { cwd, gitignore: true }))
    for (const jsdoc of codeToJsdocComments(
      readFileSync(path, { encoding: 'utf8' }),
      path
    )) {
      const member = jsdocCommentToMember(jsdoc);
      if (member) members.push(member);
    }

  mdFileReplaceSection({
    markdownPath,
    targetHeading,
    replacementAst: membersToMdAst(members),
  });
};
