'use strict'

const t = require('tap')
const deconstructJsdocNamepath = require('./deconstructJsdocNamepath')

t.test('deconstructJsdocNamepath', t => {
  t.deepEqual(
    deconstructJsdocNamepath('a'),
    {
      memberof: undefined,
      membership: undefined,
      name: 'a'
    },
    'No nested members.'
  )

  t.deepEqual(
    deconstructJsdocNamepath('a.b#c~d'),
    {
      memberof: 'a.b#c',
      membership: '~',
      name: 'd'
    },
    'Nested static, instance and inner members.'
  )

  // Invalid namepaths.
  ;['', 'a..b', 'a..b.c', 'a.'].forEach(namepath => {
    t.throws(
      () => deconstructJsdocNamepath(namepath),
      new Error(`Invalid JSDoc namepath “${namepath}”.`),
      'Throws.'
    )
  })

  t.end()
})
