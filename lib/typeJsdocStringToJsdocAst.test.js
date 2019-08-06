const t = require('tap')
const typeJsdocStringToJsdocAst = require('./typeJsdocStringToJsdocAst')

t.test('typeJsdocStringToJsdocAst', t => {
  t.test('Parameter type', t => {
    t.matchSnapshot(
      JSON.stringify(typeJsdocStringToJsdocAst('...*', true), null, 2),
      'JSDoc AST.'
    )
    t.end()
  })

  t.test('Non-parameter type', t => {
    t.matchSnapshot(
      JSON.stringify(typeJsdocStringToJsdocAst('a'), null, 2),
      'JSDoc AST.'
    )
    t.end()
  })

  t.test('Invalid type', t => {
    t.throws(
      () => {
        typeJsdocStringToJsdocAst('**')
      },
      new Error('Invalid JSDoc type “**”.'),
      'Throws.'
    )
    t.end()
  })

  t.end()
})
