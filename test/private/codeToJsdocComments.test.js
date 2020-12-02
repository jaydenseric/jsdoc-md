'use strict';

const { deepStrictEqual } = require('assert');
const { resolve } = require('path');
const snapshot = require('snapshot-assertion');
const codeToJsdocComments = require('../../private/codeToJsdocComments');

module.exports = (tests) => {
  tests.add('`codeToJsdocComments` with a comment, line.', () => {
    deepStrictEqual(
      codeToJsdocComments(
        `// a
let a;`
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
let a;`
        ),
        []
      );
    }
  );

  tests.add(
    '`codeToJsdocComments` with a code string containing JSDoc.',
    () => {
      deepStrictEqual(codeToJsdocComments("const a = '/** a */';"), []);
    }
  );

  tests.add(
    '`codeToJsdocComments` with a comment, block, single line, JSDoc.',
    async () => {
      await snapshot(
        JSON.stringify(
          codeToJsdocComments(
            `/** a */
let a;`
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
let a;`
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
let a;`
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
let b;`
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
