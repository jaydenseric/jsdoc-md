'use strict';

const { strictEqual, throws } = require('assert');
const { resolve } = require('path');
const snapshot = require('snapshot-assertion');
const codeToJsdocComments = require('../../private/codeToJsdocComments');
const jsdocCommentToMember = require('../../private/jsdocCommentToMember');

const TEST_CODE_FILE_PATH = '/a.js';

module.exports = (tests) => {
  tests.add(
    '`jsdocCommentToMember` with first `jsdocComment` argument invalid.',
    () => {
      throws(() => {
        jsdocCommentToMember(true, '', TEST_CODE_FILE_PATH);
      }, new TypeError('First argument “jsdocComment” must be an object.'));
    }
  );

  tests.add(
    '`jsdocCommentToMember` with second `code` argument invalid.',
    () => {
      const code = '/** */';
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      throws(() => {
        jsdocCommentToMember(jsdocComment, true, TEST_CODE_FILE_PATH);
      }, new TypeError('Second argument “code” must be a string.'));
    }
  );

  tests.add(
    '`jsdocCommentToMember` with third `codeFilePath` argument invalid.',
    () => {
      const code = '/** */';
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      throws(() => {
        jsdocCommentToMember(jsdocComment, code, true);
      }, new TypeError('Third argument “codeFilePath” must be a string.'));
    }
  );

  tests.add('`jsdocCommentToMember` with a JSDoc syntax error.', () => {
    const code = '/** @tag [name */';
    const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);
    strictEqual(
      jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
      undefined
    );
  });

  tests.add('`jsdocCommentToMember` with no description, no tags.', () => {
    const code = '/** */';
    const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);
    strictEqual(
      jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
      undefined
    );
  });

  tests.add('`jsdocCommentToMember` with description, no tags.', () => {
    const code = '/** Description. */';
    const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);
    strictEqual(
      jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
      undefined
    );
  });

  tests.add('`jsdocCommentToMember` with a missing kind.', () => {
    const code = '/** @name A */';
    const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);
    strictEqual(
      jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
      undefined
    );
  });

  tests.add('`jsdocCommentToMember` with a missing name.', () => {
    const code = '/** @kind member */';
    const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);
    strictEqual(
      jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
      undefined
    );
  });

  tests.add('`jsdocCommentToMember` with tag ignore.', () => {
    const code = '/** @ignore */';
    const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);
    strictEqual(
      jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
      undefined
    );
  });

  tests.add('`jsdocCommentToMember` with an invalid namepath.', async () => {
    const code = `// Code before…
const a = true;

/**
 * @kind member
 * @name .
 */
const b = true;

// Code after…`;
    const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

    let caughtError;

    try {
      jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH);
    } catch (error) {
      caughtError = error;
    }

    strictEqual(caughtError instanceof SyntaxError, true);

    await snapshot(
      caughtError.message,
      resolve(
        __dirname,
        '../snapshots/jsdocCommentToMember/error-invalid-namepath.txt'
      )
    );
  });

  tests.add('`jsdocCommentToMember` with description.', async () => {
    const code = `/**
 * Description.
 * @kind member
 * @name A
 */`;
    const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

    await snapshot(
      JSON.stringify(
        jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
        null,
        2
      ),
      resolve(__dirname, '../snapshots/jsdocCommentToMember/description.json')
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-desc-missing-description.json'
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
    const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

    await snapshot(
      JSON.stringify(
        jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
        null,
        2
      ),
      resolve(__dirname, '../snapshots/jsdocCommentToMember/tag-desc.json')
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-desc-overriding-description.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-desc-overriding-tag-desc.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-desc-overriding-tag-description.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-description-missing-description.json'
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
    const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

    await snapshot(
      JSON.stringify(
        jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
        null,
        2
      ),
      resolve(
        __dirname,
        '../snapshots/jsdocCommentToMember/tag-description.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-description-overriding-description.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-description-overriding-tag-desc.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-description-overriding-tag-description.json'
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
    const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

    await snapshot(
      JSON.stringify(
        jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
        null,
        2
      ),
      resolve(
        __dirname,
        '../snapshots/jsdocCommentToMember/tag-kind-missing-name.json'
      )
    );
  });

  tests.add('`jsdocCommentToMember` with tag kind.', async () => {
    const code = `/**
 * @kind member
 * @name A
 */`;
    const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

    await snapshot(
      JSON.stringify(
        jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
        null,
        2
      ),
      resolve(__dirname, '../snapshots/jsdocCommentToMember/tag-kind.json')
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-kind-overriding-tag-kind.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-kind-overriding-tag-typedef.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-kind-overriding-tag-callback.json'
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
    const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

    await snapshot(
      JSON.stringify(
        jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
        null,
        2
      ),
      resolve(
        __dirname,
        '../snapshots/jsdocCommentToMember/tag-name-missing-name.json'
      )
    );
  });

  tests.add('`jsdocCommentToMember` with tag name.', async () => {
    const code = `/**
 * @kind member
 * @name A
 */`;
    const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

    await snapshot(
      JSON.stringify(
        jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
        null,
        2
      ),
      resolve(__dirname, '../snapshots/jsdocCommentToMember/tag-name.json')
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-name-overriding-tag-name.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-name-overriding-tag-typedef.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-name-overriding-tag-callback.json'
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
    const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

    await snapshot(
      JSON.stringify(
        jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
        null,
        2
      ),
      resolve(
        __dirname,
        '../snapshots/jsdocCommentToMember/tag-type-missing-type.json'
      )
    );
  });

  tests.add('`jsdocCommentToMember` with tag type.', async () => {
    const code = `/**
 * @kind member
 * @name A
 * @type {boolean}
 */`;
    const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

    await snapshot(
      JSON.stringify(
        jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
        null,
        2
      ),
      resolve(__dirname, '../snapshots/jsdocCommentToMember/tag-type.json')
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-type-overriding-tag-type.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-type-overriding-tag-typedef.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-type-overriding-tag-callback.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-typedef-missing-name.json'
        )
      );
    }
  );

  tests.add('`jsdocCommentToMember` with tag typedef, name.', async () => {
    const code = `/**
 * @typedef A
 */`;
    const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

    await snapshot(
      JSON.stringify(
        jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
        null,
        2
      ),
      resolve(
        __dirname,
        '../snapshots/jsdocCommentToMember/tag-typedef-name.json'
      )
    );
  });

  tests.add(
    '`jsdocCommentToMember` with tag typedef, type, name.',
    async () => {
      const code = `/**
 * @typedef {boolean} A
 */`;
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-typedef-type-name.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-typedef-overriding-tag-kind.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-typedef-overriding-tag-type.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-typedef-overriding-tag-name.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-typedef-overriding-tag-typedef.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-typedef-overriding-tag-callback.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-callback-missing-name.json'
        )
      );
    }
  );

  tests.add('`jsdocCommentToMember` with tag callback, name.', async () => {
    const code = `/**
 * @callback A
 */`;
    const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

    await snapshot(
      JSON.stringify(
        jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
        null,
        2
      ),
      resolve(
        __dirname,
        '../snapshots/jsdocCommentToMember/tag-callback-name.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-callback-overriding-tag-kind.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-callback-overriding-tag-type.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-callback-overriding-tag-name.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-callback-overriding-tag-typedef.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-callback-overriding-tag-callback.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-param-synonyms-missing-name.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-param-synonyms-name.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-param-synonyms-type-name.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-param-synonyms-type-optional-name.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-param-synonyms-type-optional-default-name.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-param-synonyms-name-description.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-param-synonyms-type-name-description.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-param-synonyms-type-optional-name-description.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-param-synonyms-type-optional-default-name-description.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-prop-synonyms-missing-name.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-prop-synonyms-name.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-prop-synonyms-type-name.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-prop-synonyms-type-optional-name.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-prop-synonyms-type-optional-default-name.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-prop-synonyms-name-description.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-prop-synonyms-type-name-description.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-prop-synonyms-type-optional-name-description.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-prop-synonyms-type-optional-default-name-description.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-return-missing-type-or-description.json'
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
    const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

    await snapshot(
      JSON.stringify(
        jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
        null,
        2
      ),
      resolve(
        __dirname,
        '../snapshots/jsdocCommentToMember/tag-return-type.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-return-type-overriding-tag-returns.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-return-description.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-return-description-overriding-tag-returns.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-return-type-description.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-return-type-description-overriding-tag-return.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-return-type-description-overriding-tag-returns.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-returns-missing-type-or-description.json'
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
    const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

    await snapshot(
      JSON.stringify(
        jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
        null,
        2
      ),
      resolve(
        __dirname,
        '../snapshots/jsdocCommentToMember/tag-returns-type.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-returns-type-overriding-tag-return.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-returns-type-overriding-tag-returns.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-returns-description.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-returns-description-overriding-tag-return.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-returns-type-description.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-returns-type-description-overriding-tag-return.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-returns-type-description-overriding-tag-returns.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-fires-synonyms-missing-names.json'
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
    const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

    await snapshot(
      JSON.stringify(
        jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
        null,
        2
      ),
      resolve(
        __dirname,
        '../snapshots/jsdocCommentToMember/tag-fires-synonyms.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-fires-synonyms-duplicate-names.json'
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-see-missing-description.json'
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
    const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

    await snapshot(
      JSON.stringify(
        jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
        null,
        2
      ),
      resolve(__dirname, '../snapshots/jsdocCommentToMember/tag-see.json')
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
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-example-no-caption-no-content.json'
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag example, caption, no content.',
    async () => {
      const code = `/**
 * @kind member
 * @name A
 * @example <caption>Example A caption.</caption>
 * @example <caption>Example B caption.</caption>
 */`;
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-example-caption-no-content.json'
        )
      );
    }
  );

  tests.add(
    '`jsdocCommentToMember` with tag example, caption, content.',
    async () => {
      const code = `/**
 * @kind member
 * @name A
 * @example <caption>Example A caption.</caption>
 * Example A content.
 * @example <caption>Example B caption.</caption>
 * Example B content.
 */`;
      const [jsdocComment] = codeToJsdocComments(code, TEST_CODE_FILE_PATH);

      await snapshot(
        JSON.stringify(
          jsdocCommentToMember(jsdocComment, code, TEST_CODE_FILE_PATH),
          null,
          2
        ),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-example-caption-content.json'
        )
      );
    }
  );
};
