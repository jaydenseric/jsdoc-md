import { rejects, strictEqual } from 'assert';
import { spawnSync } from 'child_process';
import fs from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
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

  tests.add(
    '`mdFileReplaceSection` with valid options, Prettier peer dependency, no Prettier config, not Prettier ignored, Prettier parser uninferrable.',
    async () => {
      await disposableDirectory(async (tempDirPath) => {
        // The Prettier parser is uninferrable due to the file name and the lack
        // of an `.md` file extension. In this situation, a hardcoded fallback
        // `markdown` parser should be used.
        const markdownPath = join(tempDirPath, 'uninferrable-file-type');

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
                    value:
                      // The leading space should be gone in the Prettier
                      // formatted new markdown file contents.
                      ' Replaced content.',
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

Replaced content.

## Preserve
`
        );
      });
    }
  );

  tests.add(
    '`mdFileReplaceSection` with valid options, Prettier peer dependency, no Prettier config, not Prettier ignored, Prettier parser inferrable.',
    async () => {
      await disposableDirectory(async (tempDirPath) => {
        // The Prettier parser is inferrable due to the `readme` file name and
        // `.md` file extension.
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
                    value:
                      // The leading space should be gone in the Prettier
                      // formatted new markdown file contents.
                      ' Replaced content.',
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

Replaced content.

## Preserve
`
        );
      });
    }
  );

  tests.add(
    '`mdFileReplaceSection` with valid options, Prettier peer dependency, Prettier config, not Prettier ignored, Prettier parser inferrable.',
    async () => {
      await disposableDirectory(async (tempDirPath) => {
        // The Prettier parser is inferrable due to the `readme` file name and
        // `.md` file extension.
        const markdownPath = join(tempDirPath, 'readme.md');
        const prettierConfigPath = join(tempDirPath, '.prettierrc.json');

        await Promise.all([
          fs.promises.writeFile(
            markdownPath,
            `# Preserve

## Target

Replace.

## Preserve
`
          ),
          fs.promises.writeFile(
            prettierConfigPath,
            `{
  "proseWrap": "never"
}
`
          ),
        ]);

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
                    value:
                      // The newline should be gone in the Prettier formatted
                      // new markdown file contents due to the project Prettier
                      // config `"proseWrap": "never"`.
                      `Replaced
content.`,
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

Replaced content.

## Preserve
`
        );
      });
    }
  );

  tests.add(
    '`mdFileReplaceSection` with valid options, Prettier peer dependency, no Prettier config, Prettier ignored, Prettier parser inferrable.',
    async () => {
      await disposableDirectory(async (tempDirPath) => {
        // The Prettier parser is inferrable due to the `readme` file name and
        // `.md` file extension.
        const markdownFileName = 'readme.md';
        const markdownPath = join(tempDirPath, markdownFileName);
        const prettierIgnorePath = join(tempDirPath, '.prettierignore');
        // `test` in the file name so `coverage-node` will automatically ignore
        // it for the code coverage report.
        const scriptPath = join(tempDirPath, 'test.mjs');
        const mdFileReplaceSectionPath = fileURLToPath(
          new URL('../../private/mdFileReplaceSection.mjs', import.meta.url)
        );

        await Promise.all([
          fs.promises.writeFile(
            markdownPath,
            `# Preserve

## Target

Replace.

## Preserve
`
          ),
          fs.promises.writeFile(
            prettierIgnorePath,
            `${markdownFileName}
`
          ),
          fs.promises.writeFile(
            scriptPath,
            `import mdFileReplaceSection from '${mdFileReplaceSectionPath}';

mdFileReplaceSection({
  markdownPath: '${markdownPath}',
  targetHeading: 'Target',
  replacementAst: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            value:
              // The leading space shouldn’t be gone in the new markdown file
              // contents, because the file is Prettier ignored.
              ' Replaced content.',
          },
        ],
      },
    ],
  },
})
`
          ),
        ]);

        const { stdout, stderr, status, error } = spawnSync(
          'node',
          [scriptPath],
          { cwd: tempDirPath }
        );

        if (error) throw error;

        strictEqual(stdout.toString(), '');
        strictEqual(stderr.toString(), '');
        strictEqual(status, 0);

        const fileReplacedContent = await fs.promises.readFile(
          markdownPath,
          'utf8'
        );

        strictEqual(
          fileReplacedContent,
          `# Preserve

## Target

 Replaced content.

## Preserve
`
        );
      });
    }
  );
};
