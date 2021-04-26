import CommentParserTokenizerDescription from 'comment-parser/lib/parser/tokenizers/description.js';
import CommentParserTokenizerName from 'comment-parser/lib/parser/tokenizers/name.js';
import CommentParserTokenizerTag from 'comment-parser/lib/parser/tokenizers/tag.js';
import CommentParserTokenizerType from 'comment-parser/lib/parser/tokenizers/type.js';

const {
  default: getCommentParserTokenizerDescription,
} = CommentParserTokenizerDescription;
const { default: getCommentParserTokenizerName } = CommentParserTokenizerName;
const { default: getCommentParserTokenizerTag } = CommentParserTokenizerTag;
const { default: getCommentParserTokenizerType } = CommentParserTokenizerType;

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
