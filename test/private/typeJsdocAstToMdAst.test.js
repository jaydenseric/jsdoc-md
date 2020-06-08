'use strict';

const { throws } = require('assert');
const { resolve } = require('path');
const stringify = require('remark-stringify');
const snapshot = require('snapshot-assertion');
const unified = require('unified');
const jsdocToMember = require('../../private/jsdocToMember');
const outlineMembers = require('../../private/outlineMembers');
const remarkStringifyOptions = require('../../private/remarkStringifyOptions');
const typeJsdocAstToMdAst = require('../../private/typeJsdocAstToMdAst');
const typeJsdocStringToJsdocAst = require('../../private/typeJsdocStringToJsdocAst');

module.exports = (tests) => {
  tests.add('`typeJsdocAstToMdAst` with various types.', () => {
    const members = outlineMembers([
      jsdocToMember(
        `/**
 * Description.
 * @kind typedef
 * @name B
 * @type {boolean}
 */`
      ),
    ]);

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
          members
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
            .use(stringify, remarkStringifyOptions)
            .stringify({ type: 'root', children: typeMdAst }),
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
