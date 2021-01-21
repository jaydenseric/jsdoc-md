'use strict';

const CodePosition = require('./CodePosition');

/**
 * A location in code.
 * @kind class
 * @name CodeLocation
 * @param {CodePosition} start Start code position.
 * @param {CodePosition} [end] End code position.
 * @ignore
 */
module.exports = class CodeLocation {
  constructor(start, end) {
    if (!(start instanceof CodePosition))
      throw new TypeError(
        'First argument `start` must be a `CodePosition` instance.'
      );

    if (arguments.length > 1) {
      if (!(end instanceof CodePosition))
        throw new TypeError(
          'Second argument `end` must be a `CodePosition` instance.'
        );

      if (
        start.line > end.line ||
        (start.line === end.line && start.column > end.column)
      )
        throw new TypeError(
          'Second argument `end` must be a code position at or beyond the start code position.'
        );
    }

    this.start = start;
    if (end) this.end = end;

    Object.freeze(this);
  }
};
