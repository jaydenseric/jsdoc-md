import CodeLocation from './CodeLocation.mjs';
import CodePosition from './CodePosition.mjs';

const JSDOC_SOURCE_TOKEN_ORDER = [
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
  'lineEnd',
];

const JSDOC_SOURCE_INFO_TOKENS = ['tag', 'name', 'type', 'description'];

/**
 * Gets a JSDoc comment code location a span of data, given parsed JSDoc
 * source from `comment-parser` and a source token name. Empty lines at the
 * start and end are excluded; particularly for descriptions.
 * @kind function
 * @name getJsdocSourceTokenCodeLocation
 * @param {Array<object>} jsdocSource Parsed JSDoc source.
 * @param {string} dataTokenName Name of a JSDoc source token that represents data (vs structural syntax such as delimiters and whitespace).
 * @param {CodePosition} startCodePosition JSDoc comment start code position.
 * @returns {CodeLocation} Code location.
 * @ignore
 */
export default function getJsdocSourceTokenCodeLocation(
  jsdocSource,
  dataTokenName,
  startCodePosition
) {
  if (!Array.isArray(jsdocSource))
    throw new TypeError('Argument 1 `jsdocSource` must be an array.');

  if (typeof dataTokenName !== 'string')
    throw new TypeError('Argument 2 `dataTokenName` must be a string.');

  if (!JSDOC_SOURCE_INFO_TOKENS.includes(dataTokenName))
    throw new TypeError(
      'Argument 2 `dataTokenName` must be a JSDoc source data token name.'
    );

  if (!(startCodePosition instanceof CodePosition))
    throw new TypeError(
      'Argument 3 `startCodePosition` must be a `CodePosition` instance.'
    );

  let start;
  let end;

  // Find the start, looping the source lines forwards.
  for (let i = 0; i < jsdocSource.length; i++)
    if (jsdocSource[i].tokens[dataTokenName]) {
      start = {
        line: jsdocSource[i].number,
        column:
          jsdocSource[i].number === startCodePosition.line
            ? startCodePosition.column
            : 1,
      };

      for (const tokenName of JSDOC_SOURCE_TOKEN_ORDER) {
        if (tokenName === dataTokenName) break;
        start.column += jsdocSource[i].tokens[tokenName].length;
      }

      break;
    }

  // Find the end, looping the source lines backwards.
  for (let i = jsdocSource.length; i--; )
    if (jsdocSource[i].tokens[dataTokenName]) {
      end = {
        line: jsdocSource[i].number,
        column:
          jsdocSource[i].number === startCodePosition.line
            ? startCodePosition.column - 1
            : 0,
      };

      for (const tokenName of JSDOC_SOURCE_TOKEN_ORDER) {
        end.column += jsdocSource[i].tokens[tokenName].length;
        if (tokenName === dataTokenName) break;
      }

      break;
    }

  if (!start || !end)
    throw new Error(
      `Unable to get a code location for JSDoc source token \`${dataTokenName}\`.`
    );

  return new CodeLocation(
    new CodePosition(start.line, start.column),
    new CodePosition(end.line, end.column)
  );
}
