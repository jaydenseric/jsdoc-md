const doctrine = require('doctrine')
const stringify = require('remark-stringify')
const t = require('tap')
const unified = require('unified')
const jsdocToMember = require('./jsdocToMember')
const outlineMembers = require('./outlineMembers')
const remarkStringifyOptions = require('./remarkStringifyOptions')
const typeJsdocAstToMdAst = require('./typeJsdocAstToMdAst')

/**
 * Converts a type string to a JSDoc AST.
 * @kind function
 * @name createTypeJsdocAst
 * @param {string} type Type tag value between brackets.
 * @returns {Object} JSDoc AST.
 * @ignore
 */
const createTypeJsdocAst = type =>
  // Use @param instead of @type as it allows all features, including optional
  // (`*=`) and rest (`...*`) parameters.
  doctrine.parse(`@param {${type}} a`).tags[0].type

/**
 * Converts type markdown AST to markdown.
 * @kind function
 * @name typeMdAstToMd
 * @param {Object} typeMdAst Type markdown AST.
 * @returns {string} Markdown.
 * @ignore
 */
const typeMdAstToMd = typeMdAst =>
  unified()
    .use(stringify, remarkStringifyOptions)
    .stringify({ type: 'root', children: typeMdAst })

t.test('typeJsdocAstToMdAst', t => {
  ;[
    ['AllLiteral', '*'],
    ['NullableLiteral', '?'],
    ['NullLiteral', 'null'],
    ['UndefinedLiteral', 'undefined'],
    ['NumericLiteralType', '1'],
    ['StringLiteralType', '"a"'],
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
    ['FunctionType', 'function()'],
    ['FunctionType with return', 'function(): *'],
    ['FunctionType with return and VoidLiteral', 'function(): void'],
    ['FunctionType with parameter', 'function(*)'],
    ['FunctionType with multiple parameters', 'function(*, *)'],
    ['FunctionType with new', 'function(new:A)'],
    ['FunctionType with new and param', 'function(new:A, *)'],
    ['FunctionType with this', 'function(this:A)'],
    ['FunctionType with this and param', 'function(this:A, *)']
  ].forEach(([type, example]) =>
    t.test(`Type ${type}`, t => {
      const typeMdAst = typeJsdocAstToMdAst(createTypeJsdocAst(example))
      t.matchSnapshot(JSON.stringify(typeMdAst, null, 2), 'Markdown AST.')
      t.matchSnapshot(typeMdAstToMd(typeMdAst), 'Markdown.')
      t.end()
    })
  )

  t.test('Type NameExpression with member link', t => {
    const members = outlineMembers([
      jsdocToMember(
        `Description.
         @kind typedef
         @name A
         @type {boolean}`
      )
    ])
    const typeMdAst = typeJsdocAstToMdAst(createTypeJsdocAst('A'), members)
    t.matchSnapshot(JSON.stringify(typeMdAst, null, 2), 'Markdown AST.')
    t.matchSnapshot(typeMdAstToMd(typeMdAst), 'Markdown.')
    t.end()
  })

  t.test('Type unknown', t => {
    t.throws(
      () => {
        typeJsdocAstToMdAst({ type: 'MadeUp' })
      },
      new Error('Unknown JSDoc type “MadeUp”'),
      'Throws.'
    )
    t.end()
  })

  t.end()
})
