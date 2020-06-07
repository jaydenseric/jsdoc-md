'use strict';

/**
 * Decodes a JSDoc namepath.
 * @see [JSDoc namepaths](http://usejsdoc.org/about-namepaths)
 * @kind function
 * @name deconstructJsdocNamepath
 * @param {string} namepath A JSDoc namepath.
 * @returns {object} Namepath parts.
 * @ignore
 */
module.exports = function deconstructJsdocNamepath(namepath) {
  const [match, memberof, membership, name] =
    namepath.match(/^(?:([^.#~]+(?:[.#~][^.#~]+)*)([.#~]))?([^.#~]+)$/) || [];
  if (!match) throw new Error(`Invalid JSDoc namepath “${namepath}”.`);
  return { memberof, membership, name };
};
