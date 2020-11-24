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
 * @param {string} md Markdown content.
 * @param {object[]} [members] Outline members.
 * @returns {object} Markdown AST.
 * @ignore
 */
module.exports = function mdToMdAst(md, members) {
  return unified()
    .use(parse)
    .use(gfm)
    .parse(replaceJsdocLinks(unescapeJsdoc(md), members)).children;
};
