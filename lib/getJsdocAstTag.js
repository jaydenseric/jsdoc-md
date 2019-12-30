'use strict'

/**
 * Gets a Doctrine JSDoc AST tag.
 * @kind function
 * @name getJsdocAstTag
 * @param {object[]} tags Doctrine AST tags.
 * @param {string} title Tag title.
 * @returns {object|undefined} The tag, or undefined.
 * @ignore
 */
module.exports = function getJsdocAstTag(tags, title) {
  if (tags.length)
    // Loop tags backwards as later tags override earlier ones.
    for (let index = tags.length - 1; index >= 0; index--) {
      const tag = tags[index]
      if (tag.title === title) return tag
    }
}
