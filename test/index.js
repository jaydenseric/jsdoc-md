'use strict'

const { TestDirector } = require('test-director')

const tests = new TestDirector()

require('./cli/jsdoc-md.test')(tests)
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
