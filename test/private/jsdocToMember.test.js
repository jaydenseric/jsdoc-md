'use strict';

const { strictEqual } = require('assert');
const { resolve } = require('path');
const snapshot = require('snapshot-assertion');
const jsdocToMember = require('../../private/jsdocToMember');

module.exports = (tests) => {
  tests.add('`jsdocToMember` with a method.', async () => {
    await snapshot(
      JSON.stringify(
        jsdocToMember(
          `/**
 * Description.
 * @kind function
 * @name A#b
 * @param {number} a Description.
 */`
        ),
        null,
        2
      ),
      resolve(__dirname, '../snapshots', 'jsdocToMember', 'with-a-method.json')
    );
  });

  tests.add('`jsdocToMember` with @ignore.', () => {
    strictEqual(jsdocToMember('/** @ignore */'), undefined);
  });

  tests.add('`jsdocToMember` with a missing kind tag.', () => {
    strictEqual(jsdocToMember('/** @name A */'), undefined);
  });

  tests.add('`jsdocToMember` with a missing name tag.', () => {
    strictEqual(jsdocToMember('/** @kind function */'), undefined);
  });
};
