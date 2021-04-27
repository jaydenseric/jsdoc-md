import fs from 'fs';
import { resolve } from 'path';
import globby from 'globby';
import codeToJsdocComments from '../private/codeToJsdocComments.mjs';
import jsdocCommentToMember from '../private/jsdocCommentToMember.mjs';
import mdFileReplaceSection from '../private/mdFileReplaceSection.mjs';
import membersToMdAst from '../private/membersToMdAst.mjs';

/**
 * Scrapes JSDoc from source files to populate a markdown file documentation
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
 * @returns {Promise<void>} Resolves once the operation is done.
 * @example <caption>Ways to `import`.</caption>
 * ```js
 * import { jsdocMd } from 'jsdoc-md';
 * ```
 *
 * ```js
 * import jsdocMd from 'jsdoc-md/public/jsdocMd.mjs';
 * ```
 * @example <caption>Customizing all options.</caption>
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

  await mdFileReplaceSection({
    markdownPath: resolve(cwd, markdownPath),
    targetHeading,
    replacementAst: membersToMdAst(jsdocMembers, codeFiles),
  });
}
