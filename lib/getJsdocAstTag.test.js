const t = require('tap')
const doctrine = require('doctrine')
const getJsdocAstTag = require('./getJsdocAstTag')

t.test('getJsdocAstTag', t => {
  t.equal(
    getJsdocAstTag(doctrine.parse('').tags, 'name'),
    undefined,
    'Tag missing.'
  )

  const expectedTag = { title: 'name', description: null, name: 'a' }

  t.deepEqual(
    getJsdocAstTag(doctrine.parse('@name a').tags, 'name'),
    expectedTag,
    '@name a.'
  )

  t.deepEqual(
    getJsdocAstTag(
      doctrine.parse(
        `@name b
         @name a`
      ).tags,
      'name'
    ),
    expectedTag,
    'Tag override.'
  )

  t.end()
})
