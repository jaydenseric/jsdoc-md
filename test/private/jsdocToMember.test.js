'use strict';

const { strictEqual } = require('assert');
const { resolve } = require('path');
const snapshot = require('snapshot-assertion');
const jsdocToMember = require('../../private/jsdocToMember');

module.exports = (tests) => {
  tests.add('`jsdocToMember` with kind and name tags.', async () => {
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
      resolve(__dirname, '../snapshots/jsdocToMember/kind-and-name-tags.json')
    );
  });

  tests.add(
    '`jsdocToMember` with kind and name tags, overridden.',
    async () => {
      await snapshot(
        JSON.stringify(
          jsdocToMember(
            `/**
 * Description.
 * @kind constant
 * @kind function
 * @name B#c
 * @name A#b
 * @param {number} a Description.
 */`
          ),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocToMember/kind-and-name-tags-overridden.json'
        )
      );
    }
  );

  tests.add(
    '`jsdocToMember` with an event without an `event:` name prefix.',
    async () => {
      await snapshot(
        JSON.stringify(
          jsdocToMember(
            `/**
 * @kind event
 * @name A#b
 */`
          ),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocToMember/event-without-name-prefix.json'
        )
      );
    }
  );

  tests.add('`jsdocToMember` with @ignore.', () => {
    strictEqual(jsdocToMember('/** @ignore */'), undefined);
  });

  tests.add('`jsdocToMember` with a missing kind tag.', () => {
    strictEqual(jsdocToMember('/** @name A */'), undefined);
  });

  tests.add('`jsdocToMember` with a missing name tag.', () => {
    strictEqual(jsdocToMember('/** @kind function */'), undefined);
  });

  tests.add('`jsdocToMember` with description, no tags.', () => {
    strictEqual(jsdocToMember('/** Description. */'), undefined);
  });

  tests.add('`jsdocToMember` with no description, no tags.', () => {
    strictEqual(jsdocToMember('/** */'), undefined);
  });
};
