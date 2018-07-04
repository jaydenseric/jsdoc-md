const parse = require('remark-parse')
const unified = require('unified')

/**
 * Converts markdown text to AST.
 * @kind function
 * @name mdToMdAst
 * @param {string} md Markdown.
 * @returns {Object} Markdown AST.
 * @ignore
 */
const mdToMdAst = md =>
  unified()
    .use(parse)
    .parse(md).children

module.exports = mdToMdAst
