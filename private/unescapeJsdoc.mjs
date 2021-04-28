/**
 * Unescapes JSDoc content by removing backslashes placed between an asterisk
 * and forward slash. Such escapes allow a JSDoc comment block to contain
 * strings that would otherwise prematurely end the multiline comment.
 *
 * Example use cases:
 *
 * - Globs in parameter default values.
 * - Code examples containing JSDoc comments.
 *
 * JSDoc content should be unescaped after the JSDoc comment block has
 * been parsed, but before being displayed to a user.
 * @param {string} content JSDoc content that may contain escapes.
 * @returns {string} Unescaped JSDoc content.
 * @ignore
 */
export default function unescapeJsdoc(content) {
  if (typeof content !== 'string')
    throw new TypeError('Argument 1 `content` must be a string.');

  return content.replace(/(?<=\*)\\(?=\\*\/)/gu, '');
}
