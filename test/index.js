'use strict'

const { TestDirector } = require('test-director')
const deconstructJsdocNamepath = require('./deconstructJsdocNamepath.test')
const getJsdocAstTag = require('./getJsdocAstTag.test')
const getJsdocAstTags = require('./getJsdocAstTags.test')
const jsdocCommentsFromCode = require('./jsdocCommentsFromCode.test')
const jsdocMd = require('./jsdocMd.test')
const jsdocToMember = require('./jsdocToMember.test')
const mdFileReplaceSection = require('./mdFileReplaceSection.test')
const mdToMdAst = require('./mdToMdAst.test')
const membersToMdAst = require('./membersToMdAst.test')
const outlineMembers = require('./outlineMembers.test')
const remarkPluginReplaceSection = require('./remarkPluginReplaceSection.test')
const replaceJsdocLinks = require('./replaceJsdocLinks.test')
const typeJsdocAstToMdAst = require('./typeJsdocAstToMdAst.test')
const typeJsdocStringToJsdocAst = require('./typeJsdocStringToJsdocAst.test')

process
  .on('uncaughtException', error => {
    console.error('Uncaught exception:', error)
    process.exitCode = 1
  })
  .on('unhandledRejection', error => {
    console.error('Unhandled rejection:', error)
    process.exitCode = 1
  })

const tests = new TestDirector()

deconstructJsdocNamepath(tests)
getJsdocAstTag(tests)
getJsdocAstTags(tests)
jsdocCommentsFromCode(tests)
jsdocMd(tests)
jsdocToMember(tests)
mdFileReplaceSection(tests)
mdToMdAst(tests)
membersToMdAst(tests)
outlineMembers(tests)
remarkPluginReplaceSection(tests)
replaceJsdocLinks(tests)
typeJsdocAstToMdAst(tests)
typeJsdocStringToJsdocAst(tests)

tests.run()
