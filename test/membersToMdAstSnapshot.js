'use strict';

const { resolve } = require('path');
const gfm = require('remark-gfm');
const stringify = require('remark-stringify');
const snapshot = require('snapshot-assertion');
const unified = require('unified');
const codeToJsdocComments = require('../private/codeToJsdocComments');
const membersToMdAst = require('../private/membersToMdAst');
const remarkStringifyOptions = require('../private/remarkStringifyOptions');
const jsdocCommentsToMembers = require('./jsdocCommentsToMembers');

const TEST_CODE_FILE_PATH = '/a.js';

/**
 * Snapshot tests the [`membersToMdAst`]{@link membersToMdAst} function. A
 * snapshot of the MDAST is created along with a snapshot of the MDAST rendered
 * to markdown for easier review.
 * @kind function
 * @name membersToMdAstSnapshot
 * @param {string} snapshotName Name for the snapshot files (excluding file extension).
 * @param {string} code Code containing JSDoc comments.
 * @param {number} [topDepth] Top heading level.
 * @ignore
 */
module.exports = async function membersToMdAstSnapshot(
  snapshotName,
  code,
  topDepth
) {
  const jsdocComments = await codeToJsdocComments(code, TEST_CODE_FILE_PATH);
  const members = jsdocCommentsToMembers(
    jsdocComments,
    code,
    TEST_CODE_FILE_PATH
  );
  const mdAst = membersToMdAst(members, topDepth);

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
