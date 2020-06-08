'use strict';

const fs = require('fs');
const { join, resolve } = require('path');
const { disposableDirectory } = require('disposable-directory');
const snapshot = require('snapshot-assertion');
const jsdocMd = require('../../public/jsdocMd');

module.exports = (tests) => {
  tests.add('`jsdocMd`.', async () => {
    await disposableDirectory(async (tempDirPath) => {
      const sourcePath = join(tempDirPath, 'index.js');
      const markdownPath = join(tempDirPath, 'readme.md');

      await fs.promises.writeFile(
        sourcePath,
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
 * const b = new B()
 * \`\`\`
 * @example <caption>Construct a new instance with options.</caption>
 * \`\`\`js
 * const b = new B(true)
 * \`\`\`
 */
class B {
  /**
   * Description.
   * @kind typedef
   * @name B~A
   * @type {Object}
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
      );

      await fs.promises.writeFile(
        markdownPath,
        `# Preserve

## Target

Replace.

## Preserve
`
      );

      jsdocMd({
        cwd: tempDirPath,
        sourceGlob: sourcePath,
        markdownPath,
        targetHeading: 'Target',
      });

      await snapshot(
        await fs.promises.readFile(markdownPath, 'utf8'),
        resolve(__dirname, '../snapshots', 'jsdocMd.md')
      );
    });
  });
};
