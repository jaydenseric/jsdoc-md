'use strict';

const { strictEqual } = require('assert');
const { resolve } = require('path');
const commentParser = require('comment-parser');
const snapshot = require('snapshot-assertion');
const getJsdocAstTag = require('../../private/getJsdocAstTag');

module.exports = (tests) => {
  tests.add('`getJsdocAstTag` with a tag.', async () => {
    const [jsdocAst] = commentParser('/** @name a */');

    await snapshot(
      JSON.stringify(getJsdocAstTag(jsdocAst.tags, 'name'), null, 2),
      resolve(__dirname, '../snapshots', 'getJsdocAstTag', 'with-a-tag.json')
    );
  });

  tests.add('`getJsdocAstTag` with a tag override.', async () => {
    const [jsdocAst] = commentParser(`/**
 * @name a
 * @name b
 */`);

    await snapshot(
      JSON.stringify(getJsdocAstTag(jsdocAst.tags, 'name'), null, 2),
      resolve(
        __dirname,
        '../snapshots',
        'getJsdocAstTag',
        'with-a-tag-override.json'
      )
    );
  });

  tests.add('`getJsdocAstTag` with no tag.', () => {
    const [jsdocAst] = commentParser('/** Description. */');

    strictEqual(getJsdocAstTag(jsdocAst.tags, 'name'), undefined);
  });
};
