import TestDirector from "test-director";

import test_jsdocMdCli from "./cli/jsdoc-md.test.mjs";
import test_CliError from "./private/CliError.test.mjs";
import test_CodeLocation from "./private/CodeLocation.test.mjs";
import test_CodePosition from "./private/CodePosition.test.mjs";
import test_codePositionToIndex from "./private/codePositionToIndex.test.mjs";
import test_codeToJsdocComments from "./private/codeToJsdocComments.test.mjs";
import test_deconstructJsdocNamepath from "./private/deconstructJsdocNamepath.test.mjs";
import test_getJsdocBlockDescriptionSource from "./private/getJsdocBlockDescriptionSource.test.mjs";
import test_getJsdocSourceTokenCodeLocation from "./private/getJsdocSourceTokenCodeLocation.test.mjs";
import test_InvalidJsdocError from "./private/InvalidJsdocError.test.mjs";
import test_jsdocCommentToMember from "./private/jsdocCommentToMember.test.mjs";
import test_jsdocDataMdToMdAst from "./private/jsdocDataMdToMdAst.test.mjs";
import test_jsdocDataTypeToMdAst from "./private/jsdocDataTypeToMdAst.test.mjs";
import test_membersToMdAst from "./private/membersToMdAst.test.mjs";
import test_outlineMembers from "./private/outlineMembers.test.mjs";
import test_remarkPluginReplaceSection from "./private/remarkPluginReplaceSection.test.mjs";
import test_replaceMdSection from "./private/replaceMdSection.test.mjs";
import test_reportCliError from "./private/reportCliError.test.mjs";
import test_typeAstToMdAst from "./private/typeAstToMdAst.test.mjs";
import test_typeToTypeAst from "./private/typeToTypeAst.test.mjs";
import test_unescapeJsdoc from "./private/unescapeJsdoc.test.mjs";
import test_jsdocMd from "./public/jsdocMd.test.mjs";

const tests = new TestDirector();

test_jsdocMdCli(tests);
test_CliError(tests);
test_CodeLocation(tests);
test_CodePosition(tests);
test_codePositionToIndex(tests);
test_codeToJsdocComments(tests);
test_deconstructJsdocNamepath(tests);
test_getJsdocBlockDescriptionSource(tests);
test_getJsdocSourceTokenCodeLocation(tests);
test_InvalidJsdocError(tests);
test_jsdocCommentToMember(tests);
test_jsdocDataMdToMdAst(tests);
test_jsdocDataTypeToMdAst(tests);
test_membersToMdAst(tests);
test_outlineMembers(tests);
test_remarkPluginReplaceSection(tests);
test_replaceMdSection(tests);
test_reportCliError(tests);
test_typeAstToMdAst(tests);
test_typeToTypeAst(tests);
test_unescapeJsdoc(tests);
test_jsdocMd(tests);

tests.run();
