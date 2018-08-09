# jsdoc-md changelog

## Next

### Minor

- Explicitly left align table cell contents.

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
