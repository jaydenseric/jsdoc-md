const t = require('tap')
const stringify = require('remark-stringify')
const unified = require('unified')
const membersToMdAst = require('./membersToMdAst')
const jsdocToMember = require('./jsdocToMember')

t.test('membersToMdAst', t => {
  t.throws(
    () => {
      membersToMdAst([
        jsdocToMember(
          `Description.
           @kind typedef
           @name A`
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
     @kind typedef
     @name B
     @type {function}
     @param {boolean} a Description.`,

    `Description.
     @kind constant
     @name C
     @type {string}`,

    `Description, see [E]{@link E}.
     @kind function
     @name d
     @param {string} a Description.`,

    `Description.
     @kind class
     @name E
     @param {string} a Description.`,

    `Description.
     @kind function
     @name E.a
     @param {A} a Description.
     @param {string} b Description.
     @returns {boolean} Description.`,

    `Description.
     @kind function
     @name E#b
     @param {A} a Description.
     @returns Description.`,

    `Description.
     @kind function
     @name E~c
     @param {string} a Description.`,

    `Description.
     @kind function
     @name E~d
     @ignore`,

    `Description.
     @kind member
     @name E.e
     @type {string}`
  ].reduce((members, jsdoc) => {
    const member = jsdocToMember(jsdoc)
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
