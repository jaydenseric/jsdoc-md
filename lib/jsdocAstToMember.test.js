const t = require('tap')
const doctrine = require('doctrine')
const jsdocAstToMember = require('./jsdocAstToMember')

t.test('jsdocAstToMember', t => {
  t.equals(jsdocAstToMember(doctrine.parse('@ignore')), undefined, '@ignore.')
  t.equals(
    jsdocAstToMember(doctrine.parse('')),
    undefined,
    'Required tags missing.'
  )
  t.matchSnapshot(
    JSON.stringify(
      jsdocAstToMember(
        doctrine.parse(
          `Description.
           @kind function
           @name A#b
           @param {number} a Description.`
        )
      ),
      null,
      2
    ),
    'A method.'
  )
  t.end()
})
