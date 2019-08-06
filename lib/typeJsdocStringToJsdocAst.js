const doctrine = require('doctrine')

/**
 * Converts a JSDoc type string to a JSDoc AST.
 * @kind function
 * @name typeJsdocStringToJsdocAst
 * @param {string} type JSDoc type.
 * @param {boolean} [isParam] Is the type a parameter, which supports more features including optional (`*=`) and rest (`...*`) parameters.
 * @returns {object} JSDoc AST.
 * @ignore
 */
const typeJsdocStringToJsdocAst = (type, isParam) => {
  const jsdocAst = doctrine.parse(
    isParam ? `@param {${type}} a` : `@type {${type}}`
  )
  if (!jsdocAst.tags.length) throw new Error(`Invalid JSDoc type “${type}”.`)
  return jsdocAst.tags[0].type
}

module.exports = typeJsdocStringToJsdocAst
