const { readFileSync, writeFileSync } = require('fs')
const { parse: babelParse } = require('@babel/parser')
const doctrine = require('doctrine')
const toc = require('remark-toc')
const stringify = require('remark-stringify')
const parse = require('remark-parse')
const unified = require('unified')
const mdastInject = require('mdast-util-inject')
const glob = require('glob')

const DEFAULTS = {
  sourceGlob: '**/*.{mjs,js}',
  markdownPath: 'readme.md',
  targetHeading: 'API'
}

const MEMBERSHIPS = {
  '.': 'static',
  '#': 'instance',
  '~': 'inner'
}

/**
 * Gets JSDoc comments from a code string.
 * @kind function
 * @name jsdocCommentsFromCode
 * @param {string} code Code to search.
 * @returns {string[]} JSDoc comment values.
 * @ignore
 */
const jsdocCommentsFromCode = code => {
  const { comments } = babelParse(code, {
    plugins: [
      'classProperties',
      'decorators',
      'dynamicImport',
      'jsx',
      'objectRestSpread',
      'typescript'
    ]
  })
  return comments.reduce((comments, { value }) => {
    if (value.match(/^\*\s/)) comments.push(value)
    return comments
  }, [])
}

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
 * @name deconstructJsdocNamepath
 * @param {string} namepath A JSDoc namepath.
 * @returns {Object} Namepath parts.
 * @ignore
 */
function deconstructJsdocNamepath(namepath) {
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
    ...deconstructJsdocNamepath(namepath),
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
 * @param {string} [options.targetHeading='API'] Heading text of the section to replace.
 * @param {Object} [options.replacementAst] Replacement markdown AST (with a [`root`](https://github.com/syntax-tree/mdast#root) top level type), defaulting to empty.
 * @returns {function} Remark transform function.
 * @ignore
 */
const remarkPluginReplaceSection = ({
  targetHeading = 'API',
  replacementAst = {
    type: 'root',
    children: []
  }
} = {}) => (targetAst, file, next) => {
  mdastInject(targetHeading, targetAst, replacementAst)
    ? next()
    : next(new Error(`Missing target heading “${targetHeading}”.`))
}

/**
 * Replaces the content of a section in a markdown file.
 * @kind function
 * @name mdFileReplaceSection
 * @param {Object} options Options.
 * @param {string} options.markdownPath Markdown file path.
 * @param {string} options.targetHeading Heading text of the section to replace.
 * @param {Object} options.replacementAst Replacement markdown AST (with a [`root`](https://github.com/syntax-tree/mdast#root) top level type), defaulting to empty.
 * @ignore
 */
function mdFileReplaceSection({ markdownPath, targetHeading, replacementAst }) {
  const fileContent = readFileSync(markdownPath, { encoding: 'utf8' })
  const newFileContent = unified()
    .use(parse)
    .use(stringify, {
      // Prettier formatting.
      listItemIndent: '1'
    })
    .use(remarkPluginReplaceSection, { targetHeading, replacementAst })
    .processSync(fileContent)

  writeFileSync(markdownPath, newFileContent)
}

/**
 * Scrapes JSDoc from files to populate a markdown file documentation section.
 * @kind function
 * @name jsdocMd
 * @param {Object} [options] Options.
 * @param {string} [options.sourceGlob=**\/*.{mjs,js}] JSDoc source file glob pattern.
 * @param {string} [options.markdownPath=readme.md] Path to the markdown file for docs insertion.
 * @param {string} [options.targetHeading=API] Markdown file heading to insert docs under.
 * @example <caption>Customizing all options.</caption>
 * const { jsdocMd } = require('jsdoc-md')
 *
 * jsdocMd({
 *   sourceGlob: 'index.mjs',
 *   markdownPath: 'README.md',
 *   targetHeading: 'Docs'
 * })
 */
function jsdocMd({
  sourceGlob = DEFAULTS.sourceGlob,
  markdownPath = DEFAULTS.markdownPath,
  targetHeading = DEFAULTS.targetHeading
} = {}) {
  const members = []

  glob.sync(sourceGlob).forEach(path => {
    jsdocCommentsFromCode(readFileSync(path, { encoding: 'utf8' })).forEach(
      jsdocComment => {
        const member = jsdocAstToMember(
          doctrine.parse(jsdocComment, {
            unwrap: true,
            sloppy: true
          })
        )
        if (member) members.push(member)
      }
    )
  })

  mdFileReplaceSection({
    markdownPath,
    targetHeading,
    replacementAst: outlineToMdAst(membersToOutline(members))
  })
}

module.exports = {
  DEFAULTS,
  jsdocCommentsFromCode,
  getJsdocAstTag,
  getJsdocAstTags,
  deconstructJsdocNamepath,
  jsdocAstToMember,
  membersToOutline,
  mdToMdAst,
  outlineToMdAst,
  remarkPluginReplaceSection,
  mdFileReplaceSection,
  jsdocMd
}
