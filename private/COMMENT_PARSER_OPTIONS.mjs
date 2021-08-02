// The `eslint-plugin-node` rule `no-missing-import` doesn’t support the package
// `exports` field yet, see:
// https://github.com/mysticatea/eslint-plugin-node/issues/255
// eslint-disable-next-line node/no-missing-import
import getCommentParserTokenizerDescription from 'comment-parser/parser/tokenizers/description';
// eslint-disable-next-line node/no-missing-import
import getCommentParserTokenizerName from 'comment-parser/parser/tokenizers/name';
// eslint-disable-next-line node/no-missing-import
import getCommentParserTokenizerTag from 'comment-parser/parser/tokenizers/tag';
// eslint-disable-next-line node/no-missing-import
import getCommentParserTokenizerType from 'comment-parser/parser/tokenizers/type';

const JSDOC_SPACING_STRATEGY = 'preserve';

/**
 * [`comment-parser`](https://npm.im/comment-parser) parser options for parsing
 * JSDoc comment block tags relevant to `jsdoc-md`.
 * @kind constant
 * @name COMMENT_PARSER_OPTIONS
 * @ignore
 */
export default {
  // Used for parsing the main description (before block tags).
  spacing: JSDOC_SPACING_STRATEGY,

  // Configure what parts (tag, type, name, description) are expected for
  // jsdoc-md supported JSDoc tags.
  tokenizers: [
    // Tag tokenizer.
    getCommentParserTokenizerTag(),

    // Type tokenizer.
    (spec) =>
      // JSDoc tags without a type.
      ['desc', 'description', 'fires', 'ignore', 'kind', 'see'].includes(
        spec.tag
      )
        ? spec
        : getCommentParserTokenizerType(JSDOC_SPACING_STRATEGY)(spec),

    // Name tokenizer.
    (spec) =>
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
      ].includes(spec.tag)
        ? spec
        : getCommentParserTokenizerName()(spec),

    // Description tokenizer.
    (spec) =>
      // JSDoc tags without a description.
      ['fires', 'ignore', 'kind', 'name', 'type', 'typedef'].includes(spec.tag)
        ? spec
        : getCommentParserTokenizerDescription(JSDOC_SPACING_STRATEGY)(spec),
  ],
};
