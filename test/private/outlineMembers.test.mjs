import { strictEqual, throws } from 'assert';
import { stringify } from 'flatted';
import kleur from 'kleur';
import revertableGlobals from 'revertable-globals';
import snapshot from 'snapshot-assertion';
import codeToJsdocComments from '../../private/codeToJsdocComments.mjs';
import outlineMembers from '../../private/outlineMembers.mjs';
import jsdocCommentsToMembers from '../jsdocCommentsToMembers.mjs';

const TEST_CODE_FILE_PATH = '/a.js';

export default (tests) => {
  tests.add(
    '`outlineMembers` with first argument `members` not an array.',
    () => {
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, '']]);

      throws(() => {
        outlineMembers(true, codeFiles);
      }, new TypeError('First argument `members` must be an array.'));
    }
  );

  tests.add(
    '`outlineMembers` with second argument `codeFiles` not a `Map` instance.',
    () => {
      throws(() => {
        outlineMembers([], true);
      }, new TypeError('Second argument `codeFiles` must be a `Map` instance.'));
    }
  );

  tests.add('`outlineMembers` with no missing members.', async () => {
    const code = `/**
 * Description.
 * @kind class
 * @name A
 * @param {string} a Description.
 */

 /**
 * Description.
 * @kind event
 * @name A#event:a
 * @type {object}
 * @prop {string} a Description.
 */

 /**
 * Description.
 * @kind function
 * @name A.a
 * @param {B} a Description.
 */

 /**
 * Description.
 * @kind function
 * @name A#b
 * @fires A#event:a
 */

 /**
 * Description.
 * @kind function
 * @name A~c
 */

 /**
 * Description.
 * @kind member
 * @name A#d
 * @type {object}
 */

/**
 * Description.
 * @kind typedef
 * @name B
 * @type {object}
 * @prop {string} a Description.
 */`;
    const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
    const jsdocComments = await codeToJsdocComments(code, TEST_CODE_FILE_PATH);
    const members = jsdocCommentsToMembers(
      jsdocComments,
      codeFiles,
      TEST_CODE_FILE_PATH
    );

    await snapshot(
      stringify(outlineMembers(members, codeFiles), null, 2),
      new URL(
        '../snapshots/outlineMembers/no-missing-jsdoc-members.json',
        import.meta.url
      )
    );
  });

  tests.add('`outlineMembers` with a missing member.', async () => {
    const code = `// Code before…

class A {
  /**
   * @kind function
   * @name A#a
   */
  a() {}
}

// Code after…`;
    const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
    const jsdocComments = await codeToJsdocComments(code, TEST_CODE_FILE_PATH);
    const members = jsdocCommentsToMembers(
      jsdocComments,
      codeFiles,
      TEST_CODE_FILE_PATH
    );

    let caughtError;

    const revertEnv = revertableGlobals({ FORCE_COLOR: '1' }, process.env);
    const revertKleur = revertableGlobals({ enabled: true }, kleur);

    try {
      outlineMembers(members, codeFiles);
    } catch (error) {
      caughtError = error;
    }

    revertEnv();
    revertKleur();

    strictEqual(caughtError instanceof Error, true);

    await snapshot(
      caughtError.message,
      new URL(
        '../snapshots/outlineMembers/error-namepath-missing-jsdoc-member.ans',
        import.meta.url
      )
    );
  });
};
