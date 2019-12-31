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

require('./lib/deconstructJsdocNamepath.test')(tests)
require('./lib/getJsdocAstTag.test')(tests)
require('./lib/getJsdocAstTags.test')(tests)
require('./lib/jsdocCommentsFromCode.test')(tests)
require('./lib/jsdocMd.test')(tests)
require('./lib/jsdocToMember.test')(tests)
require('./lib/mdFileReplaceSection.test')(tests)
require('./lib/mdToMdAst.test')(tests)
require('./lib/membersToMdAst.test')(tests)
require('./lib/outlineMembers.test')(tests)
require('./lib/remarkPluginReplaceSection.test')(tests)
require('./lib/replaceJsdocLinks.test')(tests)
require('./lib/typeJsdocAstToMdAst.test')(tests)
require('./lib/typeJsdocStringToJsdocAst.test')(tests)

tests.run()
