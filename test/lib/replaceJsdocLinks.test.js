'use strict';

const { strictEqual, throws } = require('assert');
const jsdocToMember = require('../../lib/jsdocToMember');
const outlineMembers = require('../../lib/outlineMembers');
const replaceJsdocLinks = require('../../lib/replaceJsdocLinks');

module.exports = (tests) => {
  const outlinedMembers = outlineMembers(
    [
      `Description.
       @kind typedef
       @name A
       @type {string}`,

      `Description.
       @kind typedef
       @name B
       @type {string}`,
    ].reduce((members, jsdoc) => {
      const member = jsdocToMember(jsdoc);
      if (member) members.push(member);
      return members;
    }, [])
  );

  tests.add('`replaceJsdocLinks` with a single link in a sentence.', () => {
    strictEqual(
      replaceJsdocLinks('See [A]{@link A}.', outlinedMembers),
      'See [A](#type-a).'
    );
  });

  tests.add('`replaceJsdocLinks` with multiple links.', () => {
    strictEqual(
      replaceJsdocLinks('[A]{@link A} [B]{@link B}', outlinedMembers),
      '[A](#type-a) [B](#type-b)'
    );
  });

  tests.add('`replaceJsdocLinks` with a missing member.', () => {
    throws(() => {
      replaceJsdocLinks('[C]{@link C}', outlinedMembers);
    }, new Error('Missing JSDoc member for link namepath “C”.'));
  });
};
