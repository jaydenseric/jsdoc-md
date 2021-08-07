import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';
import REMARK_STRINGIFY_OPTIONS from './REMARK_STRINGIFY_OPTIONS.mjs';
import remarkPluginReplaceSection from './remarkPluginReplaceSection.mjs';

/**
 * Replaces a markdown section.
 * @kind function
 * @name replaceMdSection
 * @param {string} markdown Markdown.
 * @param {string} targetHeading Heading text of the section to replace.
 * @param {object} replacementMdAst Replacement markdown AST (with a [`root`](https://github.com/syntax-tree/mdast#root) top level type), defaulting to empty.
 * @returns {string} Updated markdown.
 * @ignore
 */
export default function replaceMdSection(
  markdown,
  targetHeading,
  replacementMdAst
) {
  if (typeof markdown !== 'string')
    throw new TypeError('Argument 1 `markdown` must be a string.');

  if (markdown === '')
    throw new TypeError('Argument 1 `markdown` must be a populated string.');

  if (typeof targetHeading !== 'string')
    throw new TypeError('Argument 2 `targetHeading` must be a string.');

  if (targetHeading === '')
    throw new TypeError(
      'Argument 2 `targetHeading` must be a populated string.'
    );

  if (typeof replacementMdAst !== 'object')
    throw new TypeError('Argument 3 `replacementMdAst` must be an object.');

  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkStringify, REMARK_STRINGIFY_OPTIONS)
    .use(remarkPluginReplaceSection, {
      targetHeading,
      replacementAst: replacementMdAst,
    })
    .processSync(markdown)
    .toString();
}
