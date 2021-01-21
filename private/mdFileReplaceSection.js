'use strict';

const { readFileSync, writeFileSync } = require('fs');
const gfm = require('remark-gfm');
const parse = require('remark-parse');
const stringify = require('remark-stringify');
const unified = require('unified');
const remarkPluginReplaceSection = require('./remarkPluginReplaceSection');
const remarkStringifyOptions = require('./remarkStringifyOptions');

/**
 * Replaces the content of a section in a markdown file.
 * @kind function
 * @name mdFileReplaceSection
 * @param {object} options Options.
 * @param {string} options.markdownPath Markdown file path.
 * @param {string} options.targetHeading Heading text of the section to replace.
 * @param {object} options.replacementAst Replacement markdown AST (with a [`root`](https://github.com/syntax-tree/mdast#root) top level type), defaulting to empty.
 * @ignore
 */
module.exports = function mdFileReplaceSection({
  markdownPath,
  targetHeading,
  replacementAst,
}) {
  if (typeof markdownPath !== 'string')
    throw new TypeError('Option `markdownPath` must be a string.');

  if (markdownPath === '')
    throw new TypeError('Option `markdownPath` must be a populated string.');

  if (typeof targetHeading !== 'string')
    throw new TypeError('Option `targetHeading` must be a string.');

  if (targetHeading === '')
    throw new TypeError('Option `targetHeading` must be a populated string.');

  if (typeof replacementAst !== 'object')
    throw new TypeError('Option `replacementAst` must be an object.');

  const fileContent = readFileSync(markdownPath, { encoding: 'utf8' });
  const newFileContent = unified()
    .use(parse)
    .use(gfm)
    .use(stringify, remarkStringifyOptions)
    .use(remarkPluginReplaceSection, { targetHeading, replacementAst })
    .processSync(fileContent)
    .toString();

  writeFileSync(markdownPath, newFileContent);
};
