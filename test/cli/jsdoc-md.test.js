'use strict';

const { strictEqual } = require('assert');
const { spawnSync } = require('child_process');
const fs = require('fs');
const { join, resolve } = require('path');
const { disposableDirectory } = require('disposable-directory');
const snapshot = require('snapshot-assertion');

const cliPath = resolve(__dirname, '../../cli/jsdoc-md');

module.exports = (tests) => {
  tests.add(
    '`jsdoc-md` CLI with argument `--source-glob` value empty.',
    async () => {
      await disposableDirectory(async (tempDirPath) => {
        const { stdout, stderr, status, error } = spawnSync(
          'node',
          [cliPath, '--source-glob='],
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

        await snapshot(
          stderr.toString(),
          resolve(
            __dirname,
            '../snapshots/jsdoc-md/argument-source-glob-value-empty-stderr.ans'
          )
        );

        strictEqual(status, 1);
      });
    }
  );

  tests.add(
    '`jsdoc-md` CLI with argument `--source-glob` value missing.',
    async () => {
      await disposableDirectory(async (tempDirPath) => {
        const { stdout, stderr, status, error } = spawnSync(
          'node',
          [cliPath, '--source-glob'],
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

        await snapshot(
          stderr.toString(),
          resolve(
            __dirname,
            '../snapshots/jsdoc-md/argument-source-glob-value-missing-stderr.ans'
          )
        );

        strictEqual(status, 1);
      });
    }
  );

  tests.add('`jsdoc-md` CLI with argument `-s` value missing.', async () => {
    await disposableDirectory(async (tempDirPath) => {
      const { stdout, stderr, status, error } = spawnSync(
        'node',
        [cliPath, '-s'],
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

      await snapshot(
        stderr.toString(),
        resolve(
          __dirname,
          '../snapshots/jsdoc-md/argument-s-value-missing-stderr.ans'
        )
      );

      strictEqual(status, 1);
    });
  });

  tests.add(
    '`jsdoc-md` CLI with argument `-s` value missing due to following short arg.',
    async () => {
      await disposableDirectory(async (tempDirPath) => {
        const { stdout, stderr, status, error } = spawnSync(
          'node',
          [cliPath, '-ss'],
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

        await snapshot(
          stderr.toString(),
          resolve(
            __dirname,
            '../snapshots/jsdoc-md/argument-s-value-missing-following-short-arg-stderr.ans'
          )
        );

        strictEqual(status, 1);
      });
    }
  );

  tests.add(
    '`jsdoc-md` CLI with argument `--markdown-path` value empty.',
    async () => {
      await disposableDirectory(async (tempDirPath) => {
        const { stdout, stderr, status, error } = spawnSync(
          'node',
          [cliPath, '--markdown-path='],
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

        await snapshot(
          stderr.toString(),
          resolve(
            __dirname,
            '../snapshots/jsdoc-md/argument-markdown-path-value-empty-stderr.ans'
          )
        );

        strictEqual(status, 1);
      });
    }
  );

  tests.add(
    '`jsdoc-md` CLI with argument `--markdown-path` value missing.',
    async () => {
      await disposableDirectory(async (tempDirPath) => {
        const { stdout, stderr, status, error } = spawnSync(
          'node',
          [cliPath, '--markdown-path'],
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

        await snapshot(
          stderr.toString(),
          resolve(
            __dirname,
            '../snapshots/jsdoc-md/argument-markdown-path-value-missing-stderr.ans'
          )
        );

        strictEqual(status, 1);
      });
    }
  );

  tests.add('`jsdoc-md` CLI with argument `-m` value missing.', async () => {
    await disposableDirectory(async (tempDirPath) => {
      const { stdout, stderr, status, error } = spawnSync(
        'node',
        [cliPath, '-m'],
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

      await snapshot(
        stderr.toString(),
        resolve(
          __dirname,
          '../snapshots/jsdoc-md/argument-m-value-missing-stderr.ans'
        )
      );

      strictEqual(status, 1);
    });
  });

  tests.add(
    '`jsdoc-md` CLI with argument `-m` value missing due to following short arg.',
    async () => {
      await disposableDirectory(async (tempDirPath) => {
        const { stdout, stderr, status, error } = spawnSync(
          'node',
          [cliPath, '-mm'],
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

        await snapshot(
          stderr.toString(),
          resolve(
            __dirname,
            '../snapshots/jsdoc-md/argument-m-value-missing-following-short-arg-stderr.ans'
          )
        );

        strictEqual(status, 1);
      });
    }
  );

  tests.add(
    '`jsdoc-md` CLI with argument `--target-heading` value empty.',
    async () => {
      await disposableDirectory(async (tempDirPath) => {
        const { stdout, stderr, status, error } = spawnSync(
          'node',
          [cliPath, '--target-heading='],
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

        await snapshot(
          stderr.toString(),
          resolve(
            __dirname,
            '../snapshots/jsdoc-md/argument-target-heading-value-empty-stderr.ans'
          )
        );

        strictEqual(status, 1);
      });
    }
  );

  tests.add(
    '`jsdoc-md` CLI with argument `--target-heading` value missing.',
    async () => {
      await disposableDirectory(async (tempDirPath) => {
        const { stdout, stderr, status, error } = spawnSync(
          'node',
          [cliPath, '--target-heading'],
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

        await snapshot(
          stderr.toString(),
          resolve(
            __dirname,
            '../snapshots/jsdoc-md/argument-target-heading-value-missing-stderr.ans'
          )
        );

        strictEqual(status, 1);
      });
    }
  );

  tests.add('`jsdoc-md` CLI with argument `-t` value missing.', async () => {
    await disposableDirectory(async (tempDirPath) => {
      const { stdout, stderr, status, error } = spawnSync(
        'node',
        [cliPath, '-t'],
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

      await snapshot(
        stderr.toString(),
        resolve(
          __dirname,
          '../snapshots/jsdoc-md/argument-t-value-missing-stderr.ans'
        )
      );

      strictEqual(status, 1);
    });
  });

  tests.add(
    '`jsdoc-md` CLI with argument `-t` value missing due to following short arg.',
    async () => {
      await disposableDirectory(async (tempDirPath) => {
        const { stdout, stderr, status, error } = spawnSync(
          'node',
          [cliPath, '-mm'],
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

        await snapshot(
          stderr.toString(),
          resolve(
            __dirname,
            '../snapshots/jsdoc-md/argument-t-value-missing-following-short-arg-stderr.ans'
          )
        );

        strictEqual(status, 1);
      });
    }
  );

  tests.add('`jsdoc-md` CLI with an unexpected argument.', async () => {
    await disposableDirectory(async (tempDirPath) => {
      const { stdout, stderr, status, error } = spawnSync(
        'node',
        [cliPath, '--unexpected-a'],
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

      await snapshot(
        stderr.toString(),
        resolve(
          __dirname,
          '../snapshots/jsdoc-md/unexpected-argument-stderr.ans'
        )
      );

      strictEqual(status, 1);
    });
  });

  tests.add('`jsdoc-md` CLI with unexpected arguments.', async () => {
    await disposableDirectory(async (tempDirPath) => {
      const { stdout, stderr, status, error } = spawnSync(
        'node',
        [cliPath, '--unexpected-a', '--unexpected-b=', '--unexpected-c=abc'],
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

      await snapshot(
        stderr.toString(),
        resolve(
          __dirname,
          '../snapshots/jsdoc-md/unexpected-arguments-stderr.ans'
        )
      );

      strictEqual(status, 1);
    });
  });

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

  tests.add('`jsdoc-md` CLI with an invalid JSdoc error.', async () => {
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
        resolve(
          __dirname,
          '../snapshots/jsdoc-md/invalid-jsdoc-error-stderr.ans'
        )
      );

      strictEqual(status, 1);
      strictEqual(await fs.promises.readFile(pathMd, 'utf8'), mdContent);
    });
  });
};
