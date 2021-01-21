'use strict';

const { codeFrameColumns } = require('@babel/code-frame');
const kleur = require('kleur');
const CliError = require('./CliError');
const CodeLocation = require('./CodeLocation');

/**
 * An invalid JSDoc error. The constructed error `message` property will contain
 * the `message` argument, annotated with:
 *
 * - The file path with the code location start position line and column
 * numbers (clickable in a VS Code terminal), followed by end position line and
 * column numbers when they are present and different to the start position.
 * - A line-numbered code frame (syntax highlighted in a capable terminal)
 * displaying the relevant code location.
 * @kind class
 * @name InvalidJsdocError
 * @param {string} message Error message.
 * @param {CodeFileLocation} codeFileLocation Relevant location in the code.
 * @param {string} code The code.
 * @ignore
 */
module.exports = class InvalidJsdocError extends CliError {
  constructor(message, codeFileLocation, code) {
    if (typeof message !== 'string')
      throw new TypeError('First argument `message` must be a string.');

    if (typeof codeFileLocation !== 'object')
      throw new TypeError(
        'Second argument `codeFileLocation` must be an object.'
      );

    if (typeof codeFileLocation.filePath !== 'string')
      throw new TypeError(
        'Second argument `codeFileLocation` property `filePath` must be a string.'
      );

    if (!(codeFileLocation.codeLocation instanceof CodeLocation))
      throw new TypeError(
        'Second argument `codeFileLocation` property `codeLocation` must be a `CodeLocation` instance.'
      );

    if (typeof code !== 'string')
      throw new TypeError('Third argument `code` must be a string.');

    const displayEnd =
      // There is an end code position.
      codeFileLocation.codeLocation.end &&
      // The end code position is not the same as the start. It would look messy
      // to display a range for 1 character. Also, Babel’s `codeFrameColumns`
      // errors if it’s provided an end code position the same as the start.
      !(
        codeFileLocation.codeLocation.start.line ===
          codeFileLocation.codeLocation.end.line &&
        codeFileLocation.codeLocation.start.column ===
          codeFileLocation.codeLocation.end.column
      );

    const codeFrameLoc = {
      start: codeFileLocation.codeLocation.start,
    };

    if (displayEnd)
      codeFrameLoc.end = {
        line: codeFileLocation.codeLocation.end.line,
        // Babel’s `codeFrameColumns` considers the character after the
        // highlighted characters to be the end.
        column: codeFileLocation.codeLocation.end.column + 1,
      };

    super(
      `${message}\n\n${codeFileLocation.filePath}:${
        codeFileLocation.codeLocation.start.line
      }:${codeFileLocation.codeLocation.start.column}${
        displayEnd
          ? ` → ${codeFileLocation.codeLocation.end.line}:${codeFileLocation.codeLocation.end.column}`
          : ''
      }\n\n${
        // Prevent any earlier colorization from interfering with the syntax
        // highlighting.
        kleur.reset(
          codeFrameColumns(code, codeFrameLoc, {
            // Allow color to be forced at runtime for tests, see:
            // https://github.com/babel/babel/issues/12442
            forceColor: process.env.FORCE_COLOR === '1',
            highlightCode: true,
          })
        )
      }`
    );

    this.name = this.constructor.name;
  }
};
