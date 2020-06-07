'use strict';

const { strictEqual } = require('assert');
const unescapeJsdoc = require('../../private/unescapeJsdoc');

module.exports = (tests) => {
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
