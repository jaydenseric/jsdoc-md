'use strict';

const gfm = require('remark-gfm');
const parse = require('remark-parse');
const unified = require('unified');
const removePositionData = require('unist-util-remove-position');
const CodeLocation = require('./CodeLocation');
const CodePosition = require('./CodePosition');
const InvalidJsdocError = require('./InvalidJsdocError');
const unescapeJsdoc = require('./unescapeJsdoc');

/**
 * Converts JSDoc data containing markdown to a markdown AST, replacing inline
 * JSDoc `link` tags with markdown links.
 * @kind function
 * @name jsdocDataMdToMdAst
 * @param {JsdocData} jsdocData JSDoc data containing markdown.
 * @param {Array<JsdocMember>} members Outlined JSDoc members.
 * @param {CodeFilesMap} codeFiles Map of code file paths and their code.
 * @returns {object} Markdown AST.
 * @ignore
 */
module.exports = function jsdocDataMdToMdAst(jsdocData, members, codeFiles) {
  if (typeof jsdocData !== 'object')
    throw new TypeError('First argument `jsdocData` must be an object.');

  if (typeof jsdocData.codeFileLocation !== 'object')
    throw new TypeError(
      'First argument `jsdocData` property `codeFileLocation` must be an object.'
    );

  if (typeof jsdocData.codeFileLocation.filePath !== 'string')
    throw new TypeError(
      'First argument `jsdocData` property `codeFileLocation` property `filePath` must be a string.'
    );

  if (!(jsdocData.codeFileLocation.codeLocation instanceof CodeLocation))
    throw new TypeError(
      'First argument `jsdocData` property `codeFileLocation` property `codeLocation` must be a `CodeLocation` instance.'
    );

  if (typeof jsdocData.data !== 'string')
    throw new TypeError(
      'First argument `jsdocData` property `data` must be a string.'
    );

  if (!Array.isArray(members))
    throw new TypeError('Second argument `members` must be an array.');

  if (!(codeFiles instanceof Map))
    throw new TypeError('Third argument `codeFiles` must be a `Map` instance.');

  let replacedMarkdown = jsdocData.data;

  const regex = /(?<beforeNamepath>\{\s*@link\s+)(?<namepathData>\S+?)\s*\}/gu;

  let match;

  while ((match = regex.exec(jsdocData.data))) {
    const {
      0: jsdocInlineLinkData,
      index: jsdocInlineLinkOffsetStart,
      groups: { beforeNamepath, namepathData },
    } = match;

    const linkedMember = members.find(
      ({ namepath: { data } }) => data === namepathData
    );

    if (linkedMember)
      replacedMarkdown = replacedMarkdown.replace(
        jsdocInlineLinkData,
        `(#${linkedMember.slug})`
      );
    else {
      let charIndex = 0;
      let { line, column } = jsdocData.codeFileLocation.codeLocation.start;

      const nextChar = () => {
        if (jsdocData.data[charIndex] === '\n') {
          line++;
          column = 1;
        } else column++;

        charIndex++;
      };

      const namepathOffsetStart =
        jsdocInlineLinkOffsetStart + beforeNamepath.length;
      const namepathOffsetEnd = namepathOffsetStart + namepathData.length - 1;

      while (charIndex < namepathOffsetStart) nextChar();

      const namepathStart = new CodePosition(line, column);

      while (charIndex < namepathOffsetEnd) nextChar();

      throw new InvalidJsdocError(
        `Missing JSDoc member for JSDoc inline link namepath \`${namepathData}\`.`,
        {
          filePath: jsdocData.codeFileLocation.filePath,
          codeLocation: new CodeLocation(
            namepathStart,
            new CodePosition(line, column)
          ),
        },
        codeFiles.get(jsdocData.codeFileLocation.filePath)
      );
    }
  }

  // The AST nodes from a parsed markdown string contain `position` data
  // (https://github.com/syntax-tree/unist#position). This data should be
  // removed because it will no longer be correct once these AST nodes are
  // inserted into another AST. While leaving the incorrect data in place is
  // technically more efficient and harmless to the public API, it bloats
  // private test snapshots.
  return removePositionData(
    unified().use(parse).use(gfm).parse(unescapeJsdoc(replacedMarkdown)),

    // Delete the `position` properties from nodes instead of only replacing
    // their values with `undefined`.
    true
  ).children;
};
