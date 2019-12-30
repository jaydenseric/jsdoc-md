'use strict'

const { deepStrictEqual, strictEqual } = require('assert')
const jsdocToMember = require('../lib/jsdocToMember')

module.exports = tests => {
  tests.add('`jsdocToMember` with a method.', () => {
    deepStrictEqual(
      jsdocToMember(
        `Description.
@kind function
@name A#b
@param {number} a Description.`
      ),
      {
        kind: 'function',
        namepath: 'A#b',
        memberof: 'A',
        membership: '#',
        name: 'b',
        description: 'Description.',
        tags: [
          {
            title: 'kind',
            description: null,
            kind: 'function'
          },
          {
            title: 'name',
            description: null,
            name: 'A#b'
          },
          {
            title: 'param',
            description: 'Description.',
            type: {
              type: 'NameExpression',
              name: 'number'
            },
            name: 'a'
          }
        ]
      }
    )
  })

  tests.add('`jsdocToMember` with @ignore.', () => {
    strictEqual(jsdocToMember('@ignore'), undefined)
  })

  tests.add('`jsdocToMember` with a missing kind tag.', () => {
    strictEqual(jsdocToMember('@name A'), undefined)
  })

  tests.add('`jsdocToMember` with a missing name tag.', () => {
    strictEqual(jsdocToMember('@kind function'), undefined)
  })
}
