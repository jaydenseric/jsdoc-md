import { throws } from "assert";
import remarkGfm from "remark-gfm";
import remarkStringify from "remark-stringify";
import snapshot from "snapshot-assertion";
import { unified } from "unified";

import codeToJsdocComments from "../../private/codeToJsdocComments.mjs";
import outlineMembers from "../../private/outlineMembers.mjs";
import REMARK_STRINGIFY_OPTIONS from "../../private/REMARK_STRINGIFY_OPTIONS.mjs";
import typeAstToMdAst from "../../private/typeAstToMdAst.mjs";
import typeToTypeAst from "../../private/typeToTypeAst.mjs";
import jsdocCommentsToMembers from "../jsdocCommentsToMembers.mjs";

const TEST_CODE_FILE_PATH = "/a.js";

export default (tests) => {
  tests.add(
    "`typeAstToMdAst` with argument 1 `typeJsdocAst` not an object.",
    () => {
      throws(() => {
        typeAstToMdAst(true);
      }, new TypeError("Argument 1 `typeJsdocAst` must be an object."));
    }
  );

  tests.add("`typeAstToMdAst` with argument 2 `members` not an array.", () => {
    throws(() => {
      typeAstToMdAst({}, true);
    }, new TypeError("Argument 2 `members` must be an array."));
  });

  tests.add("`typeAstToMdAst` with various types.", async () => {
    const code = `/**
 * @kind typedef
 * @name B
 */`;
    const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
    const jsdocComments = await codeToJsdocComments(code, TEST_CODE_FILE_PATH);
    const members = jsdocCommentsToMembers(
      jsdocComments,
      codeFiles,
      TEST_CODE_FILE_PATH
    );
    const outlinedMembers = outlineMembers(members, codeFiles);

    for (const [name, typeJsdocString] of [
      ["AllLiteral", "*"],
      ["NullableLiteral", "?"],
      ["NullLiteral", "null"],
      ["UndefinedLiteral", "undefined"],
      ["NumericLiteralType", "1"],
      ["StringLiteralType", '"a"'],
      ["StringLiteralType empty", '""'],
      ["StringLiteralType space", '" "'],
      ["StringLiteralType tab", '"  "'],
      ["BooleanLiteralType", "true"],
      ["RestType", "...*"],
      ["OptionalType", "*="],
      ["UnionType", "*|void"],
      ["TypeApplication", "Array<*>"],
      ["TypeApplication with multiple applications", "Array<*, *>"],
      ["ArrayType", "[*]"],
      ["ArrayType with multiple items", "[*, *]"],
      ["FieldType", "{a:*}"],
      ["RecordType", "{a:*, b:*}"],
      ["NameExpression", "A"],
      ["NameExpression with member link", "B"],
      ["FunctionType", "function()"],
      ["FunctionType with return", "function(): *"],
      ["FunctionType with return and VoidLiteral", "function(): void"],
      ["FunctionType with parameter", "function(*)"],
      ["FunctionType with multiple parameters", "function(*, *)"],
      ["FunctionType with new", "function(new:A)"],
      ["FunctionType with new and param", "function(new:A, *)"],
      ["FunctionType with this", "function(this:A)"],
      ["FunctionType with this and param", "function(this:A, *)"],
    ])
      tests.add(`\`typeAstToMdAst\` with type ${name}.`, async () => {
        const typeMdAst = typeAstToMdAst(
          typeToTypeAst({
            type: typeJsdocString,
            // Allow all features, including optional (`*=`) and rest (`...*`)
            // parameters.
            parameter: true,
          }),
          outlinedMembers
        );

        const snapshotFileName = name.replace(/ /gu, "-");

        await snapshot(
          JSON.stringify(typeMdAst, null, 2),
          new URL(
            `../snapshots/typeAstToMdAst/${snapshotFileName}.json`,
            import.meta.url
          )
        );

        await snapshot(
          unified()
            .use(remarkGfm)
            .use(remarkStringify, REMARK_STRINGIFY_OPTIONS)
            .stringify({
              type: "root",
              children: [
                {
                  type: "paragraph",
                  children: typeMdAst,
                },
              ],
            }),
          new URL(
            `../snapshots/typeAstToMdAst/${snapshotFileName}.md`,
            import.meta.url
          )
        );
      });
  });

  tests.add("`typeAstToMdAst` with an unknown type.", () => {
    throws(() => {
      typeAstToMdAst({ type: "MadeUp" }, []);
    }, new TypeError("Unknown JSDoc type `MadeUp`."));
  });
};
