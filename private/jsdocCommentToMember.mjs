import { parse } from 'comment-parser';
import trimNewlines from 'trim-newlines';
import COMMENT_PARSER_OPTIONS from './COMMENT_PARSER_OPTIONS.mjs';
import CodeLocation from './CodeLocation.mjs';
import CodePosition from './CodePosition.mjs';
import InvalidJsdocError from './InvalidJsdocError.mjs';
import deconstructJsdocNamepath from './deconstructJsdocNamepath.mjs';
import getJsdocBlockDescriptionSource from './getJsdocBlockDescriptionSource.mjs';
import getJsdocSourceTokenCodeLocation from './getJsdocSourceTokenCodeLocation.mjs';

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
export default function jsdocCommentToMember(
  jsdocComment,
  codeFiles,
  codeFilePath
) {
  if (typeof jsdocComment !== 'object')
    throw new TypeError('Argument 1 `jsdocComment` must be an object.');

  if (!(codeFiles instanceof Map))
    throw new TypeError('Argument 2 `codeFiles` must be a `Map` instance.');

  if (typeof codeFilePath !== 'string')
    throw new TypeError('Argument 3 `codeFilePath` must be a string.');

  if (codeFilePath === '')
    throw new TypeError(
      'Argument 3 `codeFilePath` must be a populated string.'
    );

  const jsdocBlockStartCodePosition = new CodePosition(
    jsdocComment.loc.start.line,
    // Babel starts columns at 0, not 1.
    jsdocComment.loc.start.column + 1
  );

  const [jsdocBlock] = parse(
    // Restore the start `/*` and end `*/` that the Babel parse result excludes,
    // so that the JSDoc comment parser can accept it.
    `/*${jsdocComment.value}*/`,
    {
      ...COMMENT_PARSER_OPTIONS,
      startLine: jsdocBlockStartCodePosition.line,
    }
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
        case 'description': {
          if (!description) {
            const tagDescriptionTrimmed = trimNewlines(tag.description);

            // Ignore an invalid tag missing a description.
            if (tagDescriptionTrimmed)
              description = {
                codeFileLocation: {
                  filePath: codeFilePath,
                  codeLocation: getJsdocSourceTokenCodeLocation(
                    tag.source,
                    'description',
                    jsdocBlockStartCodePosition
                  ),
                },
                data: tagDescriptionTrimmed,
              };
          }

          break;
        }
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

            if (tag.default)
              parameter.default = {
                codeFileLocation: {
                  filePath: codeFilePath,
                  codeLocation: getJsdocSourceTokenCodeLocation(
                    tag.source,
                    'name',
                    jsdocBlockStartCodePosition
                  ),
                },
                data: tag.default,
              };

            const tagDescriptionTrimmed = trimNewlines(tag.description);

            if (tagDescriptionTrimmed)
              parameter.description = {
                codeFileLocation: {
                  filePath: codeFilePath,
                  codeLocation: getJsdocSourceTokenCodeLocation(
                    tag.source,
                    'description',
                    jsdocBlockStartCodePosition
                  ),
                },
                data: tagDescriptionTrimmed,
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

            if (tag.default)
              property.default = {
                codeFileLocation: {
                  filePath: codeFilePath,
                  codeLocation: getJsdocSourceTokenCodeLocation(
                    tag.source,
                    'name',
                    jsdocBlockStartCodePosition
                  ),
                },
                data: tag.default,
              };

            const tagDescriptionTrimmed = trimNewlines(tag.description);

            if (tagDescriptionTrimmed)
              property.description = {
                codeFileLocation: {
                  filePath: codeFilePath,
                  codeLocation: getJsdocSourceTokenCodeLocation(
                    tag.source,
                    'description',
                    jsdocBlockStartCodePosition
                  ),
                },
                data: tagDescriptionTrimmed,
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

          if (!returns.description) {
            const tagDescriptionTrimmed = trimNewlines(tag.description);

            if (tagDescriptionTrimmed)
              returns.description = {
                codeFileLocation: {
                  filePath: codeFilePath,
                  codeLocation: getJsdocSourceTokenCodeLocation(
                    tag.source,
                    'description',
                    jsdocBlockStartCodePosition
                  ),
                },
                data: tagDescriptionTrimmed,
              };
          }

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
        case 'see': {
          const tagDescriptionTrimmed = trimNewlines(tag.description);

          // Ignore an invalid tag missing a description.
          if (tagDescriptionTrimmed)
            see.unshift({
              codeFileLocation: {
                filePath: codeFilePath,
                codeLocation: getJsdocSourceTokenCodeLocation(
                  tag.source,
                  'description',
                  jsdocBlockStartCodePosition
                ),
              },
              data: tagDescriptionTrimmed,
            });

          break;
        }
        case 'example': {
          const tagDescriptionTrimmed = trimNewlines(tag.description);

          // Ignore an invalid tag missing a description.
          if (tagDescriptionTrimmed) {
            const {
              groups: {
                beforeCaption,
                captionData,
                beforeContent,
                contentData,
              },
            } = tagDescriptionTrimmed.match(
              // Group what comes before the caption and content so their
              // lengths can be used to derive offsets and then code locations
              // for both.
              /^(?<beforeContent>(?:(?<beforeCaption>\s*<caption>)(?<captionData>[^]*?)<\/caption>(?:\n+|[ \t])?)?)(?<contentData>[^]+)?/u
            );

            if (captionData || contentData) {
              let { line, column } = getJsdocSourceTokenCodeLocation(
                tag.source,
                'description',
                jsdocBlockStartCodePosition
              ).start;
              let charIndex = 0;

              const nextChar = () => {
                if (tagDescriptionTrimmed[charIndex] === '\n') {
                  line++;

                  // Because the tag description characters being looped have
                  // the JSDoc comment fence stripped by `comment-parser`, the
                  // line column start must account for the length of the
                  // possible fence (e.g. ` * `).

                  const { start, delimiter, postDelimiter } =
                    jsdocBlock.source.find(
                      ({ number }) => number === line
                    ).tokens;

                  column =
                    start.length + delimiter.length + postDelimiter.length + 1;
                } else column++;

                charIndex++;
              };

              const example = {};

              if (captionData) {
                const captionOffsetStart = beforeCaption.length;
                const captionOffsetEnd =
                  captionOffsetStart + captionData.length - 1;

                while (charIndex < captionOffsetStart) nextChar();

                const captionStart = new CodePosition(line, column);

                while (charIndex < captionOffsetEnd) nextChar();

                example.caption = {
                  codeFileLocation: {
                    filePath: codeFilePath,
                    codeLocation: new CodeLocation(
                      captionStart,
                      new CodePosition(line, column)
                    ),
                  },
                  data: captionData,
                };
              }

              if (contentData) {
                const contentOffsetStart = beforeContent.length;
                const contentOffsetEnd =
                  contentOffsetStart + contentData.length - 1;

                while (charIndex < contentOffsetStart) nextChar();

                const contentStart = new CodePosition(line, column);

                while (charIndex < contentOffsetEnd) nextChar();

                example.content = {
                  codeFileLocation: {
                    filePath: codeFilePath,
                    codeLocation: new CodeLocation(
                      contentStart,
                      new CodePosition(line, column)
                    ),
                  },
                  data: contentData,
                };
              }

              examples.unshift(example);
            }
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
      // Description tags override a JSDoc block description as they come later.
      if (description) member.description = description;
      else {
        // Description was not populated from tags, so try to get it from the
        // JSDoc block.
        const jsdocBlockDescriptionTrimmed = trimNewlines(
          jsdocBlock.description
        );

        if (jsdocBlockDescriptionTrimmed)
          member.description = {
            codeFileLocation: {
              filePath: codeFilePath,
              codeLocation: getJsdocSourceTokenCodeLocation(
                getJsdocBlockDescriptionSource(jsdocBlock),
                'description',
                jsdocBlockStartCodePosition
              ),
            },
            data: jsdocBlockDescriptionTrimmed,
          };
      }

      if (parameters.length) member.parameters = parameters;
      if (properties.length) member.properties = properties;
      if (Object.keys(returns).length) member.returns = returns;
      if (fires.length) member.fires = fires;
      if (see.length) member.see = see;
      if (examples.length) member.examples = examples;

      return member;
    }
  }
}
