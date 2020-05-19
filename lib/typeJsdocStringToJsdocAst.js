'use strict';

const { parseParamType, parseType } = require('doctrine');

/**
 * Converts a JSDoc type string to a JSDoc AST.
 * @kind function
 * @name typeJsdocStringToJsdocAst
 * @param {string} type JSDoc type.
 * @param {boolean} [isParam] Is the type a parameter, which supports more features including optional (`*=`) and rest (`...*`) parameters.
 * @returns {object} JSDoc AST.
 * @ignore
 */
module.exports = function typeJsdocStringToJsdocAst(type, isParam) {
  try {
    return isParam ? parseParamType(type) : parseType(type);
  } catch (error) {
    throw new Error(`Invalid JSDoc type “${type}”.`);
  }
};
