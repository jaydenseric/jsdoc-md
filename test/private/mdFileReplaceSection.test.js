'use strict';

const { strictEqual, throws } = require('assert');
const fs = require('fs');
const { join } = require('path');
const { disposableDirectory } = require('disposable-directory');
const mdFileReplaceSection = require('../../private/mdFileReplaceSection');

module.exports = (tests) => {
  tests.add(
    '`mdFileReplaceSection` with option `markdownPath` not a string.',
    () => {
      throws(() => {
        mdFileReplaceSection({
          markdownPath: true,
          targetHeading: 'Target',
          replacementAst: {
            type: 'root',
            children: [],
          },
        });
      }, new TypeError('Option `markdownPath` must be a string.'));
    }
  );

  tests.add(
    '`mdFileReplaceSection` with option `markdownPath` not a populated string.',
    () => {
      throws(() => {
        mdFileReplaceSection({
          markdownPath: '',
          targetHeading: 'Target',
          replacementAst: {
            type: 'root',
            children: [],
          },
        });
      }, new TypeError('Option `markdownPath` must be a populated string.'));
    }
  );

  tests.add(
    '`mdFileReplaceSection` with option `targetHeading` not a string.',
    () => {
      throws(() => {
        mdFileReplaceSection({
          markdownPath: '/a.md',
          targetHeading: true,
          replacementAst: {
            type: 'root',
            children: [],
          },
        });
      }, new TypeError('Option `targetHeading` must be a string.'));
    }
  );

  tests.add(
    '`mdFileReplaceSection` with option `targetHeading` not a populated string.',
    () => {
      throws(() => {
        mdFileReplaceSection({
          markdownPath: '/a.md',
          targetHeading: '',
          replacementAst: {
            type: 'root',
            children: [],
          },
        });
      }, new TypeError('Option `targetHeading` must be a populated string.'));
    }
  );

  tests.add(
    '`mdFileReplaceSection` with option `replacementAst` not an object.',
    () => {
      throws(() => {
        mdFileReplaceSection({
          markdownPath: '/a.md',
          targetHeading: 'Target',
          replacementAst: true,
        });
      }, new TypeError('Option `replacementAst` must be an object.'));
    }
  );

  tests.add('`mdFileReplaceSection` with valid options.', async () => {
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
