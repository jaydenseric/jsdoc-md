'use strict';

const jsdocCommentToMember = require('../private/jsdocCommentToMember');

/**
 * Converts JSDoc comments to members.
 * @kind function
 * @name jsdocCommentsToMembers
 * @param {Array<string>} jsdocComments JSDoc comments.
 * @param {string} code Code containing the JSDoc comment.
 * @param {string} codeFilePath File path for the code containing the JSDoc comment.
 * @returns {Array<object>} Members.
 * @ignore
 */
module.exports = function jsdocCommentsToMembers(
  jsdocComments,
  code,
  codeFilePath
) {
  const members = [];

  for (const jsdocComment of jsdocComments) {
    const member = jsdocCommentToMember(jsdocComment, code, codeFilePath);
    if (member) members.push(member);
  }

  return members;
};
