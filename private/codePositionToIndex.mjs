import CodePosition from './CodePosition.mjs';

/**
 * Converts a code position to a string index.
 * @kind function
 * @name codePositionToIndex
 * @param {CodePosition} codePosition Code position.
 * @param {string} code Code.
 * @returns {number} String index.
 * @ignore
 */
export default function codePositionToIndex(codePosition, code) {
  if (!(codePosition instanceof CodePosition))
    throw new TypeError(
      'Argument 1 `codePosition` must be a `CodePosition` instance.'
    );

  if (typeof code !== 'string')
    throw new TypeError('Argument 2 `code` must be a string.');

  if (code === '')
    throw new TypeError('Argument 2 `code` must be a populated string.');

  let index = 0;
  let line = 1;
  let column = 1;

  while (line < codePosition.line || column < codePosition.column) {
    if (code[index] === '\n') {
      line++;
      column = 1;
    } else column++;

    index++;
  }

  return index;
}
