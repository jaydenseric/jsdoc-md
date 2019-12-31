'use strict'

const { strictEqual } = require('assert')
const fs = require('fs')
const { join } = require('path')
const { disposableDirectory } = require('disposable-directory')
const jsdocMd = require('../../lib/jsdocMd')

module.exports = tests => {
  tests.add('`jsdocMd`.', async () => {
    await disposableDirectory(async tempDirPath => {
      const sourcePath = join(tempDirPath, 'index.js')
      const markdownPath = join(tempDirPath, 'readme.md')

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
 * @see [\`B\`]{@link B}.
 * @see [jsdoc-md on npm](https://npm.im/jsdoc-md).
 */
function c(a) {}
`
      )

      await fs.promises.writeFile(
        markdownPath,
        `# Preserve

## Target

Replace.

## Preserve
`
      )

      jsdocMd({
        cwd: tempDirPath,
        sourceGlob: sourcePath,
        markdownPath,
        targetHeading: 'Target'
      })

      strictEqual(
        await fs.promises.readFile(markdownPath, 'utf8'),
        `# Preserve

## Target

### Table of contents

- [class B](#class-b)
  - [B static method d](#b-static-method-d)
  - [B static property b](#b-static-property-b)
  - [B instance method e](#b-instance-method-e)
  - [B instance property c](#b-instance-property-c)
  - [B inner typedef A](#b-inner-typedef-a)
- [function c](#function-c)
- [constant A](#constant-a)

### class B

Description, here is a **bold** word.

| Parameter | Type     | Description                           |
| :-------- | :------- | :------------------------------------ |
| \`a\`       | boolean? | Description, here is a **bold** word. |

#### Examples

_Construct a new instance, here is a **bold** word._

> \`\`\`js
> const b = new B()
> \`\`\`

_Construct a new instance with options._

> \`\`\`js
> const b = new B(true)
> \`\`\`

#### B static method d

Description.

| Parameter | Type                      | Description  |
| :-------- | :------------------------ | :----------- |
| \`a\`       | [B~A](#b-inner-typedef-a) | Description. |
| \`b\`       | boolean? = \`true\`         | Description. |

#### B static property b

Description.

**Type:** string

#### B instance method e

Description.

#### B instance property c

Description.

**Type:** string

#### B inner typedef A

Description.

**Type:** Object

| Property | Type    | Description                           |
| :------- | :------ | :------------------------------------ |
| \`a\`      | string  | Description, here is a **bold** word. |
| \`b\`      | boolean | Description.                          |

* * *

### function c

Description.

| Parameter | Type   | Description  |
| :-------- | :----- | :----------- |
| \`a\`       | string | Description. |

#### See

- [\`B\`](#class-b).
- [jsdoc-md on npm](https://npm.im/jsdoc-md).

* * *

### constant A

Description.

**Type:** boolean

## Preserve
`
      )
    })
  })
}
