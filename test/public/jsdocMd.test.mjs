import { rejects, strictEqual } from 'assert';
import { spawnSync } from 'child_process';
import fs from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { disposableDirectory } from 'disposable-directory';
import snapshot from 'snapshot-assertion';
import jsdocMd from '../../public/jsdocMd.mjs';

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

  tests.add('`jsdocMd` with defaults.', async () => {
    await disposableDirectory(async (tempDirPath) => {
      const fileNameSourceIgnored = 'D.js';
      const pathGitignore = join(tempDirPath, '.gitignore');
      const pathMd = join(tempDirPath, 'readme.md');
      const pathSourceMjs = join(tempDirPath, 'A.mjs');
      const pathSourceCjs = join(tempDirPath, 'B.cjs');
      const pathSourceJs = join(tempDirPath, 'C.js');
      const pathSourceIgnored = join(tempDirPath, fileNameSourceIgnored);
      // `test` in the file name so `coverage-node` will automatically ignore it
      // for the code coverage report.
      const pathScript = join(tempDirPath, 'test.mjs');
      const pathJsdocMd = fileURLToPath(
        new URL('../../public/jsdocMd.mjs', import.meta.url)
      );

      await Promise.all([
        fs.promises.writeFile(pathGitignore, fileNameSourceIgnored),
        fs.promises.writeFile(
          pathMd,
          `# Preserve

## API

Replace.

## Preserve
`
        ),
        fs.promises.writeFile(
          pathSourceMjs,
          `/**
 * @kind constant
 * @name A
 * @type {string}
 */
export default 'A';
`
        ),
        fs.promises.writeFile(
          pathSourceCjs,
          `/**
 * @kind constant
 * @name B
 * @type {string}
 */
module.exports = 'B';
`
        ),
        fs.promises.writeFile(
          pathSourceJs,
          `/**
 * @kind constant
 * @name C
 * @type {string}
 */
module.exports = 'C';
`
        ),
        fs.promises.writeFile(
          pathSourceIgnored,
          `/**
 * @kind constant
 * @name D
 * @type {string}
 */
module.exports = 'D';
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
        new URL('../snapshots/jsdocMd/defaults.md', import.meta.url)
      );
    });
  });

  tests.add('`jsdocMd` with options.', async () => {
    await disposableDirectory(async (tempDirPath) => {
      const targetHeading = 'Target';
      const fileNameSourceIgnored = 'B.jsx';
      const fileNameMd = 'markdown.md';
      const pathGitignore = join(tempDirPath, '.gitignore');
      const pathMd = join(tempDirPath, fileNameMd);
      const pathSource = join(tempDirPath, 'A.jsx');
      const pathSourceIgnored = join(tempDirPath, fileNameSourceIgnored);

      await Promise.all([
        fs.promises.writeFile(pathGitignore, fileNameSourceIgnored),
        fs.promises.writeFile(
          pathMd,
          `# Preserve

## ${targetHeading}

Replace.

## Preserve
`
        ),
        fs.promises.writeFile(
          pathSource,
          `/**
 * @kind constant
 * @name A
 * @type {string}
 */
export default 'A';
`
        ),
        fs.promises.writeFile(
          pathSourceIgnored,
          `/**
 * @kind constant
 * @name B
 * @type {string}
 */
export default 'B';
`
        ),
      ]);

      await jsdocMd({
        cwd: tempDirPath,
        sourceGlob: '**/*.jsx',
        markdownPath: fileNameMd,
        targetHeading,
      });

      await snapshot(
        await fs.promises.readFile(pathMd, 'utf8'),
        new URL('../snapshots/jsdocMd/options.md', import.meta.url)
      );
    });
  });
};
