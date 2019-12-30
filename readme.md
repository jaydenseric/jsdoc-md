# jsdoc-md

[![npm version](https://badgen.net/npm/v/jsdoc-md)](https://npm.im/jsdoc-md) [![CI status](https://github.com/jaydenseric/jsdoc-md/workflows/CI/badge.svg)](https://github.com/jaydenseric/jsdoc-md/actions)

A Node.js CLI to analyze source JSDoc and generate documentation under a given heading in a markdown file (such as `readme.md`).

## Setup

To try it out with [npx](https://npm.im/npx) run:

```sh
npx jsdoc-md --help
```

To install [`jsdoc-md`](https://npm.im/jsdoc-md) from [npm](https://npmjs.com) as a dev dependency run:

```sh
npm install jsdoc-md --save-dev
```

Add a script to your `package.json`:

```json
{
  "scripts": {
    "jsdoc": "jsdoc-md"
  }
}
```

Then run the script to update docs:

```sh
npm run jsdoc
```

## CLI

For detailed CLI usage instructions, run `npx jsdoc-md --help`.

| Option | Alias | Default | Description |
| :-- | :-- | :-- | :-- |
| `--source-glob` | `-s` | `**/*.{mjs,js}` | JSDoc source file glob pattern. |
| `--markdown-path` | `-m` | `readme.md` | Path to the markdown file for docs insertion. |
| `--target-heading` | `-t` | `API` | Markdown file heading to insert docs under. |

## API

### Table of contents

- [function jsdocMd](#function-jsdocmd)

### function jsdocMd

Scrapes JSDoc from files to populate a markdown file documentation section.

| Parameter | Type | Description |
| :-- | :-- | :-- |
| `options` | object? | Options. |
| `options.cwd` | string? | A directory path to scope the search for source and .gitignore files, defaulting to `process.cwd()`. |
| `options.sourceGlob` | string? = `**/*.{mjs,js}` | JSDoc source file glob pattern. |
| `options.markdownPath` | string? = `readme.md` | Path to the markdown file for docs insertion. |
| `options.targetHeading` | string? = `API` | Markdown file heading to insert docs under. |

#### Examples

_Customizing all options._

> ```js
> const { jsdocMd } = require('jsdoc-md')
>
> jsdocMd({
>   sourceGlob: 'index.mjs',
>   markdownPath: 'README.md',
>   targetHeading: 'Docs'
> })
> ```

## Caveats

### No code inference

Missing JSDoc tags are not inferred by inspecting the code, so be sure to use all the necessary tags.

```js
/**
 * The number 1.
 * @kind constant
 * @name ONE
 * @type {number}
 */
const ONE = 1
```

### Tag subset

A JSDoc tag subset is supported:

- [`@kind`](http://usejsdoc.org/tags-kind)
- [`@name`](http://usejsdoc.org/tags-name)
- [`@type`](http://usejsdoc.org/tags-type)
- [`@prop`](http://usejsdoc.org/tags-property)
- [`@param`](http://usejsdoc.org/tags-param)
- [`@returns`](http://usejsdoc.org/tags-returns)
- [`@see`](http://usejsdoc.org/tags-see)
- [`@example`](http://usejsdoc.org/tags-example)
- [`@ignore`](http://usejsdoc.org/tags-ignore)

With the full set of JSDoc tags there is a confusing number of ways to document the same thing. Examples `TWO` and `THREE` use unsupported syntax:

```js
/**
 * My namespace.
 * @kind namespace
 * @name MyNamespace
 */
const MyNamespace = {
  /**
   * The number 1.
   * @kind constant
   * @name MyNamespace.ONE
   * @type {number}
   */
  ONE: 1,

  /**
   * The number 2 (unsupported).
   * @constant {number} TWO
   * @memberof MyNamespace
   */
  TWO: 2,

  /**
   * The number 3 (unsupported).
   * @const MyNamespace.THREE
   * @type {number}
   */
  THREE: 3
}
```

### Namepath prefixes

[JSDoc namepath prefixes](http://usejsdoc.org/about-namepaths) are not supported:

- [`module:`](http://usejsdoc.org/tags-module)
- [`external:`](http://usejsdoc.org/tags-external)
- [`event:`](http://usejsdoc.org/tags-event)

### Namepath special characters

[JSDoc namepath special characters](http://usejsdoc.org/about-namepaths) with surrounding quotes and backslash escapes (e.g. `@name a."#b"."\"c"`) are not supported.

### Inline tags

One [JSDoc inline tag link](http://usejsdoc.org/tags-inline-link) syntax is supported for namepath links in JSDoc descriptions and tags with markdown content: `` [`b` method]{@link A#b} ``. Use normal markdown syntax for non-namepath links.

Other inline tags such as [`{@tutorial}`](http://usejsdoc.org/tags-inline-tutorial) are unsupported.

### Example content

[`@example`](http://usejsdoc.org/tags-example) content outside `<caption />` (which may also contain markdown) is treated as markdown. This allows multiple code blocks with syntax highlighting and explanatory content such as paragraphs and images. For example:

````js
/**
 * Displays a message in a native popup window.
 * @kind function
 * @name popup
 * @param {string} message Message text.
 * @example <caption>Say `Hello!` to the user.</caption>
 * This usage:
 *
 * ```js
 * popup('Hello!')
 * ```
 *
 * Displays like this on macOS:
 *
 * ![Screenshot](path/to/screenshot.jpg)
 */
const popup = message => alert(message)
````
