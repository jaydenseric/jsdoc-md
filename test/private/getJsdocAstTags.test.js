'use strict';

const { strictEqual } = require('assert');
const { resolve } = require('path');
const commentParser = require('comment-parser');
const snapshot = require('snapshot-assertion');
const getJsdocAstTags = require('../../private/getJsdocAstTags');

module.exports = (tests) => {
  tests.add('`getJsdocAstTags` with @param.', async () => {
    const [jsdocAst] = commentParser(`/**
 * Description.
 * @kind function
 * @name a
 * @param {string} a Description.
 * @param {string} b Description.
 */`);

    await snapshot(
      JSON.stringify(getJsdocAstTags(jsdocAst.tags, 'param'), null, 2),
      resolve(__dirname, '../snapshots/getJsdocAstTags/with-@param.json')
    );
  });

  tests.add('`getJsdocAstTags` with no tags.', () => {
    const [jsdocAst] = commentParser('/** Description. */');

    strictEqual(getJsdocAstTags(jsdocAst.tags, 'param'), undefined);
  });
};
