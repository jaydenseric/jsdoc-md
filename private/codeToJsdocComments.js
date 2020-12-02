'use strict';

const { parseSync } = require('@babel/core');

/**
 * Gets JSDoc comments from source code, using Babel.
 * @kind function
 * @name codeToJsdocComments
 * @param {string} code Code containing the JSDoc comments.
 * @param {string} [filePath] File path for the code containing the JSDoc comments.
 * @returns {Array<object>} JSDoc comments, from the Babel parse result.
 * @ignore
 */
module.exports = function codeToJsdocComments(code, filePath) {
  const { comments } = parseSync(code, {
    // Provide the code file path for more useful Babel parse errors.
    filename: filePath,

    // Allow parsing code containing modern syntax even if a project doesn’t
    // have Babel config to handle it.
    parserOpts: {
      plugins: [
        'classProperties',
        ['decorators', { decoratorsBeforeExport: false }],
      ],
    },
  });

  return comments.filter(
    ({ type, value }) =>
      // A comment block starts with `/*`, whereas a comment line starts with
      // `//`. JSDoc can only be a comment block.
      type === 'CommentBlock' &&
      // The value excludes the start `/*` and end `*/`. A JSDoc comment block
      // starts with `/**` followed by whitespace.
      value.match(/^\*\s/)
  );
};
