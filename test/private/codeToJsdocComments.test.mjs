import { deepStrictEqual, rejects } from 'assert';
import snapshot from 'snapshot-assertion';
import codeToJsdocComments from '../../private/codeToJsdocComments.mjs';

const TEST_CODE_FILE_PATH = '/a.js';

export default (tests) => {
  tests.add(
    '`codeToJsdocComments` with first argument `code` not a string.',
    async () => {
      await rejects(
        codeToJsdocComments(true, TEST_CODE_FILE_PATH),
        new TypeError('First argument `code` must be a string.')
      );
    }
  );

  tests.add(
    '`codeToJsdocComments` with second argument `codeFilePath` not a string.',
    async () => {
      await rejects(
        codeToJsdocComments('', true),
        new TypeError('Second argument `codeFilePath` must be a string.')
      );
    }
  );

  tests.add(
    '`codeToJsdocComments` with second argument `codeFilePath` not a populated string.',
    async () => {
      await rejects(
        codeToJsdocComments('', ''),
        new TypeError(
          'Second argument `codeFilePath` must be a populated string.'
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
        new URL(
          '../snapshots/codeToJsdocComments/single-comment-block-single-line-jsdoc.json',
          import.meta.url
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
        new URL(
          '../snapshots/codeToJsdocComments/single-comment-block-multi-line-jsdoc.json',
          import.meta.url
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
        new URL(
          '../snapshots/codeToJsdocComments/multiple-comment-blocks-multi-line-jsdoc.json',
          import.meta.url
        )
      );
    }
  );
};
