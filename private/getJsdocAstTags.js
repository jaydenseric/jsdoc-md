'use strict';

/**
 * Gets a JSDoc AST tag set.
 * @kind function
 * @name getJsdocAstTags
 * @param {object[]} tags JSDoc AST tags.
 * @param {string} tagType Type of tag to retrieve.
 * @returns {object[]|void} The tag set, or void.
 * @ignore
 */
module.exports = function getJsdocAstTags(tags, tagType) {
  if (tags.length) {
    const set = [];
    for (let tag of tags) if (tag.tag === tagType) set.push(tag);
    if (set.length) return set;
  }
};
