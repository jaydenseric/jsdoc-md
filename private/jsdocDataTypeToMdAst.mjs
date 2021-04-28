import CodeLocation from './CodeLocation.mjs';
import InvalidJsdocError from './InvalidJsdocError.mjs';
import typeAstToMdAst from './typeAstToMdAst.mjs';
import typeToTypeAst from './typeToTypeAst.mjs';

/**
 * Converts JSDoc data containing a JSDoc type to a markdown AST, linking JSDoc
 * member references.
 * @kind function
 * @name jsdocDataTypeToMdAst
 * @param {JsdocData} jsdocData JSDoc data containing a JSDoc type.
 * @param {Array<JsdocMember>} members Outlined JSDoc members.
 * @param {CodeFilesMap} codeFiles Map of code file paths and their code.
 * @param {boolean} optional Is the type optional. Sometimes this is indicated outside the type string, e.g. when a parameter tag name is wrapped in `[` and `]`.
 * @param {boolean} parameter Is the type a parameter, which supports more features including optional (`*=`) and rest (`...*`) parameters.
 * @returns {object} Markdown AST.
 * @ignore
 */
export default function jsdocDataTypeToMdAst(
  jsdocData,
  members,
  codeFiles,
  optional,
  parameter
) {
  if (typeof jsdocData !== 'object')
    throw new TypeError('Argument 1 `jsdocData` must be an object.');

  if (typeof jsdocData.codeFileLocation !== 'object')
    throw new TypeError(
      'Argument 1 `jsdocData` property `codeFileLocation` must be an object.'
    );

  if (typeof jsdocData.codeFileLocation.filePath !== 'string')
    throw new TypeError(
      'Argument 1 `jsdocData` property `codeFileLocation` property `filePath` must be a string.'
    );

  if (!(jsdocData.codeFileLocation.codeLocation instanceof CodeLocation))
    throw new TypeError(
      'Argument 1 `jsdocData` property `codeFileLocation` property `codeLocation` must be a `CodeLocation` instance.'
    );

  if (typeof jsdocData.data !== 'string')
    throw new TypeError(
      'Argument 1 `jsdocData` property `data` must be a string.'
    );

  if (!Array.isArray(members))
    throw new TypeError('Argument 2 `members` must be an array.');

  if (!(codeFiles instanceof Map))
    throw new TypeError('Argument 3 `codeFiles` must be a `Map` instance.');

  try {
    return typeAstToMdAst(
      typeToTypeAst({
        type: jsdocData.data,
        parameter,
        optional,
      }),
      members
    );
  } catch (error) {
    throw new InvalidJsdocError(
      error.message,
      jsdocData.codeFileLocation,
      codeFiles.get(jsdocData.codeFileLocation.filePath)
    );
  }
}
