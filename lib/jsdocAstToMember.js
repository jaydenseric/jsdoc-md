const getJsdocAstTag = require('./getJsdocAstTag')
const deconstructJsdocNamepath = require('./deconstructJsdocNamepath')

/**
 * Converts a Doctrine JSDoc AST to an outline member object.
 * @kind function
 * @name jsdocAstToMember
 * @param {Object} ast Doctrine JSDoc AST.
 * @returns {Object} Outline member.
 * @ignore
 */
const jsdocAstToMember = ast => {
  // Exclude ignored symbol.
  if (getJsdocAstTag(ast.tags, 'ignore')) return

  const { kind } = getJsdocAstTag(ast.tags, 'kind') || {}
  // Ignore symbol without a kind.
  if (!kind) return

  const { name: namepath } = getJsdocAstTag(ast.tags, 'name') || {}
  // Ignore symbol without a name.
  if (!namepath) return

  return {
    kind,
    namepath,
    ...deconstructJsdocNamepath(namepath),
    ...ast
  }
}

module.exports = jsdocAstToMember
