'use strict'

const { readFileSync } = require('fs')
const t = require('tap')
const { createTestFile } = require('../test-helpers')
const mdFileReplaceSection = require('./mdFileReplaceSection')

t.test('mdFileReplaceSection', t => {
  const markdownPath = createTestFile(
    `# Preserve

## Target

Replace.

## Preserve
`,
    'md',
    t
  )

  mdFileReplaceSection({
    markdownPath,
    targetHeading: 'Target',
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

  const fileReplacedContent = readFileSync(markdownPath, { encoding: 'utf8' })

  t.equal(
    fileReplacedContent,
    `# Preserve

## Target

Replaced.

## Preserve
`,
    'File content.'
  )

  t.end()
})
