'use strict';

const { resolve } = require('path');
const snapshot = require('snapshot-assertion');
const mdToMdAst = require('../../private/mdToMdAst');

module.exports = (tests) => {
  tests.add('`mdToMdAst`.', async () => {
    await snapshot(
      JSON.stringify(mdToMdAst('a'), null, 2),
      resolve(__dirname, '../snapshots/mdToMdAst.json')
    );
  });
};
