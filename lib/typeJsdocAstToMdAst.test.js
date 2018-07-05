const t = require('tap')
const doctrine = require('doctrine')
const stringify = require('remark-stringify')
const unified = require('unified')
const typeJsdocAstToMdAst = require('./typeJsdocAstToMdAst')
const remarkStringifyOptions = require('./remarkStringifyOptions')

t.test('typeJsdocAstToMdAst', t => {
  const typeMdAsts = [
    '@type {function()}',
    '@type {function(null)}',
    '@type {function(): *}',
    '@type {function({a: "stringLiteral", b: string})}',
    '@type {function(...Array<Object, string>): Array<Object>}',
    '@type {function(this:number, 5)}',
    '@type {function(this:Object): undefined}',
    '@type {function(this:Object)}',
    '@type {function(this:Object, true): false}',
    '@type {function(new:Object): [boolean, string]}',
    '@type {function(new:Object)}',
    '@type {function(new:Object, true=): [...number]}',
    '@type {function(new:Object, 5)}'
  ].map(doclet => typeJsdocAstToMdAst(doctrine.parse(doclet).tags[0].type))

  t.matchSnapshot(JSON.stringify(typeMdAsts, null, 2), 'Markdown ASTs.')

  const mdAst = { type: 'root', children: [] }

  typeMdAsts.forEach(typeMdAst => {
    mdAst.children.push({ type: 'paragraph', children: typeMdAst })
  })

  const md = unified()
    .use(stringify, remarkStringifyOptions)
    .stringify(mdAst)

  t.matchSnapshot(md, 'Markdown.')

  t.end()
})
