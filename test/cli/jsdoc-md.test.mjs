import { strictEqual } from 'assert';
import { spawnSync } from 'child_process';
import fs from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { disposableDirectory } from 'disposable-directory';
import snapshot from 'snapshot-assertion';

const cliPath = fileURLToPath(
  new URL('../../cli/jsdoc-md.mjs', import.meta.url)
);

export default (tests) => {
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
          new URL(
            '../snapshots/jsdoc-md/argument-source-glob-value-empty-stderr.ans',
            import.meta.url
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
          new URL(
            '../snapshots/jsdoc-md/argument-source-glob-value-missing-stderr.ans',
            import.meta.url
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
        new URL(
          '../snapshots/jsdoc-md/argument-s-value-missing-stderr.ans',
          import.meta.url
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
          new URL(
            '../snapshots/jsdoc-md/argument-s-value-missing-following-short-arg-stderr.ans',
            import.meta.url
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
          new URL(
            '../snapshots/jsdoc-md/argument-markdown-path-value-empty-stderr.ans',
            import.meta.url
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
          new URL(
            '../snapshots/jsdoc-md/argument-markdown-path-value-missing-stderr.ans',
            import.meta.url
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
        new URL(
          '../snapshots/jsdoc-md/argument-m-value-missing-stderr.ans',
          import.meta.url
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
          new URL(
            '../snapshots/jsdoc-md/argument-m-value-missing-following-short-arg-stderr.ans',
            import.meta.url
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
          new URL(
            '../snapshots/jsdoc-md/argument-target-heading-value-empty-stderr.ans',
            import.meta.url
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
          new URL(
            '../snapshots/jsdoc-md/argument-target-heading-value-missing-stderr.ans',
            import.meta.url
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
        new URL(
          '../snapshots/jsdoc-md/argument-t-value-missing-stderr.ans',
          import.meta.url
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
          new URL(
            '../snapshots/jsdoc-md/argument-t-value-missing-following-short-arg-stderr.ans',
            import.meta.url
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
        new URL(
          '../snapshots/jsdoc-md/unexpected-argument-stderr.ans',
          import.meta.url
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
        new URL(
          '../snapshots/jsdoc-md/unexpected-arguments-stderr.ans',
          import.meta.url
        )
      );

      strictEqual(status, 1);
    });
  });

  tests.add('`jsdoc-md` CLI with defaults.', async () => {
    await disposableDirectory(async (tempDirPath) => {
      const fileNameSourceIgnored = 'D.js';
      const pathGitignore = join(tempDirPath, '.gitignore');
      const pathMd = join(tempDirPath, 'readme.md');
      const pathSourceMjs = join(tempDirPath, 'A.mjs');
      const pathSourceCjs = join(tempDirPath, 'B.cjs');
      const pathSourceJs = join(tempDirPath, 'C.js');
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
export default 'D';
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
        new URL('../snapshots/jsdoc-md/defaults.md', import.meta.url)
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
        new URL('../snapshots/jsdoc-md/arguments.md', import.meta.url)
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
        new URL(
          '../snapshots/jsdoc-md/invalid-jsdoc-error-stderr.ans',
          import.meta.url
        )
      );

      strictEqual(status, 1);
      strictEqual(await fs.promises.readFile(pathMd, 'utf8'), mdContent);
    });
  });
};
