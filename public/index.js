'use strict';

exports.jsdocMd = require('./jsdocMd');

/**
 * A map of code file paths and the their code.
 * @kind typedef
 * @name CodeFilesMap
 * @type {Map<string, string>}
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
 * @prop {string} codeFilePath File path for the code containing the JSDoc comment defining this member.
 * @prop {object} codeJsdocLocation Location in the code of the JSDoc comment defining this member.
 * @prop {JsdocKind} kind Kind.
 * @prop {string} namepath Namepath.
 * @prop {string} [memberof] Namepath for the parent member, derived from the `namepath`.
 * @prop {JsdocMembershipSymbol} [membership] Relationship with the parent member, derived from the `namepath`.
 * @prop {string} name Name, derived from the `namepath`.
 * @prop {string} [description] Description markdown.
 * @prop {Array<string>} [see] List of see also markdown.
 * @prop {Array<JsdocMemberExample>} [examples] List of examples.
 * @prop {Array<JsdocMemberParameter>} [parameters] List of parameters, if the member is a function.
 * @prop {Array<JsdocMemberProperty>} [properties] List of properties, if the member is an object.
 * @prop {JsdocMemberReturns} [returns] Return signature, if the member is a function.
 * @prop {Array<string>} [fires] List of namepaths for events the member can fire.
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
 * @prop {string} [caption] Example caption markdown.
 * @prop {string} [content] Example content markdown.
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
 * @prop {string} [type] Parameter type.
 * @prop {string} [name] Parameter namepath.
 * @prop {string} [optional=false] Is the parameter optional.
 * @prop {string} [description] Parameter description markdown.
 * @ignore
 */

/**
 * A JSDoc member’s property.
 * @kind typedef
 * @name JsdocMemberProperty
 * @type {object}
 * @prop {string} [type] Property type.
 * @prop {string} [name] Property namepath.
 * @prop {string} [optional=false] Is the property optional.
 * @prop {string} [description] Property description markdown.
 * @ignore
 */

/**
 * A JSDoc member’s return signature.
 * @kind typedef
 * @name JsdocMemberReturns
 * @type {object}
 * @prop {string} [type] Return type.
 * @prop {string} [description] Return description markdown.
 * @ignore
 */
