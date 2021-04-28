/**
 * A position in code.
 * @kind class
 * @name CodePosition
 * @param {number} line Line number (starts at 1).
 * @param {number} column Column number (starts at 1).
 * @ignore
 */
export default class CodePosition {
  constructor(line, column) {
    if (typeof line !== 'number')
      throw new TypeError('Argument 1 `line` must be a number.');

    if (line < 1) throw new RangeError('Argument 1 `line` must be >= 1.');

    if (typeof column !== 'number')
      throw new TypeError('Argument 2 `column` must be a number.');

    if (column < 1) throw new RangeError('Argument 2 `column` must be >= 1.');

    this.line = line;
    this.column = column;

    Object.freeze(this);
  }
}
