'use strict';

const { deepStrictEqual, rejects } = require('assert');
const { resolve } = require('path');
const snapshot = require('snapshot-assertion');
const codeToJsdocComments = require('../../private/codeToJsdocComments');

const TEST_CODE_FILE_PATH = '/a.js';

module.exports = (tests) => {
  tests.add(
    '`codeToJsdocComments` with first argument `code` not a string.',
    async () => {
      await rejects(
        codeToJsdocComments(true, TEST_CODE_FILE_PATH),
        new TypeError('First argument “code” must be a string.')
      );
    }
  );

  tests.add(
    '`codeToJsdocComments` with second argument `codeFilePath` not a string.',
    async () => {
      await rejects(
        codeToJsdocComments('', true),
        new TypeError('Second argument “codeFilePath” must be a string.')
      );
    }
  );

  tests.add(
    '`codeToJsdocComments` with second argument `codeFilePath` not a populated string.',
    async () => {
      await rejects(
        codeToJsdocComments('', ''),
        new TypeError(
          'Second argument “codeFilePath” must be a populated string.'
        )
      );
    }
  );

  tests.add('`codeToJsdocComments` with a comment, line.', async () => {
    deepStrictEqual(
      await codeToJsdocComments(
        `// a
let a;`,
        TEST_CODE_FILE_PATH
      ),
      []
    );
  });

  tests.add(
    '`codeToJsdocComments` with a comment, block, single line, not JSDoc.',
    async () => {
      deepStrictEqual(
        await codeToJsdocComments(
          `/* a */
let a;`,
          TEST_CODE_FILE_PATH
        ),
        []
      );
    }
  );

  tests.add(
    '`codeToJsdocComments` with a code string containing JSDoc.',
    async () => {
      deepStrictEqual(
        await codeToJsdocComments("const a = '/** a */';", TEST_CODE_FILE_PATH),
        []
      );
    }
  );

  tests.add(
    '`codeToJsdocComments` with a comment, block, single line, JSDoc.',
    async () => {
      await snapshot(
        JSON.stringify(
          await codeToJsdocComments(
            `/** a */
let a;`,
            TEST_CODE_FILE_PATH
          ),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/codeToJsdocComments/single-comment-block-single-line-jsdoc.json'
        )
      );
    }
  );

  tests.add(
    '`codeToJsdocComments` with a comment, block, multi line, not JSDoc.',
    async () => {
      deepStrictEqual(
        await codeToJsdocComments(
          `/*
 * a
 */
let a;`,
          TEST_CODE_FILE_PATH
        ),
        []
      );
    }
  );

  tests.add(
    '`codeToJsdocComments` with a comment, block, multi line, JSDoc.',
    async () => {
      await snapshot(
        JSON.stringify(
          await codeToJsdocComments(
            `/**
 * a
 */
let a;`,
            TEST_CODE_FILE_PATH
          ),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/codeToJsdocComments/single-comment-block-multi-line-jsdoc.json'
        )
      );
    }
  );

  tests.add(
    '`codeToJsdocComments` with multiple comments, block, multi line, JSDoc.',
    async () => {
      await snapshot(
        JSON.stringify(
          await codeToJsdocComments(
            `/**
 * a
 */
let a;

/**
 * b
 */
let b;`,
            TEST_CODE_FILE_PATH
          ),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/codeToJsdocComments/multiple-comment-blocks-multi-line-jsdoc.json'
        )
      );
    }
  );
};
