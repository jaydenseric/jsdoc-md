import { rejects, strictEqual } from 'assert';
import { spawnSync } from 'child_process';
import disposableDirectory from 'disposable-directory';
import fs from 'fs';
import { join } from 'path';
import snapshot from 'snapshot-assertion';
import { fileURLToPath } from 'url';

import CliError from '../../private/CliError.mjs';
import jsdocMd from '../../public/jsdocMd.mjs';

const DEFAULT_MARKDOWN_PATH = 'readme.md';
const DEFAULT_TARGET_HEADING = 'API';

export default (tests) => {
  tests.add('`jsdocMd` with option `cwd` not a string.', async () => {
    await rejects(
      jsdocMd({ cwd: true }),
      new TypeError('Option `cwd` must be a string.')
    );
  });

  tests.add('`jsdocMd` with option `cwd` not a populated string.', async () => {
    await rejects(
      jsdocMd({ cwd: '' }),
      new TypeError('Option `cwd` must be a populated string.')
    );
  });

  tests.add('`jsdocMd` with option `sourceGlob` not a string.', async () => {
    await rejects(
      jsdocMd({ sourceGlob: true }),
      new TypeError('Option `sourceGlob` must be a string.')
    );
  });

  tests.add(
    '`jsdocMd` with option `sourceGlob` not a populated string.',
    async () => {
      await rejects(
        jsdocMd({ sourceGlob: '' }),
        new TypeError('Option `sourceGlob` must be a populated string.')
      );
    }
  );

  tests.add('`jsdocMd` with option `markdownPath` not a string.', async () => {
    await rejects(
      jsdocMd({ markdownPath: true }),
      new TypeError('Option `markdownPath` must be a string.')
    );
  });

  tests.add(
    '`jsdocMd` with option `markdownPath` not a populated string.',
    async () => {
      await rejects(
        jsdocMd({ markdownPath: '' }),
        new TypeError('Option `markdownPath` must be a populated string.')
      );
    }
  );

  tests.add('`jsdocMd` with option `targetHeading` not a string.', async () => {
    await rejects(
      jsdocMd({ targetHeading: true }),
      new TypeError('Option `targetHeading` must be a string.')
    );
  });

  tests.add(
    '`jsdocMd` with option `targetHeading` not a populated string.',
    async () => {
      await rejects(
        jsdocMd({ targetHeading: '' }),
        new TypeError('Option `targetHeading` must be a populated string.')
      );
    }
  );

  tests.add('`jsdocMd` with option `check` not a boolean.', async () => {
    await rejects(
      jsdocMd({ check: null }),
      new TypeError('Option `check` must be a boolean.')
    );
  });

  tests.add('`jsdocMd` with default options.', async () => {
    await disposableDirectory(async (tempDirPath) => {
      const fileNameSourceGitIgnored = 'GitIgnored.mjs';
      const pathGitIgnore = join(tempDirPath, '.gitignore');
      const pathMd = join(tempDirPath, DEFAULT_MARKDOWN_PATH);
      const pathSourceMjs = join(tempDirPath, 'MJS.mjs');
      const pathSourceCjs = join(tempDirPath, 'CJS.cjs');
      const pathSourceJs = join(tempDirPath, 'JS.js');
      const pathSourceGitIgnored = join(tempDirPath, fileNameSourceGitIgnored);
      // `test` in the file name so `coverage-node` will automatically ignore it
      // for the code coverage report.
      const pathScript = join(tempDirPath, 'test.mjs');
      const pathJsdocMd = fileURLToPath(
        new URL('../../public/jsdocMd.mjs', import.meta.url)
      );

      await Promise.all([
        fs.promises.writeFile(pathGitIgnore, fileNameSourceGitIgnored),
        fs.promises.writeFile(
          pathMd,
          `# Preserve

## ${DEFAULT_TARGET_HEADING}

Replace.

## Preserve
`
        ),
        fs.promises.writeFile(
          pathSourceMjs,
          `/**
 * @kind constant
 * @name MJS
 */
export default 1;
`
        ),
        fs.promises.writeFile(
          pathSourceCjs,
          `/**
 * @kind constant
 * @name CJS
 */
module.exports = 1;
`
        ),
        fs.promises.writeFile(
          pathSourceJs,
          `/**
 * @kind constant
 * @name JS
 */
module.exports = 1;
`
        ),
        fs.promises.writeFile(
          pathSourceGitIgnored,
          `/**
 * @kind constant
 * @name GitIgnored
 */
export default 1;
`
        ),
        fs.promises.writeFile(
          pathScript,
          `import jsdocMd from '${pathJsdocMd}';

jsdocMd();
`
        ),
      ]);

      const { stdout, stderr, status, error } = spawnSync(
        'node',
        [pathScript],
        { cwd: tempDirPath }
      );

      if (error) throw error;

      strictEqual(stdout.toString(), '');
      strictEqual(stderr.toString(), '');
      strictEqual(status, 0);

      await snapshot(
        await fs.promises.readFile(pathMd, 'utf8'),
        new URL('../snapshots/jsdocMd/default-options.md', import.meta.url)
      );
    });
  });

  tests.add('`jsdocMd` with option `cwd`.', async () => {
    await disposableDirectory(async (tempDirPath) => {
      const fileNameSourceGitIgnored = 'GitIgnored.mjs';
      const pathGitIgnore = join(tempDirPath, '.gitignore');
      const pathMd = join(tempDirPath, DEFAULT_MARKDOWN_PATH);
      const pathSourceMjs = join(tempDirPath, 'MJS.mjs');
      const pathSourceGitIgnored = join(tempDirPath, fileNameSourceGitIgnored);

      await Promise.all([
        fs.promises.writeFile(pathGitIgnore, fileNameSourceGitIgnored),
        fs.promises.writeFile(
          pathMd,
          `# Preserve

## ${DEFAULT_TARGET_HEADING}

Replace.

## Preserve
`
        ),
        fs.promises.writeFile(
          pathSourceMjs,
          `/**
 * @kind constant
 * @name MJS
 */
export default 1;
`
        ),
        fs.promises.writeFile(
          pathSourceGitIgnored,
          `/**
 * @kind constant
 * @name GitIgnored
 */
export default 1;
`
        ),
      ]);

      await jsdocMd({ cwd: tempDirPath });

      await snapshot(
        await fs.promises.readFile(pathMd, 'utf8'),
        new URL('../snapshots/jsdocMd/option-cwd.md', import.meta.url)
      );
    });
  });

  tests.add('`jsdocMd` with option `sourceGlob`.', async () => {
    await disposableDirectory(async (tempDirPath) => {
      const fileNameSourceGlobMatches = 'SourceGlobMatches.mjs';
      const pathMd = join(tempDirPath, DEFAULT_MARKDOWN_PATH);
      const pathSourceGlobMatches = join(
        tempDirPath,
        fileNameSourceGlobMatches
      );
      const pathSourceSourceGlobMisses = join(
        tempDirPath,
        'SourceGlobMisses.mjs'
      );

      await Promise.all([
        fs.promises.writeFile(
          pathMd,
          `# Preserve

## ${DEFAULT_TARGET_HEADING}

Replace.

## Preserve
`
        ),
        fs.promises.writeFile(
          pathSourceGlobMatches,
          `/**
 * @kind constant
 * @name SourceGlobMatches
 */
export default 1;
`
        ),
        fs.promises.writeFile(
          pathSourceSourceGlobMisses,
          `/**
 * @kind constant
 * @name SourceGlobMisses
 */
export default 1;
`
        ),
      ]);

      await jsdocMd({
        cwd: tempDirPath,
        sourceGlob: fileNameSourceGlobMatches,
      });

      await snapshot(
        await fs.promises.readFile(pathMd, 'utf8'),
        new URL('../snapshots/jsdocMd/option-sourceGlob.md', import.meta.url)
      );
    });
  });

  tests.add('`jsdocMd` with option `markdownPath`.', async () => {
    await disposableDirectory(async (tempDirPath) => {
      const pathMd = join(tempDirPath, 'docs.md');
      const pathSourceMjs = join(tempDirPath, 'MJS.mjs');

      await Promise.all([
        fs.promises.writeFile(
          pathMd,
          `# Preserve

## ${DEFAULT_TARGET_HEADING}

Replace.

## Preserve
`
        ),
        fs.promises.writeFile(
          pathSourceMjs,
          `/**
 * @kind constant
 * @name MJS
 */
export default 1;
`
        ),
      ]);

      await jsdocMd({
        cwd: tempDirPath,
        markdownPath: pathMd,
      });

      await snapshot(
        await fs.promises.readFile(pathMd, 'utf8'),
        new URL('../snapshots/jsdocMd/option-markdownPath.md', import.meta.url)
      );
    });
  });

  tests.add('`jsdocMd` with option `targetHeading`.', async () => {
    await disposableDirectory(async (tempDirPath) => {
      const targetHeading = 'Target';
      const pathMd = join(tempDirPath, DEFAULT_MARKDOWN_PATH);
      const pathSourceMjs = join(tempDirPath, 'MJS.mjs');

      await Promise.all([
        fs.promises.writeFile(
          pathMd,
          `# Preserve

## ${targetHeading}

Replace.

## Preserve
`
        ),
        fs.promises.writeFile(
          pathSourceMjs,
          `/**
 * @kind constant
 * @name MJS
 */
export default 1;
`
        ),
      ]);

      await jsdocMd({
        cwd: tempDirPath,
        targetHeading,
      });

      await snapshot(
        await fs.promises.readFile(pathMd, 'utf8'),
        new URL('../snapshots/jsdocMd/option-targetHeading.md', import.meta.url)
      );
    });
  });

  tests.add('`jsdocMd` with option `check`.', async () => {
    await disposableDirectory(async (tempDirPath) => {
      const pathMd = join(tempDirPath, DEFAULT_MARKDOWN_PATH);
      const pathSourceMjs = join(tempDirPath, 'MJS.mjs');
      const mdOriginal = `# Preserve

## ${DEFAULT_TARGET_HEADING}

Replace.

## Preserve
`;

      await Promise.all([
        fs.promises.writeFile(pathMd, mdOriginal),
        fs.promises.writeFile(
          pathSourceMjs,
          `/**
 * @kind constant
 * @name MJS
 */
export default 1;
`
        ),
      ]);

      await rejects(
        jsdocMd({
          cwd: tempDirPath,
          check: true,
        }),
        new CliError('Checked markdown needs updating.')
      );

      strictEqual(await fs.promises.readFile(pathMd, 'utf8'), mdOriginal);

      // Update the markdown so the following check will pass.
      await jsdocMd({ cwd: tempDirPath });

      const { mtimeMs: modifiedTimeMsFirst } = await fs.promises.stat(pathMd);

      await jsdocMd({
        cwd: tempDirPath,
        check: true,
      });

      const { mtimeMs: modifiedTimeMsSecond } = await fs.promises.stat(pathMd);

      // The file should not have been modified a second time by the check.
      strictEqual(modifiedTimeMsFirst, modifiedTimeMsSecond);
    });
  });

  tests.add('`jsdocMd` run again after no source changes.', async () => {
    await disposableDirectory(async (tempDirPath) => {
      const pathMd = join(tempDirPath, DEFAULT_MARKDOWN_PATH);
      const pathSourceMjs = join(tempDirPath, 'MJS.mjs');

      await Promise.all([
        fs.promises.writeFile(
          pathMd,
          `# Preserve

## ${DEFAULT_TARGET_HEADING}

Replace.

## Preserve
`
        ),
        fs.promises.writeFile(
          pathSourceMjs,
          `/**
 * @kind constant
 * @name MJS
 */
export default 1;
`
        ),
      ]);

      const snapshotPath = new URL(
        '../snapshots/jsdocMd/run-twice.md',
        import.meta.url
      );

      await jsdocMd({ cwd: tempDirPath });

      const { mtimeMs: modifiedTimeMsFirst } = await fs.promises.stat(pathMd);

      await snapshot(await fs.promises.readFile(pathMd, 'utf8'), snapshotPath);

      await jsdocMd({ cwd: tempDirPath });

      const { mtimeMs: modifiedTimeMsSecond } = await fs.promises.stat(pathMd);

      await snapshot(await fs.promises.readFile(pathMd, 'utf8'), snapshotPath);

      // The file should not have been modified a second time, as there were no
      // source JSDoc changes.
      strictEqual(modifiedTimeMsFirst, modifiedTimeMsSecond);
    });
  });

  tests.add('`jsdocMd` without a Prettier config file.', async () => {
    await disposableDirectory(async (tempDirPath) => {
      const pathMd = join(tempDirPath, DEFAULT_MARKDOWN_PATH);
      const pathSourceMjs = join(tempDirPath, 'MJS.mjs');

      await Promise.all([
        fs.promises.writeFile(
          pathMd,
          `# Preserve

## ${DEFAULT_TARGET_HEADING}

Replace.

## Preserve
`
        ),
        fs.promises.writeFile(
          pathSourceMjs,
          `/**
 * Extra  spacing  and
 * a  hard  line  break.
 * @kind constant
 * @name MJS
 */
export default 1;
`
        ),
      ]);

      await jsdocMd({ cwd: tempDirPath });

      // The hard line break should be preserved in the Prettier formatted
      // updated markdown file contents due to the default Prettier config
      // `"proseWrap": "preserve"`.
      await snapshot(
        await fs.promises.readFile(pathMd, 'utf8'),
        new URL(
          '../snapshots/jsdocMd/without-prettier-config-file.md',
          import.meta.url
        )
      );
    });
  });

  tests.add('`jsdocMd` with a Prettier config file.', async () => {
    await disposableDirectory(async (tempDirPath) => {
      const pathPrettierConfig = join(tempDirPath, '.prettierrc.json');
      const pathMd = join(tempDirPath, DEFAULT_MARKDOWN_PATH);
      const pathSourceMjs = join(tempDirPath, 'MJS.mjs');

      await Promise.all([
        fs.promises.writeFile(
          pathPrettierConfig,
          `{
  "proseWrap": "never"
}
`
        ),
        fs.promises.writeFile(
          pathMd,
          `# Preserve

## ${DEFAULT_TARGET_HEADING}

Replace.

## Preserve
`
        ),
        fs.promises.writeFile(
          pathSourceMjs,
          `/**
 * Extra  spacing  and
 * a  hard  line  break.
 * @kind constant
 * @name MJS
 */
export default 1;
`
        ),
      ]);

      await jsdocMd({ cwd: tempDirPath });

      // The hard line break should be gone in the Prettier formatted updated
      // markdown file contents due to the project Prettier config
      // `"proseWrap": "never"`.
      await snapshot(
        await fs.promises.readFile(pathMd, 'utf8'),
        new URL(
          '../snapshots/jsdocMd/with-prettier-config-file.md',
          import.meta.url
        )
      );
    });
  });

  tests.add('`jsdocMd` with a Prettier ignore file.', async () => {
    await disposableDirectory(async (tempDirPath) => {
      const pathPrettierIgnore = join(tempDirPath, '.prettierignore');
      const pathMd = join(tempDirPath, DEFAULT_MARKDOWN_PATH);
      const pathSourceMjs = join(tempDirPath, 'MJS.mjs');

      await Promise.all([
        fs.promises.writeFile(
          pathPrettierIgnore,
          `${DEFAULT_MARKDOWN_PATH}
`
        ),
        fs.promises.writeFile(
          pathMd,
          `# Preserve

## ${DEFAULT_TARGET_HEADING}

Replace.

## Preserve
`
        ),
        fs.promises.writeFile(
          pathSourceMjs,
          `/**
 * Extra  spacing.
 * @kind constant
 * @name MJS
 */
export default 1;
`
        ),
      ]);

      await jsdocMd({ cwd: tempDirPath });

      // The extra spacing should be preserved in the updated markdown file
      // contents because the file is Prettier ignored.
      await snapshot(
        await fs.promises.readFile(pathMd, 'utf8'),
        new URL(
          '../snapshots/jsdocMd/with-prettier-ignore-file.md',
          import.meta.url
        )
      );
    });
  });

  tests.add('`jsdocMd` with the Prettier parser uninferrable.', async () => {
    await disposableDirectory(async (tempDirPath) => {
      // The Prettier parser is uninferrable due to the file name and the lack
      // of an `.md` file extension. In this situation, a hardcoded fallback
      // `markdown` parser should be used.
      const fileNameMd = 'uninferrable-file-type';
      const pathMd = join(tempDirPath, fileNameMd);
      const pathSourceMjs = join(tempDirPath, 'MJS.mjs');

      await Promise.all([
        fs.promises.writeFile(
          pathMd,
          `# Preserve

## ${DEFAULT_TARGET_HEADING}

Replace.

## Preserve
`
        ),
        fs.promises.writeFile(
          pathSourceMjs,
          `/**
 * Extra  spacing.
 * @kind constant
 * @name MJS
 */
export default 1;
`
        ),
      ]);

      await jsdocMd({
        cwd: tempDirPath,
        markdownPath: fileNameMd,
      });

      await snapshot(
        await fs.promises.readFile(pathMd, 'utf8'),
        new URL(
          '../snapshots/jsdocMd/with-prettier-parser-uninferrable.md',
          import.meta.url
        )
      );
    });
  });
};
