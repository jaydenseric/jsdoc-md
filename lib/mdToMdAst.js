'use strict'

const parse = require('remark-parse')
const unified = require('unified')
const replaceJsdocLinks = require('./replaceJsdocLinks')

/**
 * Converts markdown text to AST.
 * @kind function
 * @name mdToMdAst
 * @param {string} md Markdown.
 * @param {object[]} [members] Outline members.
 * @returns {object} Markdown AST.
 * @ignore
 */
const mdToMdAst = (md, members) =>
  unified()
    .use(parse)
    .parse(replaceJsdocLinks(md, members)).children

module.exports = mdToMdAst
