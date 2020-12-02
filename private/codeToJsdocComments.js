'use strict';

const { parseSync } = require('@babel/core');

/**
 * Gets JSDoc comments from source code, using Babel.
 * @kind function
 * @name codeToJsdocComments
 * @param {string} code Code containing the JSDoc comments.
 * @param {string} [path] File path for the code containing the JSDoc comments.
 * @returns {Array<string>} JSDoc comment values, from the Babel parse result.
 * @ignore
 */
module.exports = function codeToJsdocComments(code, path) {
  const { comments } = parseSync(code, {
    // Provide the code file path for more useful Babel parse errors.
    filename: path,

    // Allow parsing code containing modern syntax even if a project doesn’t
    // have Babel config to handle it.
    parserOpts: {
      plugins: [
        'classProperties',
        ['decorators', { decoratorsBeforeExport: false }],
      ],
    },
  });

  return comments.reduce((comments, { type, value }) => {
    if (
      // A comment block starts with `/*`, whereas a comment line starts with
      // `//`. JSDoc can only be a comment block.
      type === 'CommentBlock' &&
      // The value excludes the start `/*` and end `*/`. A JSDoc comment block
      // starts with `/**` followed by whitespace.
      value.match(/^\*\s/)
    )
      // Restore the start `/*` and end `*/` that Babel strips off, so that the
      // JSDoc comment parser can accept it.
      comments.push(`/*${value}*/`);
    return comments;
  }, []);
};
