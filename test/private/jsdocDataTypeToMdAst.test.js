'use strict';

const { strictEqual, throws } = require('assert');
const { resolve } = require('path');
const kleur = require('kleur');
const revertableGlobals = require('revertable-globals');
const snapshot = require('snapshot-assertion');
const CodeLocation = require('../../private/CodeLocation');
const CodePosition = require('../../private/CodePosition');
const InvalidJsdocError = require('../../private/InvalidJsdocError');
const codeToJsdocComments = require('../../private/codeToJsdocComments');
const jsdocDataTypeToMdAst = require('../../private/jsdocDataTypeToMdAst');
const outlineMembers = require('../../private/outlineMembers');
const jsdocCommentsToMembers = require('../jsdocCommentsToMembers');

const TEST_CODE_FILE_PATH = '/a.js';

module.exports = (tests) => {
  tests.add(
    '`jsdocDataTypeToMdAst` with first argument `jsdocData` not an object.',
    () => {
      throws(() => {
        jsdocDataTypeToMdAst(true);
      }, new TypeError('First argument `jsdocData` must be an object.'));
    }
  );

  tests.add(
    '`jsdocDataTypeToMdAst` with first argument `jsdocData` property `codeFileLocation` not an object.',
    () => {
      throws(() => {
        jsdocDataTypeToMdAst({
          codeFileLocation: true,
        });
      }, new TypeError('First argument `jsdocData` property `codeFileLocation` must be an object.'));
    }
  );

  tests.add(
    '`jsdocDataTypeToMdAst` with first argument `jsdocData` property `codeFileLocation` property `filePath` not a string.',
    () => {
      throws(() => {
        jsdocDataTypeToMdAst({
          codeFileLocation: {
            filePath: true,
          },
        });
      }, new TypeError('First argument `jsdocData` property `codeFileLocation` property `filePath` must be a string.'));
    }
  );

  tests.add(
    '`jsdocDataTypeToMdAst` with first argument `jsdocData` property `codeFileLocation` property `codeLocation` not a `CodeLocation` instance.',
    () => {
      throws(() => {
        jsdocDataTypeToMdAst({
          codeFileLocation: {
            filePath: TEST_CODE_FILE_PATH,
            codeLocation: true,
          },
        });
      }, new TypeError('First argument `jsdocData` property `codeFileLocation` property `codeLocation` must be a `CodeLocation` instance.'));
    }
  );

  tests.add(
    '`jsdocDataTypeToMdAst` with first argument `jsdocData` property `data` not a string.',
    () => {
      throws(() => {
        jsdocDataTypeToMdAst({
          codeFileLocation: {
            filePath: TEST_CODE_FILE_PATH,
            codeLocation: new CodeLocation(new CodePosition(2, 4)),
          },
          data: true,
        });
      }, new TypeError('First argument `jsdocData` property `data` must be a string.'));
    }
  );

  tests.add(
    '`jsdocDataTypeToMdAst` with second argument `members` not an array.',
    () => {
      throws(() => {
        jsdocDataTypeToMdAst(
          {
            codeFileLocation: {
              filePath: TEST_CODE_FILE_PATH,
              codeLocation: new CodeLocation(new CodePosition(2, 4)),
            },
            data: '',
          },
          true
        );
      }, new TypeError('Second argument `members` must be an array.'));
    }
  );

  tests.add(
    '`jsdocDataTypeToMdAst` with third argument `codeFiles` not a `Map` instance.',
    () => {
      throws(() => {
        jsdocDataTypeToMdAst(
          {
            codeFileLocation: {
              filePath: TEST_CODE_FILE_PATH,
              codeLocation: new CodeLocation(new CodePosition(2, 4)),
            },
            data: '',
          },
          [],
          true
        );
      }, new TypeError('Third argument `codeFiles` must be a `Map` instance.'));
    }
  );

  tests.add('`jsdocDataTypeToMdAst` with a type, valid.', async () => {
    const typeData = 'object';
    const code = `/**
 * @kind typedef
 * @name A
 * @type {${typeData}}
 */`;
    const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
    const jsdocComments = await codeToJsdocComments(code, TEST_CODE_FILE_PATH);
    const members = jsdocCommentsToMembers(
      jsdocComments,
      codeFiles,
      TEST_CODE_FILE_PATH
    );
    const outlinedMembers = outlineMembers(members, codeFiles);

    await snapshot(
      JSON.stringify(
        jsdocDataTypeToMdAst(
          {
            codeFileLocation: {
              filePath: TEST_CODE_FILE_PATH,
              codeLocation: new CodeLocation(
                new CodePosition(4, 10),
                new CodePosition(4, 17)
              ),
            },
            data: typeData,
          },
          outlinedMembers,
          codeFiles
        ),
        null,
        2
      ),
      resolve(__dirname, '../snapshots/jsdocDataTypeToMdAst/type-valid.json')
    );
  });

  tests.add('`jsdocDataTypeToMdAst` with a type, invalid.', async () => {
    const typeData = '**';
    const code = `/**
 * @kind typedef
 * @name A
 * @type {${typeData}}
 */`;
    const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
    const jsdocComments = await codeToJsdocComments(code, TEST_CODE_FILE_PATH);
    const members = jsdocCommentsToMembers(
      jsdocComments,
      codeFiles,
      TEST_CODE_FILE_PATH
    );
    const outlinedMembers = outlineMembers(members, codeFiles);

    let caughtError;

    const revertEnv = revertableGlobals({ FORCE_COLOR: '1' }, process.env);
    const revertKleur = revertableGlobals({ enabled: true }, kleur);

    try {
      jsdocDataTypeToMdAst(
        {
          codeFileLocation: {
            filePath: TEST_CODE_FILE_PATH,
            codeLocation: new CodeLocation(
              new CodePosition(4, 10),
              new CodePosition(4, 13)
            ),
          },
          data: typeData,
        },
        outlinedMembers,
        codeFiles
      );
    } catch (error) {
      caughtError = error;
    }

    revertEnv();
    revertKleur();

    strictEqual(caughtError instanceof InvalidJsdocError, true);

    await snapshot(
      caughtError.message,
      resolve(
        __dirname,
        '../snapshots/jsdocDataTypeToMdAst/type-invalid-error-message.ans'
      )
    );
  });
};
