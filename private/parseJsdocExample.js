'use strict';

/**
 * A JSDoc member’s example.
 * @kind typedef
 * @name jsdocMemberExample
 * @type {object}
 * @prop {string} [caption] Example caption markdown.
 * @prop {string} [content] Example content markdown.
 * @ignore
 */

/**
 * Parses JSDoc `example` tag raw content.
 * @kind function
 * @name parseJsdocExample
 * @param {string} tagContent JSDoc `example` tag raw content.
 * @returns {jsdocMemberExample} The parsed content.
 * @ignore
 */
module.exports = function parseJsdocExample(tagContent) {
  const tagData = {};
  const [, caption, content] = tagContent.match(
    /^(?:\s*<caption>([^]+)<\/caption>\s?)?([^]+)?/
  );

  if (caption) tagData.caption = caption;
  if (content) tagData.content = content;

  return tagData;
};
