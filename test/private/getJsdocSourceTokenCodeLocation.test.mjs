import { deepStrictEqual, throws } from 'assert';
import CommentParserParser from 'comment-parser/lib/parser/index.js';
import COMMENT_PARSER_OPTIONS from '../../private/COMMENT_PARSER_OPTIONS.mjs';
import CodeLocation from '../../private/CodeLocation.mjs';
import CodePosition from '../../private/CodePosition.mjs';
import getJsdocSourceTokenCodeLocation from '../../private/getJsdocSourceTokenCodeLocation.mjs';

const { default: getCommentParser } = CommentParserParser;

export default (tests) => {
  tests.add(
    '`getJsdocSourceTokenCodeLocation` with first argument `jsdocSource` not an array.',
    () => {
      throws(() => {
        getJsdocSourceTokenCodeLocation(true);
      }, new TypeError('First argument `jsdocSource` must be an array.'));
    }
  );

  tests.add(
    '`getJsdocSourceTokenCodeLocation` with second argument `dataTokenName` not a string.',
    () => {
      const [
        {
          tags: [{ source }],
        },
      ] = getCommentParser({
        ...COMMENT_PARSER_OPTIONS,
        startLine: 1,
      })('/** @abc {def} hij Klm nop. */');

      throws(() => {
        getJsdocSourceTokenCodeLocation(source, true);
      }, new TypeError('Second argument `dataTokenName` must be a string.'));
    }
  );

  tests.add(
    '`getJsdocSourceTokenCodeLocation` with second argument `dataTokenName` not an data token name.',
    () => {
      const [
        {
          tags: [{ source }],
        },
      ] = getCommentParser({
        ...COMMENT_PARSER_OPTIONS,
        startLine: 1,
      })('/** @abc {def} hij Klm nop. */');

      throws(() => {
        getJsdocSourceTokenCodeLocation(source, 'notavalidtokenname');
      }, new TypeError('Second argument `dataTokenName` must be a JSDoc source data token name.'));
    }
  );

  tests.add(
    '`getJsdocSourceTokenCodeLocation` with third argument `firstLineStartColumnNumber` not a `CodePosition` instance.',
    () => {
      const [
        {
          tags: [{ source }],
        },
      ] = getCommentParser({
        ...COMMENT_PARSER_OPTIONS,
        startLine: 1,
      })('/** @abc {def} hij Klm nop. */');

      throws(() => {
        getJsdocSourceTokenCodeLocation(source, 'name', true);
      }, new TypeError('Third argument `startCodePosition` must be a `CodePosition` instance.'));
    }
  );

  tests.add(
    '`getJsdocSourceTokenCodeLocation` with source token missing.',
    () => {
      const startLine = 1;
      const [
        {
          tags: [{ source }],
        },
      ] = getCommentParser({
        ...COMMENT_PARSER_OPTIONS,
        startLine,
      })(`/** @abc {def} hij */`);

      throws(() => {
        getJsdocSourceTokenCodeLocation(
          source,
          'description',
          new CodePosition(startLine, 1)
        );
      }, new Error('Unable to get a code location for JSDoc source token `description`.'));
    }
  );

  tests.add(
    '`getJsdocSourceTokenCodeLocation` with start line 1 column 1, singleline block tag, data token `type`.',
    () => {
      const startLine = 1;
      const [
        {
          tags: [{ source }],
        },
      ] = getCommentParser({
        ...COMMENT_PARSER_OPTIONS,
        startLine,
      })('/** @abc {def} hij Klm nop. */');

      deepStrictEqual(
        getJsdocSourceTokenCodeLocation(
          source,
          'type',
          new CodePosition(startLine, 1)
        ),
        new CodeLocation(new CodePosition(1, 10), new CodePosition(1, 14))
      );
    }
  );

  tests.add(
    '`getJsdocSourceTokenCodeLocation` with start line 2 column 3, singleline block tag, data token `type`.',
    () => {
      const startLine = 2;
      const [
        {
          tags: [{ source }],
        },
      ] = getCommentParser({
        ...COMMENT_PARSER_OPTIONS,
        startLine,
      })('/** @abc {def} hij Klm nop. */');

      deepStrictEqual(
        getJsdocSourceTokenCodeLocation(
          source,
          'type',
          new CodePosition(startLine, 3)
        ),
        new CodeLocation(new CodePosition(2, 12), new CodePosition(2, 16))
      );
    }
  );

  tests.add(
    '`getJsdocSourceTokenCodeLocation` with start line 1 column 1, singleline block tag, data token `name`.',
    () => {
      const startLine = 1;
      const [
        {
          tags: [{ source }],
        },
      ] = getCommentParser({
        ...COMMENT_PARSER_OPTIONS,
        startLine,
      })('/** @abc {def} hij Klm nop. */');

      deepStrictEqual(
        getJsdocSourceTokenCodeLocation(
          source,
          'name',
          new CodePosition(startLine, 1)
        ),
        new CodeLocation(new CodePosition(1, 16), new CodePosition(1, 18))
      );
    }
  );

  tests.add(
    '`getJsdocSourceTokenCodeLocation` with start line 1 column 1, singleline block tag, data token `description`.',
    () => {
      const startLine = 1;
      const [
        {
          tags: [{ source }],
        },
      ] = getCommentParser({
        ...COMMENT_PARSER_OPTIONS,
        startLine,
      })('/** @abc {def} hij Klm nop. */');

      deepStrictEqual(
        getJsdocSourceTokenCodeLocation(
          source,
          'description',
          new CodePosition(startLine, 1)
        ),
        new CodeLocation(new CodePosition(1, 20), new CodePosition(1, 28))
      );
    }
  );

  tests.add(
    '`getJsdocSourceTokenCodeLocation` with start line 1 column 1, a multiline block tag, data token `description`.',
    () => {
      const startLine = 1;
      const [
        {
          tags: [{ source }],
        },
      ] = getCommentParser({
        ...COMMENT_PARSER_OPTIONS,
        startLine,
      })(`/**
 * @abc {def} hij Klm
 * nop.
 */`);

      deepStrictEqual(
        getJsdocSourceTokenCodeLocation(
          source,
          'description',
          new CodePosition(startLine, 1)
        ),
        new CodeLocation(new CodePosition(2, 19), new CodePosition(3, 7))
      );
    }
  );

  tests.add(
    '`getJsdocSourceTokenCodeLocation` with start line 2 column 3, multiline block tag, data token `description`.',
    () => {
      const startLine = 2;
      const [
        {
          tags: [{ source }],
        },
      ] = getCommentParser({
        ...COMMENT_PARSER_OPTIONS,
        startLine,
      })(`/**
   * @abc {def} hij Klm
   * nop.
   */`);

      deepStrictEqual(
        getJsdocSourceTokenCodeLocation(
          source,
          'description',
          new CodePosition(startLine, 3)
        ),
        new CodeLocation(new CodePosition(3, 21), new CodePosition(4, 9))
      );
    }
  );
};
