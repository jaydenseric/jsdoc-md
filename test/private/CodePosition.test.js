'use strict';

const { deepStrictEqual, throws } = require('assert');
const CodePosition = require('../../private/CodePosition');

module.exports = (tests) => {
  tests.add('`CodePosition` with first argument `line` not a number.', () => {
    throws(() => {
      new CodePosition(true);
    }, new TypeError('First argument `line` must be a number.'));
  });

  tests.add('`CodePosition` with first argument `line` < 1.', () => {
    throws(() => {
      new CodePosition(0);
    }, new RangeError('First argument `line` must be >= 1.'));
  });

  tests.add(
    '`CodePosition` with second argument `column` not a number.',
    () => {
      throws(() => {
        new CodePosition(1, true);
      }, new TypeError('Second argument `column` must be a number.'));
    }
  );

  tests.add('`CodePosition` with second argument `column` < 1.', () => {
    throws(() => {
      new CodePosition(1, 0);
    }, new RangeError('Second argument `column` must be >= 1.'));
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
