'use strict';

const { strictEqual } = require('assert');
const fs = require('fs');
const { join, resolve } = require('path');
const { disposableDirectory } = require('disposable-directory');
const execFilePromise = require('../execFilePromise');

const cliPath = resolve(__dirname, '../../cli/jsdoc-md');

module.exports = (tests) => {
  tests.add('`jsdoc-md` CLI with defaults.', async () => {
    await disposableDirectory(async (tempDirPath) => {
      const gitignorePath = join(tempDirPath, '.gitignore');
      const ignoredSourcePath = join(tempDirPath, 'ignored.js');
      const sourcePath = join(tempDirPath, 'index.js');
      const markdownPath = join(tempDirPath, 'readme.md');

      await fs.promises.writeFile(gitignorePath, 'ignored.js');

      await fs.promises.writeFile(
        ignoredSourcePath,
        `/**
 * Description.
 * @kind constant
 * @name B
 * @type {boolean}
 */
const B = true
`
      );

      await fs.promises.writeFile(
        sourcePath,
        `/**
 * Description.
 * @kind constant
 * @name A
 * @type {boolean}
 */
const A = true
`
      );

      await fs.promises.writeFile(markdownPath, '## API');

      const { stdout, stderr } = await execFilePromise('node', [cliPath], {
        cwd: tempDirPath,
      });

      strictEqual(stdout, '');
      strictEqual(stderr, '');

      strictEqual(
        await fs.promises.readFile(markdownPath, 'utf8'),
        `## API

### Table of contents

- [constant A](#constant-a)

### constant A

Description.

**Type:** boolean
`
      );
    });
  });

  tests.add('`jsdoc-md` CLI with arguments.', async () => {
    await disposableDirectory(async (tempDirPath) => {
      const gitignorePath = join(tempDirPath, '.gitignore');
      const ignoredSourcePath = join(tempDirPath, 'ignored.txt');
      const sourcePath = join(tempDirPath, 'index.txt');
      const markdownPath = join(tempDirPath, 'markdown.md');

      await fs.promises.writeFile(gitignorePath, 'ignored.txt');

      await fs.promises.writeFile(
        ignoredSourcePath,
        `/**
 * Description.
 * @kind constant
 * @name B
 * @type {boolean}
 */
const B = true
`
      );

      await fs.promises.writeFile(
        sourcePath,
        `/**
 * Description.
 * @kind constant
 * @name A
 * @type {boolean}
 */
const A = true
`
      );

      await fs.promises.writeFile(markdownPath, '## Target');

      const { stdout, stderr } = await execFilePromise(
        'node',
        [
          cliPath,
          '--source-glob=**/*.txt',
          '--markdown-path=markdown.md',
          '--target-heading=Target',
        ],
        {
          cwd: tempDirPath,
        }
      );

      strictEqual(stdout, '');
      strictEqual(stderr, '');

      strictEqual(
        await fs.promises.readFile(markdownPath, 'utf8'),
        `## Target

### Table of contents

- [constant A](#constant-a)

### constant A

Description.

**Type:** boolean
`
      );
    });
  });
};
