'use strict';

const { throws } = require('assert');
const { resolve } = require('path');
const { stringify } = require('flatted');
const snapshot = require('snapshot-assertion');
const jsdocToMember = require('../../lib/jsdocToMember');
const outlineMembers = require('../../lib/outlineMembers');

module.exports = (tests) => {
  tests.add('`outlineMembers` with no missing members.', async () => {
    const members = [
      `/**
 * Description.
 * @kind class
 * @name A
 * @param {string} a Description.
 */`,

      `/**
 * Description.
 * @kind function
 * @name A.a
 * @param {B} a Description.
 */`,

      `/**
 * Description.
 * @kind function
 * @name A#b
 */`,

      `/**
 * Description.
 * @kind function
 * @name A~c
 */`,

      `/**
 * Description.
 * @kind member
 * @name A#d
 * @type {object}
 */`,

      `/**
 * Description.
 * @kind typedef
 * @name B
 * @type {object}
 * @prop {string} a Description.
 */`,
    ].reduce((members, jsdoc) => {
      const member = jsdocToMember(jsdoc);
      if (member) members.push(member);
      return members;
    }, []);

    await snapshot(
      stringify(outlineMembers(members), null, 2),
      resolve(__dirname, '../snapshots', 'outlineMembers.json')
    );
  });

  tests.add('`outlineMembers` with missing members.', () => {
    throws(() => {
      outlineMembers([
        jsdocToMember(
          `/**
 * Description.
 * @kind function
 * @name A.a
 */`
        ),
      ]);
    }, new Error('Missing JSDoc for namepath “A”.'));
  });
};
