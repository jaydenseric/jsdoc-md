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
    const jsdocComments = codeToJsdocComments(code, TEST_CODE_FILE_PATH);
    const members = jsdocCommentsToMembers(
      jsdocComments,
      code,
      TEST_CODE_FILE_PATH
    );

    await snapshot(
      stringify(outlineMembers(members), null, 2),
      resolve(__dirname, '../snapshots/outlineMembers.json')
    );
  });

  tests.add('`outlineMembers` with missing members.', () => {
    const code = `/**
 * @kind member
 * @name A.a
 */`;
    const jsdocComments = codeToJsdocComments(code, TEST_CODE_FILE_PATH);
    const members = jsdocCommentsToMembers(
      jsdocComments,
      code,
      TEST_CODE_FILE_PATH
    );

    throws(() => {
      outlineMembers(members);
    }, new Error('Missing JSDoc for namepath “A”.'));
  });
};
