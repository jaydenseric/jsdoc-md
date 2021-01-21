'use strict';

const { rejects } = require('assert');
const fs = require('fs');
const { join, resolve } = require('path');
const { disposableDirectory } = require('disposable-directory');
const snapshot = require('snapshot-assertion');
const jsdocMd = require('../../public/jsdocMd');

module.exports = (tests) => {
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

  tests.add('`jsdocMd` with options.', async () => {
    await disposableDirectory(async (tempDirPath) => {
      const pathMd = join(tempDirPath, 'readme.md');
      const pathSource = join(tempDirPath, 'index.js');

      await Promise.all([
        fs.promises.writeFile(
          pathMd,
          `# Preserve

## Target

Replace.

## Preserve
`
        ),
        fs.promises.writeFile(
          pathSource,
          `/**
 * Description.
 * @kind constant
 * @name A
 * @type {boolean}
 */
const A = true

/**
 * Description, here is a **bold** word.
 * @kind class
 * @name B
 * @param {boolean} [a] Description, here is a **bold** word.
 * @example <caption>Construct a new instance, here is a **bold** word.</caption>
 * \`\`\`js
 * const b = new B();
 * \`\`\`
 * @example <caption>Construct a new instance with options.</caption>
 * \`\`\`js
 * const b = new B(true);
 * \`\`\`
 */
class B {
  /**
   * Description.
   * @kind typedef
   * @name B~A
   * @type {object}
   * @prop {string} a Description, here is a **bold** word.
   * @prop {boolean} b Description.
   */

  /**
   * Description.
   * @kind event
   * @name B#event:a
   * @type {object}
   * @prop {string} a Description.
   */

  /**
   * Description.
   * @kind member
   * @name B.b
   * @type {string}
   */
  static b = ''

  /**
   * Description.
   * @kind member
   * @name B#c
   * @type {string}
   */
  c = ''

  /**
   * Description.
   * @kind function
   * @name B.d
   * @param {B~A} a Description.
   * @param {boolean} [b=true] Description.
   */
  static d(a, b = true) {}

  /**
   * Description.
   * @kind function
   * @name B#e
   */
  e() {}
}

/**
 * Description.
 * @kind function
 * @name c
 * @param {string} a Description.
 * @fires B#event:a
 * @see [\`B\`]{@link B}.
 * @see [jsdoc-md on npm](https://npm.im/jsdoc-md).
 */
function c(a) {}
`
        ),
      ]);

      await jsdocMd({
        cwd: tempDirPath,
        sourceGlob: pathSource,
        markdownPath: pathMd,
        targetHeading: 'Target',
      });

      await snapshot(
        await fs.promises.readFile(pathMd, 'utf8'),
        resolve(__dirname, '../snapshots/jsdocMd/options.md')
      );
    });
  });
};
