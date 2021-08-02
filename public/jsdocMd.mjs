import fs from 'fs';
import { resolve } from 'path';
import { globby } from 'globby';
import CliError from '../private/CliError.mjs';
import codeToJsdocComments from '../private/codeToJsdocComments.mjs';
import jsdocCommentToMember from '../private/jsdocCommentToMember.mjs';
import membersToMdAst from '../private/membersToMdAst.mjs';
import replaceMdSection from '../private/replaceMdSection.mjs';

/**
 * Analyzes JSDoc from source files to populate a markdown file documentation
 * section. Source files are excluded via `.gitignore` files. If the optional
 * peer dependency [`prettier`](https://npm.im/prettier) is installed, the new
 * markdown file contents is [Prettier](https://prettier.io) formatted.
 * @kind function
 * @name jsdocMd
 * @param {object} [options] Options.
 * @param {string} [options.cwd] A directory path to scope the search for source and `.gitignore` files, defaulting to `process.cwd()`.
 * @param {string} [options.sourceGlob='**\/*.{mjs,cjs,js}'] JSDoc source file glob pattern.
 * @param {string} [options.markdownPath='readme.md'] Path to the markdown file for docs insertion.
 * @param {string} [options.targetHeading='API'] Markdown file heading to insert docs under.
 * @param {boolean} [options.check=false] Should an error be thrown instead of updating the markdown file if the contents would change; useful for checking docs are up to date in CI.
 * @returns {Promise<void>} Resolves once the operation is done.
 * @example <caption>Ways to `import`.</caption>
 * ```js
 * import { jsdocMd } from 'jsdoc-md';
 * ```
 *
 * ```js
 * import jsdocMd from 'jsdoc-md/public/jsdocMd.mjs';
 * ```
 * @example <caption>Customizing options.</caption>
 * ```js
 * jsdocMd({
 *   cwd: '/path/to/project',
 *   sourceGlob: 'index.mjs',
 *   markdownPath: 'README.md',
 *   targetHeading: 'Docs',
 * }).then(() => {
 *   console.log('Done!');
 * });
 * ```
 */
export default async function jsdocMd({
  cwd = process.cwd(),
  sourceGlob = '**/*.{mjs,cjs,js}',
  markdownPath = 'readme.md',
  targetHeading = 'API',
  check = false,
} = {}) {
  if (typeof cwd !== 'string')
    throw new TypeError('Option `cwd` must be a string.');

  if (cwd === '')
    throw new TypeError('Option `cwd` must be a populated string.');

  if (typeof sourceGlob !== 'string')
    throw new TypeError('Option `sourceGlob` must be a string.');

  if (sourceGlob === '')
    throw new TypeError('Option `sourceGlob` must be a populated string.');

  if (typeof markdownPath !== 'string')
    throw new TypeError('Option `markdownPath` must be a string.');

  if (markdownPath === '')
    throw new TypeError('Option `markdownPath` must be a populated string.');

  if (typeof targetHeading !== 'string')
    throw new TypeError('Option `targetHeading` must be a string.');

  if (targetHeading === '')
    throw new TypeError('Option `targetHeading` must be a populated string.');

  if (typeof check !== 'boolean')
    throw new TypeError('Option `check` must be a boolean.');

  const codeFilePaths = await globby(sourceGlob, { cwd, gitignore: true });
  const codeFiles = new Map();
  const jsdocMembers = [];

  await Promise.all(
    codeFilePaths.map(async (codeFilePath) => {
      // Update the code files map.
      codeFiles.set(
        codeFilePath,
        await fs.promises.readFile(resolve(cwd, codeFilePath), 'utf8')
      );

      // Get the JSDoc comments from the code.
      const jsdocComments = await codeToJsdocComments(
        codeFiles.get(codeFilePath),
        codeFilePath
      );

      // Get the JSDoc members from the JSDoc comments.
      for (const jsdocComment of jsdocComments) {
        const jsdocMember = jsdocCommentToMember(
          jsdocComment,
          codeFiles,
          codeFilePath
        );
        if (jsdocMember) jsdocMembers.push(jsdocMember);
      }
    })
  );

  const mdAbsolutePath = resolve(cwd, markdownPath);
  const mdOriginal = await fs.promises.readFile(mdAbsolutePath, 'utf8');

  let mdUpdated = replaceMdSection(
    mdOriginal,
    targetHeading,
    membersToMdAst(jsdocMembers, codeFiles)
  );

  try {
    var { default: prettier } =
      // See: https://github.com/mysticatea/eslint-plugin-node/issues/250
      // eslint-disable-next-line node/no-unsupported-features/es-syntax
      await import('prettier');
    // It would be great if there was a way to test this without Prettier
    // installed.
    // coverage ignore next line
  } catch (error) {
    // Ignore the error, as Prettier is an optional peer dependency.
  }

  if (prettier) {
    // Determine if the the markdown file is Prettier ignored.
    const { ignored, inferredParser } = await prettier.getFileInfo(
      mdAbsolutePath,
      {
        resolveConfig: true,
        ignorePath:
          // Prettier CLI doesn’t resolve the ignore file like Git, npm, etc.
          // See: https://github.com/prettier/prettier/issues/4081
          resolve(cwd, '.prettierignore'),
      }
    );

    if (!ignored) {
      // Get the Prettier config for the file.
      const prettierConfig = await prettier.resolveConfig(mdAbsolutePath, {
        editorconfig: true,
      });

      // Prettier format the new file contents.
      mdUpdated = prettier.format(mdUpdated, {
        ...prettierConfig,
        parser: inferredParser || 'markdown',
      });
    }
  }

  if (mdOriginal !== mdUpdated)
    if (check) throw new CliError('Checked markdown needs updating.');
    else await fs.promises.writeFile(mdAbsolutePath, mdUpdated);
}
