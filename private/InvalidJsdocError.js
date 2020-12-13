'use strict';

const { codeFrameColumns } = require('@babel/code-frame');
const kleur = require('kleur');

/**
 * An invalid JSDoc error. The constructed error `message` property will contain
 * the `message` argument, annotated with:
 *
 * - The file path with the code location start line and column (clickable in a
 * VS Code terminal).
 * - A line-numbered code frame (syntax highlighted in a capable terminal)
 * displaying the relevant code location.
 * @kind class
 * @name InvalidJsdocError
 * @param {string} message Error message.
 * @param {string} codeFilePath Code file path.
 * @param {object} codeLocation Relevant location in the code.
 * @param {string} code The code.
 * @ignore
 */
module.exports = class InvalidJsdocError extends Error {
  constructor(message, codeFilePath, codeLocation, code) {
    super(
      `${kleur.red(
        `${message}\n\n${kleur.underline(
          `${codeFilePath}:${codeLocation.start.line}:${
            codeLocation.start.column + 1
          }`
        )}`
      )}\n\n${codeFrameColumns(
        code,
        {
          start: {
            line: codeLocation.start.line,
            column: codeLocation.start.column + 1,
          },
        },
        {
          // Allow color to be forced at runtime for tests, see:
          // https://github.com/babel/babel/issues/12442
          forceColor: process.env.FORCE_COLOR === '1',
          highlightCode: true,
        }
      )}`
    );

    this.name = this.constructor.name;
  }
};
