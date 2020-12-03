'use strict';

const { throws } = require('assert');
const { resolve } = require('path');
const gfm = require('remark-gfm');
const stringify = require('remark-stringify');
const snapshot = require('snapshot-assertion');
const unified = require('unified');
const codeToJsdocComments = require('../../private/codeToJsdocComments');
const outlineMembers = require('../../private/outlineMembers');
const remarkStringifyOptions = require('../../private/remarkStringifyOptions');
const typeJsdocAstToMdAst = require('../../private/typeJsdocAstToMdAst');
const typeJsdocStringToJsdocAst = require('../../private/typeJsdocStringToJsdocAst');
const jsdocCommentsToMembers = require('../jsdocCommentsToMembers');

const TEST_CODE_FILE_PATH = '/a.js';

module.exports = (tests) => {
  tests.add('`typeJsdocAstToMdAst` with various types.', () => {
    const code = `/**
 * @kind typedef
 * @name B
 */`;
    const jsdocComments = codeToJsdocComments(code, TEST_CODE_FILE_PATH);
    const members = jsdocCommentsToMembers(
      jsdocComments,
      code,
      TEST_CODE_FILE_PATH
    );
    const outlinedMembers = outlineMembers(members);

    for (const [name, typeJsdocString] of [
      ['AllLiteral', '*'],
      ['NullableLiteral', '?'],
      ['NullLiteral', 'null'],
      ['UndefinedLiteral', 'undefined'],
      ['NumericLiteralType', '1'],
      ['StringLiteralType', '"a"'],
      ['StringLiteralType empty', '""'],
      ['StringLiteralType space', '" "'],
      ['StringLiteralType tab', '"  "'],
      ['BooleanLiteralType', 'true'],
      ['RestType', '...*'],
      ['OptionalType', '*='],
      ['UnionType', '*|void'],
      ['TypeApplication', 'Array<*>'],
      ['TypeApplication with multiple applications', 'Array<*, *>'],
      ['ArrayType', '[*]'],
      ['ArrayType with multiple items', '[*, *]'],
      ['FieldType', '{a:*}'],
      ['RecordType', '{a:*, b:*}'],
      ['NameExpression', 'A'],
      ['NameExpression with member link', 'B'],
      ['FunctionType', 'function()'],
      ['FunctionType with return', 'function(): *'],
      ['FunctionType with return and VoidLiteral', 'function(): void'],
      ['FunctionType with parameter', 'function(*)'],
      ['FunctionType with multiple parameters', 'function(*, *)'],
      ['FunctionType with new', 'function(new:A)'],
      ['FunctionType with new and param', 'function(new:A, *)'],
      ['FunctionType with this', 'function(this:A)'],
      ['FunctionType with this and param', 'function(this:A, *)'],
    ])
      tests.add(`\`typeJsdocAstToMdAst\` with type ${name}.`, async () => {
        const typeMdAst = typeJsdocAstToMdAst(
          typeJsdocStringToJsdocAst({
            type: typeJsdocString,
            // Allow all features, including optional (`*=`) and rest (`...*`)
            // parameters.
            parameter: true,
          }),
          outlinedMembers
        );

        const snapshotFileName = name.replace(/ /g, '-');

        await snapshot(
          JSON.stringify(typeMdAst, null, 2),
          resolve(
            __dirname,
            `../snapshots/typeJsdocAstToMdAst/${snapshotFileName}.json`
          )
        );

        await snapshot(
          unified()
            .use(gfm)
            .use(stringify, remarkStringifyOptions)
            .stringify({
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: typeMdAst,
                },
              ],
            }),
          resolve(
            __dirname,
            `../snapshots/typeJsdocAstToMdAst/${snapshotFileName}.md`
          )
        );
      });
  });

  tests.add('`typeJsdocAstToMdAst` with an unknown type.', () => {
    throws(() => {
      typeJsdocAstToMdAst({ type: 'MadeUp' });
    }, new Error('Unknown JSDoc type “MadeUp”.'));
  });
};
