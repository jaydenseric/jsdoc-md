'use strict'

const { TestDirector } = require('test-director')

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

require('./deconstructJsdocNamepath.test')(tests)
require('./getJsdocAstTag.test')(tests)
require('./getJsdocAstTags.test')(tests)
require('./jsdocCommentsFromCode.test')(tests)
require('./jsdocMd.test')(tests)
require('./jsdocToMember.test')(tests)
require('./mdFileReplaceSection.test')(tests)
require('./mdToMdAst.test')(tests)
require('./membersToMdAst.test')(tests)
require('./outlineMembers.test')(tests)
require('./remarkPluginReplaceSection.test')(tests)
require('./replaceJsdocLinks.test')(tests)
require('./typeJsdocAstToMdAst.test')(tests)
require('./typeJsdocStringToJsdocAst.test')(tests)

tests.run()
