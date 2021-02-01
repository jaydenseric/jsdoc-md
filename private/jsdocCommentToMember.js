'use strict';

const { default: getCommentParser } = require('comment-parser/lib/parser');
const COMMENT_PARSER_OPTIONS = require('./COMMENT_PARSER_OPTIONS');
const CodeLocation = require('./CodeLocation');
const CodePosition = require('./CodePosition');
const InvalidJsdocError = require('./InvalidJsdocError');
const deconstructJsdocNamepath = require('./deconstructJsdocNamepath');
const getJsdocBlockDescriptionSource = require('./getJsdocBlockDescriptionSource');
const getJsdocSourceTokenCodeLocation = require('./getJsdocSourceTokenCodeLocation');
const parseJsdocExample = require('./parseJsdocExample');

/**
 * Analyzes a JSDoc comment to produce JSDoc member details.
 * @kind function
 * @name jsdocCommentToMember
 * @param {object} jsdocComment JSDoc comment, from a Babel parse result.
 * @param {CodeFilesMap} codeFiles Map of code file paths and their code.
 * @param {string} codeFilePath File path for the code containing the JSDoc comment.
 * @returns {JsdocMember|void} JSDoc member, if it’s valid and not ignored.
 * @ignore
 */
module.exports = function jsdocCommentToMember(
  jsdocComment,
  codeFiles,
  codeFilePath
) {
  if (typeof jsdocComment !== 'object')
    throw new TypeError('First argument `jsdocComment` must be an object.');

  if (!(codeFiles instanceof Map))
    throw new TypeError(
      'Second argument `codeFiles` must be a `Map` instance.'
    );

  if (typeof codeFilePath !== 'string')
    throw new TypeError('Third argument `codeFilePath` must be a string.');

  if (codeFilePath === '')
    throw new TypeError(
      'Third argument `codeFilePath` must be a populated string.'
    );

  const jsdocBlockStartCodePosition = new CodePosition(
    jsdocComment.loc.start.line,
    // Babel starts columns at 0, not 1.
    jsdocComment.loc.start.column + 1
  );

  const [jsdocBlock] = getCommentParser({
    ...COMMENT_PARSER_OPTIONS,
    startLine: jsdocBlockStartCodePosition.line,
  })(
    // Restore the start `/*` and end `*/` that the Babel parse result excludes,
    // so that the JSDoc comment parser can accept it.
    `/*${jsdocComment.value}*/`
  );

  // Ignore JSDoc without tags.
  if (jsdocBlock && jsdocBlock.tags && jsdocBlock.tags.length) {
    let kind;
    let namepath;
    let memberof;
    let type;
    let description;

    const parameters = [];
    const properties = [];
    const returns = {};
    const fires = [];
    const see = [];
    const examples = [];

    // Scan tags for membership data, looping tags backwards as later tags
    // override earlier ones.
    for (let index = jsdocBlock.tags.length - 1; index >= 0; index--) {
      const tag = jsdocBlock.tags[index];

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
            namepath = {
              codeFileLocation: {
                filePath: codeFilePath,
                codeLocation: getJsdocSourceTokenCodeLocation(
                  tag.source,
                  'name',
                  jsdocBlockStartCodePosition
                ),
              },
              data: tag.name,
            };

          break;
        case 'typedef':
          // Ignore an invalid tag missing a name.
          if (tag.name) {
            if (!kind) kind = 'typedef';

            if (!namepath)
              namepath = {
                codeFileLocation: {
                  filePath: codeFilePath,
                  codeLocation: getJsdocSourceTokenCodeLocation(
                    tag.source,
                    'name',
                    jsdocBlockStartCodePosition
                  ),
                },
                data: tag.name,
              };

            if (!type && tag.type)
              type = {
                codeFileLocation: {
                  filePath: codeFilePath,
                  codeLocation: getJsdocSourceTokenCodeLocation(
                    tag.source,
                    'type',
                    jsdocBlockStartCodePosition
                  ),
                },
                data: tag.type,
              };
          }

          break;
        case 'callback':
          // A callback tag is a typedef with an implied function type.
          // Ignore an invalid tag missing a name.
          if (tag.name) {
            if (!kind) kind = 'typedef';

            if (!namepath)
              namepath = {
                codeFileLocation: {
                  filePath: codeFilePath,
                  codeLocation: getJsdocSourceTokenCodeLocation(
                    tag.source,
                    'name',
                    jsdocBlockStartCodePosition
                  ),
                },
                data: tag.name,
              };

            if (!type)
              type = {
                codeFileLocation: {
                  filePath: codeFilePath,
                  codeLocation: getJsdocSourceTokenCodeLocation(
                    tag.source,
                    'tag',
                    jsdocBlockStartCodePosition
                  ),
                },
                // A special case; the tag implies this type so this data is not
                // what is actually at the associated code file location.
                data: 'Function',
              };
          }

          break;
        case 'type':
          if (
            !type &&
            // Ignore an invalid tag missing a type.
            tag.type
          )
            type = {
              codeFileLocation: {
                filePath: codeFilePath,
                codeLocation: getJsdocSourceTokenCodeLocation(
                  tag.source,
                  'type',
                  jsdocBlockStartCodePosition
                ),
              },
              data: tag.type,
            };

          break;
        case 'desc':
        case 'description':
          if (
            !description &&
            // Ignore an invalid tag missing a description.
            tag.description
          )
            description = {
              codeFileLocation: {
                filePath: codeFilePath,
                codeLocation: getJsdocSourceTokenCodeLocation(
                  tag.source,
                  'description',
                  jsdocBlockStartCodePosition
                ),
              },
              data: tag.description,
            };

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

            if (tag.type)
              parameter.type = {
                codeFileLocation: {
                  filePath: codeFilePath,
                  codeLocation: getJsdocSourceTokenCodeLocation(
                    tag.source,
                    'type',
                    jsdocBlockStartCodePosition
                  ),
                },
                data: tag.type,
              };

            parameter.optional = tag.optional;

            if (tag.default) parameter.default = tag.default;

            if (tag.description)
              parameter.description = {
                codeFileLocation: {
                  filePath: codeFilePath,
                  codeLocation: getJsdocSourceTokenCodeLocation(
                    tag.source,
                    'description',
                    jsdocBlockStartCodePosition
                  ),
                },
                data: tag.description,
              };

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

            if (tag.type)
              property.type = {
                codeFileLocation: {
                  filePath: codeFilePath,
                  codeLocation: getJsdocSourceTokenCodeLocation(
                    tag.source,
                    'type',
                    jsdocBlockStartCodePosition
                  ),
                },
                data: tag.type,
              };

            property.optional = tag.optional;

            if (tag.default) property.default = tag.default;

            if (tag.description)
              property.description = {
                codeFileLocation: {
                  filePath: codeFilePath,
                  codeLocation: getJsdocSourceTokenCodeLocation(
                    tag.source,
                    'description',
                    jsdocBlockStartCodePosition
                  ),
                },
                data: tag.description,
              };

            properties.unshift(property);
          }

          break;
        }
        case 'return':
        case 'returns': {
          // Ignore an invalid tag missing both a type and description.
          if (!returns.type && tag.type)
            returns.type = {
              codeFileLocation: {
                filePath: codeFilePath,
                codeLocation: getJsdocSourceTokenCodeLocation(
                  tag.source,
                  'type',
                  jsdocBlockStartCodePosition
                ),
              },
              data: tag.type,
            };

          if (!returns.description && tag.description)
            returns.description = {
              codeFileLocation: {
                filePath: codeFilePath,
                codeLocation: getJsdocSourceTokenCodeLocation(
                  tag.source,
                  'description',
                  jsdocBlockStartCodePosition
                ),
              },
              data: tag.description,
            };

          break;
        }
        case 'emits':
        case 'fires': {
          if (
            // Ignore an invalid tag missing a name.
            tag.name &&
            // Ignore a duplicate name.
            !fires.some(({ data }) => data === tag.name)
          )
            fires.unshift({
              codeFileLocation: {
                filePath: codeFilePath,
                codeLocation: getJsdocSourceTokenCodeLocation(
                  tag.source,
                  'name',
                  jsdocBlockStartCodePosition
                ),
              },
              data: tag.name,
            });

          break;
        }
        case 'see':
          // Ignore an invalid tag missing a description.
          if (tag.description)
            see.unshift({
              codeFileLocation: {
                filePath: codeFilePath,
                codeLocation: getJsdocSourceTokenCodeLocation(
                  tag.source,
                  'description',
                  jsdocBlockStartCodePosition
                ),
              },
              data: tag.description,
            });

          break;
        case 'example': {
          // Ignore an invalid tag missing a description.
          if (tag.description) {
            const example = parseJsdocExample({
              codeFileLocation: {
                filePath: codeFilePath,
                codeLocation: getJsdocSourceTokenCodeLocation(
                  tag.source,
                  'description',
                  jsdocBlockStartCodePosition
                ),
              },
              data: tag.description,
            });

            // The example could be void if it only contains an empty caption.
            if (example) examples.unshift(example);
          }

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
        var {
          memberof: memberofNamepath,
          membership,
          name,
        } = deconstructJsdocNamepath(namepath.data);
      } catch (error) {
        throw new InvalidJsdocError(
          error.message,
          namepath.codeFileLocation,
          codeFiles.get(codeFilePath)
        );
      }

      if (memberofNamepath)
        memberof = {
          codeFileLocation: {
            filePath: codeFilePath,
            codeLocation: new CodeLocation(
              namepath.codeFileLocation.codeLocation.start,
              new CodePosition(
                namepath.codeFileLocation.codeLocation.end.line,
                namepath.codeFileLocation.codeLocation.end.column -
                  membership.length -
                  name.length
              )
            ),
          },
          data: memberofNamepath,
        };

      // Automatically add a missing `event:` prefix to an event name.
      if (kind === 'event' && !name.startsWith('event:'))
        name = `event:${name}`;

      // Define the JSDoc member with nicely ordered properties, and only add
      // properties that contain details.
      const member = {
        codeFileLocation: {
          filePath: codeFilePath,
          codeLocation: new CodeLocation(
            jsdocBlockStartCodePosition,
            new CodePosition(
              jsdocComment.loc.end.line,
              // Although Babel starts columns at 0, not 1, it considers the end
              // character the one after the actual end.
              jsdocComment.loc.end.column
            )
          ),
        },
      };

      member.namepath = namepath;
      if (memberof) member.memberof = memberof;
      if (membership) member.membership = membership;
      member.name = name;
      member.kind = kind;
      if (type) member.type = type;

      // The description is special as it can be specified without a tag.
      if (description) member.description = description;
      else if (jsdocBlock.description)
        member.description = {
          codeFileLocation: {
            filePath: codeFilePath,
            codeLocation: getJsdocSourceTokenCodeLocation(
              getJsdocBlockDescriptionSource(jsdocBlock),
              'description',
              jsdocBlockStartCodePosition
            ),
          },
          data: jsdocBlock.description,
        };

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
