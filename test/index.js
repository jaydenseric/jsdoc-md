'use strict';

const { TestDirector } = require('test-director');

const tests = new TestDirector();

require('./cli/jsdoc-md.test')(tests);
require('./private/deconstructJsdocNamepath.test')(tests);
require('./private/getJsdocAstTag.test')(tests);
require('./private/getJsdocAstTags.test')(tests);
require('./private/jsdocCommentsFromCode.test')(tests);
require('./private/jsdocCommentToMember.test')(tests);
require('./private/mdFileReplaceSection.test')(tests);
require('./private/mdToMdAst.test')(tests);
require('./private/membersToMdAst.test')(tests);
require('./private/outlineMembers.test')(tests);
require('./private/parseJsdocExample.test')(tests);
require('./private/remarkPluginReplaceSection.test')(tests);
require('./private/replaceJsdocLinks.test')(tests);
require('./private/typeJsdocAstToMdAst.test')(tests);
require('./private/typeJsdocStringToJsdocAst.test')(tests);
require('./private/unescapeJsdoc.test')(tests);
require('./public/jsdocMd.test')(tests);

tests.run();
