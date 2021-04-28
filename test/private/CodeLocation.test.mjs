import { deepStrictEqual, throws } from 'assert';
import CodeLocation from '../../private/CodeLocation.mjs';
import CodePosition from '../../private/CodePosition.mjs';

export default (tests) => {
  tests.add(
    '`CodeLocation` with argument 1 `start` not a `CodePosition` instance.',
    () => {
      throws(() => {
        new CodeLocation(true);
      }, new TypeError('Argument 1 `start` must be a `CodePosition` instance.'));
    }
  );

  tests.add(
    '`CodeLocation` with argument 2 `end` not a `CodePosition` instance.',
    () => {
      throws(() => {
        new CodeLocation(new CodePosition(1, 1), true);
      }, new TypeError('Argument 2 `end` must be a `CodePosition` instance.'));
    }
  );

  tests.add('`CodeLocation` with argument 2 `end` an undefined value.', () => {
    let end;

    throws(() => {
      new CodeLocation(new CodePosition(1, 1), end);
    }, new TypeError('Argument 2 `end` must be a `CodePosition` instance.'));
  });

  tests.add(
    '`CodeLocation` with argument 2 `end` not at or beyond the start position.',
    () => {
      throws(() => {
        new CodeLocation(new CodePosition(2, 1), new CodePosition(1, 1));
      }, new TypeError('Argument 2 `end` must be a code position at or beyond the start code position.'));
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
