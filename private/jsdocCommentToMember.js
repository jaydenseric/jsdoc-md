'use strict';

const { codeFrameColumns } = require('@babel/code-frame');
const commentParser = require('comment-parser');
const deconstructJsdocNamepath = require('./deconstructJsdocNamepath');
const parseJsdocExample = require('./parseJsdocExample');

const JSDOC_PARSER_OPTIONS = {
  // Configure what parts (tag, type, name, description) are expected for
  // jsdoc-md supported JSDoc tags. See:
  // https://github.com/syavorsky/comment-parser/issues/82
  parsers: [
    commentParser.PARSERS.parse_tag,
    (unparsed, data) =>
      // JSDoc tags without a type.
      ['desc', 'description', 'fires', 'ignore', 'kind', 'see'].includes(
        data.tag
      )
        ? null
        : commentParser.PARSERS.parse_type(unparsed, data),
    (unparsed, data) =>
      // JSDoc tags without a name.
      [
        'desc',
        'description',
        'example',
        'ignore',
        'return',
        'returns',
        'see',
        'type',
      ].includes(data.tag)
        ? null
        : commentParser.PARSERS.parse_name(unparsed, data),
    (unparsed, data) =>
      // JSDoc tags without a description.
      ['fires', 'ignore', 'kind', 'name', 'type', 'typedef'].includes(data.tag)
        ? null
        : commentParser.PARSERS.parse_description(unparsed, data),
  ],
};

/**
 * A JSDoc member’s kind.
 * @kind typedef
 * @name jsdocKind
 * @type {'class'|'constant'|'event'|'external'|'file'|'function'|'member'|'mixin'|'module'|'namespace'|'typedef'}
 * @ignore
 */

/**
 * A JSDoc member’s relationship with it’s parent member.
 *
 * - `.`: Static.
 * - `#`: Instance.
 * - `~`: Inner.
 * @kind typedef
 * @name JsdocMembership
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

/**
 * A JSDoc member’s details, derived from an analysis of a source JSDoc comment.
 * @kind typedef
 * @name JsdocMember
 * @type {object}
 * @prop {string} kind Kind.
 * @prop {string} namepath Namepath.
 * @prop {string} [memberof] Namepath for the parent member, derived from the `namepath`.
 * @prop {JsdocMembership} [membership] Relationship with the parent member, derived from the `namepath`.
 * @prop {string} name Name, derived from the `namepath`.
 * @prop {string} [description] Description markdown.
 * @prop {Array<string>} [see] List of see also markdown.
 * @prop {Array<jsdocMemberExample>} [examples] List of examples.
 * @prop {Array<JsdocMemberParameter>} [parameters] List of parameters, if the member is a function.
 * @prop {Array<JsdocMemberProperty>} [properties] List of properties, if the member is an object.
 * @prop {JsdocMemberReturns} [returns] Return signature, if the member is a function.
 * @prop {Array<string>} [fires] List of namepaths for events the member can fire.
 * @ignore
 */

/**
 * Analyzes a JSDoc comment to produce JSDoc member details.
 * @kind function
 * @name jsdocCommentToMember
 * @param {object} jsdocComment JSDoc comment, from a Babel parse result.
 * @param {string} code Code containing the JSDoc comment.
 * @param {string} [filePath] File path for the code containing the JSDoc comment.
 * @returns {JsdocMember|void} JSDoc member, if it’s valid and not ignored.
 * @ignore
 */
module.exports = function jsdocCommentToMember(jsdocComment, code, filePath) {
  const [jsdocAst] = commentParser(
    // Restore the start `/*` and end `*/` that the Babel parse result excludes,
    // so that the JSDoc comment parser can accept it.
    `/*${jsdocComment.value}*/`,
    JSDOC_PARSER_OPTIONS
  );

  // Ignore JSDoc without tags.
  if (jsdocAst && jsdocAst.tags && jsdocAst.tags.length) {
    let kind;
    let namepath;
    let type;
    let description;

    const parameters = [];
    const properties = [];
    const returns = {};
    const fires = [];
    const see = [];
    const examples = [];

    // Scan tags for membership info, looping tags backwards as later tags
    // override earlier ones.
    for (let index = jsdocAst.tags.length - 1; index >= 0; index--) {
      const tag = jsdocAst.tags[index];

      switch (tag.tag) {
        case 'kind':
          if (
            !kind &&
            // Ignore an invalid tag missing a name.
            tag.name
          )
            kind = tag.name;
          break;
        case 'name':
          if (
            !namepath &&
            // Ignore an invalid tag missing a name.
            tag.name
          )
            namepath = tag.name;
          break;
        case 'typedef':
          // Ignore an invalid tag missing a name.
          if (tag.name) {
            if (!kind) kind = 'typedef';
            if (!namepath) namepath = tag.name;
            if (!type && tag.type) ({ type } = tag);
          }
          break;
        case 'callback':
          // A callback tag is a typedef with an implied function type.
          // Ignore an invalid tag missing a name.
          if (tag.name) {
            if (!kind) kind = 'typedef';
            if (!namepath) namepath = tag.name;
            if (!type) type = 'Function';
          }
          break;
        case 'type':
          if (
            !type &&
            // Ignore an invalid tag missing a type.
            tag.type
          )
            ({ type } = tag);
          break;
        case 'desc':
        case 'description':
          if (
            !description &&
            // Ignore an invalid tag missing a description.
            tag.description
          )
            ({ description } = tag);
          break;
        case 'arg':
        case 'argument':
        case 'param': {
          // Ignore an invalid tag missing a name.
          if (tag.name) {
            // Define the JSDoc parameter with nicely ordered properties.
            const parameter = {
              name: tag.name,
            };
            if (tag.type) parameter.type = tag.type;
            parameter.optional = tag.optional;
            if (tag.default) parameter.default = tag.default;
            if (tag.description) parameter.description = tag.description;

            parameters.unshift(parameter);
          }
          break;
        }
        case 'prop':
        case 'property': {
          // Ignore an invalid tag missing a name.
          if (tag.name) {
            // Define the JSDoc property with nicely ordered properties.
            const property = {
              name: tag.name,
            };

            if (tag.type) property.type = tag.type;
            property.optional = tag.optional;
            if (tag.default) property.default = tag.default;
            if (tag.description) property.description = tag.description;

            properties.unshift(property);
          }
          break;
        }
        case 'return':
        case 'returns': {
          // Ignore an invalid tag missing both a type and description.
          if (!returns.type && tag.type) returns.type = tag.type;
          if (!returns.description && tag.description)
            returns.description = tag.description;
          break;
        }
        case 'emits':
        case 'fires': {
          if (
            // Ignore an invalid tag missing a name.
            tag.name &&
            // Ignore a duplicate name.
            !fires.includes(tag.name)
          )
            fires.unshift(tag.name);
          break;
        }
        case 'see':
          // Ignore an invalid tag missing a description.
          if (tag.description) see.unshift(tag.description);
          break;
        case 'example': {
          const example = parseJsdocExample(tag.description);
          // Ignore an example missing both a caption and content.
          if (example.caption || example.content) examples.unshift(example);
          break;
        }
        case 'ignore':
          // Ignore JSDoc with an ignore tag. It’s best for this tag to be used
          // last in a JSDoc comment, so processing can be bailed earlier.
          return;
      }
    }

    // Ignore JSDoc without a kind or namepath.
    if (kind && namepath) {
      try {
        var { memberof, membership, name } = deconstructJsdocNamepath(namepath);
      } catch (error) {
        throw new SyntaxError(
          `Unable to deconstruct JSDoc namepath “${namepath}”:\n\n${
            error.message
          }\n\n${filePath}:${jsdocComment.loc.start.line}:${
            jsdocComment.loc.start.column
          }\n\n${codeFrameColumns(code, jsdocComment.loc, {
            highlightCode: true,
          })}`
        );
      }

      // Automatically add a missing `event:` prefix to an event name.
      if (kind === 'event' && !name.startsWith('event:'))
        name = `event:${name}`;

      // Define the JSDoc member with nicely ordered properties, and only add
      // properties that contain details.
      const member = {};

      member.namepath = namepath;
      if (memberof) member.memberof = memberof;
      if (membership) member.membership = membership;
      member.name = name;
      member.kind = kind;
      if (type) member.type = type;

      // The description is special as it can be specified without a tag.
      if (description) member.description = description;
      else if (jsdocAst.description) member.description = jsdocAst.description;

      if (parameters.length) member.parameters = parameters;
      if (properties.length) member.properties = properties;
      if (Object.keys(returns).length) member.returns = returns;
      if (fires.length) member.fires = fires;
      if (see.length) member.see = see;
      if (examples.length) member.examples = examples;

      return member;
    }
  }
};
