const crypto = require('crypto')
const { sep } = require('path')
const { tmpdir } = require('os')
const { writeFileSync, unlinkSync } = require('fs')

/**
 * Creates a temporary file that deletes at test teardown.
 * @kind function
 * @name createTestFile
 * @param {string} content File content.
 * @param {string} extension File extension.
 * @param {Object} t TAP test context.
 * @returns {string} File path.
 * @ignore
 */
function createTestFile(content, extension, t) {
  const path = `${tmpdir()}${sep}jsdoc-md-test-${crypto
    .randomBytes(16)
    .toString('hex')}.${extension}`

  writeFileSync(path, content)

  // Make sure that the temp file is removed after the test.
  t.tearDown(() => {
    try {
      unlinkSync(path)
    } catch (error) {
      // Ignore the error if there is no file to clean up.
      if (error.code !== 'ENOENT') throw error
    }
  })

  return path
}

module.exports = { createTestFile }
