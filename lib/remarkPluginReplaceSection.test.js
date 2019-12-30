'use strict'

const t = require('tap')
const unified = require('unified')
const remarkPluginReplaceSection = require('./remarkPluginReplaceSection')

t.test('remarkPluginReplaceSection', t => {
  t.deepEqual(
    unified()
      .use(remarkPluginReplaceSection, {
        targetHeading: 'A',
        replacementAst: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  value: 'Replaced.'
                }
              ]
            }
          ]
        }
      })
      .runSync({
        type: 'root',
        children: [
          {
            type: 'heading',
            depth: 1,
            children: [
              {
                type: 'text',
                value: 'A'
              }
            ]
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                value: 'Replace.'
              }
            ]
          },
          {
            type: 'heading',
            depth: 1,
            children: [
              {
                type: 'text',
                value: 'B'
              }
            ]
          }
        ]
      }),
    {
      type: 'root',
      children: [
        {
          type: 'heading',
          depth: 1,
          children: [
            {
              type: 'text',
              value: 'A'
            }
          ]
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'Replaced.'
            }
          ]
        },
        {
          type: 'heading',
          depth: 1,
          children: [
            {
              type: 'text',
              value: 'B'
            }
          ]
        }
      ]
    },
    'Options.'
  )

  t.deepEqual(
    unified()
      .use(remarkPluginReplaceSection)
      .runSync({
        type: 'root',
        children: [
          {
            type: 'heading',
            depth: 1,
            children: [
              {
                type: 'text',
                value: 'API'
              }
            ]
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                value: 'Replace.'
              }
            ]
          }
        ]
      }),
    {
      type: 'root',
      children: [
        {
          type: 'heading',
          depth: 1,
          children: [
            {
              type: 'text',
              value: 'API'
            }
          ]
        }
      ]
    },
    'Defaults.'
  )

  t.throws(
    () =>
      unified()
        .use(remarkPluginReplaceSection)
        .runSync({
          type: 'root',
          children: []
        }),
    new Error('Missing target heading “API”.'),
    'Missing target heading.'
  )

  t.end()
})
