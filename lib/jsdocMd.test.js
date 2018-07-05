const { readFileSync } = require('fs')
const t = require('tap')
const { createTestFile } = require('../test-helpers')
const jsdocMd = require('./jsdocMd')

t.test('jsdocMd', t => {
  const sourceGlob = createTestFile(
    `
/**
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
   * @kind member
   * @name B.b
   */
  static b = ''

  /**
   * Description.
   * @kind member
   * @name B#c
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
 * @see [jsdoc-md on Github](https://github.com/jaydenseric/jsdoc-md).
 * @see [jsdoc-md on npm](https://npm.im/jsdoc-md).
 */
function c(a) {}
`,
    'js',
    t
  )

  const markdownPath = createTestFile(
    `# Preserve

## Target

Replace.

## Preserve
`,
    'md',
    t
  )

  jsdocMd({ sourceGlob, markdownPath, targetHeading: 'Target' })

  const fileReplacedContent = readFileSync(markdownPath, { encoding: 'utf8' })

  t.matchSnapshot(fileReplacedContent, 'File content.')

  t.end()
})
