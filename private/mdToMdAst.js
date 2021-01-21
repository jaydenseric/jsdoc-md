'use strict';

const gfm = require('remark-gfm');
const parse = require('remark-parse');
const unified = require('unified');
const removePositionData = require('unist-util-remove-position');
const replaceJsdocLinks = require('./replaceJsdocLinks');
const unescapeJsdoc = require('./unescapeJsdoc');

/**
 * Converts JSDoc markdown content to markdown AST.
 * @kind function
 * @name mdToMdAst
 * @param {string} markdown Markdown content.
 * @param {Array<JsdocMember>} members Outlined JSDoc members.
 * @returns {object} Markdown AST.
 * @ignore
 */
module.exports = function mdToMdAst(markdown, members) {
  if (typeof markdown !== 'string')
    throw new TypeError('First argument `markdown` must be a string.');

  if (!Array.isArray(members))
    throw new TypeError('Second argument `members` must be an array.');

  // The AST nodes from a parsed markdown string contain `position` data
  // (https://github.com/syntax-tree/unist#position). This data should be
  // removed because it will no longer be correct once these AST nodes are
  // inserted into another AST. While leaving the incorrect data in place is
  // technically more efficient and harmless to the public API, it bloats
  // private test snapshots.
  return removePositionData(
    unified()
      .use(parse)
      .use(gfm)
      .parse(replaceJsdocLinks(unescapeJsdoc(markdown), members)),

    // Delete the `position` properties from nodes instead of only replacing
    // their values with `undefined`.
    true
  ).children;
};
