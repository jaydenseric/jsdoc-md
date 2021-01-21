'use strict';

/**
 * Parses JSDoc `example` tag raw content.
 * @kind function
 * @name parseJsdocExample
 * @param {string} tagContent JSDoc `example` tag raw content.
 * @returns {JsdocMemberExample} The parsed content.
 * @ignore
 */
module.exports = function parseJsdocExample(tagContent) {
  if (typeof tagContent !== 'string')
    throw new TypeError('First argument `tagContent` must be a string.');

  const tagData = {};
  const [, caption, content] = tagContent.match(
    /^(?:\s*<caption>([^]+)<\/caption>\s?)?([^]+)?/
  );

  if (caption) tagData.caption = caption;
  if (content) tagData.content = content;

  return tagData;
};
