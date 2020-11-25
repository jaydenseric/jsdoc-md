'use strict';

const jsdocToMember = require('../private/jsdocToMember');

/**
 * Converts JSDoc comments to members.
 * @kind function
 * @name jsdocCommentsToMembers
 * @param {Array<string>} jsdocComments JSDoc comments.
 * @returns {Array<object>} Members.
 * @ignore
 */
module.exports = function jsdocCommentsToMembers(jsdocComments) {
  const members = [];

  for (const jsdoc of jsdocComments) {
    const member = jsdocToMember(jsdoc);
    if (member) members.push(member);
  }

  return members;
};
