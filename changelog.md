# jsdoc-md changelog

## 10.0.1

### Patch

- Updated dev dependencies.
- Added back JSDoc typedefs that were accidentally deleted in v10.0.0.
- Replaced the package `prepare` script with a `jsdoc` script.
- Tweaked the package description.
- Updated readme content.

## 10.0.0

### Major

- Updated Node.js support to `^12.20 || >= 14.13`.
- Updated dependencies, some of which require newer Node.js versions than previously supported.
- The API is now ESM in `.mjs` files instead of CJS in `.js` files, [accessible via `import` but not `require`](https://nodejs.org/dist/latest/docs/api/esm.html#esm_require).
- Replaced the the `package.json` `exports` field public [subpath folder mapping](https://nodejs.org/api/packages.html#packages_subpath_folder_mappings) (deprecated by Node.js) with a [subpath pattern](https://nodejs.org/api/packages.html#packages_subpath_patterns).
- By default also scape files with the `.cjs` file extension for JSDoc.
- If the optional peer dependency [`prettier`](https://npm.im/prettier) is installed, the new markdown file contents is [Prettier](https://prettier.io) formatted.

### Patch

- Also run GitHub Actions CI with Node.js v16.
- Use regex `u` mode.
- JSDoc comment ends (`*/`) escaped with a backslash (`*\/`) can now be escaped using additional backslashes (e.g. `*\\/` unescapes to `*\/`).
- Tweaked a code example for the public function `jsdocMd`.
- v9.1.1 changelog entry tweak.

## 9.1.1

### Patch

- Updated dev dependencies.
- Account for the JSDoc comment fence when deriving the code locations for JSDoc inline tag `@link` namepath error messages, fixing [#20](https://github.com/jaydenseric/jsdoc-md/issues/20).
- Exclude multiple newlines from the start and end of JSDoc markdown content.
- Exclude multiple newlines following a JSDoc tag `@example` caption from the content start.
- Disallow newlines between JSDoc inline tag `@link` parts.
- Removed the private function `parseJsdocExample`, moving functionality to the private function `jsdocCommentToMember`.
- Corrected JSDoc member code location end column numbers.
- Reordered tests.

## 9.1.0

### Minor

- Display the relevant source code file path and location in more JSDoc related error messages, fixing [#19](https://github.com/jaydenseric/jsdoc-md/issues/19).
- Allow whitespace between JSDoc inline tag `@link` parts.

### Patch

- Updated dependencies.
- Tweaked some tests.
- Internal JSDoc fixes.
- Use regex `u` mode when parsing JSDoc examples or scanning for JSDoc inline links in description markdown.
- Renamed several private functions.
- Internally, throw `TypeError` instead of `Error` for JSDoc type related errors.

## 9.0.0

### Major

- The function `jsdocMd` is now async and should be faster.

### Minor

- Added support for more JSDoc tags (some are aliases for already supported tags):
  - `@arg`
  - `@argument`
  - `@callback`
  - `@desc`
  - `@description`
  - `@property`
  - `@return`
  - `@typedef`
- Display the relevant source code file path and location in JSDoc namepath related error messages, using new [`kleur`](https://npm.im/kleur) and [`@babel/code-frame`](https://npm.im/@babel/code-frame) dependencies.
- Improved console output for `jsdoc-md` CLI errors.
- Added runtime argument type checks for the function `jsdocMd`.

### Patch

- Update dependencies.
- Use [`unist-util-remove-position`](https://npm.im/unist-util-remove-position) to remove undesirable [`position`](https://github.com/syntax-tree/unist#position) data from the markdown AST that the private function `mdToMdAst` returns.
- Removed `dynamicImport` and `objectRestSpread` plugins from the Babel parser config, as they are enabled by default nowadays.
- Fixed the function `jsdocMd` option `cwd` causing `ENOENT` filesystem errors.
- Fixed the generated markdown headings for various kinds of nested members:
  - Inner members of classes of kind `member` are now labeled `member` instead of `property`.
  - Inner members of non-classes are now labeled `inner`.
  - Inner typedefs are now labeled `type` instead of `typedef`, consistent with non-inner typedefs.
- Fixed mixed absent and present `event:` prefixes in sibling event names in source JSDoc causing incorrect sorting of events in generated markdown.
- Use the `SyntaxError` class instead of `Error` for when `deconstructJsdocNamepath` can’t deconstruct an invalid namepath.
- Renamed the private function `jsdocCommentsFromCode` to `codeToJsdocComments`.
- Made the private function `codeToJsdocComments` async.
- Made the private function `mdFileReplaceSection` async.
- Added runtime argument type checks for various private functions.
- Renamed the private function `jsdocToMember` to `jsdocCommentToMember`.
- Configured the JSDoc parser to not accept a name part for a `type` tag.
- Rewrote a lot of the implementation for better performance.
- Use backticks (`` ` ``) to quote values in error messages instead of typographic double quotes (`“`/`”`).
- Renamed the private `remarkStringifyOptions` module to `REMARK_STRINGIFY_OPTIONS` and added JSDoc.
- Use `Array<>` JSDoc type syntax instead of `[]`.
- Improved the internal JSDoc.
- Improved tests.
- Stop using [`hard-rejection`](https://npm.im/hard-rejection) to detect unhandled `Promise` rejections in tests, as Node.js v15+ does this natively.
- Updated GitHub Actions CI config:
  - Updated `actions/checkout` to v2.
  - Updated `actions/setup-node` to v2.
  - Don’t specify the `CI` environment variable as it’s set by default.

## 8.0.0

### Major

- Updated the [`remark-parse`](https://npm.im/remark-parse) and [`remark-stringify`](https://npm.im/remark-stringify) dependencies to v9.0.0, and implemented a new [`remark-gfm`](https://npm.im/remark-gfm) dependency. Markdown is now explicitly parsed and generated as [GitHub Flavored Markdown (GFM)](https://github.github.com/gfm). Generated markdown may subtly change.

### Patch

- Updated dependencies.
- Use `parseSync` from [`@babel/core`](https://npm.im/@babel/core) instead of `parse`, which may become async in a future major version of Babel.
- Ensure JSDoc without tags is ignored instead of causing an error.
- Updated the `remarkStringifyOptions` so that rules in generated markdown match Prettier formatting (`---`).
- Corrected a `jsdocMd` code example.
- Fixed incorrect MDAST used for `typeJsdocAstToMdAst` tests.
- Use `remarkStringifyOptions` in the `membersToMdAst` tests.
- Refactored an `mdToMdAst` test to use a snapshot.
- Also run GitHub Actions CI with Node.js v15.
- Simplified the GitHub Actions CI config with the [`npm install-test`](https://docs.npmjs.com/cli/v7/commands/npm-install-test) command.
- Removed `npm-debug.log` from the `.gitignore` file as npm [v4.2.0](https://github.com/npm/npm/releases/tag/v4.2.0)+ doesn’t create it in the current working directory.

## 7.0.0

### Major

- Updated Node.js support to `^10.17.0 || ^12.0.0 || >= 13.7.0`.
- Updated dev dependencies, some of which require newer Node.js versions than previously supported.
- Added a [package `exports` field](https://nodejs.org/api/esm.html#esm_package_entry_points) with [conditional exports](https://nodejs.org/api/esm.html#esm_conditional_exports) to support native ESM in Node.js and keep internal code private, [whilst avoiding the dual package hazard](https://nodejs.org/api/esm.html#esm_approach_1_use_an_es_module_wrapper). Published files have been reorganized, so previously undocumented deep imports will need to be rewritten according to the newly documented paths.

### Minor

- Support documenting events:
  - Support the `event` [`@kind`](https://jsdoc.app/tags-kind) value.
  - Support the `event:` name prefix in [JSDoc namepaths](https://jsdoc.app/about-namepaths).
  - Support the [`@fires`](https://jsdoc.app/tags-fires) JSDoc tag.

### Patch

- Updated dependencies.
- Added ESM related keywords to the package `keywords` field.
- Stopped testing with Node.js v13.
- Use [`comment-parser`](https://npm.im/comment-parser) to parse JSDoc comments instead of [`doctrine`](https://npm.im/doctrine).
- Fixed only the first multiline comment end syntax escape being unescaped when parsing JSDoc comments.
- Simplified the `typeJsdocStringToJsdocAst` function.
- Converted a `jsdocMd` test assertion to a snapshot assertion.
- More thorough tests.
- Updated the EditorConfig URL.
- Update [`http://usejsdoc.org`](http://usejsdoc.org) links to [`https://jsdoc.app`](https://jsdoc.app).
- Prettier format code examples.
- Simplify ESLint config after correcting the minimum supported Node.js to v10.17.0.
- Simplify snapshot paths in tests.

## 6.0.0

### Major

- Updated dependencies, some of which now have a [package `exports` field](https://nodejs.org/api/esm.html#esm_package_exports) to support native ESM in Node.js.
- Updated Node.js support from v10+ to `10 - 12 || >= 13.7` to reflect the package `exports` related breaking changes.

### Patch

- Improved the package `prepare:prettier` and `test:prettier` scripts.
- Configured Prettier option `semi` to the default, `true`.
- Lint fixes for [`prettier`](https://npm.im/prettier) v2.
- Ensure GitHub Actions run on pull request.
- Also run GitHub Actions with Node.js v14.
- Fixed the internal `mdFileReplaceSection` function for Node.js v14.

## 5.0.1

### Patch

- Updated dependencies.
- Use [`snapshot-assertion`](https://npm.im/snapshot-assertion) for snapshot assertions in tests.

## 5.0.0

### Major

- Support Node.js v10+, from v8+.
- Updated the [`globby`](https://npm.im/globby) dependency to v10, which may affect how the `jsdoc-md` command `--source-glob` argument and `jsdocMd` function `sourceGlob` option work.
- Replaced the [`yargs`](https://npm.im/yargs) dependency with [`arg`](https://npm.im/arg), for a smaller install size. This affects the `jsdoc-md` command:
  - The `--help`/`-h` argument is gone.
  - The `--version`/`-v` argument is gone.
  - Short arguments can’t be used with `=` (e.g. `jsdoc-md -m readme.md` works, `jsdoc-md -m=readme.md` doesn’t), see [zeit/arg#51](https://github.com/zeit/arg/issues/51).
  - Behavior using quotes around argument values may have changed.

### Minor

- Added a new `cwd` option for the `jsdocMd` function.
- Setup [GitHub Sponsors funding](https://github.com/sponsors/jaydenseric):
  - Added `.github/funding.yml` to display a sponsor button in GitHub.
  - Added a `package.json` `funding` field to enable npm CLI funding features.

### Patch

- Updated dependencies.
- Removed the now redundant [`eslint-plugin-import-order-alphabetical`](https://npm.im/eslint-plugin-import-order-alphabetical) dev dependency.
- Stop using [`husky`](https://npm.im/husky) and [`lint-staged`](https://npm.im/lint-staged).
- Replaced the [`tap`](https://npm.im/tap) dev dependency with [`test-director`](https://npm.im/test-director) and [`coverage-node`](https://npm.im/coverage-node), refactoring the tests accordingly. This vastly reduces the dev install size.
- Replaced the deprecated [`circular-json`](https://npm.im/circular-json) dev dependency with [`flatted`](https://npm.im/flatted).
- Added a new [`disposable-directory`](https://npm.im/disposable-directory) dev dependency, using it to replace the `createTestFile` helper and improve tests.
- Added a new [`hard-rejection`](https://npm.im/hard-rejection) dev dependency to ensure unhandled rejections in tests exit the process with an error.
- Test the CLI.
- Use strict mode for scripts.
- Use less arrow functions for better stack traces.
- Replaced every `forEach` loop with `for` `of`.
- More consistent module exports style.
- Removed `package-lock.json` from `.gitignore` and `.prettierignore` as it’s disabled in `.npmrc` anyway.
- Added a package `main` field and moved the index and bin files.
- Use GitHub Actions instead of Travis for CI.
- Simplified the readme “Setup” section.
- Improved CLI docs with examples.
- Documented how files are excluded via `.gitignore`.

## 4.0.1

### Patch

- Display quotes around string literal types that are empty or only contain whitespace, to avoid resulting empty inline code and markdown rendering issues.

## 4.0.0

### Major

- `@param` and `@prop` default values are now parsed as JSDoc types; an invalid type will result in an error.

### Minor

- Richer markdown for `@param` and `@prop` default values:
  - `null`, `undefined`, `void`, number, string, and boolean literal values display as inline code.
  - JSDoc member name references display as links.

### Patch

- Updated dependencies.
- Renamed `test:js` package script to `test:tap`.

## 3.1.0

### Minor

- Exclude “See” and “Examples” headings from generated table of contents.

### Patch

- Updated dependencies.
- Simplified the `prepublishOnly` script.

## 3.0.0

### Major

- Support Node.js v8+, from v6+.

### Minor

- Support the nullable literal type (`?`).
- Support the void literal type (`function(): void`).
- Automatically adjust heading levels in descriptions and examples to suit the surrounding document.

### Patch

- Updated dependencies.
- Reduced the published size of `package.json` by moving dev tool configs to separate files.
- Removed `.html` from [usejsdoc.org](http://usejsdoc.org) links.
- Removed the test file glob from the `test:js` script args as [`tap`](https://npm.im/tap) now finds the files automatically.
- Refactored `typeJsdocAstToMdAst`.
- Test `typeJsdocAstToMdAst` with an unknown type, and more clearly test every possible type.
- Test `outlineMembers` with missing members.
- Test `membersToMdAst` with a parameter default value.

## 2.1.0

### Minor

- Render any combination of supported tags, even if they are illogical (e.g. `@param` with `@prop`). This fixes `@kind constant` not rendering an associated `@type`.
- `@kind typedef` without an associated `@type` no longer causes an error. Linting would be a better way to ensure the right combination of tags are used.

### Patch

- Updated dev dependencies.

## 2.0.1

### Patch

- Fix `<hr />` incorrectly appearing above non top level members.

## 2.0.0

### Major

- `@kind member` now displays an associated `@type` and throws an error if there is none.

### Minor

- Separate top level member sections with `<hr />`.

### Patch

- Updated dev dependencies.
- Use default [`tap`](https://npm.im/tap) reporter for tests.
- Simplify package `test:js` script glob.

## 1.7.1

### Patch

- Updated dependencies.
- Allow Babel to load config relative to files being parsed.
- Stopped automatically linking global types to MDN.
- Simplified ESLint config.

## 1.7.0

### Minor

- Added MDN links for [`Uint8Array`](https://mdn.io/uint8array) types and updated snapshot tests, fixing [#11](https://github.com/jaydenseric/jsdoc-md/issues/9) via [#12](https://github.com/jaydenseric/jsdoc-md/pull/12).

### Patch

- Updated dependencies.
- Updated package scripts and config for the new [`husky`](https://npm.im/husky) version.
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

- Support [JSDoc inline tag links](https://jsdoc.app/tags-inline-link) (e.g. `` [`b` method]{@link A#b} ``) for descriptions and tags with markdown content, closes [#5](https://github.com/jaydenseric/jsdoc-md/issues/5).

### Patch

- Correct slugs for successive type member links, fixes [#6](https://github.com/jaydenseric/jsdoc-md/issues/6).
- Display CLI options as code in the readme.
- Internally refactor `jsdocAstToMember` to `jsdocToMember`.

## 1.0.0

Initial release.
