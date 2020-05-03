'use strict';

const { strictEqual } = require('assert');
const fs = require('fs');
const { join } = require('path');
const { disposableDirectory } = require('disposable-directory');
const mdFileReplaceSection = require('../../lib/mdFileReplaceSection');

module.exports = (tests) => {
  tests.add('`mdFileReplaceSection`.', async () => {
    await disposableDirectory(async (tempDirPath) => {
      const markdownPath = join(tempDirPath, 'readme.md');

      await fs.promises.writeFile(
        markdownPath,
        `# Preserve

## Target

Replace.

## Preserve
`
      );

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
                  value: 'Replaced.',
                },
              ],
            },
          ],
        },
      });

      const fileReplacedContent = await fs.promises.readFile(
        markdownPath,
        'utf8'
      );

      strictEqual(
        fileReplacedContent,
        `# Preserve

## Target

Replaced.

## Preserve
`
      );
    });
  });
};
