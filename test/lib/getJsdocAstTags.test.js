'use strict';

const { deepStrictEqual, strictEqual } = require('assert');
const doctrine = require('doctrine');
const getJsdocAstTags = require('../../lib/getJsdocAstTags');

module.exports = (tests) => {
  tests.add('`getJsdocAstTags` with @param.', () => {
    deepStrictEqual(
      getJsdocAstTags(
        doctrine.parse(
          `Description.
@kind function
@name a
@param {string} a Description.
@param {string} b Description.`
        ).tags,
        'param'
      ),
      [
        {
          title: 'param',
          description: 'Description.',
          type: { type: 'NameExpression', name: 'string' },
          name: 'a',
        },
        {
          title: 'param',
          description: 'Description.',
          type: { type: 'NameExpression', name: 'string' },
          name: 'b',
        },
      ]
    );
  });

  tests.add('`getJsdocAstTags` with no tags.', () => {
    strictEqual(getJsdocAstTags(doctrine.parse('').tags, 'param'), undefined);
  });
};
