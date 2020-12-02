'use strict';

const { deepStrictEqual } = require('assert');
const codeToJsdocComments = require('../../private/codeToJsdocComments');

module.exports = (tests) => {
  tests.add('`codeToJsdocComments`.', () => {
    deepStrictEqual(
      codeToJsdocComments(
        `/**
 * a
 */
let a

/** b */
let b

const c = '/** c */'

/* d */

/*
e
*/

// f
`
      ),
      [
        `/**
 * a
 */`,
        '/** b */',
      ]
    );
  });
};
