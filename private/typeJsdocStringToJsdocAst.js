'use strict';

const { parseParamType, parseType } = require('doctrine');
const unescapeJsdoc = require('./unescapeJsdoc');

/**
 * Converts a JSDoc type string to a JSDoc type Doctrine AST node.
 * @kind function
 * @name typeJsdocStringToJsdocAst
 * @param {object} options Options.
 * @param {string} options.type JSDoc type string.
 * @param {boolean} [options.parameter] Is the type a parameter, which supports more features including optional (`*=`) and rest (`...*`) parameters.
 * @param {boolean} [options.optional] Is the type optional. Sometimes this is indicated outside the type string, e.g. when a parameter tag name is wrapped in `[` and `]`.
 * @returns {object} JSDoc type Doctrine AST node.
 * @ignore
 */
module.exports = function typeJsdocStringToJsdocAst({
  type,
  parameter,
  optional,
}) {
  const unescapedType = unescapeJsdoc(type);

  let typeAst;

  // Workaround Doctrine erroring if there is an `event:` prefix in a namepath:
  // https://github.com/eslint/doctrine/issues/221
  if (unescapedType.includes('event:'))
    typeAst = {
      type: 'NameExpression',
      name: unescapedType,
    };
  else
    try {
      typeAst = parameter
        ? parseParamType(unescapedType)
        : parseType(unescapedType);
    } catch (error) {
      throw new Error(`Invalid JSDoc type \`${unescapedType}\`.`);
    }

  return optional &&
    // Account for the edge case where optionality is indicated both in the type
    // string and the name, e.g. `{string=} [name]`.
    typeAst.type !== 'OptionalType'
    ? { type: 'OptionalType', expression: typeAst }
    : typeAst;
};
