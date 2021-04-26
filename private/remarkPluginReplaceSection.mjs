import mdastInject from 'mdast-util-inject';

/**
 * A remark plugin that replaces the content of a section with a particular
 * heading.
 * @kind function
 * @name remarkPluginReplaceSection
 * @param {object} [options] Options.
 * @param {string} [options.targetHeading='API'] Heading text of the section to replace.
 * @param {object} [options.replacementAst] Replacement markdown AST (with a [`root`](https://github.com/syntax-tree/mdast#root) top level type), defaulting to empty.
 * @returns {Function} Remark transform function.
 * @ignore
 */
export default function remarkPluginReplaceSection({
  targetHeading = 'API',
  replacementAst = {
    type: 'root',
    children: [],
  },
} = {}) {
  if (typeof targetHeading !== 'string')
    throw new TypeError('Option `targetHeading` must be a string.');

  if (typeof replacementAst !== 'object')
    throw new TypeError('Option `replacementAst` must be an object.');

  return (targetAst, file, next) => {
    mdastInject(targetHeading, targetAst, replacementAst)
      ? next()
      : next(new Error(`Missing target heading \`${targetHeading}\`.`));
  };
}
