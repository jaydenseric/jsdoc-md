'use strict';

const { throws } = require('assert');
const { resolve } = require('path');
const { stringify } = require('flatted');
const snapshot = require('snapshot-assertion');
const outlineMembers = require('../../private/outlineMembers');
const jsdocCommentsToMembers = require('../jsdocCommentsToMembers');

module.exports = (tests) => {
  tests.add('`outlineMembers` with no missing members.', async () => {
    await snapshot(
      stringify(
        outlineMembers(
          jsdocCommentsToMembers([
            `/**
 * Description.
 * @kind class
 * @name A
 * @param {string} a Description.
 */`,
            `/**
 * Description.
 * @kind event
 * @name A#event:a
 * @type {object}
 * @prop {string} a Description.
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
 * @fires A#event:a
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
          ])
        ),
        null,
        2
      ),
      resolve(__dirname, '../snapshots/outlineMembers.json')
    );
  });

  tests.add('`outlineMembers` with missing members.', () => {
    throws(() => {
      outlineMembers(
        jsdocCommentsToMembers([
          `/**
 * Description.
 * @kind function
 * @name A.a
 */`,
        ])
      );
    }, new Error('Missing JSDoc for namepath “A”.'));
  });
};
