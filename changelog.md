# jsdoc-md changelog

## Next

### Minor

- [Uint8Array](https://mdn.io/uint8array) now MDN linked & alphabetized, updated snapshot test for `Uint8Array` and fixed [#11](https://github.com/jaydenseric/jsdoc-md/issues/9).

### Patch

- Updated dependencies.
- Updated package scripts and config for the new [`husky`](https://npm.im/husky) version.
- [Uint8Array](https://mdn.io/uint8array) now MDN linked & alphabetized, updated snapshot test for `Uint8Array` and fixed [#11](https://github.com/jaydenseric/jsdoc-md/issues/9).
- Added a missing test for the `Promise` type MDN link.

## 1.6.0

### Minor

- Support Node.js v6+, from v8.5+.

### Patch

- Work around a Babel breaking change to parsing decorators, see [babel/babel#8562](https://github.com/babel/babel/issues/8562).

## 1.5.0

### Minor

- Use [mdn.io](https://github.com/lazd/mdn.io) for shorter [MDN](https://developer.mozilla.org) links in generated markdown.
- `Promise` types now link to their MDN docs.

### Patch

- Updated dependencies.
- Removed the [`npm-run-all`](https://npm.im/npm-run-all) dev dependency and stopped using it for package scripts.
- Swapped readme badge order.

## 1.4.0

### Minor

- Sort members in the documentation outline, fixes [#8](https://github.com/jaydenseric/jsdoc-md/issues/8).
- Explicitly left align table cell contents.
- Display parameter and property names as inline code.

### Patch

- Updated dependencies.
- Configured Prettier to lint `.yml` files.
- Ensure the readme Travis build status badge only tracks `master` branch.
- Use [Badgen](https://badgen.net) for the readme npm version badge.

## 1.3.0

### Minor

- Default documentation for global types (such as `Object`) can be overridden using `@typedef`.
- Also auto-link MDN articles for global types `function` and `Date`.

### Patch

- Varied capitalization of global types (such as `Object`) results in a consistently lowercase MDN link slug.

## 1.2.0

### Minor

- Generate function return documentation, fixes [#7](https://github.com/jaydenseric/jsdoc-md/issues/7).

## 1.1.0

### Minor

- Support [JSDoc inline tag links](http://usejsdoc.org/tags-inline-link.html) (e.g. `` [`b` method]{@link A#b} ``) for descriptions and tags with markdown content, closes [#5](https://github.com/jaydenseric/jsdoc-md/issues/5).

### Patch

- Correct slugs for successive type member links, fixes [#6](https://github.com/jaydenseric/jsdoc-md/issues/6).
- Display CLI options as code in the readme.
- Internally refactor `jsdocAstToMember` to `jsdocToMember`.

## 1.0.0

Initial release.
