const { parse } = require('@babel/core')

/**
 * Gets JSDoc comments from a code string.
 * @kind function
 * @name jsdocCommentsFromCode
 * @param {string} code Code to search.
 * @returns {string[]} JSDoc comment values.
 * @ignore
 */
const jsdocCommentsFromCode = code => {
  const { comments } = parse(code, {
    parserOpts: {
      plugins: [
        'classProperties',
        ['decorators', { decoratorsBeforeExport: false }],
        'dynamicImport',
        'objectRestSpread'
      ]
    }
  })
  return comments.reduce((comments, { value }) => {
    if (value.match(/^\*\s/)) comments.push(value.replace('*\\/', '*/'))
    return comments
  }, [])
}

module.exports = jsdocCommentsFromCode
