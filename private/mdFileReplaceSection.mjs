import fs from 'fs';
import { resolve } from 'path';
import gfm from 'remark-gfm';
import parse from 'remark-parse';
import stringify from 'remark-stringify';
import unified from 'unified';
import REMARK_STRINGIFY_OPTIONS from './REMARK_STRINGIFY_OPTIONS.mjs';
import remarkPluginReplaceSection from './remarkPluginReplaceSection.mjs';

/**
 * Replaces the content of a section in a markdown file. If the optional peer
 * dependency [`prettier`](https://npm.im/prettier) is installed, the new
 * markdown file contents is [Prettier](https://prettier.io) formatted.
 * @kind function
 * @name mdFileReplaceSection
 * @param {object} options Options.
 * @param {string} options.markdownPath Markdown file path.
 * @param {string} options.targetHeading Heading text of the section to replace.
 * @param {object} options.replacementAst Replacement markdown AST (with a [`root`](https://github.com/syntax-tree/mdast#root) top level type), defaulting to empty.
 * @returns {Promise<void>} Resolves once the operation is done.
 * @ignore
 */
export default async function mdFileReplaceSection({
  markdownPath,
  targetHeading,
  replacementAst,
}) {
  if (typeof markdownPath !== 'string')
    throw new TypeError('Option `markdownPath` must be a string.');

  if (markdownPath === '')
    throw new TypeError('Option `markdownPath` must be a populated string.');

  if (typeof targetHeading !== 'string')
    throw new TypeError('Option `targetHeading` must be a string.');

  if (targetHeading === '')
    throw new TypeError('Option `targetHeading` must be a populated string.');

  if (typeof replacementAst !== 'object')
    throw new TypeError('Option `replacementAst` must be an object.');

  const fileContent = await fs.promises.readFile(markdownPath, 'utf8');

  let newFileContent = unified()
    .use(parse)
    .use(gfm)
    .use(stringify, REMARK_STRINGIFY_OPTIONS)
    .use(remarkPluginReplaceSection, { targetHeading, replacementAst })
    .processSync(fileContent)
    .toString();

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
      markdownPath,
      {
        resolveConfig: true,
        ignorePath:
          // Prettier CLI doesn’t resolve the ignore file like Git, npm, etc.
          // See: https://github.com/prettier/prettier/issues/4081
          resolve(process.cwd(), '.prettierignore'),
      }
    );

    if (!ignored) {
      // Get the Prettier config for the file.
      const prettierConfig = await prettier.resolveConfig(markdownPath, {
        editorconfig: true,
      });

      // Prettier format the new file contents.
      newFileContent = prettier.format(newFileContent, {
        ...prettierConfig,
        parser: inferredParser || 'markdown',
      });
    }
  }

  await fs.promises.writeFile(markdownPath, newFileContent);
}
