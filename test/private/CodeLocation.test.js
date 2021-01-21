'use strict';

const { deepStrictEqual, throws } = require('assert');
const CodeLocation = require('../../private/CodeLocation');
const CodePosition = require('../../private/CodePosition');

module.exports = (tests) => {
  tests.add(
    '`CodeLocation` with first argument `start` not a `CodePosition` instance.',
    () => {
      throws(() => {
        new CodeLocation(true);
      }, new TypeError('First argument `start` must be a `CodePosition` instance.'));
    }
  );

  tests.add(
    '`CodeLocation` with second argument `end` not a `CodePosition` instance.',
    () => {
      throws(() => {
        new CodeLocation(new CodePosition(1, 1), true);
      }, new TypeError('Second argument `end` must be a `CodePosition` instance.'));
    }
  );

  tests.add(
    '`CodeLocation` with second argument `end` an undefined value.',
    () => {
      let end;

      throws(() => {
        new CodeLocation(new CodePosition(1, 1), end);
      }, new TypeError('Second argument `end` must be a `CodePosition` instance.'));
    }
  );

  tests.add(
    '`CodeLocation` with second argument `end` not at or beyond the start position.',
    () => {
      throws(() => {
        new CodeLocation(new CodePosition(2, 1), new CodePosition(1, 1));
      }, new TypeError('Second argument `end` must be a code position at or beyond the start code position.'));
    }
  );

  tests.add('`CodeLocation` without an end position.', () => {
    const start = new CodePosition(1, 1);

    deepStrictEqual(Object.entries(new CodeLocation(start)), [
      ['start', start],
    ]);
  });

  tests.add('`CodeLocation` with an end position, at start position.', () => {
    const start = new CodePosition(1, 1);
    const end = new CodePosition(1, 1);

    deepStrictEqual(Object.entries(new CodeLocation(start, end)), [
      ['start', start],
      ['end', end],
    ]);
  });

  tests.add(
    '`CodeLocation` with an end position, beyond start position.',
    () => {
      const start = new CodePosition(1, 1);
      const end = new CodePosition(2, 1);

      deepStrictEqual(Object.entries(new CodeLocation(start, end)), [
        ['start', start],
        ['end', end],
      ]);
    }
  );

  tests.add('`CodeLocation` instance properties are frozen.', () => {
    const codeLocation = new CodeLocation(
      new CodePosition(1, 1),
      new CodePosition(2, 1)
    );

    throws(() => {
      codeLocation.start = true;
    }, TypeError);

    throws(() => {
      codeLocation.end = true;
    }, TypeError);
  });
};
