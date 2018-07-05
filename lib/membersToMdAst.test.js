const t = require('tap')
const doctrine = require('doctrine')
const stringify = require('remark-stringify')
const unified = require('unified')
const membersToMdAst = require('./membersToMdAst')
const jsdocAstToMember = require('./jsdocAstToMember')

t.test('membersToMdAst', t => {
  t.throws(
    () => {
      membersToMdAst([
        jsdocAstToMember(
          doctrine.parse(
            `Description.
             @kind typedef
             @name A`
          )
        )
      ])
    },
    new Error('Missing JSDoc typedef @type tag for namepath “A”.'),
    'Throws'
  )

  const members = [
    `Description.
     @kind typedef
     @name A
     @type {Object}
     @prop {boolean} a Description.`,

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
     @param {string} a Description.`,

    `Description.
     @kind typedef
     @name E
     @type {function}
     @param {boolean} a Description.`
  ].reduce((members, doclet) => {
    const member = jsdocAstToMember(doctrine.parse(doclet))
    if (member) members.push(member)
    return members
  }, [])

  const mdAst = membersToMdAst(members, 3)

  t.matchSnapshot(JSON.stringify(mdAst, null, 2), 'Markdown AST.')

  const md = unified()
    .use(stringify, {
      // Prettier formatting.
      listItemIndent: '1'
    })
    .stringify(mdAst)

  t.matchSnapshot(md, 'Markdown.')

  t.end()
})
