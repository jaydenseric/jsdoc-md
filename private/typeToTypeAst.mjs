import { parseParamType, parseType } from 'doctrine';
import unescapeJsdoc from './unescapeJsdoc.mjs';

/**
 * Converts a JSDoc type string to a Doctrine AST node.
 * @kind function
 * @name typeToTypeAst
 * @param {object} options Options.
 * @param {string} options.type JSDoc type string.
 * @param {boolean} [options.parameter] Is the type a parameter, which supports more features including optional (`*=`) and rest (`...*`) parameters.
 * @param {boolean} [options.optional] Is the type optional. Sometimes this is indicated outside the type string, e.g. when a parameter tag name is wrapped in `[` and `]`.
 * @returns {object} JSDoc type Doctrine AST node.
 * @ignore
 */
export default function typeToTypeAst({ type, parameter, optional }) {
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
      throw new TypeError(`Invalid JSDoc type \`${unescapedType}\`.`);
    }

  return optional &&
    // Account for the edge case where optionality is indicated both in the type
    // string and the name, e.g. `{string=} [name]`.
    typeAst.type !== 'OptionalType'
    ? { type: 'OptionalType', expression: typeAst }
    : typeAst;
}
