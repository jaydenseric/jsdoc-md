'use strict';

const { throws, deepStrictEqual } = require('assert');
const { default: getCommentParser } = require('comment-parser/lib/parser');
const COMMENT_PARSER_OPTIONS = require('../../private/COMMENT_PARSER_OPTIONS');
const CodeLocation = require('../../private/CodeLocation');
const CodePosition = require('../../private/CodePosition');
const getJsdocBlockTagSpanCodeLocation = require('../../private/getJsdocBlockTagSpanCodeLocation');

module.exports = (tests) => {
  tests.add(
    '`getJsdocBlockTagSpanCodeLocation` with first argument `blockTag` not an object.',
    () => {
      throws(() => {
        getJsdocBlockTagSpanCodeLocation(true);
      }, new TypeError('First argument `blockTag` must be an object.'));
    }
  );

  tests.add(
    '`getJsdocBlockTagSpanCodeLocation` with second argument `spanTokenName` not a string.',
    () => {
      const [
        {
          tags: [blockTag],
        },
      ] = getCommentParser({
        ...COMMENT_PARSER_OPTIONS,
        startLine: 1,
      })('/** @abc {def} hij Klm nop. */');

      throws(() => {
        getJsdocBlockTagSpanCodeLocation(blockTag, true);
      }, new TypeError('Second argument `spanTokenName` must be a string.'));
    }
  );

  tests.add(
    '`getJsdocBlockTagSpanCodeLocation` with second argument `spanTokenName` not a span token name.',
    () => {
      const [
        {
          tags: [blockTag],
        },
      ] = getCommentParser({
        ...COMMENT_PARSER_OPTIONS,
        startLine: 1,
      })('/** @abc {def} hij Klm nop. */');

      throws(() => {
        getJsdocBlockTagSpanCodeLocation(blockTag, 'notavalidtokenname');
      }, new TypeError('Second argument `spanTokenName` must be a JSDoc block tag span token name.'));
    }
  );

  tests.add(
    '`getJsdocBlockTagSpanCodeLocation` with third argument `firstLineStartColumnNumber` not a number.',
    () => {
      const [
        {
          tags: [blockTag],
        },
      ] = getCommentParser({
        ...COMMENT_PARSER_OPTIONS,
        startLine: 1,
      })('/** @abc {def} hij Klm nop. */');

      throws(() => {
        getJsdocBlockTagSpanCodeLocation(blockTag, 'name', true);
      }, new TypeError('Third argument `firstLineStartColumnNumber` must be a number.'));
    }
  );

  tests.add(
    '`getJsdocBlockTagSpanCodeLocation` with a singleline block tag, type.',
    () => {
      const [
        {
          tags: [blockTag],
        },
      ] = getCommentParser({
        ...COMMENT_PARSER_OPTIONS,
        startLine: 1,
      })('/** @abc {def} hij Klm nop. */');

      deepStrictEqual(
        getJsdocBlockTagSpanCodeLocation(blockTag, 'type', 1),
        new CodeLocation(new CodePosition(1, 10), new CodePosition(1, 14))
      );
    }
  );

  tests.add(
    '`getJsdocBlockTagSpanCodeLocation` with a singleline block tag, name.',
    () => {
      const [
        {
          tags: [blockTag],
        },
      ] = getCommentParser({
        ...COMMENT_PARSER_OPTIONS,
        startLine: 1,
      })('/** @abc {def} hij Klm nop. */');

      deepStrictEqual(
        getJsdocBlockTagSpanCodeLocation(blockTag, 'name', 1),
        new CodeLocation(new CodePosition(1, 16), new CodePosition(1, 18))
      );
    }
  );

  tests.add(
    '`getJsdocBlockTagSpanCodeLocation` with a singleline block tag, description.',
    () => {
      const [
        {
          tags: [blockTag],
        },
      ] = getCommentParser({
        ...COMMENT_PARSER_OPTIONS,
        startLine: 1,
      })('/** @abc {def} hij Klm nop. */');

      deepStrictEqual(
        getJsdocBlockTagSpanCodeLocation(blockTag, 'description', 1),
        new CodeLocation(new CodePosition(1, 20), new CodePosition(1, 28))
      );
    }
  );

  tests.add(
    '`getJsdocBlockTagSpanCodeLocation` with a singleline block tag, description, missing.',
    () => {
      const [
        {
          tags: [blockTag],
        },
      ] = getCommentParser({
        ...COMMENT_PARSER_OPTIONS,
        startLine: 1,
      })(`/** @abc {def} hij */`);

      throws(() => {
        getJsdocBlockTagSpanCodeLocation(blockTag, 'description', 1);
      }, new Error('Failed to locate a JSDoc block tag span for token name `description`.'));
    }
  );

  tests.add(
    '`getJsdocBlockTagSpanCodeLocation` with a multiline block tag, description, not indented.',
    () => {
      const [
        {
          tags: [blockTag],
        },
      ] = getCommentParser({
        ...COMMENT_PARSER_OPTIONS,
        startLine: 1,
      })(`/** @abc {def} hij Klm
 * nop.
 */`);

      deepStrictEqual(
        getJsdocBlockTagSpanCodeLocation(blockTag, 'description', 1),
        new CodeLocation(new CodePosition(1, 20), new CodePosition(2, 7))
      );
    }
  );

  tests.add(
    '`getJsdocBlockTagSpanCodeLocation` with a multiline block tag, description, indented.',
    () => {
      const [
        {
          tags: [blockTag],
        },
      ] = getCommentParser({
        ...COMMENT_PARSER_OPTIONS,
        startLine: 1,
      })(`/** @abc {def} hij Klm
   * nop.
   */`);

      deepStrictEqual(
        getJsdocBlockTagSpanCodeLocation(blockTag, 'description', 3),
        new CodeLocation(new CodePosition(1, 22), new CodePosition(2, 9))
      );
    }
  );
};
