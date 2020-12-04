'use strict';

const { throws } = require('assert');
const { resolve } = require('path');
const { stringify } = require('flatted');
const snapshot = require('snapshot-assertion');
const codeToJsdocComments = require('../../private/codeToJsdocComments');
const outlineMembers = require('../../private/outlineMembers');
const jsdocCommentsToMembers = require('../jsdocCommentsToMembers');

const TEST_CODE_FILE_PATH = '/a.js';

module.exports = (tests) => {
  tests.add(
    '`outlineMembers` with first argument `members` not an array.',
    () => {
      throws(() => {
        outlineMembers(true);
      }, new TypeError('First argument “members” must be an array.'));
    }
  );

  tests.add('`outlineMembers` with no missing members.', async () => {
    const code = `/**
 * Description.
 * @kind class
 * @name A
 * @param {string} a Description.
 */

 /**
 * Description.
 * @kind event
 * @name A#event:a
 * @type {object}
 * @prop {string} a Description.
 */

 /**
 * Description.
 * @kind function
 * @name A.a
 * @param {B} a Description.
 */

 /**
 * Description.
 * @kind function
 * @name A#b
 * @fires A#event:a
 */

 /**
 * Description.
 * @kind function
 * @name A~c
 */

 /**
 * Description.
 * @kind member
 * @name A#d
 * @type {object}
 */

/**
 * Description.
 * @kind typedef
 * @name B
 * @type {object}
 * @prop {string} a Description.
 */`;
    const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
    const jsdocComments = await codeToJsdocComments(code, TEST_CODE_FILE_PATH);
    const members = jsdocCommentsToMembers(
      jsdocComments,
      codeFiles,
      TEST_CODE_FILE_PATH
    );

    await snapshot(
      stringify(outlineMembers(members), null, 2),
      resolve(__dirname, '../snapshots/outlineMembers.json')
    );
  });

  tests.add('`outlineMembers` with missing members.', async () => {
    const code = `/**
 * @kind member
 * @name A.a
 */`;
    const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
    const jsdocComments = await codeToJsdocComments(code, TEST_CODE_FILE_PATH);
    const members = jsdocCommentsToMembers(
      jsdocComments,
      codeFiles,
      TEST_CODE_FILE_PATH
    );

    throws(() => {
      outlineMembers(members);
    }, new Error('Missing JSDoc for namepath “A”.'));
  });
};
