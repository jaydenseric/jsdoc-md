'use strict'

const { throws } = require('assert')
const { join } = require('path')
const CircularJSON = require('circular-json')
const jsdocToMember = require('../lib/jsdocToMember')
const outlineMembers = require('../lib/outlineMembers')
const snapshot = require('./snapshot')

module.exports = tests => {
  tests.add('`outlineMembers` with no missing members.', async () => {
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

    await snapshot(
      CircularJSON.stringify(outlineMembers(members), null, 2),
      join(__dirname, 'snapshots', 'outlineMembers.json')
    )
  })

  tests.add('`outlineMembers` with missing members.', () => {
    throws(() => {
      outlineMembers([
        jsdocToMember(
          `Description.
@kind function
@name A.a`
        )
      ])
    }, new Error('Missing JSDoc for namepath “A”.'))
  })
}
