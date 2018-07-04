const { readFileSync } = require('fs')
const doctrine = require('doctrine')
const globby = require('globby')
const mdFileReplaceSection = require('./mdFileReplaceSection')
const jsdocCommentsFromCode = require('./jsdocCommentsFromCode')
const jsdocAstToMember = require('./jsdocAstToMember')
const membersToMdAst = require('./membersToMdAst')
const { DEFAULTS } = require('./constants')

/**
 * Scrapes JSDoc from files to populate a markdown file documentation section.
 * @kind function
 * @name jsdocMd
 * @param {Object} [options] Options.
 * @param {string} [options.sourceGlob=**\/*.{mjs,js}] JSDoc source file glob pattern.
 * @param {string} [options.markdownPath=readme.md] Path to the markdown file for docs insertion.
 * @param {string} [options.targetHeading=API] Markdown file heading to insert docs under.
 * @example <caption>Customizing all options.</caption>
 * ```js
 * const { jsdocMd } = require('jsdoc-md')
 *
 * jsdocMd({
 *   sourceGlob: 'index.mjs',
 *   markdownPath: 'README.md',
 *   targetHeading: 'Docs'
 * })
 * ```
 */
function jsdocMd({
  sourceGlob = DEFAULTS.sourceGlob,
  markdownPath = DEFAULTS.markdownPath,
  targetHeading = DEFAULTS.targetHeading
} = {}) {
  const members = []

  globby.sync(sourceGlob, { gitignore: true }).forEach(path => {
    jsdocCommentsFromCode(readFileSync(path, { encoding: 'utf8' })).forEach(
      jsdocComment => {
        const member = jsdocAstToMember(
          doctrine.parse(jsdocComment, { unwrap: true, sloppy: true })
        )
        if (member) members.push(member)
      }
    )
  })

  mdFileReplaceSection({
    markdownPath,
    targetHeading,
    replacementAst: membersToMdAst(members)
  })
}

module.exports = jsdocMd
