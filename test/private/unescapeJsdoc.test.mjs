import { strictEqual, throws } from 'assert';
import unescapeJsdoc from '../../private/unescapeJsdoc.mjs';

export default (tests) => {
  tests.add(
    '`unescapeJsdoc` with first argument `content` not a string.',
    () => {
      throws(() => {
        unescapeJsdoc(true);
      }, new TypeError('First argument `content` must be a string.'));
    }
  );

  tests.add('`unescapeJsdoc` unescapes multiline comment ends.', () => {
    strictEqual(unescapeJsdoc('*/ *\\/ *\\\\/ *\\\\\\/'), '*/ */ *\\/ *\\\\/');
  });
};
