const t = require('tap')
const doctrine = require('doctrine')
const membersToOutline = require('./membersToOutline')
const jsdocAstToMember = require('./jsdocAstToMember')

t.test('membersToOutline', t => {
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
    JSON.stringify(membersToOutline(members), null, 2),
    'Outline.'
  )

  t.end()
})
