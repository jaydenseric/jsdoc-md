'use strict';

const { deepStrictEqual } = require('assert');
const jsdocCommentsFromCode = require('../../private/jsdocCommentsFromCode');

module.exports = (tests) => {
  tests.add('`jsdocCommentsFromCode`.', () => {
    deepStrictEqual(
      jsdocCommentsFromCode(
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
