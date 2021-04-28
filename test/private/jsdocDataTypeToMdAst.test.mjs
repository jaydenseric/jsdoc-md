import { strictEqual, throws } from 'assert';
import kleur from 'kleur';
import revertableGlobals from 'revertable-globals';
import snapshot from 'snapshot-assertion';
import CodeLocation from '../../private/CodeLocation.mjs';
import CodePosition from '../../private/CodePosition.mjs';
import InvalidJsdocError from '../../private/InvalidJsdocError.mjs';
import codeToJsdocComments from '../../private/codeToJsdocComments.mjs';
import jsdocDataTypeToMdAst from '../../private/jsdocDataTypeToMdAst.mjs';
import outlineMembers from '../../private/outlineMembers.mjs';
import jsdocCommentsToMembers from '../jsdocCommentsToMembers.mjs';

const TEST_CODE_FILE_PATH = '/a.js';

export default (tests) => {
  tests.add(
    '`jsdocDataTypeToMdAst` with argument 1 `jsdocData` not an object.',
    () => {
      throws(() => {
        jsdocDataTypeToMdAst(true);
      }, new TypeError('Argument 1 `jsdocData` must be an object.'));
    }
  );

  tests.add(
    '`jsdocDataTypeToMdAst` with argument 1 `jsdocData` property `codeFileLocation` not an object.',
    () => {
      throws(() => {
        jsdocDataTypeToMdAst({
          codeFileLocation: true,
        });
      }, new TypeError('Argument 1 `jsdocData` property `codeFileLocation` must be an object.'));
    }
  );

  tests.add(
    '`jsdocDataTypeToMdAst` with argument 1 `jsdocData` property `codeFileLocation` property `filePath` not a string.',
    () => {
      throws(() => {
        jsdocDataTypeToMdAst({
          codeFileLocation: {
            filePath: true,
          },
        });
      }, new TypeError('Argument 1 `jsdocData` property `codeFileLocation` property `filePath` must be a string.'));
    }
  );

  tests.add(
    '`jsdocDataTypeToMdAst` with argument 1 `jsdocData` property `codeFileLocation` property `codeLocation` not a `CodeLocation` instance.',
    () => {
      throws(() => {
        jsdocDataTypeToMdAst({
          codeFileLocation: {
            filePath: TEST_CODE_FILE_PATH,
            codeLocation: true,
          },
        });
      }, new TypeError('Argument 1 `jsdocData` property `codeFileLocation` property `codeLocation` must be a `CodeLocation` instance.'));
    }
  );

  tests.add(
    '`jsdocDataTypeToMdAst` with argument 1 `jsdocData` property `data` not a string.',
    () => {
      throws(() => {
        jsdocDataTypeToMdAst({
          codeFileLocation: {
            filePath: TEST_CODE_FILE_PATH,
            codeLocation: new CodeLocation(new CodePosition(2, 4)),
          },
          data: true,
        });
      }, new TypeError('Argument 1 `jsdocData` property `data` must be a string.'));
    }
  );

  tests.add(
    '`jsdocDataTypeToMdAst` with argument 2 `members` not an array.',
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
      }, new TypeError('Argument 2 `members` must be an array.'));
    }
  );

  tests.add(
    '`jsdocDataTypeToMdAst` with argument 3 `codeFiles` not a `Map` instance.',
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
      }, new TypeError('Argument 3 `codeFiles` must be a `Map` instance.'));
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
      new URL(
        '../snapshots/jsdocDataTypeToMdAst/type-valid.json',
        import.meta.url
      )
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
      new URL(
        '../snapshots/jsdocDataTypeToMdAst/type-invalid-error-message.ans',
        import.meta.url
      )
    );
  });
};
