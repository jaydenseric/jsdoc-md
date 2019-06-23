const { parse } = require('@babel/core')

/**
 * Gets JSDoc comments from a code string.
 * @kind function
 * @name jsdocCommentsFromCode
 * @param {string} code Code to search.
 * @param {string} [path] Code file path.
 * @returns {string[]} JSDoc comment values.
 * @ignore
 */
const jsdocCommentsFromCode = (code, path) => {
  const { comments } = parse(code, {
    filename: path,
    rootMode: 'upward'
  })
  return comments.reduce((comments, { value }) => {
    if (value.match(/^\*\s/)) comments.push(value.replace('*\\/', '*/'))
    return comments
  }, [])
}

module.exports = jsdocCommentsFromCode
