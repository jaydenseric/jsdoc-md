const doctrine = require('doctrine')
const t = require('tap')
const getJsdocAstTags = require('./getJsdocAstTags')

t.test('getJsdocAstTags', t => {
  t.equal(
    getJsdocAstTags(doctrine.parse('').tags, 'param'),
    undefined,
    'Tags missing.'
  )

  t.deepEqual(
    getJsdocAstTags(
      doctrine.parse(
        `Description.
         @kind function
         @name a
         @param {string} a Description.
         @param {string} b Description.`
      ).tags,
      'param'
    ),
    [
      {
        title: 'param',
        description: 'Description.',
        type: { type: 'NameExpression', name: 'string' },
        name: 'a'
      },
      {
        title: 'param',
        description: 'Description.',
        type: { type: 'NameExpression', name: 'string' },
        name: 'b'
      }
    ],
    '@param.'
  )

  t.end()
})
