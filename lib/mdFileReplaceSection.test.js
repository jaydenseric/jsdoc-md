'use strict'

const fs = require('fs')
const { join } = require('path')
const { disposableDirectory } = require('disposable-directory')
const t = require('tap')
const mdFileReplaceSection = require('./mdFileReplaceSection')

t.test('mdFileReplaceSection', async t => {
  await disposableDirectory(async tempDirPath => {
    const markdownPath = join(tempDirPath, 'readme.md')
    await fs.promises.writeFile(
      markdownPath,
      `# Preserve

## Target

Replace.

## Preserve
`
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

    const fileReplacedContent = await fs.promises.readFile(markdownPath, 'utf8')

    t.equal(
      fileReplacedContent,
      `# Preserve

## Target

Replaced.

## Preserve
`,
      'File content.'
    )
  })
})
