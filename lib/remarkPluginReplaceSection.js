'use strict'

const mdastInject = require('mdast-util-inject')

/**
 * A remark plugin that replaces the content of a section with a particular
 * heading.
 * @kind function
 * @name remarkPluginReplaceSection
 * @param {object} [options] Options.
 * @param {string} [options.targetHeading='API'] Heading text of the section to replace.
 * @param {object} [options.replacementAst] Replacement markdown AST (with a [`root`](https://github.com/syntax-tree/mdast#root) top level type), defaulting to empty.
 * @returns {Function} Remark transform function.
 * @ignore
 */
const remarkPluginReplaceSection = ({
  targetHeading = 'API',
  replacementAst = {
    type: 'root',
    children: []
  }
} = {}) => (targetAst, file, next) => {
  mdastInject(targetHeading, targetAst, replacementAst)
    ? next()
    : next(new Error(`Missing target heading “${targetHeading}”.`))
}

module.exports = remarkPluginReplaceSection
