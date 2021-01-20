'use strict';

/**
 * A CLI error. Useful for anticipated CLI errors (such as invalid CLI
 * arguments) that don’t need to be displayed with a stack trace, vs unexpected
 * internal errors.
 * @kind class
 * @name CliError
 * @param {string} message Error message.
 * @ignore
 */
module.exports = class CliError extends Error {
  constructor(message) {
    if (typeof message !== 'string')
      throw new TypeError('First argument “message” must be a string.');

    super(message);

    this.name = this.constructor.name;
  }
};
