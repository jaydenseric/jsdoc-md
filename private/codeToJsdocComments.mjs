import { parseAsync } from '@babel/core';

/**
 * Gets JSDoc comments from source code, using Babel.
 * @kind function
 * @name codeToJsdocComments
 * @param {string} code Code containing the JSDoc comments.
 * @param {string} codeFilePath File path for the code containing the JSDoc comments.
 * @returns {Promise<Array<object>>} Resolves JSDoc comments, from the Babel parse result.
 * @ignore
 */
export default async function codeToJsdocComments(code, codeFilePath) {
  if (typeof code !== 'string')
    throw new TypeError('Argument 1 `code` must be a string.');

  if (typeof codeFilePath !== 'string')
    throw new TypeError('Argument 2 `codeFilePath` must be a string.');

  if (codeFilePath === '')
    throw new TypeError(
      'Argument 2 `codeFilePath` must be a populated string.'
    );

  const { comments } = await parseAsync(code, {
    // Provide the code file path for more useful Babel parse errors.
    filename: codeFilePath,

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
      value.match(/^\*\s/u)
  );
}
