const toc = require('remark-toc')
const unified = require('unified')
const getJsdocAstTags = require('./getJsdocAstTags')
const membersToOutline = require('./membersToOutline')
const mdToMdAst = require('./mdToMdAst')
const typeJsdocAstToMdAst = require('./typeJsdocAstToMdAst')

const MEMBERSHIPS = {
  '.': 'static',
  '#': 'instance',
  '~': 'inner'
}

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
  const outline = membersToOutline(members)
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
   * @param {Object} options Options.
   * @param {number} options.depth Top heading level for the member.
   * @param {Object} [options.parentMember] Parent member.
   * @param {Object[]} options.childMembers Child members of the parent member.
   * @ignore
   */
  const recurse = ({ depth, parentMember, childMembers }) => {
    childMembers.forEach(member => {
      mdast.children.push({
        type: 'heading',
        depth,
        children: [
          {
            type: 'text',
            value: `${member.memberof ? `${member.memberof} ` : ''}${
              parentMember && parentMember.kind === 'class'
                ? `${MEMBERSHIPS[member.membership]} ${
                    member.kind === 'function' && member.membership !== '~'
                      ? 'method'
                      : member.kind === 'member'
                        ? 'property'
                        : member.kind
                  }`
                : member.kind
            } ${member.name}`
          }
        ]
      })

      if (member.description)
        mdast.children.push(...mdToMdAst(member.description))

      if (member.kind === 'typedef') {
        const propTags = getJsdocAstTags(member.tags, 'prop')
        if (propTags) {
          const propTable = {
            type: 'table',
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
            const typeCellChildren = typeJsdocAstToMdAst(tag.type, members)

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
                  children: [{ type: 'text', value: tag.name }]
                },
                { type: 'tableCell', children: typeCellChildren },
                { type: 'tableCell', children: mdToMdAst(tag.description) }
              ]
            })
          })

          mdast.children.push(propTable)
        }
      }

      if (member.kind === 'function' || member.kind === 'class') {
        const paramTags = getJsdocAstTags(member.tags, 'param')
        if (paramTags) {
          const paramTable = {
            type: 'table',
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
            const typeCellChildren = typeJsdocAstToMdAst(tag.type, members)

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
                  children: [{ type: 'text', value: tag.name }]
                },
                { type: 'tableCell', children: typeCellChildren },
                { type: 'tableCell', children: mdToMdAst(tag.description) }
              ]
            })
          })

          mdast.children.push(paramTable)
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
            children: mdToMdAst(tag.description)
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
              children: [{ type: 'emphasis', children: mdToMdAst(tag.caption) }]
            })

          mdast.children.push({
            type: 'blockquote',
            children: mdToMdAst(tag.description)
          })
        })
      }

      if (member.members)
        recurse({
          depth: depth + 1,
          parentMember: member,
          childMembers: member.members
        })
    })
  }

  recurse({ depth, childMembers: outline })

  // Return markdown AST.
  return unified()
    .use(toc, {
      // Prettier formatting.
      tight: true
    })
    .runSync(mdast)
}

module.exports = membersToMdAst
