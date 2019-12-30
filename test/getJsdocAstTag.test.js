'use strict'

const { deepStrictEqual, strictEqual } = require('assert')
const doctrine = require('doctrine')
const getJsdocAstTag = require('../lib/getJsdocAstTag')

module.exports = tests => {
  tests.add('`getJsdocAstTag` with a tag.', () => {
    deepStrictEqual(getJsdocAstTag(doctrine.parse('@name a').tags, 'name'), {
      title: 'name',
      description: null,
      name: 'a'
    })
  })

  tests.add('`getJsdocAstTag` with a tag override.', () => {
    deepStrictEqual(
      getJsdocAstTag(
        doctrine.parse(
          `@name a
@name b`
        ).tags,
        'name'
      ),
      {
        title: 'name',
        description: null,
        name: 'b'
      }
    )
  })

  tests.add('`getJsdocAstTag` with no tag.', () => {
    strictEqual(getJsdocAstTag(doctrine.parse('').tags, 'name'), undefined)
  })
}
