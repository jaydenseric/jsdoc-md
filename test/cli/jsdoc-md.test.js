'use strict';

const { strictEqual } = require('assert');
const { spawnSync } = require('child_process');
const fs = require('fs');
const { join, resolve } = require('path');
const { disposableDirectory } = require('disposable-directory');
const snapshot = require('snapshot-assertion');

const cliPath = resolve(__dirname, '../../cli/jsdoc-md');

module.exports = (tests) => {
  tests.add('`jsdoc-md` CLI with defaults.', async () => {
    await disposableDirectory(async (tempDirPath) => {
      const fileNameSourceIgnored = 'C.js';
      const pathGitignore = join(tempDirPath, '.gitignore');
      const pathMd = join(tempDirPath, 'readme.md');
      const pathSourceJs = join(tempDirPath, 'A.js');
      const pathSourceMjs = join(tempDirPath, 'B.mjs');
      const pathSourceIgnored = join(tempDirPath, fileNameSourceIgnored);

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
          pathSourceJs,
          `/**
 * @kind constant
 * @name A
 * @type {string}
 */
module.exports = 'A';
`
        ),
        fs.promises.writeFile(
          pathSourceMjs,
          `/**
 * @kind constant
 * @name B
 * @type {string}
 */
export default 'B';
`
        ),
        fs.promises.writeFile(
          pathSourceIgnored,
          `/**
 * @kind constant
 * @name C
 * @type {string}
 */
module.exports = 'C';
`
        ),
      ]);

      const { stdout, stderr, status, error } = spawnSync('node', [cliPath], {
        cwd: tempDirPath,
        env: {
          ...process.env,
          FORCE_COLOR: 1,
        },
      });

      if (error) throw error;

      strictEqual(stdout.toString(), '');
      strictEqual(stderr.toString(), '');
      strictEqual(status, 0);

      await snapshot(
        await fs.promises.readFile(pathMd, 'utf8'),
        resolve(__dirname, '../snapshots/jsdoc-md/defaults.md')
      );
    });
  });

  tests.add('`jsdoc-md` CLI with arguments.', async () => {
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

      const { stdout, stderr, status, error } = spawnSync(
        'node',
        [
          cliPath,
          '--source-glob=**/*.jsx',
          `--markdown-path=${fileNameMd}`,
          `--target-heading=${targetHeading}`,
        ],
        {
          cwd: tempDirPath,
          env: {
            ...process.env,
            FORCE_COLOR: 1,
          },
        }
      );

      if (error) throw error;

      strictEqual(stdout.toString(), '');
      strictEqual(stderr.toString(), '');
      strictEqual(status, 0);

      await snapshot(
        await fs.promises.readFile(pathMd, 'utf8'),
        resolve(__dirname, '../snapshots/jsdoc-md/arguments.md')
      );
    });
  });

  tests.add('`jsdoc-md` CLI with an error.', async () => {
    await disposableDirectory(async (tempDirPath) => {
      const pathMd = join(tempDirPath, 'readme.md');
      const pathSource = join(tempDirPath, 'A.js');
      const mdContent = '## API';

      await Promise.all([
        fs.promises.writeFile(pathMd, mdContent),
        fs.promises.writeFile(
          pathSource,
          `/**
 * @kind member
 * @name A~a
 */`
        ),
      ]);

      const { stdout, stderr, status, error } = spawnSync('node', [cliPath], {
        cwd: tempDirPath,
        env: {
          ...process.env,
          FORCE_COLOR: 1,
        },
      });

      if (error) throw error;

      strictEqual(stdout.toString(), '');

      await snapshot(
        stderr.toString(),
        resolve(__dirname, '../snapshots/jsdoc-md/error-stderr.ans')
      );

      strictEqual(status, 1);
      strictEqual(await fs.promises.readFile(pathMd, 'utf8'), mdContent);
    });
  });
};
