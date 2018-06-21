const { readFileSync, writeFileSync } = require('fs')
const doctrine = require('doctrine')
const toc = require('remark-toc')
const stringify = require('remark-stringify')
const parse = require('remark-parse')
const unified = require('unified')
const mdastInject = require('mdast-util-inject')

const MEMBERSHIPS = {
  '.': 'static',
  '#': 'instance',
  '~': 'inner'
}

/**
 * Detects if a Babel AST CommentBlock value is JSDoc.
 * @kind function
 * @name isJsdoc
 * @param {string} comment Babel AST CommentBlock value.
 * @returns {boolean} Is the comment JSDoc.
 * @ignore
 */
const isJsdoc = comment => !!comment.match(/^\*\s/)

/**
 * Gets a Doctrine JSDoc AST tag.
 * @kind function
 * @name getJsdocAstTag
 * @param {Object[]} tags Doctrine AST tags.
 * @param {string} title Tag title.
 * @returns {Object|undefined} The tag, or undefined.
 * @ignore
 */
function getJsdocAstTag(tags, title) {
  if (tags.length)
    // Loop tags backwards as later tags override earlier ones.
    for (let index = tags.length - 1; index >= 0; index--) {
      const tag = tags[index]
      if (tag.title === title) return tag
    }
}

/**
 * Gets a Doctrine JSDoc AST set.
 * @kind function
 * @name getJsdocAstTags
 * @param {Object[]} tags Doctrine AST tags.
 * @param {string} title Tag title.
 * @returns {Object[]|undefined} The tag set, or undefined.
 * @ignore
 */
function getJsdocAstTags(tags, title) {
  if (tags.length) {
    const set = []
    for (let tag of tags) if (tag.title === title) set.push(tag)
    if (set.length) return set
  }
}

/**
 * Decodes a JSDoc namepath.
 * @see [JSDoc namepaths](http://usejsdoc.org/about-namepaths.html)
 * @kind function
 * @name getJsdocNamepathParts
 * @param {string} namepath A JSDoc namepath.
 * @returns {Object} Namepath parts.
 * @ignore
 */
function getJsdocNamepathParts(namepath) {
  const [match, memberof, membership, name] =
    namepath.match(/^(?:([^.#~]+(?:[.#~][^.#~]+)*)([.#~]))?([^.#~]+)$/) || []
  if (!match) throw new Error(`Invalid JSDoc namepath “${namepath}”.`)
  return { memberof, membership, name }
}

/**
 * Converts a Doctrine JSDoc AST to an outline member object.
 * @kind function
 * @name jsdocAstToMember
 * @param {Object} ast Doctrine JSDoc AST.
 * @returns {Object} Outline member.
 * @ignore
 */
const jsdocAstToMember = ast => {
  // Exclude ignored symbol.
  if (getJsdocAstTag(ast.tags, 'ignore')) return

  const { kind } = getJsdocAstTag(ast.tags, 'kind') || {}
  // Ignore symbol without a kind.
  if (!kind) return

  const { name: namepath } = getJsdocAstTag(ast.tags, 'name') || {}
  // Ignore symbol without a name.
  if (!namepath) return

  return {
    kind,
    namepath,
    ...getJsdocNamepathParts(namepath),
    ...ast
  }
}

/**
 * Converts a members list to an outline.
 * @kind function
 * @name membersToOutline
 * @param {Object[]} members Outline members.
 * @returns {Object[]} Outline.
 * @ignore
 */
const membersToOutline = members => {
  // Prevent modification of the input array.
  let membersClone = members.slice()

  /**
   * Recursively constructs the outline.
   * @kind function
   * @name membersToOutline~recurse
   * @param {string} parentNamepath JSDoc namepath of the parent member.
   * @returns {Object[]} Outline.
   * @ignore
   */
  const recurse = parentNamepath => {
    const outline = []

    // Reduce the search each time nodes are placed in the outline.
    membersClone = membersClone.filter(member => {
      if (member.memberof === parentNamepath) {
        outline.push({
          ...member,
          members: recurse(member.namepath)
        })
        return false
      }
      return true
    })

    return outline
  }

  return recurse()
}

/**
 * Converts markdown text to AST.
 * @kind function
 * @name mdToMdAst
 * @param {string} md Markdown.
 * @returns {Object} Markdown AST.
 * @ignore
 */
const mdToMdAst = md =>
  unified()
    .use(parse)
    .parse(md).children

/**
 * Converts a members outline to a markdown AST.
 * @kind function
 * @name outlineToMdAst
 * @param {Object} outline Members outline.
 * @param {number} depth Top heading level.
 * @returns {Object} Markdown AST.
 * @ignore
 */
const outlineToMdAst = (outline, depth = 1) => {
  const mdast = {
    type: 'root',
    children: [
      {
        type: 'heading',
        depth,
        children: [
          {
            type: 'text',
            value: 'Table of contents'
          }
        ]
      }
    ]
  }

  /**
   * Recursively constructs the markdown AST.
   * @kind function
   * @name outlineToMdAst~recurse
   * @param {Object} options Options.
   * @param {Object} [options.parentMember] Parent member.
   * @param {Object[]} members Members.
   * @param {number} depth Top heading level for the member.
   * @ignore
   */
  const recurse = ({ parentMember, members, depth }) => {
    members.forEach(member => {
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
                    children: [
                      {
                        type: 'text',
                        value: 'Property'
                      }
                    ]
                  },
                  {
                    type: 'tableCell',
                    children: [
                      {
                        type: 'text',
                        value: 'Type'
                      }
                    ]
                  },
                  {
                    type: 'tableCell',
                    children: [
                      {
                        type: 'text',
                        value: 'Description'
                      }
                    ]
                  }
                ]
              }
            ]
          }

          propTags.forEach(tag => {
            propTable.children.push({
              type: 'tableRow',
              children: [
                {
                  type: 'tableCell',
                  children: [
                    {
                      type: 'text',
                      value: tag.name
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  children: []
                },
                {
                  type: 'tableCell',
                  children: mdToMdAst(tag.description)
                }
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
                    children: [
                      {
                        type: 'text',
                        value: 'Parameter'
                      }
                    ]
                  },
                  {
                    type: 'tableCell',
                    children: [
                      {
                        type: 'text',
                        value: 'Type'
                      }
                    ]
                  },
                  {
                    type: 'tableCell',
                    children: [
                      {
                        type: 'text',
                        value: 'Description'
                      }
                    ]
                  }
                ]
              }
            ]
          }

          paramTags.forEach(tag => {
            paramTable.children.push({
              type: 'tableRow',
              children: [
                {
                  type: 'tableCell',
                  children: [
                    {
                      type: 'text',
                      value: tag.name
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  children: []
                },
                {
                  type: 'tableCell',
                  children: mdToMdAst(tag.description)
                }
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
          children: [
            {
              type: 'text',
              value: 'See'
            }
          ]
        })

        const seeTagsList = {
          type: 'list',
          ordered: false,
          children: []
        }

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
          children: [
            {
              type: 'text',
              value: 'Examples'
            }
          ]
        })

        exampleTags.forEach(tag => {
          if (tag.caption)
            mdast.children.push({
              type: 'paragraph',
              children: mdToMdAst(tag.caption)
            })

          mdast.children.push({
            type: 'code',
            value: tag.description
          })
        })
      }

      if (member.members)
        recurse({
          parentMember: member,
          members: member.members,
          depth: depth + 1
        })
    })
  }

  recurse({ members: outline, depth })

  // Return markdown AST.
  return unified()
    .use(toc, {
      // Prettier formatting.
      tight: true
    })
    .runSync(mdast)
}

/**
 * A remark plugin that replaces the content of a section with a particular
 * heading.
 * @kind function
 * @name remarkPluginReplaceSection
 * @param {Object} [options] Options.
 * @param {string} [options.heading='API'] Heading text of the section to replace.
 * @param {Object} [options.content] Replacement content markdown AST (with a [`root`](https://github.com/syntax-tree/mdast#root) top level type), defaulting to empty.
 * @returns {function} Remark transform function.
 * @ignore
 */
const remarkPluginReplaceSection = ({
  heading = 'API',
  content = {
    type: 'root',
    children: []
  }
} = {}) => (targetAst, file, next) => {
  mdastInject(heading, targetAst, content)
    ? next()
    : next(new Error(`Missing heading “${heading}”.`))
}

/**
 * Replaces the content of a section in a markdown file.
 * @kind function
 * @name mdFileReplaceSection
 * @param {string} path File path.
 * @param {string} heading Heading text of the section to replace.
 * @param {*} content Replacement content markdown AST (with a [`root`](https://github.com/syntax-tree/mdast#root) top level type), defaulting to empty.
 * @ignore
 */
function mdFileReplaceSection(path, heading, content) {
  const fileContent = readFileSync(path, { encoding: 'utf8' })
  const newFileContent = unified()
    .use(parse)
    .use(stringify, {
      // Prettier formatting.
      listItemIndent: '1'
    })
    .use(remarkPluginReplaceSection, { heading, content })
    .processSync(fileContent)

  writeFileSync(path, newFileContent)
}

/**
 * Babel plugin that scrapes JSDoc to populate a markdown file documentation
 * section.
 * @kind function
 * @name babelPluginJsdocMd
 * @returns {Object} Babel plugin.
 * @example <caption>Babel config, displaying default options.</caption>
 * {
 *   "plugins": [
 *     [
 *       "jsdoc-md",
 *       {
 *         "mdPath": "readme.md",
 *         "heading": "API"
 *       }
 *     ]
 *   ]
 * }
 * @example <caption>Babel config, using defaults.</caption>
 * {
 *   "plugins": ["jsdoc-md"]
 * }
 */
function babelPluginJsdocMd() {
  return {
    post({ ast: { comments } }) {
      const { mdPath = 'readme.md', heading = 'API' } = this.opts
      const members = comments.reduce((members, { value }) => {
        if (isJsdoc(value)) {
          const jsdocAst = doctrine.parse(value, { unwrap: true, sloppy: true })
          const member = jsdocAstToMember(jsdocAst)
          if (member) members.push(member)
        }
        return members
      }, [])
      const outline = membersToOutline(members)
      const mdAst = outlineToMdAst(outline)
      mdFileReplaceSection(mdPath, heading, mdAst)
    }
  }
}

module.exports = {
  isJsdoc,
  getJsdocAstTag,
  getJsdocAstTags,
  getJsdocNamepathParts,
  jsdocAstToMember,
  membersToOutline,
  mdToMdAst,
  outlineToMdAst,
  remarkPluginReplaceSection,
  mdFileReplaceSection,
  babelPluginJsdocMd
}
