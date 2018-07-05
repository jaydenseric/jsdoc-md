/**
 * Gets a Doctrine JSDoc AST tag.
 * @kind function
 * @name getJsdocAstTag
 * @param {Object[]} tags Doctrine AST tags.
 * @param {string} title Tag title.
 * @returns {Object|undefined} The tag, or undefined.
 * @ignore
 */
function getJsdocAstTag(tags, title) {
  if (tags.length)
    // Loop tags backwards as later tags override earlier ones.
    for (let index = tags.length - 1; index >= 0; index--) {
      const tag = tags[index]
      if (tag.title === title) return tag
    }
}

module.exports = getJsdocAstTag
