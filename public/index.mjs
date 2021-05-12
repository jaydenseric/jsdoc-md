export { default as jsdocMd } from './jsdocMd.mjs';

/**
 * A location in a code file.
 * @kind typedef
 * @name CodeFileLocation
 * @type {object}
 * @prop {string} filePath File path for the code.
 * @prop {CodeLocation} codeLocation Location in the code.
 * @ignore
 */

/**
 * A map of code file paths and the their code.
 * @kind typedef
 * @name CodeFilesMap
 * @type {Map<string, string>}
 * @ignore
 */

/**
 * A span of data in a JSDoc comment.
 * @kind typedef
 * @name JsdocData
 * @type {object}
 * @prop {CodeFileLocation} codeFileLocation Code location within the JSDoc comment.
 * @prop {string} namepath Data.
 * @ignore
 */

/**
 * A JSDoc member’s kind.
 * @kind typedef
 * @name JsdocKind
 * @type {'class'|'constant'|'event'|'external'|'file'|'function'|'member'|'mixin'|'module'|'namespace'|'typedef'}
 * @ignore
 */

/**
 * A JSDoc member’s details, derived from an analysis of a source JSDoc comment.
 * @kind typedef
 * @name JsdocMember
 * @type {object}
 * @prop {CodeFileLocation} codeFileLocation Where the JSDoc comment defines this member.
 * @prop {JsdocKind} kind Kind.
 * @prop {JsdocData} namepath Namepath.
 * @prop {JsdocData} [memberof] Namepath for the parent member, derived from the `namepath`.
 * @prop {JsdocMembershipSymbol} [membership] Relationship with the parent member, derived from the `namepath`.
 * @prop {string} name Name, derived from the `namepath`.
 * @prop {JsdocData} [type] Type.
 * @prop {JsdocData} [description] Description markdown.
 * @prop {Array<JsdocData>} [see] List of see also markdown.
 * @prop {Array<JsdocMemberExample>} [examples] List of examples.
 * @prop {Array<JsdocMemberParameter>} [parameters] List of parameters, if the member is a function.
 * @prop {Array<JsdocMemberProperty>} [properties] List of properties, if the member is an object.
 * @prop {JsdocMemberReturns} [returns] Return signature, if the member is a function.
 * @prop {Array<JsdocData>} [fires] List of namepaths for events the member can fire.
 * @prop {string} [heading] A description of the member suitable for use as a heading in API documentation. Available after the JSDoc member is outlined.
 * @prop {string} [slug] A GitHub markdown heading ID for the member’s `heading`. Available after the JSDoc member is outlined.
 * @prop {JsdocMember} [parent] Parent member, if this member has one. Available after the JSDoc member is outlined.
 * @ignore
 */

/**
 * A JSDoc member’s example.
 * @kind typedef
 * @name JsdocMemberExample
 * @type {object}
 * @prop {JsdocData} [caption] Example caption markdown.
 * @prop {JsdocData} [content] Example content markdown.
 * @ignore
 */

/**
 * A symbol representing a JSDoc member’s relationship with it’s parent member.
 *
 * - `.`: Static.
 * - `#`: Instance.
 * - `~`: Inner.
 * @kind typedef
 * @name JsdocMembershipSymbol
 * @type {'.'|'#'|'~'}
 * @ignore
 */

/**
 * A JSDoc member’s parameter.
 * @kind typedef
 * @name JsdocMemberParameter
 * @type {object}
 * @prop {JsdocData} [type] Parameter type.
 * @prop {string} [name] Parameter namepath.
 * @prop {boolean} [optional=false] Is the parameter optional.
 * @prop {JsdocData} [default] Default value, if the parameter is optional.
 * @prop {JsdocData} [description] Parameter description markdown.
 * @ignore
 */

/**
 * A JSDoc member’s property.
 * @kind typedef
 * @name JsdocMemberProperty
 * @type {object}
 * @prop {JsdocData} [type] Property type.
 * @prop {string} [name] Property namepath.
 * @prop {boolean} [optional=false] Is the property optional.
 * @prop {JsdocData} [default] Default value, if the property is optional.
 * @prop {JsdocData} [description] Property description markdown.
 * @ignore
 */

/**
 * A JSDoc member’s return signature.
 * @kind typedef
 * @name JsdocMemberReturns
 * @type {object}
 * @prop {JsdocData} [type] Return type.
 * @prop {JsdocData} [description] Return description markdown.
 * @ignore
 */
