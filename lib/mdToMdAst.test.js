'use strict'

const t = require('tap')
const mdToMdAst = require('./mdToMdAst')

t.test('mdToMdAst', t => {
  t.matchSnapshot(
    JSON.stringify(mdToMdAst('[a](https://npm.im/jsdoc-md)'), null, 2),
    'Markdown AST.'
  )
  t.end()
})
