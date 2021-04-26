import { strictEqual, throws } from 'assert';
import CodePosition from '../../private/CodePosition.mjs';
import codePositionToIndex from '../../private/codePositionToIndex.mjs';

export default (tests) => {
  tests.add(
    '`codePositionToIndex` with first argument `codePosition` not a `CodePosition` instance.',
    () => {
      throws(() => {
        codePositionToIndex(true);
      }, new TypeError('First argument `codePosition` must be a `CodePosition` instance.'));
    }
  );

  tests.add(
    '`codePositionToIndex` with second argument `code` not a string.',
    () => {
      throws(() => {
        codePositionToIndex(new CodePosition(1, 1), true);
      }, new TypeError('Second argument `code` must be a string.'));
    }
  );

  tests.add(
    '`codePositionToIndex` with second argument `code` not a populated string.',
    () => {
      throws(() => {
        codePositionToIndex(new CodePosition(1, 1), '');
      }, new TypeError('Second argument `code` must be a populated string.'));
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
