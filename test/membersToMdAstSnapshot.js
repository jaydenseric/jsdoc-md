'use strict';

const { resolve } = require('path');
const gfm = require('remark-gfm');
const stringify = require('remark-stringify');
const snapshot = require('snapshot-assertion');
const unified = require('unified');
const membersToMdAst = require('../private/membersToMdAst');
const remarkStringifyOptions = require('../private/remarkStringifyOptions');
const jsdocCommentsToMembers = require('./jsdocCommentsToMembers');

/**
 * Snapshot tests the [`membersToMdAst`]{@link membersToMdAst} function. A
 * snapshot of the MDAST is created along with a snapshot of the MDAST rendered
 * to markdown for easier review.
 * @kind function
 * @name membersToMdAstSnapshot
 * @param {string} snapshotName Name for the snapshot files (excluding file extension).
 * @param {Array<string>} jsdocComments JSDoc comments.
 * @param {number} [topDepth] Top heading level.
 * @ignore
 */
module.exports = async function membersToMdAstSnapshot(
  snapshotName,
  jsdocComments,
  topDepth
) {
  const mdAst = membersToMdAst(jsdocCommentsToMembers(jsdocComments), topDepth);

  await snapshot(
    JSON.stringify(mdAst, null, 2),
    resolve(__dirname, `./snapshots/membersToMdAst/${snapshotName}.json`)
  );

  const md = unified()
    .use(gfm)
    .use(stringify, remarkStringifyOptions)
    .stringify(mdAst);

  await snapshot(
    md,
    resolve(__dirname, `./snapshots/membersToMdAst/${snapshotName}.md`)
  );
};
