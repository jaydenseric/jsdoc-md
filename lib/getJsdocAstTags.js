/**
 * Gets a Doctrine JSDoc AST set.
 * @kind function
 * @name getJsdocAstTags
 * @param {Object[]} tags Doctrine AST tags.
 * @param {string} title Tag title.
 * @returns {Object[]|undefined} The tag set, or undefined.
 * @ignore
 */
function getJsdocAstTags(tags, title) {
  if (tags.length) {
    const set = []
    for (let tag of tags) if (tag.title === title) set.push(tag)
    if (set.length) return set
  }
}

module.exports = getJsdocAstTags
