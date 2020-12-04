'use strict';

const { codeFrameColumns } = require('@babel/code-frame');

/**
 * Creates a string for use in an error message concerning a location in a code
 * file, containing a file path with the code location start line and column
 * (clickable in a VS Code terminal) followed by a line-numbered code frame
 * (syntax highlighted in a capable terminal) displaying the relevant code
 * region.
 * @kind function
 * @name createCodeFrame
 * @param {string} codeFilePath Code file path.
 * @param {object} codeLocation Relevant location in the code.
 * @param {string} code The code.
 * @returns {string} Code frame.
 * @ignore
 */
module.exports = function createCodeFrame(codeFilePath, codeLocation, code) {
  return `\n\n${codeFilePath}:${codeLocation.start.line}:${
    codeLocation.start.column + 1
  }\n\n${codeFrameColumns(
    code,
    {
      start: {
        line: codeLocation.start.line,
        column: codeLocation.start.column + 1,
      },
      end: codeLocation.end,
    },
    { highlightCode: true }
  )}`;
};
