'use strict'

const { deepStrictEqual, throws } = require('assert')
const typeJsdocStringToJsdocAst = require('../lib/typeJsdocStringToJsdocAst')

module.exports = tests => {
  tests.add('`typeJsdocStringToJsdocAst` with a parameter type.', () => {
    deepStrictEqual(typeJsdocStringToJsdocAst('...*', true), {
      type: 'RestType',
      expression: {
        type: 'AllLiteral'
      }
    })
  })

  tests.add('`typeJsdocStringToJsdocAst` with a non-parameter type.', () => {
    deepStrictEqual(typeJsdocStringToJsdocAst('a'), {
      type: 'NameExpression',
      name: 'a'
    })
  })

  tests.add('`typeJsdocStringToJsdocAst` with an invalid type.', () => {
    throws(() => {
      typeJsdocStringToJsdocAst('**')
    }, new Error('Invalid JSDoc type “**”.'))
  })
}
