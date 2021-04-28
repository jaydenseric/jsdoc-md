import { strictEqual, throws } from 'assert';
import CodePosition from '../../private/CodePosition.mjs';
import codePositionToIndex from '../../private/codePositionToIndex.mjs';

export default (tests) => {
  tests.add(
    '`codePositionToIndex` with argument 1 `codePosition` not a `CodePosition` instance.',
    () => {
      throws(() => {
        codePositionToIndex(true);
      }, new TypeError('Argument 1 `codePosition` must be a `CodePosition` instance.'));
    }
  );

  tests.add(
    '`codePositionToIndex` with argument 2 `code` not a string.',
    () => {
      throws(() => {
        codePositionToIndex(new CodePosition(1, 1), true);
      }, new TypeError('Argument 2 `code` must be a string.'));
    }
  );

  tests.add(
    '`codePositionToIndex` with argument 2 `code` not a populated string.',
    () => {
      throws(() => {
        codePositionToIndex(new CodePosition(1, 1), '');
      }, new TypeError('Argument 2 `code` must be a populated string.'));
    }
  );

  tests.add('`codePositionToIndex` with singleline code, start.', () => {
    strictEqual(codePositionToIndex(new CodePosition(1, 1), 'abc'), 0);
  });

  tests.add('`codePositionToIndex` with singleline code, between.', () => {
    strictEqual(codePositionToIndex(new CodePosition(1, 2), 'abc'), 1);
  });

  tests.add('`codePositionToIndex` with singleline code, end.', () => {
    strictEqual(codePositionToIndex(new CodePosition(1, 3), 'abc'), 2);
  });

  tests.add('`codePositionToIndex` with multiline code, start.', () => {
    strictEqual(
      codePositionToIndex(
        new CodePosition(1, 1),
        `abc
def
hij`
      ),
      0
    );
  });

  tests.add('`codePositionToIndex` with multiline code, between.', () => {
    strictEqual(
      codePositionToIndex(
        new CodePosition(2, 2),
        `abc
def
hij`
      ),
      5
    );
  });

  tests.add('`codePositionToIndex` with multiline code, end.', () => {
    strictEqual(
      codePositionToIndex(
        new CodePosition(3, 3),
        `abc
def
hij`
      ),
      10
    );
  });
};
