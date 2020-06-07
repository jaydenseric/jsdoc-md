'use strict';

/**
 * Gets a JSDoc AST tag.
 * @kind function
 * @name getJsdocAstTag
 * @param {object[]} tags JSDoc AST tags.
 * @param {string} tagType Type of tag to retrieve.
 * @returns {object|void} The tag, or void.
 * @ignore
 */
module.exports = function getJsdocAstTag(tags, tagType) {
  if (tags.length)
    // Loop tags backwards as later tags override earlier ones.
    for (let index = tags.length - 1; index >= 0; index--) {
      const tag = tags[index];
      if (tag.tag === tagType) return tag;
    }
};
