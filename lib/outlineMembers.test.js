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
     @param {A} a Description.`,

    `Description.
     @kind function
     @name A#methodName1
     @param {A} a Description.`,

    `Description.
     @kind function
     @name A#methodName2
     @param {A} a Description.`,

    `Description.
     @kind function
     @name A~methodName3
     @ignore`
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
