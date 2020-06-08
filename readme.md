# jsdoc-md

[![npm version](https://badgen.net/npm/v/jsdoc-md)](https://npm.im/jsdoc-md) [![CI status](https://github.com/jaydenseric/jsdoc-md/workflows/CI/badge.svg)](https://github.com/jaydenseric/jsdoc-md/actions)

A Node.js CLI to analyze source JSDoc and generate documentation under a given heading in a markdown file (such as `readme.md`).

## Setup

To install from [npm](https://npmjs.com) run:

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

The `jsdoc-md` command scrapes JSDoc from source files nested in the current working directory to populate a markdown file documentation section. Source files are excluded via `.gitignore` files.

It implements the [function `jsdocMd`](#function-jsdocmd) and has the following arguments:

| Option | Alias | Default | Description |
| :-- | :-- | :-- | :-- |
| `--source-glob` | `-s` | `**/*.{mjs,js}` | JSDoc source file glob pattern. |
| `--markdown-path` | `-m` | `readme.md` | Path to the markdown file for docs insertion. |
| `--target-heading` | `-t` | `API` | Markdown file heading to insert docs under. |

[`npx`](https://npm.im/npx) examples:

```sh
npx jsdoc-md
```

```sh
npx jsdoc-md --source-glob **/*.{mjs,js} --markdown-path readme.md --target-heading API
```

Example [`package.json` scripts](https://docs.npmjs.com/files/package.json#scripts) for a project that uses [Prettier](https://prettier.io) to format the readme:

```json
{
  "prepare": "npm run prepare:jsdoc && npm run prepare:prettier",
  "prepare:jsdoc": "jsdoc-md",
  "prepare:prettier": "prettier readme.md --write"
}
```

## API

### Table of contents

- [function jsdocMd](#function-jsdocmd)

### function jsdocMd

Scrapes JSDoc from source files to populate a markdown file documentation section. Source files are excluded via `.gitignore` files.

| Parameter | Type | Description |
| :-- | :-- | :-- |
| `options` | object? | Options. |
| `options.cwd` | string? | A directory path to scope the search for source and .gitignore files, defaulting to `process.cwd()`. |
| `options.sourceGlob` | string? = `**/*.{mjs,js}` | JSDoc source file glob pattern. |
| `options.markdownPath` | string? = `readme.md` | Path to the markdown file for docs insertion. |
| `options.targetHeading` | string? = `API` | Markdown file heading to insert docs under. |

#### Examples

_Ways to `import`._

> ```js
> import { jsdocMd } from 'jsdoc-md';
> ```
>
> ```js
> import jsdocMd from 'jsdoc-md/public/jsdocMd.js';
> ```

_Ways to `require`._

> ```js
> const { jsdocMd } = require('jsdoc-md');
> ```
>
> ```js
> const jsdocMd = require('jsdoc-md/public/execute');
> ```

_Customizing all options._

> ```js
> const { jsdocMd } = require('jsdoc-md');
>
> jsdocMd({
>   cwd: '/path/to/project',
>   sourceGlob: 'index.mjs',
>   markdownPath: 'README.md',
>   targetHeading: 'Docs',
> });
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
const ONE = 1;
```

### Tag subset

A JSDoc tag subset is supported:

- [`@kind`](https://jsdoc.app/tags-kind)
- [`@name`](https://jsdoc.app/tags-name)
- [`@type`](https://jsdoc.app/tags-type)
- [`@prop`](https://jsdoc.app/tags-property)
- [`@param`](https://jsdoc.app/tags-param)
- [`@returns`](https://jsdoc.app/tags-returns)
- [`@fires`](https://jsdoc.app/tags-fires)
- [`@see`](https://jsdoc.app/tags-see)
- [`@example`](https://jsdoc.app/tags-example)
- [`@ignore`](https://jsdoc.app/tags-ignore)

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
  THREE: 3,
};
```

### Namepath prefixes

Some [JSDoc namepath prefixes](https://jsdoc.app/about-namepaths) are not supported:

- [`module:`](https://jsdoc.app/tags-module)
- [`external:`](https://jsdoc.app/tags-external)

### Namepath special characters

[JSDoc namepath special characters](https://jsdoc.app/about-namepaths) with surrounding quotes and backslash escapes (e.g. `@name a."#b"."\"c"`) are not supported.

### Inline tags

One [JSDoc inline tag link](https://jsdoc.app/tags-inline-link) syntax is supported for namepath links in JSDoc descriptions and tags with markdown content: `` [`b` method]{@link A#b} ``. Use normal markdown syntax for non-namepath links.

Other inline tags such as [`{@tutorial}`](https://jsdoc.app/tags-inline-tutorial) are unsupported.

### Example content

[`@example`](https://jsdoc.app/tags-example) content outside `<caption />` (which may also contain markdown) is treated as markdown. This allows multiple code blocks with syntax highlighting and explanatory content such as paragraphs and images. For example:

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
 * popup('Hello!');
 * ```
 *
 * Displays like this on macOS:
 *
 * ![Screenshot](path/to/screenshot.jpg)
 */
const popup = (message) => alert(message);
````
