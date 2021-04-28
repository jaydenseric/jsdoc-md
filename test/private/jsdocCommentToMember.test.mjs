import { strictEqual, throws } from 'assert';
import kleur from 'kleur';
import revertableGlobals from 'revertable-globals';
import snapshot from 'snapshot-assertion';
import InvalidJsdocError from '../../private/InvalidJsdocError.mjs';
import codeToJsdocComments from '../../private/codeToJsdocComments.mjs';
import jsdocCommentToMember from '../../private/jsdocCommentToMember.mjs';

const TEST_CODE_FILE_PATH = '/a.js';

export default (tests) => {
  tests.add(
    '`jsdocCommentToMember` with argument 1 `jsdocComment` not an object.',
    () => {
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, '']]);

      throws(() => {
        jsdocCommentToMember(true, codeFiles, TEST_CODE_FILE_PATH);
      }, new TypeError('Argument 1 `jsdocComment` must be an object.'));
    }
  );

  tests.add(
    '`jsdocCommentToMember` with argument 2 `codeFiles` not a `Map` instance.',
    async () => {
      const code = '/** */';
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      throws(() => {
        jsdocCommentToMember(jsdocComment, true, TEST_CODE_FILE_PATH);
      }, new TypeError('Argument 2 `codeFiles` must be a `Map` instance.'));
    }
  );

  tests.add(
    '`jsdocCommentToMember` with argument 3 `codeFilePath` not a string.',
    async () => {
      const code = '/** */';
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      throws(() => {
        jsdocCommentToMember(jsdocComment, codeFiles, true);
      }, new TypeError('Argument 3 `codeFilePath` must be a string.'));
    }
  );

  tests.add(
    '`jsdocCommentToMember` with argument 3 `codeFilePath` not a populated string.',
    async () => {
      const code = '/** */';
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      throws(() => {
        jsdocCommentToMember(jsdocComment, codeFiles, '');
      }, new TypeError('Argument 3 `codeFilePath` must be a populated string.'));
    }
  );

  tests.add('`jsdocCommentToMember` with a JSDoc syntax error.', async () => {
    const code = '/** @tag [name */';
    const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
    const [jsdocComment] = await codeToJsdocComments(code, TEST_CODE_FILE_PATH);
    strictEqual(
      jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
      undefined
    );
  });

  tests.add(
    '`jsdocCommentToMember` with no description, no tags.',
    async () => {
      const code = '/** */';
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );
      strictEqual(
        jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
        undefined
      );
    }
  );

  tests.add('`jsdocCommentToMember` with description, no tags.', async () => {
    const code = '/** Description. */';
    const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
    const [jsdocComment] = await codeToJsdocComments(code, TEST_CODE_FILE_PATH);
    strictEqual(
      jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
      undefined
    );
  });

  tests.add('`jsdocCommentToMember` with a missing kind.', async () => {
    const code = '/** @name A */';
    const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
    const [jsdocComment] = await codeToJsdocComments(code, TEST_CODE_FILE_PATH);
    strictEqual(
      jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
      undefined
    );
  });

  tests.add('`jsdocCommentToMember` with a missing name.', async () => {
    const code = '/** @kind member */';
    const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
    const [jsdocComment] = await codeToJsdocComments(code, TEST_CODE_FILE_PATH);
    strictEqual(
      jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
      undefined
    );
  });

  tests.add('`jsdocCommentToMember` with tag ignore.', async () => {
    const code = '/** @ignore */';
    const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
    const [jsdocComment] = await codeToJsdocComments(code, TEST_CODE_FILE_PATH);
    strictEqual(
      jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
      undefined
    );
  });

  tests.add('`jsdocCommentToMember` with an invalid namepath.', async () => {
    const code = `// Code before…
const a = true;

/**
 * @kind member
 * @name ....
 */
const b = true;

// Code after…`;
    const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
    const [jsdocComment] = await codeToJsdocComments(code, TEST_CODE_FILE_PATH);

    let caughtError;

    const revertEnv = revertableGlobals({ FORCE_COLOR: '1' }, process.env);
    const revertKleur = revertableGlobals({ enabled: true }, kleur);

    try {
      jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH);
    } catch (error) {
      caughtError = error;
    }

    revertEnv();
    revertKleur();

    strictEqual(caughtError instanceof InvalidJsdocError, true);

    await snapshot(
      caughtError.message,
      new URL(
        '../snapshots/jsdocCommentToMember/error-invalid-namepath.ans',
        import.meta.url
      )
    );
  });

  tests.add('`jsdocCommentToMember` with description.', async () => {
    const code = `/**
 * Description.
 * @kind member
 * @name A
 */`;
    const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
    const [jsdocComment] = await codeToJsdocComments(code, TEST_CODE_FILE_PATH);

    await snapshot(
      JSON.stringify(
        jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
        null,
        2
      ),
      new URL(
        '../snapshots/jsdocCommentToMember/description.json',
        import.meta.url
      )
    );
  });

  tests.add(
    '`jsdocCommentToMember` with tag desc, missing description.',
    async () => {
      const code = `/**
 * @desc
 * @kind member
 * @name A
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-desc-missing-description.json',
          import.meta.url
        )
      );
    }
  );

  tests.add('`jsdocCommentToMember` with tag desc.', async () => {
    const code = `/**
 * @desc Description.
 * @kind member
 * @name A
 */`;
    const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
    const [jsdocComment] = await codeToJsdocComments(code, TEST_CODE_FILE_PATH);

    await snapshot(
      JSON.stringify(
        jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
        null,
        2
      ),
      new URL(
        '../snapshots/jsdocCommentToMember/tag-desc.json',
        import.meta.url
      )
    );
  });

  tests.add(
    '`jsdocCommentToMember` with tag desc, overriding description.',
    async () => {
      const code = `/**
 * Description A.
 * @desc Description B.
 * @kind member
 * @name A
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-desc-overriding-description.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag desc, overriding tag desc.',
    async () => {
      const code = `/**
 * @desc Description A.
 * @desc Description B.
 * @kind member
 * @name A
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-desc-overriding-tag-desc.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag desc, overriding tag description.',
    async () => {
      const code = `/**
 * @description Description A.
 * @desc Description B.
 * @kind member
 * @name A
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-desc-overriding-tag-description.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag description, missing description.',
    async () => {
      const code = `/**
 * @description
 * @kind member
 * @name A
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-description-missing-description.json',
          import.meta.url
        )
      );
    }
  );

  tests.add('`jsdocCommentToMember` with tag description.', async () => {
    const code = `/**
 * @description Description.
 * @kind member
 * @name A
 */`;
    const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
    const [jsdocComment] = await codeToJsdocComments(code, TEST_CODE_FILE_PATH);

    await snapshot(
      JSON.stringify(
        jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
        null,
        2
      ),
      new URL(
        '../snapshots/jsdocCommentToMember/tag-description.json',
        import.meta.url
      )
    );
  });

  tests.add(
    '`jsdocCommentToMember` with tag description, overriding description.',
    async () => {
      const code = `/**
 * Description A.
 * @description Description B.
 * @kind member
 * @name A
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-description-overriding-description.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag description, overriding tag desc.',
    async () => {
      const code = `/**
 * @desc Description A.
 * @description Description B.
 * @kind member
 * @name A
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-description-overriding-tag-desc.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag description, overriding tag description.',
    async () => {
      const code = `/**
 * @description Description A.
 * @description Description B.
 * @kind member
 * @name A
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-description-overriding-tag-description.json',
          import.meta.url
        )
      );
    }
  );

  tests.add('`jsdocCommentToMember` with tag kind, missing name.', async () => {
    const code = `/**
 * @kind member
 * @kind
 * @name A
 */`;
    const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
    const [jsdocComment] = await codeToJsdocComments(code, TEST_CODE_FILE_PATH);

    await snapshot(
      JSON.stringify(
        jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
        null,
        2
      ),
      new URL(
        '../snapshots/jsdocCommentToMember/tag-kind-missing-name.json',
        import.meta.url
      )
    );
  });

  tests.add('`jsdocCommentToMember` with tag kind.', async () => {
    const code = `/**
 * @kind member
 * @name A
 */`;
    const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
    const [jsdocComment] = await codeToJsdocComments(code, TEST_CODE_FILE_PATH);

    await snapshot(
      JSON.stringify(
        jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
        null,
        2
      ),
      new URL(
        '../snapshots/jsdocCommentToMember/tag-kind.json',
        import.meta.url
      )
    );
  });

  tests.add(
    '`jsdocCommentToMember` with tag kind, overriding tag kind.',
    async () => {
      const code = `/**
 * @kind function
 * @kind member
 * @name A
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-kind-overriding-tag-kind.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag kind, overriding tag typedef.',
    async () => {
      const code = `/**
 * @typedef A
 * @kind member
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-kind-overriding-tag-typedef.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag kind, overriding tag callback.',
    async () => {
      const code = `/**
 * @callback A
 * @kind member
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-kind-overriding-tag-callback.json',
          import.meta.url
        )
      );
    }
  );

  tests.add('`jsdocCommentToMember` with tag name, missing name.', async () => {
    const code = `/**
 * @kind member
 * @name A
 * @name
 */`;
    const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
    const [jsdocComment] = await codeToJsdocComments(code, TEST_CODE_FILE_PATH);

    await snapshot(
      JSON.stringify(
        jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
        null,
        2
      ),
      new URL(
        '../snapshots/jsdocCommentToMember/tag-name-missing-name.json',
        import.meta.url
      )
    );
  });

  tests.add('`jsdocCommentToMember` with tag name.', async () => {
    const code = `/**
 * @kind member
 * @name A
 */`;
    const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
    const [jsdocComment] = await codeToJsdocComments(code, TEST_CODE_FILE_PATH);

    await snapshot(
      JSON.stringify(
        jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
        null,
        2
      ),
      new URL(
        '../snapshots/jsdocCommentToMember/tag-name.json',
        import.meta.url
      )
    );
  });

  tests.add(
    '`jsdocCommentToMember` with tag name, overriding tag name.',
    async () => {
      const code = `/**
 * @kind member
 * @name A
 * @name B
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-name-overriding-tag-name.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag name, overriding tag typedef.',
    async () => {
      const code = `/**
 * @typedef A
 * @name B
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-name-overriding-tag-typedef.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag name, overriding tag callback.',
    async () => {
      const code = `/**
 * @callback A
 * @name B
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-name-overriding-tag-callback.json',
          import.meta.url
        )
      );
    }
  );

  tests.add('`jsdocCommentToMember` with tag type, missing type.', async () => {
    const code = `/**
 * @kind member
 * @name A
 * @type
 */`;
    const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
    const [jsdocComment] = await codeToJsdocComments(code, TEST_CODE_FILE_PATH);

    await snapshot(
      JSON.stringify(
        jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
        null,
        2
      ),
      new URL(
        '../snapshots/jsdocCommentToMember/tag-type-missing-type.json',
        import.meta.url
      )
    );
  });

  tests.add('`jsdocCommentToMember` with tag type.', async () => {
    const code = `/**
 * @kind member
 * @name A
 * @type {boolean}
 */`;
    const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
    const [jsdocComment] = await codeToJsdocComments(code, TEST_CODE_FILE_PATH);

    await snapshot(
      JSON.stringify(
        jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
        null,
        2
      ),
      new URL(
        '../snapshots/jsdocCommentToMember/tag-type.json',
        import.meta.url
      )
    );
  });

  tests.add(
    '`jsdocCommentToMember` with tag type, overriding tag type.',
    async () => {
      const code = `/**
 * @kind member
 * @name A
 * @type {string}
 * @type {boolean}
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-type-overriding-tag-type.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag type, overriding tag typedef.',
    async () => {
      const code = `/**
 * @typedef {string} A
 * @type {boolean}
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-type-overriding-tag-typedef.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag type, overriding tag callback.',
    async () => {
      const code = `/**
 * @callback A
 * @type {SpecialFunctionType}
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-type-overriding-tag-callback.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag typedef, missing name.',
    async () => {
      const code = `/**
 * @kind member
 * @name A
 * @typedef
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-typedef-missing-name.json',
          import.meta.url
        )
      );
    }
  );

  tests.add('`jsdocCommentToMember` with tag typedef, name.', async () => {
    const code = `/**
 * @typedef A
 */`;
    const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
    const [jsdocComment] = await codeToJsdocComments(code, TEST_CODE_FILE_PATH);

    await snapshot(
      JSON.stringify(
        jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
        null,
        2
      ),
      new URL(
        '../snapshots/jsdocCommentToMember/tag-typedef-name.json',
        import.meta.url
      )
    );
  });

  tests.add(
    '`jsdocCommentToMember` with tag typedef, type, name.',
    async () => {
      const code = `/**
 * @typedef {boolean} A
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-typedef-type-name.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag typedef, overriding tag kind.',
    async () => {
      const code = `/**
 * @kind member
 * @typedef A
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-typedef-overriding-tag-kind.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag typedef, overriding tag type.',
    async () => {
      const code = `/**
 * @type {string}
 * @typedef {boolean} A
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-typedef-overriding-tag-type.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag typedef, overriding tag name.',
    async () => {
      const code = `/**
 * @name A
 * @typedef B
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-typedef-overriding-tag-name.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag typedef, overriding tag typedef.',
    async () => {
      const code = `/**
 * @typedef {string} A
 * @typedef {boolean} B
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-typedef-overriding-tag-typedef.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag typedef, overriding tag callback.',
    async () => {
      const code = `/**
 * @callback A
 * @typedef {boolean} B
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-typedef-overriding-tag-callback.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag callback, missing name.',
    async () => {
      const code = `/**
 * @kind member
 * @name A
 * @callback
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-callback-missing-name.json',
          import.meta.url
        )
      );
    }
  );

  tests.add('`jsdocCommentToMember` with tag callback, name.', async () => {
    const code = `/**
 * @callback A
 */`;
    const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
    const [jsdocComment] = await codeToJsdocComments(code, TEST_CODE_FILE_PATH);

    await snapshot(
      JSON.stringify(
        jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
        null,
        2
      ),
      new URL(
        '../snapshots/jsdocCommentToMember/tag-callback-name.json',
        import.meta.url
      )
    );
  });

  tests.add(
    '`jsdocCommentToMember` with tag callback, overriding tag kind.',
    async () => {
      const code = `/**
 * @kind member
 * @callback A
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-callback-overriding-tag-kind.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag callback, overriding tag type.',
    async () => {
      const code = `/**
 * @type {boolean}
 * @callback A
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-callback-overriding-tag-type.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag callback, overriding tag name.',
    async () => {
      const code = `/**
 * @name A
 * @typedef B
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-callback-overriding-tag-name.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag callback, overriding tag typedef.',
    async () => {
      const code = `/**
 * @typedef {boolean} A
 * @callback B
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-callback-overriding-tag-typedef.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag callback, overriding tag callback.',
    async () => {
      const code = `/**
 * @callback A
 * @callback B
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-callback-overriding-tag-callback.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with an event without an `event:` name prefix.',
    async () => {
      const code = `/**
 * @kind event
 * @name A#b
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/event-without-name-prefix.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag param synonyms, missing name.',
    async () => {
      const code = `/**
 * @kind function
 * @name A
 * @arg
 * @argument
 * @param
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-param-synonyms-missing-name.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag param synonyms, name.',
    async () => {
      const code = `/**
 * @kind function
 * @name A
 * @arg a
 * @argument b
 * @param c
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-param-synonyms-name.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag param synonyms, type, name.',
    async () => {
      const code = `/**
 * @kind function
 * @name A
 * @arg {boolean} a
 * @argument {boolean} b
 * @param {boolean} c
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-param-synonyms-type-name.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag param synonyms, type (optional), name.',
    async () => {
      const code = `/**
 * @kind function
 * @name A
 * @arg {boolean} [a]
 * @argument {boolean} [b]
 * @param {boolean} [c]
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-param-synonyms-type-optional-name.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag param synonyms, type (optional, default), name.',
    async () => {
      const code = `/**
 * @kind function
 * @name A
 * @arg {boolean} [a=true]
 * @argument {boolean} [b=true]
 * @param {boolean} [c=true]
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-param-synonyms-type-optional-default-name.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag param synonyms, name, description.',
    async () => {
      const code = `/**
 * @kind function
 * @name A
 * @arg a Parameter description A.
 * @argument b Parameter description A.
 * @param c Parameter description A.
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-param-synonyms-name-description.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag param synonyms, type, name, description.',
    async () => {
      const code = `/**
 * @kind function
 * @name A
 * @arg {boolean} a Parameter description A.
 * @argument {boolean} b Parameter description A.
 * @param {boolean} c Parameter description A.
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-param-synonyms-type-name-description.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag param synonyms, type (optional), name, description.',
    async () => {
      const code = `/**
 * @kind function
 * @name A
 * @arg {boolean} [a] Parameter description A.
 * @argument {boolean} [b] Parameter description A.
 * @param {boolean} [c] Parameter description A.
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-param-synonyms-type-optional-name-description.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag param synonyms, type (optional, default), name, description.',
    async () => {
      const code = `/**
 * @kind function
 * @name A
 * @arg {boolean} [a=true] Parameter description A.
 * @argument {boolean} [b=true] Parameter description A.
 * @param {boolean} [c=true] Parameter description A.
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-param-synonyms-type-optional-default-name-description.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag prop synonyms, missing name.',
    async () => {
      const code = `/**
 * @kind member
 * @name A
 * @prop
 * @property
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-prop-synonyms-missing-name.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag prop synonyms, name.',
    async () => {
      const code = `/**
 * @kind member
 * @name A
 * @prop a
 * @property b
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-prop-synonyms-name.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag prop synonyms, type, name.',
    async () => {
      const code = `/**
 * @kind member
 * @name A
 * @prop {boolean} a
 * @property {boolean} b
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-prop-synonyms-type-name.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag prop synonyms, type (optional), name.',
    async () => {
      const code = `/**
 * @kind member
 * @name A
 * @prop {boolean} [a]
 * @property {boolean} [b]
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-prop-synonyms-type-optional-name.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag prop synonyms, type (optional, default), name.',
    async () => {
      const code = `/**
 * @kind member
 * @name A
 * @prop {boolean} [a=true]
 * @property {boolean} [b=true]
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-prop-synonyms-type-optional-default-name.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag prop synonyms, name, description.',
    async () => {
      const code = `/**
 * @kind member
 * @name A
 * @prop a Property description A.
 * @property b Property description B.
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-prop-synonyms-name-description.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag prop synonyms, type, name, description.',
    async () => {
      const code = `/**
 * @kind member
 * @name A
 * @prop {boolean} a Property description A.
 * @property {boolean} b Property description B.
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-prop-synonyms-type-name-description.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag prop synonyms, type (optional), name, description.',
    async () => {
      const code = `/**
 * @kind member
 * @name A
 * @prop {boolean} [a] Property description A.
 * @property {boolean} [b] Property description B.
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-prop-synonyms-type-optional-name-description.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag prop synonyms, type (optional, default), name, description.',
    async () => {
      const code = `/**
 * @kind member
 * @name A
 * @prop {boolean} [a=true] Property description A.
 * @property {boolean} [b=true] Property description B.
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-prop-synonyms-type-optional-default-name-description.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag return, missing type or description.',
    async () => {
      const code = `/**
 * @kind function
 * @name A
 * @return
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-return-missing-type-or-description.json',
          import.meta.url
        )
      );
    }
  );

  tests.add('`jsdocCommentToMember` with tag return, type.', async () => {
    const code = `/**
 * @kind function
 * @name A
 * @return {boolean}
 */`;
    const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
    const [jsdocComment] = await codeToJsdocComments(code, TEST_CODE_FILE_PATH);

    await snapshot(
      JSON.stringify(
        jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
        null,
        2
      ),
      new URL(
        '../snapshots/jsdocCommentToMember/tag-return-type.json',
        import.meta.url
      )
    );
  });

  tests.add(
    '`jsdocCommentToMember` with tag return, type, overriding tag returns.',
    async () => {
      const code = `/**
 * @kind function
 * @name A
 * @returns {string} Description.
 * @return {boolean}
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-return-type-overriding-tag-returns.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag return, description.',
    async () => {
      const code = `/**
 * @kind function
 * @name A
 * @return Description.
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-return-description.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag return, description, overriding tag returns.',
    async () => {
      const code = `/**
 * @kind function
 * @name A
 * @returns {boolean} Description A.
 * @return Description B.
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-return-description-overriding-tag-returns.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag return, type, description.',
    async () => {
      const code = `/**
 * @kind function
 * @name A
 * @return {boolean} Description.
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-return-type-description.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag return, type, description, overriding tag return.',
    async () => {
      const code = `/**
 * @kind function
 * @name A
 * @return {string} Description A.
 * @return {boolean} Description B.
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-return-type-description-overriding-tag-return.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag return, type, description, overriding tag returns.',
    async () => {
      const code = `/**
 * @kind function
 * @name A
 * @returns {string} Description A.
 * @return {boolean} Description B.
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-return-type-description-overriding-tag-returns.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag returns, missing type or description.',
    async () => {
      const code = `/**
 * @kind function
 * @name A
 * @returns
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-returns-missing-type-or-description.json',
          import.meta.url
        )
      );
    }
  );

  tests.add('`jsdocCommentToMember` with tag returns, type.', async () => {
    const code = `/**
 * @kind function
 * @name A
 * @returns {boolean}
 */`;
    const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
    const [jsdocComment] = await codeToJsdocComments(code, TEST_CODE_FILE_PATH);

    await snapshot(
      JSON.stringify(
        jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
        null,
        2
      ),
      new URL(
        '../snapshots/jsdocCommentToMember/tag-returns-type.json',
        import.meta.url
      )
    );
  });

  tests.add(
    '`jsdocCommentToMember` with tag returns, type, overriding tag return.',
    async () => {
      const code = `/**
 * @kind function
 * @name A
 * @return {string} Description.
 * @returns {boolean}
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-returns-type-overriding-tag-return.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag returns, type, overriding tag returns.',
    async () => {
      const code = `/**
 * @kind function
 * @name A
 * @returns {string} Description.
 * @returns {boolean}
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-returns-type-overriding-tag-returns.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag returns, description.',
    async () => {
      const code = `/**
 * @kind function
 * @name A
 * @returns Description.
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-returns-description.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag returns, description, overriding tag return.',
    async () => {
      const code = `/**
 * @kind function
 * @name A
 * @return {boolean} Description A.
 * @returns Description B.
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-returns-description-overriding-tag-return.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag returns, type, description.',
    async () => {
      const code = `/**
 * @kind function
 * @name A
 * @returns {boolean} Description.
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-returns-type-description.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag returns, type, description, overriding tag return.',
    async () => {
      const code = `/**
 * @kind function
 * @name A
 * @return {string} Description A.
 * @returns {boolean} Description B.
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-returns-type-description-overriding-tag-return.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag returns, type, description, overriding tag returns.',
    async () => {
      const code = `/**
 * @kind function
 * @name A
 * @returns {string} Description A.
 * @returns {boolean} Description B.
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-returns-type-description-overriding-tag-returns.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag fires synonyms, missing names.',
    async () => {
      const code = `/**
 * @kind class
 * @name A
 * @emits
 * @fires
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-fires-synonyms-missing-names.json',
          import.meta.url
        )
      );
    }
  );

  tests.add('`jsdocCommentToMember` with tag fires synonyms.', async () => {
    const code = `/**
 * @kind class
 * @name A
 * @emits A#event:a
 * @fires A#event:b
 */`;
    const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
    const [jsdocComment] = await codeToJsdocComments(code, TEST_CODE_FILE_PATH);

    await snapshot(
      JSON.stringify(
        jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
        null,
        2
      ),
      new URL(
        '../snapshots/jsdocCommentToMember/tag-fires-synonyms.json',
        import.meta.url
      )
    );
  });

  tests.add(
    '`jsdocCommentToMember` with tag fires synonyms, duplicate names.',
    async () => {
      const code = `/**
 * @kind class
 * @name A
 * @emits A#event:a
 * @emits A#event:a
 * @fires A#event:b
 * @fires A#event:b
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-fires-synonyms-duplicate-names.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag see, missing description.',
    async () => {
      const code = `/**
 * @kind member
 * @name A
 * @see
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-see-missing-description.json',
          import.meta.url
        )
      );
    }
  );

  tests.add('`jsdocCommentToMember` with tag see.', async () => {
    const code = `/**
 * @kind member
 * @name A
 * @see See description A.
 * @see See description B.
 */`;
    const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
    const [jsdocComment] = await codeToJsdocComments(code, TEST_CODE_FILE_PATH);

    await snapshot(
      JSON.stringify(
        jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
        null,
        2
      ),
      new URL('../snapshots/jsdocCommentToMember/tag-see.json', import.meta.url)
    );
  });

  tests.add(
    '`jsdocCommentToMember` with tag example, no caption, no content.',
    async () => {
      const code = `/**
 * @kind member
 * @name A
 * @example
 * @example
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-example-no-caption-no-content.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag example, no caption, newline, content.',
    async () => {
      const code = `/**
 * @kind member
 * @name A
 * @example
 * Example A
 * content.
 * @example
 * Example B
 * content.
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-example-no-caption-newline-content.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag example, no caption, multiple newlines, content.',
    async () => {
      const code = `/**
 * @kind member
 * @name A
 * @example
 *
 * Example A
 * content.
 * @example
 *
 * Example B
 * content.
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-example-no-caption-multiple-newlines-content.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag example, no caption, space, content.',
    async () => {
      const code = `/**
 * @kind member
 * @name A
 * @example Example A
 * content.
 * @example Example B
 * content.
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-example-no-caption-space-content.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag example, no caption, spaces and tabs, content.',
    async () => {
      const code = `/**
 * @kind member
 * @name A
 * @example  		Example A
 * content.
 * @example  		Example B
 * content.
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-example-no-caption-spaces-and-tabs-content.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag example, caption empty, no content.',
    async () => {
      const code = `/**
 * @kind member
 * @name A
 * @example <caption></caption>
 * @example <caption></caption>
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-example-caption-empty-no-content.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag example, caption empty, content extra caption close syntax.',
    async () => {
      const code = `/**
 * @kind member
 * @name A
 * @example <caption></caption></caption>
 * @example <caption></caption></caption>
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-example-caption-empty-content-extra-caption-close-syntax.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag example, caption populated, no content.',
    async () => {
      const code = `/**
 * @kind member
 * @name A
 * @example <caption>Example A
 * caption.</caption>
 * @example <caption>Example B
 * caption.</caption>
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-example-caption-populated-no-content.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag example, caption populated, content.',
    async () => {
      const code = `/**
 * @kind member
 * @name A
 * @example <caption>Example A
 * caption.</caption>Example A
 * content.
 * @example <caption>Example B
 * caption.</caption>Example B
 * content.
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-example-caption-populated-content.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag example, caption populated, newline, content.',
    async () => {
      const code = `/**
 * @kind member
 * @name A
 * @example <caption>Example A
 * caption.</caption>
 * Example A
 * content.
 * @example <caption>Example B
 * caption.</caption>
 * Example B
 * content.
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-example-caption-populated-newline-content.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag example, caption populated, multiple newlines, content.',
    async () => {
      const code = `/**
 * @kind member
 * @name A
 * @example <caption>Example A
 * caption.</caption>
 *
 * Example A
 * content.
 * @example <caption>Example B
 * caption.</caption>
 *
 * Example B
 * content.
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-example-caption-populated-multiple-newlines-content.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag example, caption populated, space, content.',
    async () => {
      const code = `/**
 * @kind member
 * @name A
 * @example <caption>Example A
 * caption.</caption> Example A
 * content.
 * @example <caption>Example B
 * caption.</caption> Example B
 * content.
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-example-caption-populated-space-content.json',
          import.meta.url
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag example, caption populated, spaces and tabs, content.',
    async () => {
      const code = `/**
 * @kind member
 * @name A
 * @example <caption>Example A
 * caption.</caption>  		Example A
 * content.
 * @example <caption>Example B
 * caption.</caption>  		Example B
 * content.
 */`;
      const codeFiles = new Map([[TEST_CODE_FILE_PATH, code]]);
      const [jsdocComment] = await codeToJsdocComments(
        code,
        TEST_CODE_FILE_PATH
      );

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, codeFiles, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        new URL(
          '../snapshots/jsdocCommentToMember/tag-example-caption-populated-spaces-and-tabs-content.json',
          import.meta.url
        )
      );
    }
  );
};
