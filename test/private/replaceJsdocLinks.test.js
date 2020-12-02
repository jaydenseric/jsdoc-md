'use strict';

const { strictEqual, throws } = require('assert');
const codeToJsdocComments = require('../../private/codeToJsdocComments');
const outlineMembers = require('../../private/outlineMembers');
const replaceJsdocLinks = require('../../private/replaceJsdocLinks');
const jsdocCommentsToMembers = require('../jsdocCommentsToMembers');

module.exports = (tests) => {
  const jsdocComments = codeToJsdocComments(
    `/**
 * @kind typedef
 * @name A
 */

/**
 * @kind typedef
 * @name B
 */`
  );
  const members = jsdocCommentsToMembers(jsdocComments);
  const outlinedMembers = outlineMembers(members);

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
