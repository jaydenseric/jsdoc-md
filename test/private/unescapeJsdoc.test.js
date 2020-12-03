'use strict';

const { strictEqual, throws } = require('assert');
const unescapeJsdoc = require('../../private/unescapeJsdoc');

module.exports = (tests) => {
  tests.add(
    '`unescapeJsdoc` with first argument `content` not a string.',
    () => {
      throws(() => {
        unescapeJsdoc(true);
      }, new TypeError('First argument “content” must be a string.'));
    }
  );

  tests.add('`unescapeJsdoc` unescapes one multiline comment end.', () => {
    strictEqual(unescapeJsdoc('*\\/'), '*/');
  });

  tests.add(
    '`unescapeJsdoc` unescapes multiple multiline comment ends.',
    () => {
      strictEqual(unescapeJsdoc('*\\/ *\\/'), '*/ */');
    }
  );
};
