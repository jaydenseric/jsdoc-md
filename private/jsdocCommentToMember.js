'use strict';

const commentParser = require('comment-parser');
const deconstructJsdocNamepath = require('./deconstructJsdocNamepath');
const getJsdocAstTag = require('./getJsdocAstTag');

const JSDOC_PARSER_OPTIONS = {
  // Configure what parts (tag, type, name, description) are expected for
  // jsdoc-md supported JSDoc tags. See:
  // https://github.com/syavorsky/comment-parser/issues/82
  parsers: [
    commentParser.PARSERS.parse_tag,
    (unparsed, data) =>
      // JSDoc tags without a type.
      ['fires', 'ignore', 'kind', 'see'].includes(data.tag)
        ? null
        : commentParser.PARSERS.parse_type(unparsed, data),
    (unparsed, data) =>
      // JSDoc tags without a name.
      ['example', 'ignore', 'returns', 'see'].includes(data.tag)
        ? null
        : commentParser.PARSERS.parse_name(unparsed, data),
    (unparsed, data) =>
      // JSDoc tags without a description.
      ['fires', 'ignore', 'kind', 'name', 'type'].includes(data.tag)
        ? null
        : commentParser.PARSERS.parse_description(unparsed, data),
  ],
};

/**
 * Analyzes a JSDoc comment to produce JSDoc member details.
 * @kind function
 * @name jsdocCommentToMember
 * @param {string} jsdoc JSDoc comment string.
 * @returns {object|void} Outline member, if it is one.
 * @ignore
 */
module.exports = function jsdocCommentToMember(jsdoc) {
  const [jsdocAst] = commentParser(jsdoc, JSDOC_PARSER_OPTIONS);

  // Ignore JSDoc without tags.
  if (!jsdocAst || !jsdocAst.tags || !jsdocAst.tags.length) return;

  // Exclude ignored symbol.
  if (getJsdocAstTag(jsdocAst.tags, 'ignore')) return;

  const { name: kind } = getJsdocAstTag(jsdocAst.tags, 'kind') || {};

  // Ignore symbol without a kind.
  if (!kind) return;

  const { name: namepath } = getJsdocAstTag(jsdocAst.tags, 'name') || {};

  // Ignore symbol without a name.
  if (!namepath) return;

  let { memberof, membership, name } = deconstructJsdocNamepath(namepath);

  // Automatically add a missing `event:` prefix to an event name.
  if (kind === 'event' && !name.startsWith('event:')) name = `event:${name}`;

  return Object.assign(
    {
      kind,
      namepath,
      memberof,
      membership,
      name,
    },
    jsdocAst
  );
};
