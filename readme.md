# babel-plugin-jsdoc-md

[![Build status](https://travis-ci.org/jaydenseric/babel-plugin-jsdoc-md.svg)](https://travis-ci.org/jaydenseric/babel-plugin-jsdoc-md) [![npm version](https://img.shields.io/npm/v/babel-plugin-jsdoc-md.svg)](https://npm.im/babel-plugin-jsdoc-md)

A Babel plugin that analyzes JSDoc to generate documentation under a given heading in a markdown file (such as `readme.md`).

## Setup

To install [`babel-plugin-jsdoc-md`](https://npm.im/babel-plugin-jsdoc-md) from [npm](https://npmjs.com) run:

```sh
npm install babel-plugin-jsdoc-md
```

Configure Babel (displaying default options):

```json
{
  "plugins": [
    [
      "jsdoc-md",
      {
        "mdPath": "readme.md",
        "heading": "API"
      }
    ]
  ]
}
```

To use defaults:

```json
{
  "plugins": ["jsdoc-md"]
}
```

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

- [`@kind`](http://usejsdoc.org/tags-kind.html)
- [`@name`](http://usejsdoc.org/tags-name.html)
- [`@type`](http://usejsdoc.org/tags-type.html)
- [`@param`](http://usejsdoc.org/tags-param.html)
- [`@prop`](http://usejsdoc.org/tags-property.html)
- [`@returns`](http://usejsdoc.org/tags-returns.html)
- [`@see`](http://usejsdoc.org/tags-see.html)
- [`@example`](http://usejsdoc.org/tags-see.html)
- [`@ignore`](http://usejsdoc.org/tags-ignore.html)

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

[JSDoc namepath prefixes](http://usejsdoc.org/about-namepaths.html) are not supported:

- [`module:`](http://usejsdoc.org/tags-module.html)
- [`external:`](http://usejsdoc.org/tags-external.html)
- [`event:`](http://usejsdoc.org/tags-event.html)

### Namepath special characters

[JSDoc namepath special characters](http://usejsdoc.org/about-namepaths.html) with surrounding quotes and backslash escapes (e.g. `@name a."#b"."\"c"`) are not supported.

### Inline tags

JSDoc inline tags such as [`{@link}`](http://usejsdoc.org/tags-inline-link.html) and [`{@tutorial}`](http://usejsdoc.org/tags-inline-tutorial.html) are unsupported. Use markdown links instead.
