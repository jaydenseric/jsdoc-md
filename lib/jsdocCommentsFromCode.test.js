const t = require('tap')
const jsdocCommentsFromCode = require('./jsdocCommentsFromCode')

t.test('jsdocCommentsFromCode', t => {
  t.matchSnapshot(
    JSON.stringify(
      jsdocCommentsFromCode(
        `
/**
* a
*/
let a

/** b */
let b

const c = '/** c */'

/* d */

/*
e
*/

// f
`
      ),
      null,
      2
    ),
    'JSDoc comments.'
  )
  t.end()
})
