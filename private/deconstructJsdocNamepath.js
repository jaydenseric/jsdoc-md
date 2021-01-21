'use strict';

/**
 * Decodes a JSDoc namepath.
 * @see [JSDoc namepath docs](https://jsdoc.app/about-namepaths).
 * @kind function
 * @name deconstructJsdocNamepath
 * @param {JsdocNamepathReference} namepath A JSDoc namepath.
 * @returns {object} Namepath parts.
 * @ignore
 */
module.exports = function deconstructJsdocNamepath(namepath) {
  if (typeof namepath !== 'string')
    throw new TypeError('First argument `namepath` must be a string.');

  const [match, memberof, membership, name] =
    namepath.match(/^(?:([^.#~]+(?:[.#~][^.#~]+)*)([.#~]))?([^.#~]+)$/) || [];
  if (!match) throw new SyntaxError(`Invalid JSDoc namepath \`${namepath}\`.`);
  return { memberof, membership, name };
};
