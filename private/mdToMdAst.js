'use strict';

const gfm = require('remark-gfm');
const parse = require('remark-parse');
const unified = require('unified');
const replaceJsdocLinks = require('./replaceJsdocLinks');
const unescapeJsdoc = require('./unescapeJsdoc');

/**
 * Converts JSDoc markdown content to markdown AST.
 * @kind function
 * @name mdToMdAst
 * @param {string} markdown Markdown content.
 * @param {Array<object>} [members] Outlined JSDoc members.
 * @returns {object} Markdown AST.
 * @ignore
 */
module.exports = function mdToMdAst(markdown, members) {
  if (typeof markdown !== 'string')
    throw new TypeError('First argument “markdown” must be a string.');

  return unified()
    .use(parse)
    .use(gfm)
    .parse(replaceJsdocLinks(unescapeJsdoc(markdown), members)).children;
};
