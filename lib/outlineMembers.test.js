const t = require('tap')
const CircularJSON = require('circular-json')
const doctrine = require('doctrine')
const outlineMembers = require('./outlineMembers')
const jsdocAstToMember = require('./jsdocAstToMember')

t.test('outlineMembers', t => {
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
     @type {Object}
     @prop {string} a Description.`
  ].reduce((members, doclet) => {
    const member = jsdocAstToMember(doctrine.parse(doclet))
    if (member) members.push(member)
    return members
  }, [])

  t.matchSnapshot(
    CircularJSON.stringify(outlineMembers(members), null, 2),
    'Outlined members.'
  )

  t.end()
})
