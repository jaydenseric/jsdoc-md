/**
 * Gets the JSDoc block description source from a `comment-parser` result
 * JSDoc block.
 * @see [GitHub comments](https://github.com/syavorsky/comment-parser/issues/99#issuecomment-766285462).
 * @kind function
 * @name getJsdocBlockDescriptionSource
 * @param {object} jsdocBlock JSDoc block parsed by `comment-parser`.
 * @param {Array<object>}jsdocBlock.source JSdoc block source.
 * @param {Array<object>} jsdocBlock.tags JSDoc block tags.
 * @returns {Array<object>} JSDoc block description source.
 * @ignore
 */
export default function getJsdocBlockDescriptionSource(jsdocBlock) {
  if (typeof jsdocBlock !== 'object')
    throw new TypeError('Argument 1 `jsdocBlock` must be an object.');

  return jsdocBlock.tags.length
    ? jsdocBlock.source.filter(
        ({ number }) => number < jsdocBlock.tags[0].source[0].number
      )
    : jsdocBlock.source;
}
