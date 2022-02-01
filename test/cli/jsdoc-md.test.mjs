import { strictEqual } from 'assert';
import { spawnSync } from 'child_process';
import disposableDirectory from 'disposable-directory';
import fs from 'fs';
import { join } from 'path';
import snapshot from 'snapshot-assertion';
import { fileURLToPath } from 'url';

const JSDOC_MD_CLI_PATH = fileURLToPath(
  new URL('../../cli/jsdoc-md.mjs', import.meta.url)
);

export default (tests) => {
  tests.add(
    '`jsdoc-md` CLI with argument `--source-glob` value empty.',
    async () => {
      await disposableDirectory(async (tempDirPath) => {
        const { stdout, stderr, status, error } = spawnSync(
          'node',
          [JSDOC_MD_CLI_PATH, '--source-glob='],
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
          [JSDOC_MD_CLI_PATH, '--source-glob'],
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
        [JSDOC_MD_CLI_PATH, '-s'],
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
          [JSDOC_MD_CLI_PATH, '-ss'],
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
          [JSDOC_MD_CLI_PATH, '--markdown-path='],
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
          [JSDOC_MD_CLI_PATH, '--markdown-path'],
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
        [JSDOC_MD_CLI_PATH, '-m'],
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
          [JSDOC_MD_CLI_PATH, '-mm'],
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
          [JSDOC_MD_CLI_PATH, '--target-heading='],
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
          [JSDOC_MD_CLI_PATH, '--target-heading'],
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
        [JSDOC_MD_CLI_PATH, '-t'],
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
          [JSDOC_MD_CLI_PATH, '-mm'],
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
        [JSDOC_MD_CLI_PATH, '--unexpected-a'],
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
        [
          JSDOC_MD_CLI_PATH,
          '--unexpected-a',
          '--unexpected-b=',
          '--unexpected-c=abc',
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
      const fileNameSourceGitIgnored = 'GitIgnored.js';
      const pathGitIgnore = join(tempDirPath, '.gitignore');
      const pathMd = join(tempDirPath, 'readme.md');
      const pathSourceMjs = join(tempDirPath, 'MJS.mjs');
      const pathSourceCjs = join(tempDirPath, 'CJS.cjs');
      const pathSourceJs = join(tempDirPath, 'JS.js');
      const pathSourceGitIgnored = join(tempDirPath, fileNameSourceGitIgnored);

      await Promise.all([
        fs.promises.writeFile(pathGitIgnore, fileNameSourceGitIgnored),
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
      ]);

      const { stdout, stderr, status, error } = spawnSync(
        'node',
        [JSDOC_MD_CLI_PATH],
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
        new URL('../snapshots/jsdoc-md/defaults.md', import.meta.url)
      );
    });
  });

  tests.add('`jsdoc-md` CLI with arguments.', async () => {
    await disposableDirectory(async (tempDirPath) => {
      const targetHeading = 'Target';
      const fileNameSourceGitIgnored = 'B.jsx';
      const fileNameMd = 'markdown.md';
      const pathGitIgnore = join(tempDirPath, '.gitignore');
      const pathMd = join(tempDirPath, fileNameMd);
      const pathSource = join(tempDirPath, 'A.jsx');
      const pathSourceGitIgnored = join(tempDirPath, fileNameSourceGitIgnored);

      await Promise.all([
        fs.promises.writeFile(pathGitIgnore, fileNameSourceGitIgnored),
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
 */
export default 1;
`
        ),
        fs.promises.writeFile(
          pathSourceGitIgnored,
          `/**
 * @kind constant
 * @name B
 */
export default 1;
`
        ),
      ]);

      const { stdout, stderr, status, error } = spawnSync(
        'node',
        [
          JSDOC_MD_CLI_PATH,
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

  tests.add('`jsdoc-md` CLI with argument `--check`.', async () => {
    await disposableDirectory(async (tempDirPath) => {
      const pathMd = join(tempDirPath, 'readme.md');
      const pathSourceMjs = join(tempDirPath, 'MJS.mjs');

      await Promise.all([
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
 * @name MJS
 */
export default 1;
`
        ),
      ]);

      const spawnResult1 = spawnSync('node', [JSDOC_MD_CLI_PATH, '--check'], {
        cwd: tempDirPath,
        env: {
          ...process.env,
          FORCE_COLOR: 1,
        },
      });

      if (spawnResult1.error) throw spawnResult1.error;

      strictEqual(spawnResult1.stdout.toString(), '');

      await snapshot(
        spawnResult1.stderr.toString(),
        new URL(
          '../snapshots/jsdoc-md/argument-check-error-stderr.ans',
          import.meta.url
        )
      );

      strictEqual(spawnResult1.status, 1);

      // Update the markdown so the following check will pass.
      const spawnResult2 = spawnSync('node', [JSDOC_MD_CLI_PATH], {
        cwd: tempDirPath,
        env: {
          ...process.env,
          FORCE_COLOR: 1,
        },
      });

      if (spawnResult2.error) throw spawnResult2.error;

      strictEqual(spawnResult2.stdout.toString(), '');
      strictEqual(spawnResult2.stderr.toString(), '');
      strictEqual(spawnResult2.status, 0);

      const { mtimeMs: modifiedTimeMsFirst } = await fs.promises.stat(pathMd);

      const spawnResult3 = spawnSync('node', [JSDOC_MD_CLI_PATH, '--check'], {
        cwd: tempDirPath,
        env: {
          ...process.env,
          FORCE_COLOR: 1,
        },
      });

      if (spawnResult3.error) throw spawnResult3.error;

      strictEqual(spawnResult3.stdout.toString(), '');
      strictEqual(spawnResult3.stderr.toString(), '');
      strictEqual(spawnResult3.status, 0);

      const { mtimeMs: modifiedTimeMsSecond } = await fs.promises.stat(pathMd);

      // The file should not have been modified a second time by the check.
      strictEqual(modifiedTimeMsFirst, modifiedTimeMsSecond);
    });
  });

  tests.add('`jsdoc-md` CLI with an invalid JSdoc error.', async () => {
    await disposableDirectory(async (tempDirPath) => {
      const pathMd = join(tempDirPath, 'readme.md');
      const pathSource = join(tempDirPath, 'A.mjs');
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

      const { stdout, stderr, status, error } = spawnSync(
        'node',
        [JSDOC_MD_CLI_PATH],
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
          '../snapshots/jsdoc-md/invalid-jsdoc-error-stderr.ans',
          import.meta.url
        )
      );

      strictEqual(status, 1);
      strictEqual(await fs.promises.readFile(pathMd, 'utf8'), mdContent);
    });
  });
};
