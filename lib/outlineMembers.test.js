'use strict'

const CircularJSON = require('circular-json')
const t = require('tap')
const jsdocToMember = require('./jsdocToMember')
const outlineMembers = require('./outlineMembers')

t.test('outlineMembers', t => {
  t.test('Members not missing', t => {
    const members = [
      `Description.
       @kind class
       @name A
       @param {string} a Description.`,

      `Description.
       @kind function
       @name A.a
       @param {B} a Description.`,

      `Description.
       @kind function
       @name A#b`,

      `Description.
       @kind typedef
       @name B
       @type {object}
       @prop {string} a Description.`
    ].reduce((members, jsdoc) => {
      const member = jsdocToMember(jsdoc)
      if (member) members.push(member)
      return members
    }, [])

    t.matchSnapshot(
      CircularJSON.stringify(outlineMembers(members), null, 2),
      'Outlined members.'
    )

    t.end()
  })

  t.test('Members missing', t => {
    const member = jsdocToMember(
      `Description.
       @kind function
       @name A.a`
    )

    t.throws(
      () => {
        outlineMembers([member])
      },
      new Error('Missing JSDoc for namepath “A”.'),
      'Throws.'
    )

    t.end()
  })

  t.end()
})
