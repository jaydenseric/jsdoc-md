'use strict';

const CodeLocation = require('./CodeLocation');
const CodePosition = require('./CodePosition');

/**
 * Parses JSDoc `example` tag raw data.
 * @kind function
 * @name parseJsdocExample
 * @param {JsdocData} jsdocData JSDoc `example` tag raw data.
 * @returns {JsdocMemberExample|null} Example data, or `null` if the example is empty.
 * @ignore
 */
module.exports = function parseJsdocExample(jsdocData) {
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

  const example = {};

  const {
    groups: { beforeCaption, captionData, beforeContent, contentData },
  } = jsdocData.data.match(
    /^(?<beforeContent>(?:(?<beforeCaption>\s*<caption>)(?<captionData>[^]*?)<\/caption>\s?)?)(?<contentData>[^]+)?/u
  );

  let charIndex = 0;
  let { line, column } = jsdocData.codeFileLocation.codeLocation.start;

  const nextChar = () => {
    if (jsdocData.data[charIndex] === '\n') {
      line++;
      column = 1;
    } else column++;

    charIndex++;
  };

  if (captionData) {
    const captionOffsetStart = beforeCaption.length;
    const captionOffsetEnd = captionOffsetStart + captionData.length - 1;

    while (charIndex < captionOffsetStart) nextChar();

    const captionStart = new CodePosition(line, column);

    while (charIndex < captionOffsetEnd) nextChar();

    example.caption = {
      codeFileLocation: {
        filePath: jsdocData.codeFileLocation.filePath,
        codeLocation: new CodeLocation(
          captionStart,
          new CodePosition(line, column)
        ),
      },
      data: captionData,
    };
  }

  if (contentData) {
    const contentOffsetStart = beforeContent.length;
    const contentOffsetEnd = contentOffsetStart + contentData.length - 1;

    while (charIndex < contentOffsetStart) nextChar();

    const contentStart = new CodePosition(line, column);

    while (charIndex < contentOffsetEnd) nextChar();

    example.content = {
      codeFileLocation: {
        filePath: jsdocData.codeFileLocation.filePath,
        codeLocation: new CodeLocation(
          contentStart,
          new CodePosition(line, column)
        ),
      },
      data: contentData,
    };
  }

  return example.caption || example.content ? example : null;
};
