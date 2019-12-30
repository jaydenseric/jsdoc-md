'use strict'

const { readFileSync } = require('fs')
const globby = require('globby')
const DEFAULTS = require('./defaults')
const jsdocCommentsFromCode = require('./jsdocCommentsFromCode')
const jsdocToMember = require('./jsdocToMember')
const mdFileReplaceSection = require('./mdFileReplaceSection')
const membersToMdAst = require('./membersToMdAst')

/**
 * Scrapes JSDoc from files to populate a markdown file documentation section.
 * @kind function
 * @name jsdocMd
 * @param {object} [options] Options.
 * @param {string} [options.cwd] A directory path to scope the search for source and .gitignore files, defaulting to `process.cwd()`.
 * @param {string} [options.sourceGlob='**\/*.{mjs,js}'] JSDoc source file glob pattern.
 * @param {string} [options.markdownPath='readme.md'] Path to the markdown file for docs insertion.
 * @param {string} [options.targetHeading='API'] Markdown file heading to insert docs under.
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
module.exports = function jsdocMd({
  cwd = DEFAULTS.cwd,
  sourceGlob = DEFAULTS.sourceGlob,
  markdownPath = DEFAULTS.markdownPath,
  targetHeading = DEFAULTS.targetHeading
} = {}) {
  const members = []

  globby.sync(sourceGlob, { cwd, gitignore: true }).forEach(path => {
    jsdocCommentsFromCode(
      readFileSync(path, { encoding: 'utf8' }),
      path
    ).forEach(jsdoc => {
      const member = jsdocToMember(jsdoc)
      if (member) members.push(member)
    })
  })

  mdFileReplaceSection({
    markdownPath,
    targetHeading,
    replacementAst: membersToMdAst(members)
  })
}
