'use strict';

const jsdocCommentToMember = require('../private/jsdocCommentToMember');

/**
 * Converts JSDoc comments to members.
 * @kind function
 * @name jsdocCommentsToMembers
 * @param {Array<string>} jsdocComments JSDoc comments.
 * @param {CodeFilesMap} codeFiles Map of code file paths and their code.
 * @param {string} codeFilePath File path for the code containing the JSDoc comment.
 * @returns {Array<JsdocMember>} JSDoc members.
 * @ignore
 */
module.exports = function jsdocCommentsToMembers(
  jsdocComments,
  codeFiles,
  codeFilePath
) {
  if (!Array.isArray(jsdocComments))
    throw new TypeError('First argument `jsdocComments` must be an array.');

  if (!(codeFiles instanceof Map))
    throw new TypeError(
      'Second argument `codeFiles` must be a `Map` instance.'
    );

  if (typeof codeFilePath !== 'string')
    throw new TypeError('Third argument `codeFilePath` must be a string.');

  if (codeFilePath === '')
    throw new TypeError(
      'Third argument `codeFilePath` must be a populated string.'
    );

  const members = [];

  for (const jsdocComment of jsdocComments) {
    const member = jsdocCommentToMember(jsdocComment, codeFiles, codeFilePath);
    if (member) members.push(member);
  }

  return members;
};
