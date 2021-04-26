import { rejects, strictEqual } from 'assert';
import fs from 'fs';
import { join } from 'path';
import { disposableDirectory } from 'disposable-directory';
import mdFileReplaceSection from '../../private/mdFileReplaceSection.mjs';

export default (tests) => {
  tests.add(
    '`mdFileReplaceSection` with option `markdownPath` not a string.',
    async () => {
      await rejects(
        mdFileReplaceSection({
          markdownPath: true,
          targetHeading: 'Target',
          replacementAst: {
            type: 'root',
            children: [],
          },
        }),
        new TypeError('Option `markdownPath` must be a string.')
      );
    }
  );

  tests.add(
    '`mdFileReplaceSection` with option `markdownPath` not a populated string.',
    async () => {
      await rejects(
        mdFileReplaceSection({
          markdownPath: '',
          targetHeading: 'Target',
          replacementAst: {
            type: 'root',
            children: [],
          },
        }),
        new TypeError('Option `markdownPath` must be a populated string.')
      );
    }
  );

  tests.add(
    '`mdFileReplaceSection` with option `targetHeading` not a string.',
    async () => {
      await rejects(
        mdFileReplaceSection({
          markdownPath: '/a.md',
          targetHeading: true,
          replacementAst: {
            type: 'root',
            children: [],
          },
        }),
        new TypeError('Option `targetHeading` must be a string.')
      );
    }
  );

  tests.add(
    '`mdFileReplaceSection` with option `targetHeading` not a populated string.',
    async () => {
      await rejects(
        mdFileReplaceSection({
          markdownPath: '/a.md',
          targetHeading: '',
          replacementAst: {
            type: 'root',
            children: [],
          },
        }),
        new TypeError('Option `targetHeading` must be a populated string.')
      );
    }
  );

  tests.add(
    '`mdFileReplaceSection` with option `replacementAst` not an object.',
    async () => {
      await rejects(
        mdFileReplaceSection({
          markdownPath: '/a.md',
          targetHeading: 'Target',
          replacementAst: true,
        }),
        new TypeError('Option `replacementAst` must be an object.')
      );
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

      await mdFileReplaceSection({
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
