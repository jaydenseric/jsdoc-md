const t = require('tap')
const doctrine = require('doctrine')
const stringify = require('remark-stringify')
const unified = require('unified')
const typeJsdocAstToMdAst = require('./typeJsdocAstToMdAst')
const remarkStringifyOptions = require('./remarkStringifyOptions')
const outlineMembers = require('./outlineMembers')
const jsdocToMember = require('./jsdocToMember')

/**
 * Converts a type string to a markdown AST.
 * @kind function
 * @name typeToMdAst
 * @param {string} type Type tag value between brackets.
 * @param {Object[]} [members] Outline members.
 * @returns {Object} Markdown AST.
 * @ignore
 */
const typeToMdAst = (type, members) =>
  typeJsdocAstToMdAst(doctrine.parse(`@type {${type}}`).tags[0].type, members)

/**
 * Converts type markdown ASTs to markdown.
 * @kind function
 * @name typeMdAstsToMd
 * @param {Object[]} typeMdAsts Type markdown ASTs.
 * @returns {string} Markdown.
 * @ignore
 */
const typeMdAstsToMd = typeMdAsts =>
  unified()
    .use(stringify, remarkStringifyOptions)
    .stringify({
      type: 'root',
      children: typeMdAsts.map(children => ({
        type: 'paragraph',
        children
      }))
    })

t.test('typeJsdocAstToMdAst', t => {
  t.test('FunctionType types', t => {
    const typeMdAsts = [
      'function()',
      'function(null)',
      'function(): *',
      'function({a: "stringLiteral", b: string})',
      'function(...Array<Object, string>): Array<Object>',
      'function(this:number, 5)',
      'function(this:Object): undefined',
      'function(this:Object)',
      'function(this:Object, true): false',
      'function(new:Object): [boolean, string]',
      'function(new:Object)}',
      'function(new:Object, true=): [...number]',
      'function(new:Object, 5)'
    ].map(type => typeToMdAst(type))

    t.matchSnapshot(JSON.stringify(typeMdAsts, null, 2), 'Markdown ASTs.')
    t.matchSnapshot(typeMdAstsToMd(typeMdAsts), 'Markdown.')

    t.end()
  })

  t.test('NameExpression types.', t => {
    // Varied type capitalization should result in a consistently lowercase
    // MDN link slug.

    const typeMdAsts = [
      'Boolean',
      'Number',
      'String',
      'Function',
      'Array',
      'Object',
      'Date'
    ].reduce((typeMdAsts, type) => {
      typeMdAsts.push(typeToMdAst(type), typeToMdAst(type.toLowerCase()))
      return typeMdAsts
    }, [])

    t.matchSnapshot(JSON.stringify(typeMdAsts, null, 2), 'Markdown ASTs.')
    t.matchSnapshot(typeMdAstsToMd(typeMdAsts), 'Markdown.')

    t.end()
  })

  t.test('Override global type.', t => {
    const typeMdAst = typeToMdAst(
      'Object',
      outlineMembers([
        jsdocToMember(
          `A string.
           @kind typedef
           @name Object
           @type {Object}`
        )
      ])
    )

    t.matchSnapshot(JSON.stringify(typeMdAst, null, 2), 'Markdown ASTs.')
    t.matchSnapshot(typeMdAstsToMd([typeMdAst]), 'Markdown.')

    t.end()
  })

  t.end()
})
