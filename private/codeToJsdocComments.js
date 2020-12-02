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
    filename: path,
    parserOpts: {
      plugins: [
        'classProperties',
        ['decorators', { decoratorsBeforeExport: false }],
      ],
    },
  });

  return comments.reduce((comments, { type, value }) => {
    if (
      type === 'CommentBlock' &&
      // A JSDoc comment block starts with `/**` followed by whitespace.
      value.match(/^\*\s/)
    )
      // Restore the start `/*` and end `*/` that Babel strips off, so that the
      // JSDoc comment parser can accept it.
      comments.push(`/*${value}*/`);
    return comments;
  }, []);
};
