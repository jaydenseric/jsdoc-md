import { deepStrictEqual, throws } from 'assert';

import CodePosition from '../../private/CodePosition.mjs';

export default (tests) => {
  tests.add('`CodePosition` with argument 1 `line` not a number.', () => {
    throws(() => {
      new CodePosition(true);
    }, new TypeError('Argument 1 `line` must be a number.'));
  });

  tests.add('`CodePosition` with argument 1 `line` < 1.', () => {
    throws(() => {
      new CodePosition(0);
    }, new RangeError('Argument 1 `line` must be >= 1.'));
  });

  tests.add('`CodePosition` with argument 2 `column` not a number.', () => {
    throws(() => {
      new CodePosition(1, true);
    }, new TypeError('Argument 2 `column` must be a number.'));
  });

  tests.add('`CodePosition` with argument 2 `column` < 1.', () => {
    throws(() => {
      new CodePosition(1, 0);
    }, new RangeError('Argument 2 `column` must be >= 1.'));
  });

  tests.add('`CodePosition` with arguments valid.', () => {
    deepStrictEqual(Object.entries(new CodePosition(2, 3)), [
      ['line', 2],
      ['column', 3],
    ]);
  });

  tests.add('`CodePosition` instance properties are frozen.', () => {
    const codePosition = new CodePosition(1, 1);

    throws(() => {
      codePosition.line = 2;
    }, TypeError);

    throws(() => {
      codePosition.column = 2;
    }, TypeError);
  });
};
