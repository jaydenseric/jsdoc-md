import { deepStrictEqual, throws } from 'assert';
import CommentParserParser from 'comment-parser/lib/parser/index.js';
import snapshot from 'snapshot-assertion';
import COMMENT_PARSER_OPTIONS from '../../private/COMMENT_PARSER_OPTIONS.mjs';
import getJsdocBlockDescriptionSource from '../../private/getJsdocBlockDescriptionSource.mjs';

const { default: getCommentParser } = CommentParserParser;

export default (tests) => {
  tests.add(
    '`getJsdocBlockDescriptionSource` with argument 1 `jsdocBlock` not an object.',
    () => {
      throws(() => {
        getJsdocBlockDescriptionSource(true);
      }, new TypeError('Argument 1 `jsdocBlock` must be an object.'));
    }
  );

  tests.add(
    '`getJsdocBlockDescriptionSource` with no description, tag.',
    () => {
      const [jsdocBlock] = getCommentParser({
        ...COMMENT_PARSER_OPTIONS,
        startLine: 1,
      })(`/**@a*/`);

      deepStrictEqual(getJsdocBlockDescriptionSource(jsdocBlock), []);
    }
  );

  tests.add(
    '`getJsdocBlockDescriptionSource` with a description, no tags.',
    async () => {
      const [jsdocBlock] = getCommentParser({
        ...COMMENT_PARSER_OPTIONS,
        startLine: 1,
      })(`/**
 * Line 1.
 * Line 2.
 */`);

      await snapshot(
        JSON.stringify(getJsdocBlockDescriptionSource(jsdocBlock), null, 2),
        new URL(
          '../snapshots/getJsdocBlockDescriptionSource/description-no-tags.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`getJsdocBlockDescriptionSource` with a description, tags.',
    async () => {
      const [jsdocBlock] = getCommentParser({
        ...COMMENT_PARSER_OPTIONS,
        startLine: 1,
      })(`/**
 * Line 1.
 * Line 2.
 * @a
 * @b
 */`);

      await snapshot(
        JSON.stringify(getJsdocBlockDescriptionSource(jsdocBlock), null, 2),
        new URL(
          '../snapshots/getJsdocBlockDescriptionSource/description-tags.json',
          import.meta.url
        )
      );
    }
  );
};
