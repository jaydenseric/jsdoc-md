'use strict';

const { deepStrictEqual, throws } = require('assert');
const { resolve } = require('path');
const { default: getCommentParser } = require('comment-parser/lib/parser');
const snapshot = require('snapshot-assertion');
const COMMENT_PARSER_OPTIONS = require('../../private/COMMENT_PARSER_OPTIONS');
const getJsdocBlockDescriptionSource = require('../../private/getJsdocBlockDescriptionSource');

module.exports = (tests) => {
  tests.add(
    '`getJsdocBlockDescriptionSource` with first argument `jsdocBlock` not an object.',
    () => {
      throws(() => {
        getJsdocBlockDescriptionSource(true);
      }, new TypeError('First argument `jsdocBlock` must be an object.'));
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
        resolve(
          __dirname,
          '../snapshots/getJsdocBlockDescriptionSource/description-no-tags.json'
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
        resolve(
          __dirname,
          '../snapshots/getJsdocBlockDescriptionSource/description-tags.json'
        )
      );
    }
  );
};
