'use strict';

const { throws } = require('assert');
const { resolve } = require('path');
const stringify = require('remark-stringify');
const snapshot = require('snapshot-assertion');
const unified = require('unified');
const jsdocToMember = require('../../private/jsdocToMember');
const membersToMdAst = require('../../private/membersToMdAst');

module.exports = (tests) => {
  tests.add('`membersToMdAst` with various members.', async () => {
    const members = [
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
    ].reduce((members, jsdoc) => {
      const member = jsdocToMember(jsdoc);
      if (member) members.push(member);
      return members;
    }, []);

    const mdAst = membersToMdAst(members, 3);

    await snapshot(
      JSON.stringify(mdAst, null, 2),
      resolve(__dirname, '../snapshots/membersToMdAst.json')
    );

    const md = unified()
      .use(stringify, {
        // Prettier formatting.
        listItemIndent: '1',
      })
      .stringify(mdAst);

    await snapshot(md, resolve(__dirname, '../snapshots/membersToMdAst.md'));
  });

  tests.add('`membersToMdAst` with a missing event namepath.', async () => {
    const members = [
      `/**
 * @kind class
 * @name A
 */`,
      `/**
 * @kind function
 * @name A#a
 * @fires A#event:a
 */`,
    ].reduce((members, jsdoc) => {
      const member = jsdocToMember(jsdoc);
      if (member) members.push(member);
      return members;
    }, []);

    throws(() => {
      membersToMdAst(members);
    }, new Error('Missing JSDoc member for event namepath “A#event:a”.'));
  });
};
