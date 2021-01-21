'use strict';

const CodeLocation = require('./CodeLocation');
const CodePosition = require('./CodePosition');

const JSDOC_BLOCK_TAG_TOKEN_ORDER = [
  'start',
  'delimiter',
  'postDelimiter',
  'tag',
  'postTag',
  'type',
  'postType',
  'name',
  'postName',
  'description',
  'end',
];

const JSDOC_BLOCK_TAG_SPAN_TOKENS = ['tag', 'name', 'type', 'description'];

/**
 * Gets a JSDoc block tag span code location.
 * @kind function
 * @name getJsdocBlockTagSpanCodeLocation
 * @param {object} blockTag Parsed JSDoc block tag.
 * @param {string} spanTokenName Span token name.
 * @param {number} firstLineStartColumnNumber First line start column number, to account for indentation of the JSDoc comment.
 * @returns {CodeLocation} Code location.
 * @ignore
 */
module.exports = function getJsdocBlockTagSpanCodeLocation(
  blockTag,
  spanTokenName,
  firstLineStartColumnNumber
) {
  if (typeof blockTag !== 'object')
    throw new TypeError('First argument `blockTag` must be an object.');

  if (typeof spanTokenName !== 'string')
    throw new TypeError('Second argument `spanTokenName` must be a string.');

  if (!JSDOC_BLOCK_TAG_SPAN_TOKENS.includes(spanTokenName))
    throw new TypeError(
      'Second argument `spanTokenName` must be a JSDoc block tag span token name.'
    );

  if (typeof firstLineStartColumnNumber !== 'number')
    throw new TypeError(
      'Third argument `firstLineStartColumnNumber` must be a number.'
    );

  let start;
  let end;

  // Find the start, looping the source lines forwards.
  for (let i = 0; i < blockTag.source.length; i++)
    if (blockTag.source[i].tokens[spanTokenName]) {
      start = {
        line: blockTag.source[i].number,
        column:
          blockTag.source[i].number === 1 ? firstLineStartColumnNumber : 1,
      };

      for (const tokenName of JSDOC_BLOCK_TAG_TOKEN_ORDER) {
        if (tokenName === spanTokenName) break;
        start.column += blockTag.source[i].tokens[tokenName].length;
      }

      break;
    }

  // Find the end, looping the source lines backwards.
  for (let i = blockTag.source.length; i--; )
    if (blockTag.source[i].tokens[spanTokenName]) {
      end = {
        line: blockTag.source[i].number,
        column:
          blockTag.source[i].number === 1 ? firstLineStartColumnNumber - 1 : 0,
      };

      for (const tokenName of JSDOC_BLOCK_TAG_TOKEN_ORDER) {
        end.column += blockTag.source[i].tokens[tokenName].length;
        if (tokenName === spanTokenName) break;
      }

      break;
    }

  if (!start || !end)
    throw new Error(
      `Failed to locate a JSDoc block tag span for token name \`${spanTokenName}\`.`
    );

  return new CodeLocation(
    new CodePosition(start.line, start.column),
    new CodePosition(end.line, end.column)
  );
};
