'use strict'

const { resolve } = require('path')
const stringify = require('remark-stringify')
const snapshot = require('snapshot-assertion')
const unified = require('unified')
const jsdocToMember = require('../../lib/jsdocToMember')
const membersToMdAst = require('../../lib/membersToMdAst')

module.exports = tests => {
  tests.add('`membersToMdAst`.', async () => {
    const members = [
      `Description.
@kind typedef
@name A
@type {object}
@prop {boolean} [a=true] Description.`,

      `Description.
@kind typedef
@name B
@type {Function}
@param {object} a Description.`,

      `Description.
@kind constant
@name C
@type {string}`,

      `Description, see [E]{@link E}.
@kind function
@name d
@param {string} [a=C] Description.`,

      `Description.

# Description heading

@kind class
@name E
@param {string} a Description.
@example <caption>Example caption.</caption>
# Heading
\`\`\`js
new E('a')
\`\`\`
`,

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

    await snapshot(
      JSON.stringify(mdAst, null, 2),
      resolve(__dirname, '../snapshots', 'membersToMdAst.json')
    )

    const md = unified()
      .use(stringify, {
        // Prettier formatting.
        listItemIndent: '1'
      })
      .stringify(mdAst)

    await snapshot(md, resolve(__dirname, '../snapshots', 'membersToMdAst.md'))
  })
}
