'use strict';

const { strictEqual } = require('assert');
const { resolve } = require('path');
const snapshot = require('snapshot-assertion');
const codeToJsdocComments = require('../../private/codeToJsdocComments');
const jsdocCommentToMember = require('../../private/jsdocCommentToMember');

module.exports = (tests) => {
  tests.add('`jsdocCommentToMember` with a JSDoc syntax error.', () => {
    const [jsdocComment] = codeToJsdocComments('/** @tag [name */');
    strictEqual(jsdocCommentToMember(jsdocComment), undefined);
  });

  tests.add('`jsdocCommentToMember` with no description, no tags.', () => {
    const [jsdocComment] = codeToJsdocComments('/** */');
    strictEqual(jsdocCommentToMember(jsdocComment), undefined);
  });

  tests.add('`jsdocCommentToMember` with description, no tags.', () => {
    const [jsdocComment] = codeToJsdocComments('/** Description. */');
    strictEqual(jsdocCommentToMember(jsdocComment), undefined);
  });

  tests.add('`jsdocCommentToMember` with a missing kind.', () => {
    const [jsdocComment] = codeToJsdocComments('/** @name A */');
    strictEqual(jsdocCommentToMember(jsdocComment), undefined);
  });

  tests.add('`jsdocCommentToMember` with a missing name.', () => {
    const [jsdocComment] = codeToJsdocComments('/** @kind member */');
    strictEqual(jsdocCommentToMember(jsdocComment), undefined);
  });

  tests.add('`jsdocCommentToMember` with tag ignore.', () => {
    const [jsdocComment] = codeToJsdocComments('/** @ignore */');
    strictEqual(jsdocCommentToMember(jsdocComment), undefined);
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
    const [jsdocComment] = codeToJsdocComments(code);

    let caughtError;

    try {
      jsdocCommentToMember(jsdocComment, code, '/a.js');
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
    const [jsdocComment] = codeToJsdocComments(`/**
 * Description.
 * @kind member
 * @name A
 */`);

    await snapshot(
      JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
      resolve(__dirname, '../snapshots/jsdocCommentToMember/description.json')
    );
  });

  tests.add(
    '`jsdocCommentToMember` with tag desc, missing description.',
    async () => {
      const [jsdocComment] = codeToJsdocComments(`/**
 * @desc
 * @kind member
 * @name A
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-desc-missing-description.json'
        )
      );
    }
  );

  tests.add('`jsdocCommentToMember` with tag desc.', async () => {
    const [jsdocComment] = codeToJsdocComments(`/**
 * @desc Description.
 * @kind member
 * @name A
 */`);

    await snapshot(
      JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
      resolve(__dirname, '../snapshots/jsdocCommentToMember/tag-desc.json')
    );
  });

  tests.add(
    '`jsdocCommentToMember` with tag desc, overriding description.',
    async () => {
      const [jsdocComment] = codeToJsdocComments(`/**
 * Description A.
 * @desc Description B.
 * @kind member
 * @name A
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @desc Description A.
 * @desc Description B.
 * @kind member
 * @name A
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @description Description A.
 * @desc Description B.
 * @kind member
 * @name A
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @description
 * @kind member
 * @name A
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-description-missing-description.json'
        )
      );
    }
  );

  tests.add('`jsdocCommentToMember` with tag description.', async () => {
    const [jsdocComment] = codeToJsdocComments(`/**
 * @description Description.
 * @kind member
 * @name A
 */`);

    await snapshot(
      JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
      resolve(
        __dirname,
        '../snapshots/jsdocCommentToMember/tag-description.json'
      )
    );
  });

  tests.add(
    '`jsdocCommentToMember` with tag description, overriding description.',
    async () => {
      const [jsdocComment] = codeToJsdocComments(`/**
 * Description A.
 * @description Description B.
 * @kind member
 * @name A
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @desc Description A.
 * @description Description B.
 * @kind member
 * @name A
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @description Description A.
 * @description Description B.
 * @kind member
 * @name A
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-description-overriding-tag-description.json'
        )
      );
    }
  );

  tests.add('`jsdocCommentToMember` with tag kind, missing name.', async () => {
    const [jsdocComment] = codeToJsdocComments(`/**
 * @kind member
 * @kind
 * @name A
 */`);

    await snapshot(
      JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
      resolve(
        __dirname,
        '../snapshots/jsdocCommentToMember/tag-kind-missing-name.json'
      )
    );
  });

  tests.add('`jsdocCommentToMember` with tag kind.', async () => {
    const [jsdocComment] = codeToJsdocComments(`/**
 * @kind member
 * @name A
 */`);

    await snapshot(
      JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
      resolve(__dirname, '../snapshots/jsdocCommentToMember/tag-kind.json')
    );
  });

  tests.add(
    '`jsdocCommentToMember` with tag kind, overriding tag kind.',
    async () => {
      const [jsdocComment] = codeToJsdocComments(`/**
 * @kind function
 * @kind member
 * @name A
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @typedef A
 * @kind member
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @callback A
 * @kind member
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-kind-overriding-tag-callback.json'
        )
      );
    }
  );

  tests.add('`jsdocCommentToMember` with tag name, missing name.', async () => {
    const [jsdocComment] = codeToJsdocComments(`/**
 * @kind member
 * @name A
 * @name
 */`);

    await snapshot(
      JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
      resolve(
        __dirname,
        '../snapshots/jsdocCommentToMember/tag-name-missing-name.json'
      )
    );
  });

  tests.add('`jsdocCommentToMember` with tag name.', async () => {
    const [jsdocComment] = codeToJsdocComments(`/**
 * @kind member
 * @name A
 */`);

    await snapshot(
      JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
      resolve(__dirname, '../snapshots/jsdocCommentToMember/tag-name.json')
    );
  });

  tests.add(
    '`jsdocCommentToMember` with tag name, overriding tag name.',
    async () => {
      const [jsdocComment] = codeToJsdocComments(`/**
 * @kind member
 * @name A
 * @name B
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @typedef A
 * @name B
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @callback A
 * @name B
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-name-overriding-tag-callback.json'
        )
      );
    }
  );

  tests.add('`jsdocCommentToMember` with tag type, missing type.', async () => {
    const [jsdocComment] = codeToJsdocComments(`/**
 * @kind member
 * @name A
 * @type
 */`);

    await snapshot(
      JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
      resolve(
        __dirname,
        '../snapshots/jsdocCommentToMember/tag-type-missing-type.json'
      )
    );
  });

  tests.add('`jsdocCommentToMember` with tag type.', async () => {
    const [jsdocComment] = codeToJsdocComments(`/**
 * @kind member
 * @name A
 * @type {boolean}
 */`);

    await snapshot(
      JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
      resolve(__dirname, '../snapshots/jsdocCommentToMember/tag-type.json')
    );
  });

  tests.add(
    '`jsdocCommentToMember` with tag type, overriding tag type.',
    async () => {
      const [jsdocComment] = codeToJsdocComments(`/**
 * @kind member
 * @name A
 * @type {string}
 * @type {boolean}
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @typedef {string} A
 * @type {boolean}
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @callback A
 * @type {SpecialFunctionType}
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @kind member
 * @name A
 * @typedef
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-typedef-missing-name.json'
        )
      );
    }
  );

  tests.add('`jsdocCommentToMember` with tag typedef, name.', async () => {
    const [jsdocComment] = codeToJsdocComments(`/**
 * @typedef A
 */`);

    await snapshot(
      JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
      resolve(
        __dirname,
        '../snapshots/jsdocCommentToMember/tag-typedef-name.json'
      )
    );
  });

  tests.add(
    '`jsdocCommentToMember` with tag typedef, type, name.',
    async () => {
      const [jsdocComment] = codeToJsdocComments(`/**
 * @typedef {boolean} A
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @kind member
 * @typedef A
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @type {string}
 * @typedef {boolean} A
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @name A
 * @typedef B
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @typedef {string} A
 * @typedef {boolean} B
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @callback A
 * @typedef {boolean} B
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @kind member
 * @name A
 * @callback
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-callback-missing-name.json'
        )
      );
    }
  );

  tests.add('`jsdocCommentToMember` with tag callback, name.', async () => {
    const [jsdocComment] = codeToJsdocComments(`/**
 * @callback A
 */`);

    await snapshot(
      JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
      resolve(
        __dirname,
        '../snapshots/jsdocCommentToMember/tag-callback-name.json'
      )
    );
  });

  tests.add(
    '`jsdocCommentToMember` with tag callback, overriding tag kind.',
    async () => {
      const [jsdocComment] = codeToJsdocComments(`/**
 * @kind member
 * @callback A
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @type {boolean}
 * @callback A
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @name A
 * @typedef B
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @typedef {boolean} A
 * @callback B
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @callback A
 * @callback B
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @kind event
 * @name A#b
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @kind function
 * @name A
 * @arg
 * @argument
 * @param
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @kind function
 * @name A
 * @arg a
 * @argument b
 * @param c
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @kind function
 * @name A
 * @arg {boolean} a
 * @argument {boolean} b
 * @param {boolean} c
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @kind function
 * @name A
 * @arg {boolean} [a]
 * @argument {boolean} [b]
 * @param {boolean} [c]
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @kind function
 * @name A
 * @arg {boolean} [a=true]
 * @argument {boolean} [b=true]
 * @param {boolean} [c=true]
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @kind function
 * @name A
 * @arg a Parameter description A.
 * @argument b Parameter description A.
 * @param c Parameter description A.
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @kind function
 * @name A
 * @arg {boolean} a Parameter description A.
 * @argument {boolean} b Parameter description A.
 * @param {boolean} c Parameter description A.
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @kind function
 * @name A
 * @arg {boolean} [a] Parameter description A.
 * @argument {boolean} [b] Parameter description A.
 * @param {boolean} [c] Parameter description A.
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @kind function
 * @name A
 * @arg {boolean} [a=true] Parameter description A.
 * @argument {boolean} [b=true] Parameter description A.
 * @param {boolean} [c=true] Parameter description A.
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @kind member
 * @name A
 * @prop
 * @property
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @kind member
 * @name A
 * @prop a
 * @property b
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @kind member
 * @name A
 * @prop {boolean} a
 * @property {boolean} b
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @kind member
 * @name A
 * @prop {boolean} [a]
 * @property {boolean} [b]
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @kind member
 * @name A
 * @prop {boolean} [a=true]
 * @property {boolean} [b=true]
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @kind member
 * @name A
 * @prop a Property description A.
 * @property b Property description B.
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @kind member
 * @name A
 * @prop {boolean} a Property description A.
 * @property {boolean} b Property description B.
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @kind member
 * @name A
 * @prop {boolean} [a] Property description A.
 * @property {boolean} [b] Property description B.
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @kind member
 * @name A
 * @prop {boolean} [a=true] Property description A.
 * @property {boolean} [b=true] Property description B.
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @kind function
 * @name A
 * @return
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-return-missing-type-or-description.json'
        )
      );
    }
  );

  tests.add('`jsdocCommentToMember` with tag return, type.', async () => {
    const [jsdocComment] = codeToJsdocComments(`/**
 * @kind function
 * @name A
 * @return {boolean}
 */`);

    await snapshot(
      JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
      resolve(
        __dirname,
        '../snapshots/jsdocCommentToMember/tag-return-type.json'
      )
    );
  });

  tests.add(
    '`jsdocCommentToMember` with tag return, type, overriding tag returns.',
    async () => {
      const [jsdocComment] = codeToJsdocComments(`/**
 * @kind function
 * @name A
 * @returns {string} Description.
 * @return {boolean}
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @kind function
 * @name A
 * @return Description.
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @kind function
 * @name A
 * @returns {boolean} Description A.
 * @return Description B.
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @kind function
 * @name A
 * @return {boolean} Description.
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @kind function
 * @name A
 * @return {string} Description A.
 * @return {boolean} Description B.
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @kind function
 * @name A
 * @returns {string} Description A.
 * @return {boolean} Description B.
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @kind function
 * @name A
 * @returns
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-returns-missing-type-or-description.json'
        )
      );
    }
  );

  tests.add('`jsdocCommentToMember` with tag returns, type.', async () => {
    const [jsdocComment] = codeToJsdocComments(`/**
 * @kind function
 * @name A
 * @returns {boolean}
 */`);

    await snapshot(
      JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
      resolve(
        __dirname,
        '../snapshots/jsdocCommentToMember/tag-returns-type.json'
      )
    );
  });

  tests.add(
    '`jsdocCommentToMember` with tag returns, type, overriding tag return.',
    async () => {
      const [jsdocComment] = codeToJsdocComments(`/**
 * @kind function
 * @name A
 * @return {string} Description.
 * @returns {boolean}
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @kind function
 * @name A
 * @returns {string} Description.
 * @returns {boolean}
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @kind function
 * @name A
 * @returns Description.
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @kind function
 * @name A
 * @return {boolean} Description A.
 * @returns Description B.
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @kind function
 * @name A
 * @returns {boolean} Description.
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @kind function
 * @name A
 * @return {string} Description A.
 * @returns {boolean} Description B.
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @kind function
 * @name A
 * @returns {string} Description A.
 * @returns {boolean} Description B.
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @kind class
 * @name A
 * @emits
 * @fires
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-fires-synonyms-missing-names.json'
        )
      );
    }
  );

  tests.add('`jsdocCommentToMember` with tag fires synonyms.', async () => {
    const [jsdocComment] = codeToJsdocComments(`/**
 * @kind class
 * @name A
 * @emits A#event:a
 * @fires A#event:b
 */`);

    await snapshot(
      JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
      resolve(
        __dirname,
        '../snapshots/jsdocCommentToMember/tag-fires-synonyms.json'
      )
    );
  });

  tests.add(
    '`jsdocCommentToMember` with tag fires synonyms, duplicate names.',
    async () => {
      const [jsdocComment] = codeToJsdocComments(`/**
 * @kind class
 * @name A
 * @emits A#event:a
 * @emits A#event:a
 * @fires A#event:b
 * @fires A#event:b
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @kind member
 * @name A
 * @see
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-see-missing-description.json'
        )
      );
    }
  );

  tests.add('`jsdocCommentToMember` with tag see.', async () => {
    const [jsdocComment] = codeToJsdocComments(`/**
 * @kind member
 * @name A
 * @see See description A.
 * @see See description B.
 */`);

    await snapshot(
      JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
      resolve(__dirname, '../snapshots/jsdocCommentToMember/tag-see.json')
    );
  });

  tests.add(
    '`jsdocCommentToMember` with tag example, no caption, no content.',
    async () => {
      const [jsdocComment] = codeToJsdocComments(`/**
 * @kind member
 * @name A
 * @example
 * @example
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @kind member
 * @name A
 * @example <caption>Example A caption.</caption>
 * @example <caption>Example B caption.</caption>
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
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
      const [jsdocComment] = codeToJsdocComments(`/**
 * @kind member
 * @name A
 * @example <caption>Example A caption.</caption>
 * Example A content.
 * @example <caption>Example B caption.</caption>
 * Example B content.
 */`);

      await snapshot(
        JSON.stringify(jsdocCommentToMember(jsdocComment), null, 2),
        resolve(
          __dirname,
          '../snapshots/jsdocCommentToMember/tag-example-caption-content.json'
        )
      );
    }
  );
};
