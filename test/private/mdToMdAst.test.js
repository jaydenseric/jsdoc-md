'use strict';

const { throws } = require('assert');
const { resolve } = require('path');
const snapshot = require('snapshot-assertion');
const mdToMdAst = require('../../private/mdToMdAst');

module.exports = (tests) => {
  tests.add('`mdToMdAst` with first argument `markdown` not a string.', () => {
    throws(() => {
      mdToMdAst(true);
    }, new TypeError('First argument “markdown” must be a string.'));
  });

  tests.add('`mdToMdAst` with a paragraph.', async () => {
    await snapshot(
      JSON.stringify(mdToMdAst('a'), null, 2),
      resolve(__dirname, '../snapshots/mdToMdAst/paragraph.json')
    );
  });
};
