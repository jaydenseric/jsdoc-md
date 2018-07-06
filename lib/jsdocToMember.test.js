const t = require('tap')
const jsdocToMember = require('./jsdocToMember')

t.test('jsdocToMember', t => {
  t.equals(jsdocToMember('@ignore'), undefined, '@ignore.')
  t.equals(jsdocToMember(''), undefined, 'Required tags missing.')
  t.matchSnapshot(
    JSON.stringify(
      jsdocToMember(
        `Description.
         @kind function
         @name A#b
         @param {number} a Description.`
      ),
      null,
      2
    ),
    'A method.'
  )
  t.end()
})
