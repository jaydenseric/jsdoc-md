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
      const pathGitignore = join(tempDirPath, '.gitignore');
      const pathMd = join(tempDirPath, 'readme.md');
      const pathSource = join(tempDirPath, 'index.js');
      const pathSourceIgnored = join(tempDirPath, 'ignored.js');

      await Promise.all([
        fs.promises.writeFile(pathGitignore, 'ignored.js'),
        fs.promises.writeFile(pathMd, '## API'),
        fs.promises.writeFile(
          pathSource,
          `/**
 * Description.
 * @kind constant
 * @name A
 * @type {boolean}
 */
const A = true
`
        ),
        fs.promises.writeFile(
          pathSourceIgnored,
          `/**
 * Description.
 * @kind constant
 * @name B
 * @type {boolean}
 */
const B = true
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
        resolve(__dirname, '../snapshots/jsdoc-md/with-defaults-markdown.md')
      );
    });
  });

  tests.add('`jsdoc-md` CLI with arguments.', async () => {
    await disposableDirectory(async (tempDirPath) => {
      const pathGitignore = join(tempDirPath, '.gitignore');
      const pathMd = join(tempDirPath, 'markdown.md');
      const pathSource = join(tempDirPath, 'index.txt');
      const pathSourceIgnored = join(tempDirPath, 'ignored.txt');

      await Promise.all([
        fs.promises.writeFile(pathGitignore, 'ignored.txt'),
        fs.promises.writeFile(pathMd, '## Target'),
        fs.promises.writeFile(
          pathSource,
          `/**
 * Description.
 * @kind constant
 * @name A
 * @type {boolean}
 */
const A = true
`
        ),
        fs.promises.writeFile(
          pathSourceIgnored,
          `/**
 * Description.
 * @kind constant
 * @name B
 * @type {boolean}
 */
const B = true
`
        ),
      ]);

      const { stdout, stderr, status, error } = spawnSync(
        'node',
        [
          cliPath,
          '--source-glob=**/*.txt',
          '--markdown-path=markdown.md',
          '--target-heading=Target',
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
        resolve(__dirname, '../snapshots/jsdoc-md/with-arguments-markdown.md')
      );
    });
  });

  tests.add('`jsdoc-md` CLI with an error.', async () => {
    await disposableDirectory(async (tempDirPath) => {
      const pathMd = join(tempDirPath, 'readme.md');
      const pathSource = join(tempDirPath, 'index.js');
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
        resolve(__dirname, '../snapshots/jsdoc-md/with-an-error-stderr.ans')
      );

      strictEqual(status, 1);
      strictEqual(await fs.promises.readFile(pathMd, 'utf8'), mdContent);
    });
  });
};
