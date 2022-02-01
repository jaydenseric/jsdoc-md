import remarkGfm from 'remark-gfm';
import remarkStringify from 'remark-stringify';
import snapshot from 'snapshot-assertion';
import { unified } from 'unified';

import codeToJsdocComments from '../private/codeToJsdocComments.mjs';
import membersToMdAst from '../private/membersToMdAst.mjs';
import REMARK_STRINGIFY_OPTIONS from '../private/REMARK_STRINGIFY_OPTIONS.mjs';
import jsdocCommentsToMembers from './jsdocCommentsToMembers.mjs';

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
 * @returns {Promise<void>} Resolves once the operation is done.
 * @ignore
 */
export default async function membersToMdAstSnapshot(
  snapshotName,
  code,
  topDepth
) {
  if (typeof snapshotName !== 'string')
    throw new TypeError('Argument 1 `snapshotName` must be a string.');

  if (typeof code !== 'string')
    throw new TypeError('Argument 2 `code` must be a string.');

  if (arguments.length > 2) {
    if (typeof topDepth !== 'number')
      throw new TypeError('Argument 3 `topDepth` must be a number.');

    if (topDepth < 1)
      throw new RangeError('Argument 3 `topDepth` must be >= 1.');
  }

  const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
  const jsdocComments = await codeToJsdocComments(code, TEST_CODE_FILE_PATH);
  const members = jsdocCommentsToMembers(
    jsdocComments,
    codeFiles,
    TEST_CODE_FILE_PATH
  );
  const mdAst = membersToMdAst(members, codeFiles, topDepth);

  await snapshot(
    JSON.stringify(mdAst, null, 2),
    new URL(`./snapshots/membersToMdAst/${snapshotName}.json`, import.meta.url)
  );

  const md = unified()
    .use(remarkGfm)
    .use(remarkStringify, REMARK_STRINGIFY_OPTIONS)
    .stringify(mdAst);

  await snapshot(
    md,
    new URL(`./snapshots/membersToMdAst/${snapshotName}.md`, import.meta.url)
  );
}
