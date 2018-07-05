const t = require('tap')
const doctrine = require('doctrine')
const membersToMdAst = require('./membersToMdAst')
const jsdocAstToMember = require('./jsdocAstToMember')

t.test('membersToMdAst', t => {
  const members = [
    `Description.
     @kind typedef
     @name A
     @prop {string} a Description.
     @prop {boolean|string} b Description.`,

    `Description.
     @kind constant
     @name B
     @type {string}`,

    `Description.
     @kind class
     @name C
     @param {A} a Description.`,

    `Description.
     @kind function
     @name C.a
     @param {string} a Description.
     @param {string} b Description.`,

    `Description.
     @kind function
     @name C#b
     @param {string} a Description.`,

    `Description.
     @kind function
     @name C~c
     @param {string} a Description.`,

    `Description.
     @kind function
     @name C~d
     @ignore`,

    `Description.
     @kind member
     @name C.e
     @type {string}`,

    `Description.
     @kind function
     @name d
     @param {string} a Description.`
  ].reduce((members, doclet) => {
    const member = jsdocAstToMember(doctrine.parse(doclet))
    if (member) members.push(member)
    return members
  }, [])

  t.matchSnapshot(
    JSON.stringify(membersToMdAst(members, 3), null, 2),
    'Markdown.'
  )

  t.end()
})
