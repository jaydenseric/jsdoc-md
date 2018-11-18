const toc = require('remark-toc')
const unified = require('unified')
const getJsdocAstTag = require('./getJsdocAstTag')
const getJsdocAstTags = require('./getJsdocAstTags')
const mdToMdAst = require('./mdToMdAst')
const outlineMembers = require('./outlineMembers')
const typeJsdocAstToMdAst = require('./typeJsdocAstToMdAst')

const MEMBERSHIP_ORDER = ['.', '#', '~']
const KIND_ORDER = [
  'external',
  'file',
  'module',
  'namespace',
  'class',
  'function',
  'member',
  'constant',
  'event',
  'mixin',
  'typedef'
]

/**
 * Converts members to a markdown AST.
 * @kind function
 * @name membersToMdAst
 * @param {Object[]} members Members.
 * @param {number} depth Top heading level.
 * @returns {Object} Markdown AST.
 * @ignore
 */
const membersToMdAst = (members, depth = 1) => {
  const outlinedMembers = outlineMembers(members)
  const mdast = {
    type: 'root',
    children: [
      {
        type: 'heading',
        depth,
        children: [{ type: 'text', value: 'Table of contents' }]
      }
    ]
  }

  /**
   * Recursively constructs the markdown AST.
   * @kind function
   * @name membersToMdAst~recurse
   * @param {Object[]} [members] Outline members.
   * @param {number} depth Top heading level for the members.
   * @ignore
   */
  const recurse = (members, depth) => {
    members
      .sort((a, b) =>
        a.membership !== b.membership
          ? MEMBERSHIP_ORDER.indexOf(a.membership) -
            MEMBERSHIP_ORDER.indexOf(b.membership)
          : a.kind !== b.kind
          ? KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind)
          : a.name.localeCompare(b.name)
      )
      .forEach(member => {
        mdast.children.push({
          type: 'heading',
          depth,
          children: [{ type: 'text', value: member.heading }]
        })

        if (member.description)
          mdast.children.push(...mdToMdAst(member.description, outlinedMembers))

        if (member.kind === 'typedef') {
          const typeTag = getJsdocAstTag(member.tags, 'type')

          if (!typeTag)
            throw new Error(
              `Missing JSDoc typedef @type tag for namepath “${member.name}”.`
            )

          mdast.children.push({
            type: 'paragraph',
            children: [
              { type: 'strong', children: [{ type: 'text', value: 'Type:' }] },
              { type: 'text', value: ' ' },
              ...typeJsdocAstToMdAst(typeTag.type, outlinedMembers)
            ]
          })

          const propTags = getJsdocAstTags(member.tags, 'prop')
          if (propTags) {
            const propTable = {
              type: 'table',
              align: ['left', 'left', 'left'],
              children: [
                {
                  type: 'tableRow',
                  children: [
                    {
                      type: 'tableCell',
                      children: [{ type: 'text', value: 'Property' }]
                    },
                    {
                      type: 'tableCell',
                      children: [{ type: 'text', value: 'Type' }]
                    },
                    {
                      type: 'tableCell',
                      children: [{ type: 'text', value: 'Description' }]
                    }
                  ]
                }
              ]
            }

            propTags.forEach(tag => {
              const typeCellChildren = typeJsdocAstToMdAst(
                tag.type,
                outlinedMembers
              )

              if ('default' in tag)
                typeCellChildren.push(
                  { type: 'text', value: ' = ' },
                  { type: 'inlineCode', value: tag.default }
                )

              propTable.children.push({
                type: 'tableRow',
                children: [
                  {
                    type: 'tableCell',
                    children: [{ type: 'inlineCode', value: tag.name }]
                  },
                  { type: 'tableCell', children: typeCellChildren },
                  {
                    type: 'tableCell',
                    children: mdToMdAst(tag.description, outlinedMembers)
                  }
                ]
              })
            })

            mdast.children.push(propTable)
          }
        }

        if (
          member.kind === 'typedef' ||
          member.kind === 'function' ||
          member.kind === 'class'
        ) {
          const paramTags = getJsdocAstTags(member.tags, 'param')
          if (paramTags) {
            const paramTable = {
              type: 'table',
              align: ['left', 'left', 'left'],
              children: [
                {
                  type: 'tableRow',
                  children: [
                    {
                      type: 'tableCell',
                      children: [{ type: 'text', value: 'Parameter' }]
                    },
                    {
                      type: 'tableCell',
                      children: [{ type: 'text', value: 'Type' }]
                    },
                    {
                      type: 'tableCell',
                      children: [{ type: 'text', value: 'Description' }]
                    }
                  ]
                }
              ]
            }

            paramTags.forEach(tag => {
              const typeCellChildren = typeJsdocAstToMdAst(
                tag.type,
                outlinedMembers
              )

              if ('default' in tag)
                typeCellChildren.push(
                  { type: 'text', value: ' = ' },
                  { type: 'inlineCode', value: tag.default }
                )

              paramTable.children.push({
                type: 'tableRow',
                children: [
                  {
                    type: 'tableCell',
                    children: [{ type: 'inlineCode', value: tag.name }]
                  },
                  { type: 'tableCell', children: typeCellChildren },
                  {
                    type: 'tableCell',
                    children: mdToMdAst(tag.description, outlinedMembers)
                  }
                ]
              })
            })

            mdast.children.push(paramTable)
          }
        }

        if (member.kind === 'typedef' || member.kind === 'function') {
          const returnsTag = getJsdocAstTag(member.tags, 'returns')
          if (returnsTag) {
            const children = [
              {
                type: 'strong',
                children: [{ type: 'text', value: 'Returns:' }]
              }
            ]

            if (returnsTag.type)
              children.push(
                { type: 'text', value: ' ' },
                ...typeJsdocAstToMdAst(returnsTag.type, outlinedMembers)
              )

            if (returnsTag.description)
              children.push(
                { type: 'text', value: returnsTag.type ? ' — ' : ' ' },
                ...mdToMdAst(returnsTag.description, outlinedMembers)
              )

            mdast.children.push({ type: 'paragraph', children })
          }
        }

        const seeTags = getJsdocAstTags(member.tags, 'see')
        if (seeTags) {
          mdast.children.push({
            type: 'heading',
            depth: depth + 1,
            children: [{ type: 'text', value: 'See' }]
          })

          const seeTagsList = { type: 'list', ordered: false, children: [] }

          seeTags.forEach(tag => {
            seeTagsList.children.push({
              type: 'listItem',
              children: mdToMdAst(tag.description, outlinedMembers)
            })
          })

          mdast.children.push(seeTagsList)
        }

        const exampleTags = getJsdocAstTags(member.tags, 'example')
        if (exampleTags) {
          mdast.children.push({
            type: 'heading',
            depth: depth + 1,
            children: [{ type: 'text', value: 'Examples' }]
          })

          exampleTags.forEach(tag => {
            if (tag.caption)
              mdast.children.push({
                type: 'paragraph',
                children: [
                  {
                    type: 'emphasis',
                    children: mdToMdAst(tag.caption, outlinedMembers)
                  }
                ]
              })

            mdast.children.push({
              type: 'blockquote',
              children: mdToMdAst(tag.description, outlinedMembers)
            })
          })
        }

        if (member.children) recurse(member.children, depth + 1)
      })
  }

  const topMembers = outlinedMembers.filter(({ parent }) => !parent)
  recurse(topMembers, depth)

  // Return markdown AST.
  return unified()
    .use(toc, {
      // Prettier formatting.
      tight: true
    })
    .runSync(mdast)
}

module.exports = membersToMdAst
