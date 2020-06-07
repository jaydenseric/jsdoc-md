'use strict';

/**
 * A parsed JSDoc `example` tag.
 * @kind typedef
 * @name ParsedJsdocExample
 * @type {object}
 * @prop {string} [caption] The caption.
 * @prop {string} [content] The raw content.
 * @ignore
 */

/**
 * Parses JSDoc `example` tag raw content.
 * @kind function
 * @name parseJsdocExample
 * @param {string} tagContent JSDoc `example` tag raw content.
 * @returns {ParsedJsdocExample} The parsed content.
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
