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
const jsdocDataToMdAst = require('../../private/jsdocDataToMdAst');
const outlineMembers = require('../../private/outlineMembers');
const jsdocCommentsToMembers = require('../jsdocCommentsToMembers');

const TEST_CODE_FILE_PATH = '/a.js';

module.exports = (tests) => {
  tests.add(
    '`jsdocDataToMdAst` with first argument `jsdocData` not an object.',
    () => {
      throws(() => {
        jsdocDataToMdAst(true);
      }, new TypeError('First argument `jsdocData` must be an object.'));
    }
  );

  tests.add(
    '`jsdocDataToMdAst` with first argument `jsdocData` property `codeFileLocation` not an object.',
    () => {
      throws(() => {
        jsdocDataToMdAst({
          codeFileLocation: true,
        });
      }, new TypeError('First argument `jsdocData` property `codeFileLocation` must be an object.'));
    }
  );

  tests.add(
    '`jsdocDataToMdAst` with first argument `jsdocData` property `codeFileLocation` property `filePath` not a string.',
    () => {
      throws(() => {
        jsdocDataToMdAst({
          codeFileLocation: {
            filePath: true,
          },
        });
      }, new TypeError('First argument `jsdocData` property `codeFileLocation` property `filePath` must be a string.'));
    }
  );

  tests.add(
    '`jsdocDataToMdAst` with first argument `jsdocData` property `codeFileLocation` property `codeLocation` not a `CodeLocation` instance.',
    () => {
      throws(() => {
        jsdocDataToMdAst({
          codeFileLocation: {
            filePath: TEST_CODE_FILE_PATH,
            codeLocation: true,
          },
        });
      }, new TypeError('First argument `jsdocData` property `codeFileLocation` property `codeLocation` must be a `CodeLocation` instance.'));
    }
  );

  tests.add(
    '`jsdocDataToMdAst` with first argument `jsdocData` property `data` not a string.',
    () => {
      throws(() => {
        jsdocDataToMdAst({
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
    '`jsdocDataToMdAst` with second argument `members` not an array.',
    () => {
      throws(() => {
        jsdocDataToMdAst(
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
    '`jsdocDataToMdAst` with third argument `codeFiles` not a `Map` instance.',
    () => {
      throws(() => {
        jsdocDataToMdAst(
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

  tests.add('`jsdocDataToMdAst` with a paragraph.', async () => {
    const descriptionContent = 'a';
    const code = `/**
 * ${descriptionContent}
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
        jsdocDataToMdAst(
          {
            codeFileLocation: {
              filePath: TEST_CODE_FILE_PATH,
              codeLocation: new CodeLocation(new CodePosition(2, 4)),
            },
            data: 'a',
          },
          outlinedMembers,
          codeFiles
        ),
        null,
        2
      ),
      resolve(__dirname, '../snapshots/jsdocDataToMdAst/paragraph.json')
    );
  });

  tests.add(
    '`jsdocDataToMdAst` with a single link, empty, no whitespace.',
    async () => {
      const descriptionContent = 'See [`B`]{@link}.';
      const code = `/**
 * ${descriptionContent}
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
          jsdocDataToMdAst(
            {
              codeFileLocation: {
                filePath: TEST_CODE_FILE_PATH,
                codeLocation: new CodeLocation(new CodePosition(2, 4)),
              },
              data: descriptionContent,
            },
            outlinedMembers,
            codeFiles
          ),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocDataToMdAst/single-link-empty-no-whitespace.json'
        )
      );
    }
  );

  tests.add(
    '`jsdocDataToMdAst` with a single link, empty, whitespace, singleline.',
    async () => {
      const descriptionContent = 'See [`B`]{ 	@link 	}.';
      const code = `/**
 * ${descriptionContent}
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
          jsdocDataToMdAst(
            {
              codeFileLocation: {
                filePath: TEST_CODE_FILE_PATH,
                codeLocation: new CodeLocation(new CodePosition(2, 4)),
              },
              data: descriptionContent,
            },
            outlinedMembers,
            codeFiles
          ),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocDataToMdAst/single-link-empty-whitespace-singleline.json'
        )
      );
    }
  );

  tests.add(
    '`jsdocDataToMdAst` with a single link, empty, whitespace, multiline.',
    async () => {
      const descriptionContent = `See [\`B\`]{

@link

}.`;
      const code = `/**
 * ${descriptionContent}
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
          jsdocDataToMdAst(
            {
              codeFileLocation: {
                filePath: TEST_CODE_FILE_PATH,
                codeLocation: new CodeLocation(new CodePosition(2, 4)),
              },
              data: descriptionContent,
            },
            outlinedMembers,
            codeFiles
          ),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocDataToMdAst/single-link-whitespace-multiline-empty.json'
        )
      );
    }
  );

  tests.add(
    '`jsdocDataToMdAst` with a single link, populated, member found, no whitespace.',
    async () => {
      const descriptionContent = 'See [`B`]{@link B}.';
      const code = `/**
 * ${descriptionContent}
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
          jsdocDataToMdAst(
            {
              codeFileLocation: {
                filePath: TEST_CODE_FILE_PATH,
                codeLocation: new CodeLocation(new CodePosition(2, 4)),
              },
              data: descriptionContent,
            },
            outlinedMembers,
            codeFiles
          ),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocDataToMdAst/single-link-populated-member-found-no-whitespace.json'
        )
      );
    }
  );

  tests.add(
    '`jsdocDataToMdAst` with a single link, populated, member found, whitespace, singleline.',
    async () => {
      const descriptionContent = 'See [`B`]{ 	@link 	B 	}.';
      const code = `/**
 * ${descriptionContent}
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
          jsdocDataToMdAst(
            {
              codeFileLocation: {
                filePath: TEST_CODE_FILE_PATH,
                codeLocation: new CodeLocation(new CodePosition(2, 4)),
              },
              data: descriptionContent,
            },
            outlinedMembers,
            codeFiles
          ),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocDataToMdAst/single-link-populated-member-found-whitespace-singleline.json'
        )
      );
    }
  );

  tests.add(
    '`jsdocDataToMdAst` with a single link, populated, member found, whitespace, multiline.',
    async () => {
      const descriptionContent = `See [\`B\`]{
@link

B

}.`;
      const code = `/**
 * ${descriptionContent}
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
          jsdocDataToMdAst(
            {
              codeFileLocation: {
                filePath: TEST_CODE_FILE_PATH,
                codeLocation: new CodeLocation(new CodePosition(2, 4)),
              },
              data: descriptionContent,
            },
            outlinedMembers,
            codeFiles
          ),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocDataToMdAst/single-link-populated-member-found-whitespace-multiline.json'
        )
      );
    }
  );

  tests.add(
    '`jsdocDataToMdAst` with a single link, populated, member missing, no whitespace.',
    async () => {
      const descriptionContent = '[`Abc`]{@link Abc}';
      const code = `/**
 * ${descriptionContent}
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
        jsdocDataToMdAst(
          {
            codeFileLocation: {
              filePath: TEST_CODE_FILE_PATH,
              codeLocation: new CodeLocation(new CodePosition(2, 4)),
            },
            data: descriptionContent,
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
          '../snapshots/jsdocDataToMdAst/single-link-populated-member-missing-no-whitespace-error-message.ans'
        )
      );
    }
  );

  tests.add(
    '`jsdocDataToMdAst` with a single link, populated, member missing, whitespace, singleline.',
    async () => {
      const descriptionContent = '[`Abc`]{ 	@link 	Abc 	}';
      const code = `/**
 * ${descriptionContent}
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
        jsdocDataToMdAst(
          {
            codeFileLocation: {
              filePath: TEST_CODE_FILE_PATH,
              codeLocation: new CodeLocation(new CodePosition(2, 4)),
            },
            data: descriptionContent,
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
      strictEqual(caughtError.message.includes('/a.js:2:21 → 2:23'), true);
      strictEqual(caughtError.message.includes('[`Abc`]{ 	@link 	Abc 	}'), true);
    }
  );

  tests.add(
    '`jsdocDataToMdAst` with a single link, populated, member missing, whitespace, multiline.',
    async () => {
      const descriptionContent = `[\`Abc\`]{
@link

Abc

}`;
      const code = `/**
 * ${descriptionContent}
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
        jsdocDataToMdAst(
          {
            codeFileLocation: {
              filePath: TEST_CODE_FILE_PATH,
              codeLocation: new CodeLocation(new CodePosition(2, 4)),
            },
            data: descriptionContent,
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
          '../snapshots/jsdocDataToMdAst/single-link-populated-member-missing-whitespace-multiline-error-message.ans'
        )
      );
    }
  );

  tests.add('`jsdocDataToMdAst` with multiple links.', async () => {
    const descriptionContent = 'See [`B`]{@link B} and [`C`]{@link C}.';
    const code = `/**
 * ${descriptionContent}
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
        jsdocDataToMdAst(
          {
            codeFileLocation: {
              filePath: TEST_CODE_FILE_PATH,
              codeLocation: new CodeLocation(new CodePosition(2, 4)),
            },
            data: descriptionContent,
          },
          outlinedMembers,
          codeFiles
        ),
        null,
        2
      ),
      resolve(__dirname, '../snapshots/jsdocDataToMdAst/multiple-links.json')
    );
  });
};
