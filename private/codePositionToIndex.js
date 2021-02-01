'use strict';

const CodePosition = require('./CodePosition');

/**
 * Converts a code position to a string index.
 * @kind function
 * @name codePositionToIndex
 * @param {CodePosition} codePosition Code position.
 * @param {string} code Code.
 * @returns {number} String index.
 * @ignore
 */
module.exports = function codePositionToIndex(codePosition, code) {
  if (!(codePosition instanceof CodePosition))
    throw new TypeError(
      'First argument `codePosition` must be a `CodePosition` instance.'
    );

  if (typeof code !== 'string')
    throw new TypeError('Second argument `code` must be a string.');

  if (code === '')
    throw new TypeError('Second argument `code` must be a populated string.');

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
};
