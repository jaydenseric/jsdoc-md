'use strict';

const { strictEqual, throws } = require('assert');
const codeToJsdocComments = require('../../private/codeToJsdocComments');
const outlineMembers = require('../../private/outlineMembers');
const replaceJsdocLinks = require('../../private/replaceJsdocLinks');
const jsdocCommentsToMembers = require('../jsdocCommentsToMembers');

const TEST_CODE_FILE_PATH = '/a.js';

module.exports = (tests) => {
  tests.add(
    '`replaceJsdocLinks` with first argument `markdown` not a string.',
    () => {
      throws(() => {
        replaceJsdocLinks(true);
      }, new TypeError('First argument `markdown` must be a string.'));
    }
  );

  tests.add(
    '`replaceJsdocLinks` with second argument `members` not an array.',
    () => {
      throws(() => {
        replaceJsdocLinks('a', true);
      }, new TypeError('Second argument `members` must be an array.'));
    }
  );

  tests.add(
    '`replaceJsdocLinks` with a single link in a sentence.',
    async () => {
      const code = `/**
 * @kind typedef
 * @name A
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const jsdocComments = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );
      const members = jsdocCommentsToMembers(
        jsdocComments,
        codeFiles,
        TEST_CODE_FILE_PATH
      );
      const outlinedMembers = outlineMembers(members, codeFiles);

      strictEqual(
        replaceJsdocLinks('See [A]{@link A}.', outlinedMembers),
        'See [A](#type-a).'
      );
    }
  );

  tests.add('`replaceJsdocLinks` with multiple links.', async () => {
    const code = `/**
 * @kind typedef
 * @name A
 */

/**
 * @kind typedef
 * @name B
 */`;
    const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
    const jsdocComments = await codeToJsdocComments(code, TEST_CODE_FILE_PATH);
    const members = jsdocCommentsToMembers(
      jsdocComments,
      codeFiles,
      TEST_CODE_FILE_PATH
    );
    const outlinedMembers = outlineMembers(members, codeFiles);

    strictEqual(
      replaceJsdocLinks('[A]{@link A} [B]{@link B}', outlinedMembers),
      '[A](#type-a) [B](#type-b)'
    );
  });

  tests.add('`replaceJsdocLinks` with a missing member.', () => {
    throws(() => {
      replaceJsdocLinks('[A]{@link A}', []);
    }, new Error('Missing JSDoc member for link namepath `A`.'));
  });
};
