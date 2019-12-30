'use strict'

const fs = require('fs')

/**
 * Asserts a string value matches a snapshot saved to a file. The environment
 * variable `UPDATE_SNAPSHOTS=1` can be used to create or update the snapshot.
 * @kind function
 * @name snapshot
 * @param {string} value Value to assert matches the snapshot.
 * @param {string} filePath Snapshot file path. Be sure directories in the path already exist.
 * @param {Function} [assertion] Receives the value and expected value to assert they match. Defaults to `require('assert').strictEqual`.
 * @returns {Promise<void>} Resolves once the snapshot has been created, updated or asserted.
 * @ignore
 */
module.exports = async function snapshot(
  value,
  filePath,
  assertion = require('assert').strictEqual
) {
  if (process.env.UPDATE_SNAPSHOTS) await fs.promises.writeFile(filePath, value)
  else {
    try {
      var valueExpected = await fs.promises.readFile(filePath, 'utf8')
    } catch (error) {
      throw typeof error === 'object' && error && error.code === 'ENOENT'
        ? new Error(
            `Use the environment variable \`UPDATE_SNAPSHOTS=1\` to create missing snapshot \`${filePath}\`.`
          )
        : error
    }

    assertion(value, valueExpected)
  }
}
