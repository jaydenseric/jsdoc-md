'use strict';

const { deepStrictEqual, throws } = require('assert');
const { resolve } = require('path');
const snapshot = require('snapshot-assertion');
const codeToJsdocComments = require('../../private/codeToJsdocComments');

const TEST_CODE_FILE_PATH = '/a.js';

module.exports = (tests) => {
  tests.add('`codeToJsdocComments` with first `code` argument invalid.', () => {
    throws(() => {
      codeToJsdocComments(true, TEST_CODE_FILE_PATH);
    }, new TypeError('First argument “code” must be a string.'));
  });

  tests.add(
    '`codeToJsdocComments` with second `codeFilePath` argument invalid.',
    () => {
      throws(() => {
        codeToJsdocComments('', true);
      }, new TypeError('Second argument “codeFilePath” must be a string.'));
    }
  );

  tests.add('`codeToJsdocComments` with a comment, line.', () => {
    deepStrictEqual(
      codeToJsdocComments(
        `// a
let a;`,
        TEST_CODE_FILE_PATH
      ),
      []
    );
  });

  tests.add(
    '`codeToJsdocComments` with a comment, block, single line, not JSDoc.',
    () => {
      deepStrictEqual(
        codeToJsdocComments(
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
    () => {
      deepStrictEqual(
        codeToJsdocComments("const a = '/** a */';", TEST_CODE_FILE_PATH),
        []
      );
    }
  );

  tests.add(
    '`codeToJsdocComments` with a comment, block, single line, JSDoc.',
    async () => {
      await snapshot(
        JSON.stringify(
          codeToJsdocComments(
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
    () => {
      deepStrictEqual(
        codeToJsdocComments(
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
          codeToJsdocComments(
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
          codeToJsdocComments(
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
