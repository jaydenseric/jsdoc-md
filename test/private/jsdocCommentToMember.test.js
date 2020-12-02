'use strict';

const { strictEqual } = require('assert');
const { resolve } = require('path');
const snapshot = require('snapshot-assertion');
const jsdocCommentToMember = require('../../private/jsdocCommentToMember');

module.exports = (tests) => {
  tests.add('`jsdocCommentToMember` with kind and name tags.', async () => {
    await snapshot(
      JSON.stringify(
        jsdocCommentToMember(
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
      resolve(
        __dirname,
        '../snapshots/jsdocCommentToMember/kind-and-name-tags.json'
      )
    );
  });

  tests.add(
    '`jsdocCommentToMember` with kind and name tags, overridden.',
    async () => {
      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(
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
          '../snapshots/jsdocCommentToMember/kind-and-name-tags-overridden.json'
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with an event without an `event:` name prefix.',
    async () => {
      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(
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
          '../snapshots/jsdocCommentToMember/event-without-name-prefix.json'
        )
      );
    }
  );

  tests.add('`jsdocCommentToMember` with @ignore.', () => {
    strictEqual(jsdocCommentToMember('/** @ignore */'), undefined);
  });

  tests.add('`jsdocCommentToMember` with a missing kind tag.', () => {
    strictEqual(jsdocCommentToMember('/** @name A */'), undefined);
  });

  tests.add('`jsdocCommentToMember` with a missing name tag.', () => {
    strictEqual(jsdocCommentToMember('/** @kind function */'), undefined);
  });

  tests.add('`jsdocCommentToMember` with description, no tags.', () => {
    strictEqual(jsdocCommentToMember('/** Description. */'), undefined);
  });

  tests.add('`jsdocCommentToMember` with no description, no tags.', () => {
    strictEqual(jsdocCommentToMember('/** */'), undefined);
  });
};
