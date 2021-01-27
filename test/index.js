'use strict';

const { TestDirector } = require('test-director');

const tests = new TestDirector();

require('./replaceStackTraces.test')(tests);
require('./cli/jsdoc-md.test')(tests);
require('./private/CliError.test')(tests);
require('./private/codeToJsdocComments.test')(tests);
require('./private/deconstructJsdocNamepath.test')(tests);
require('./private/getJsdocBlockDescriptionSource.test')(tests);
require('./private/getJsdocSourceTokenCodeLocation.test')(tests);
require('./private/CodeLocation.test')(tests);
require('./private/CodePosition.test')(tests);
require('./private/InvalidJsdocError.test')(tests);
require('./private/jsdocCommentToMember.test')(tests);
require('./private/mdFileReplaceSection.test')(tests);
require('./private/jsdocDataMdToMdAst.test')(tests);
require('./private/membersToMdAst.test')(tests);
require('./private/outlineMembers.test')(tests);
require('./private/parseJsdocExample.test')(tests);
require('./private/remarkPluginReplaceSection.test')(tests);
require('./private/reportCliError.test')(tests);
require('./private/typeAstToMdAst.test')(tests);
require('./private/typeToTypeAst.test')(tests);
require('./private/unescapeJsdoc.test')(tests);
require('./public/jsdocMd.test')(tests);

tests.run();
