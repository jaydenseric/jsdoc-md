'use strict';

const { parseSync } = require('@babel/core');

/**
 * Gets JSDoc comments from a code string.
 * @kind function
 * @name jsdocCommentsFromCode
 * @param {string} code Code to search.
 * @param {string} [path] Code file path.
 * @returns {string[]} JSDoc comment values.
 * @ignore
 */
module.exports = function jsdocCommentsFromCode(code, path) {
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
