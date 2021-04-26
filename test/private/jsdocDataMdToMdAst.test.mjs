import { strictEqual, throws } from 'assert';
import kleur from 'kleur';
import revertableGlobals from 'revertable-globals';
import snapshot from 'snapshot-assertion';
import CodeLocation from '../../private/CodeLocation.mjs';
import CodePosition from '../../private/CodePosition.mjs';
import InvalidJsdocError from '../../private/InvalidJsdocError.mjs';
import codeToJsdocComments from '../../private/codeToJsdocComments.mjs';
import jsdocDataMdToMdAst from '../../private/jsdocDataMdToMdAst.mjs';
import outlineMembers from '../../private/outlineMembers.mjs';
import jsdocCommentsToMembers from '../jsdocCommentsToMembers.mjs';

const TEST_CODE_FILE_PATH = '/a.js';

export default (tests) => {
  tests.add(
    '`jsdocDataMdToMdAst` with first argument `jsdocData` not an object.',
    () => {
      throws(() => {
        jsdocDataMdToMdAst(true);
      }, new TypeError('First argument `jsdocData` must be an object.'));
    }
  );

  tests.add(
    '`jsdocDataMdToMdAst` with first argument `jsdocData` property `codeFileLocation` not an object.',
    () => {
      throws(() => {
        jsdocDataMdToMdAst({
          codeFileLocation: true,
        });
      }, new TypeError('First argument `jsdocData` property `codeFileLocation` must be an object.'));
    }
  );

  tests.add(
    '`jsdocDataMdToMdAst` with first argument `jsdocData` property `codeFileLocation` property `filePath` not a string.',
    () => {
      throws(() => {
        jsdocDataMdToMdAst({
          codeFileLocation: {
            filePath: true,
          },
        });
      }, new TypeError('First argument `jsdocData` property `codeFileLocation` property `filePath` must be a string.'));
    }
  );

  tests.add(
    '`jsdocDataMdToMdAst` with first argument `jsdocData` property `codeFileLocation` property `codeLocation` not a `CodeLocation` instance.',
    () => {
      throws(() => {
        jsdocDataMdToMdAst({
          codeFileLocation: {
            filePath: TEST_CODE_FILE_PATH,
            codeLocation: true,
          },
        });
      }, new TypeError('First argument `jsdocData` property `codeFileLocation` property `codeLocation` must be a `CodeLocation` instance.'));
    }
  );

  tests.add(
    '`jsdocDataMdToMdAst` with first argument `jsdocData` property `data` not a string.',
    () => {
      throws(() => {
        jsdocDataMdToMdAst({
          codeFileLocation: {
            filePath: TEST_CODE_FILE_PATH,
            codeLocation: new CodeLocation(
              new CodePosition(2, 4),
              new CodePosition(2, 4)
            ),
          },
          data: true,
        });
      }, new TypeError('First argument `jsdocData` property `data` must be a string.'));
    }
  );

  tests.add(
    '`jsdocDataMdToMdAst` with second argument `members` not an array.',
    () => {
      throws(() => {
        jsdocDataMdToMdAst(
          {
            codeFileLocation: {
              filePath: TEST_CODE_FILE_PATH,
              codeLocation: new CodeLocation(
                new CodePosition(2, 4),
                new CodePosition(2, 4)
              ),
            },
            data: '',
          },
          true
        );
      }, new TypeError('Second argument `members` must be an array.'));
    }
  );

  tests.add(
    '`jsdocDataMdToMdAst` with third argument `codeFiles` not a `Map` instance.',
    () => {
      throws(() => {
        jsdocDataMdToMdAst(
          {
            codeFileLocation: {
              filePath: TEST_CODE_FILE_PATH,
              codeLocation: new CodeLocation(
                new CodePosition(2, 4),
                new CodePosition(2, 4)
              ),
            },
            data: '',
          },
          [],
          true
        );
      }, new TypeError('Third argument `codeFiles` must be a `Map` instance.'));
    }
  );

  tests.add('`jsdocDataMdToMdAst` with a paragraph.', async () => {
    const mdData = 'abc';
    const code = `/**
 * ${mdData}
 * @kind member
 * @name A
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
        jsdocDataMdToMdAst(
          {
            codeFileLocation: {
              filePath: TEST_CODE_FILE_PATH,
              codeLocation: new CodeLocation(
                new CodePosition(2, 4),
                new CodePosition(2, 6)
              ),
            },
            data: mdData,
          },
          outlinedMembers,
          codeFiles
        ),
        null,
        2
      ),
      new URL('../snapshots/jsdocDataMdToMdAst/paragraph.json', import.meta.url)
    );
  });

  tests.add(
    '`jsdocDataMdToMdAst` with a single link, empty, no whitespace.',
    async () => {
      const mdData = 'See [`B`]{@link}.';
      const code = `/**
 * ${mdData}
 * @kind member
 * @name A
 */

/**
 * @kind member
 * @name B
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const jsdocComments = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );
      const members = jsdocCommentsToMembers(
        jsdocComments,
        codeFiles,
        TEST_CODE_FILE_PATH
      );
      const outlinedMembers = outlineMembers(members, codeFiles);

      await snapshot(
        JSON.stringify(
          jsdocDataMdToMdAst(
            {
              codeFileLocation: {
                filePath: TEST_CODE_FILE_PATH,
                codeLocation: new CodeLocation(
                  new CodePosition(2, 4),
                  new CodePosition(2, 20)
                ),
              },
              data: mdData,
            },
            outlinedMembers,
            codeFiles
          ),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocDataMdToMdAst/single-link-empty-no-whitespace.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocDataMdToMdAst` with a single link, empty, whitespace.',
    async () => {
      const mdData = 'See [`B`]{ 	@link 	}.';
      const code = `/**
 * ${mdData}
 * @kind member
 * @name A
 */

/**
 * @kind member
 * @name B
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const jsdocComments = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );
      const members = jsdocCommentsToMembers(
        jsdocComments,
        codeFiles,
        TEST_CODE_FILE_PATH
      );
      const outlinedMembers = outlineMembers(members, codeFiles);

      await snapshot(
        JSON.stringify(
          jsdocDataMdToMdAst(
            {
              codeFileLocation: {
                filePath: TEST_CODE_FILE_PATH,
                codeLocation: new CodeLocation(
                  new CodePosition(2, 4),
                  new CodePosition(2, 24)
                ),
              },
              data: mdData,
            },
            outlinedMembers,
            codeFiles
          ),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocDataMdToMdAst/single-link-empty-whitespace.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocDataMdToMdAst` with a single link, populated, member found, no whitespace.',
    async () => {
      const mdData = 'See [`B`]{@link B}.';
      const code = `/**
 * ${mdData}
 * @kind member
 * @name A
 */

/**
 * @kind member
 * @name B
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const jsdocComments = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );
      const members = jsdocCommentsToMembers(
        jsdocComments,
        codeFiles,
        TEST_CODE_FILE_PATH
      );
      const outlinedMembers = outlineMembers(members, codeFiles);

      await snapshot(
        JSON.stringify(
          jsdocDataMdToMdAst(
            {
              codeFileLocation: {
                filePath: TEST_CODE_FILE_PATH,
                codeLocation: new CodeLocation(
                  new CodePosition(2, 4),
                  new CodePosition(2, 22)
                ),
              },
              data: mdData,
            },
            outlinedMembers,
            codeFiles
          ),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocDataMdToMdAst/single-link-populated-member-found-no-whitespace.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocDataMdToMdAst` with a single link, populated, member found, whitespace.',
    async () => {
      const mdData = 'See [`B`]{ 	@link 	B 	}.';
      const code = `/**
 * ${mdData}
 * @kind member
 * @name A
 */

/**
 * @kind member
 * @name B
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const jsdocComments = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );
      const members = jsdocCommentsToMembers(
        jsdocComments,
        codeFiles,
        TEST_CODE_FILE_PATH
      );
      const outlinedMembers = outlineMembers(members, codeFiles);

      await snapshot(
        JSON.stringify(
          jsdocDataMdToMdAst(
            {
              codeFileLocation: {
                filePath: TEST_CODE_FILE_PATH,
                codeLocation: new CodeLocation(
                  new CodePosition(2, 4),
                  new CodePosition(2, 27)
                ),
              },
              data: mdData,
            },
            outlinedMembers,
            codeFiles
          ),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocDataMdToMdAst/single-link-populated-member-found-whitespace.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocDataMdToMdAst` with a single link, populated, member missing, no whitespace.',
    async () => {
      const code = `/**
 * Description.
 * [\`Abc\`]{@link Abc}
 * @kind member
 * @name A
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const jsdocComments = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );
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
        jsdocDataMdToMdAst(
          {
            codeFileLocation: {
              filePath: TEST_CODE_FILE_PATH,
              codeLocation: new CodeLocation(
                new CodePosition(2, 4),
                new CodePosition(3, 21)
              ),
            },
            data: `Description.
[\`Abc\`]{@link Abc}`,
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
          '../snapshots/jsdocDataMdToMdAst/single-link-populated-member-missing-no-whitespace-error-message.ans',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocDataMdToMdAst` with a single link, populated, member missing, whitespace.',
    async () => {
      const code = `/**
 * Description.
 * [\`Abc\`]{ 	@link 	Abc 	}
 * @kind member
 * @name A
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const jsdocComments = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );
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
        jsdocDataMdToMdAst(
          {
            codeFileLocation: {
              filePath: TEST_CODE_FILE_PATH,
              codeLocation: new CodeLocation(
                new CodePosition(2, 4),
                new CodePosition(3, 26)
              ),
            },
            data: `Description.
[\`Abc\`]{ 	@link 	Abc 	}`,
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

      // The error message can’t be snapshot tested due to a `@babel/code-frame`
      // bug, see:
      // https://github.com/babel/babel/issues/12696
      strictEqual(caughtError.message.includes('/a.js:3:21 → 3:23'), true);
      strictEqual(caughtError.message.includes('[`Abc`]{ 	@link 	Abc 	}'), true);
    }
  );

  tests.add('`jsdocDataMdToMdAst` with multiple links.', async () => {
    const mdData = 'See [`B`]{@link B} and [`C`]{@link C}.';
    const code = `/**
 * ${mdData}
 * @kind member
 * @name A
 */

/**
 * @kind member
 * @name B
 */

/**
 * @kind member
 * @name C
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
        jsdocDataMdToMdAst(
          {
            codeFileLocation: {
              filePath: TEST_CODE_FILE_PATH,
              codeLocation: new CodeLocation(
                new CodePosition(2, 4),
                new CodePosition(2, 41)
              ),
            },
            data: mdData,
          },
          outlinedMembers,
          codeFiles
        ),
        null,
        2
      ),
      new URL(
        '../snapshots/jsdocDataMdToMdAst/multiple-links.json',
        import.meta.url
      )
    );
  });
};
