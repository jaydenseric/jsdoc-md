'use strict'

const t = require('tap')
const jsdocToMember = require('./jsdocToMember')
const outlineMembers = require('./outlineMembers')
const replaceJsdocLinks = require('./replaceJsdocLinks')

t.test('replaceJsdocLinks', t => {
  const outlinedMembers = outlineMembers(
    [
      `Description.
       @kind typedef
       @name A
       @type {string}`,

      `Description.
       @kind typedef
       @name B
       @type {string}`
    ].reduce((members, jsdoc) => {
      const member = jsdocToMember(jsdoc)
      if (member) members.push(member)
      return members
    }, [])
  )

  t.equal(
    replaceJsdocLinks('See [A]{@link A}.', outlinedMembers),
    'See [A](#type-a).',
    'Single link in a sentence.'
  )

  t.equal(
    replaceJsdocLinks('[A]{@link A} [B]{@link B}', outlinedMembers),
    '[A](#type-a) [B](#type-b)',
    'Multiple links.'
  )

  t.throws(
    () => {
      replaceJsdocLinks('[C]{@link C}', outlinedMembers)
    },
    new Error('Missing JSDoc member for link namepath “C”.'),
    'Throws.'
  )

  t.end()
})
