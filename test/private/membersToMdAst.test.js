'use strict';

const { throws } = require('assert');
const membersToMdAst = require('../../private/membersToMdAst');
const jsdocCommentsToMembers = require('../jsdocCommentsToMembers');
const membersToMdAstSnapshot = require('../membersToMdAstSnapshot');

module.exports = (tests) => {
  tests.add('`membersToMdAst` with various members.', async () => {
    await membersToMdAstSnapshot(
      'various-members',
      [
        `/**
 * Description.
 * @kind typedef
 * @name A
 * @type {object}
 * @prop {boolean} [a=true] Description.
 */`,
        `/**
 * Description.
 * @kind typedef
 * @name B
 * @type {Function}
 * @param {object} a Description.
 */`,
        `/**
 * Description.
 * @kind constant
 * @name C
 * @type {string}
 */`,
        `/**
 * Description, see [E]{@link E}.
 * @kind function
 * @name d
 * @param {string} [a=C] Description.
 */`,
        `/**
 * Description.
 *
 * # Description heading
 *
 * @kind class
 * @name E
 * @param {string} a Description.
 * @example <caption>Example caption.</caption>
 * # Heading
 * \`\`\`js
 * new E('a');
 * \`\`\`
 */`,
        `/**
 * Description.
 * @kind event
 * @name E#event:a
 * @type {object}
 * @prop {string} a Description.
 */`,
        `/**
 * Description.
 * @kind event
 * @name E#event:b
 * @type {object}
 * @prop {string} a Description.
 */`,
        `/**
 * Description.
 * @kind function
 * @name E.a
 * @param {A} a Description.
 * @param {string} b Description.
 * @returns {boolean} Description.
 * @fires E#event:a
 * @fires E#b
 */`,
        `/**
 * Description.
 * @kind function
 * @name E#b
 * @param {A} a Description.
 * @returns Description.
 */`,
        `/**
 * Description.
 * @kind function
 * @name E~c
 * @param {string} a Description.
 */`,
        `/**
 * Description.
 * @kind function
 * @name E~d
 * @ignore
 */`,
        `/**
 * Description.
 * @kind member
 * @name E.e
 * @type {string}
 */`,
        `/**
 * Description.
 * @kind function
 * @name f
 * @returns Description.
 * @see [\`E\`]{@link E}.
 * @see [\`jsdoc-md\` on npm](https://npm.im/jsdoc-md).
 */`,
      ],
      3
    );
  });

  tests.add('`membersToMdAst` with a missing event namepath.', () => {
    throws(() => {
      membersToMdAst(
        jsdocCommentsToMembers([
          `/**
 * @kind class
 * @name A
 */`,
          `/**
 * @kind function
 * @name A#a
 * @fires A#event:a
 */`,
        ])
      );
    }, new Error('Missing JSDoc member for event namepath “A#event:a”.'));
  });
};
