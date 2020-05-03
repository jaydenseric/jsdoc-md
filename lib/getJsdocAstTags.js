'use strict';

/**
 * Gets a Doctrine JSDoc AST set.
 * @kind function
 * @name getJsdocAstTags
 * @param {object[]} tags Doctrine AST tags.
 * @param {string} title Tag title.
 * @returns {object[]|undefined} The tag set, or undefined.
 * @ignore
 */
module.exports = function getJsdocAstTags(tags, title) {
  if (tags.length) {
    const set = [];
    for (let tag of tags) if (tag.title === title) set.push(tag);
    if (set.length) return set;
  }
};
