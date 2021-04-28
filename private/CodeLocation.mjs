import CodePosition from './CodePosition.mjs';

/**
 * A location in code.
 * @kind class
 * @name CodeLocation
 * @param {CodePosition} start Start code position.
 * @param {CodePosition} [end] End code position.
 * @ignore
 */
export default class CodeLocation {
  constructor(start, end) {
    if (!(start instanceof CodePosition))
      throw new TypeError(
        'Argument 1 `start` must be a `CodePosition` instance.'
      );

    if (arguments.length > 1) {
      if (!(end instanceof CodePosition))
        throw new TypeError(
          'Argument 2 `end` must be a `CodePosition` instance.'
        );

      if (
        start.line > end.line ||
        (start.line === end.line && start.column > end.column)
      )
        throw new TypeError(
          'Argument 2 `end` must be a code position at or beyond the start code position.'
        );
    }

    this.start = start;
    if (end) this.end = end;

    Object.freeze(this);
  }
}
