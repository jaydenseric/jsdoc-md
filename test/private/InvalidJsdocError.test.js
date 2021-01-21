'use strict';

const { strictEqual, throws } = require('assert');
const { resolve } = require('path');
const kleur = require('kleur');
const revertableGlobals = require('revertable-globals');
const snapshot = require('snapshot-assertion');
const CliError = require('../../private/CliError');
const CodeLocation = require('../../private/CodeLocation');
const CodePosition = require('../../private/CodePosition');
const InvalidJsdocError = require('../../private/InvalidJsdocError');

module.exports = (tests) => {
  tests.add(
    '`InvalidJsdocError` with first argument `message` not a string.',
    () => {
      throws(() => {
        new InvalidJsdocError(true);
      }, new TypeError('First argument `message` must be a string.'));
    }
  );

  tests.add(
    '`InvalidJsdocError` with second argument `codeFileLocation` not an object.',
    () => {
      throws(() => {
        new InvalidJsdocError('a', true);
      }, new TypeError('Second argument `codeFileLocation` must be an object.'));
    }
  );

  tests.add(
    '`InvalidJsdocError` with second argument `codeFileLocation` property `filePath` not a string.',
    () => {
      throws(() => {
        new InvalidJsdocError('a', {});
      }, new TypeError('Second argument `codeFileLocation` property `filePath` must be a string.'));
    }
  );

  tests.add(
    '`InvalidJsdocError` with second argument `codeFileLocation` property `codeLocation` not a `CodeLocation` instance.',
    () => {
      throws(() => {
        new InvalidJsdocError('a', {
          filePath: '/a.js',
        });
      }, new TypeError('Second argument `codeFileLocation` property `codeLocation` must be a `CodeLocation` instance.'));
    }
  );

  tests.add(
    '`InvalidJsdocError` with third argument `code` not a string.',
    () => {
      throws(() => {
        new InvalidJsdocError(
          'a',
          {
            filePath: '/a.js',
            codeLocation: new CodeLocation(new CodePosition(1, 4)),
          },
          true
        );
      }, new TypeError('Third argument `code` must be a string.'));
    }
  );

  tests.add(
    '`InvalidJsdocError` with code location end position, none.',
    async () => {
      const revertEnv = revertableGlobals({ FORCE_COLOR: '1' }, process.env);
      const revertKleur = revertableGlobals({ enabled: true }, kleur);

      let error;

      try {
        error = new InvalidJsdocError(
          'Message.',
          {
            filePath: '/a.js',
            codeLocation: new CodeLocation(new CodePosition(1, 4)),
          },
          '/**@abc*/'
        );
      } finally {
        revertEnv();
        revertKleur();
      }

      strictEqual(error instanceof CliError, true);
      strictEqual(error.name, 'InvalidJsdocError');

      await snapshot(
        error.message,
        resolve(
          __dirname,
          '../snapshots/InvalidJsdocError/code-location-end-position-none.ans'
        )
      );
    }
  );

  tests.add(
    '`InvalidJsdocError` with code location end position, matching start.',
    async () => {
      const revertEnv = revertableGlobals({ FORCE_COLOR: '1' }, process.env);
      const revertKleur = revertableGlobals({ enabled: true }, kleur);

      let error;

      try {
        error = new InvalidJsdocError(
          'Message.',
          {
            filePath: '/a.js',
            codeLocation: new CodeLocation(
              new CodePosition(1, 4),
              new CodePosition(1, 4)
            ),
          },
          '/**@abc*/'
        );
      } finally {
        revertEnv();
        revertKleur();
      }

      strictEqual(error instanceof CliError, true);
      strictEqual(error.name, 'InvalidJsdocError');

      await snapshot(
        error.message,
        resolve(
          __dirname,
          '../snapshots/InvalidJsdocError/code-location-end-position-matching-start.ans'
        )
      );
    }
  );

  tests.add(
    '`InvalidJsdocError` with code location end position, beyond start.',
    async () => {
      const revertEnv = revertableGlobals({ FORCE_COLOR: '1' }, process.env);
      const revertKleur = revertableGlobals({ enabled: true }, kleur);

      let error;

      try {
        error = new InvalidJsdocError(
          'Message.',
          {
            filePath: '/a.js',
            codeLocation: new CodeLocation(
              new CodePosition(1, 4),
              new CodePosition(1, 7)
            ),
          },
          '/**@abc*/'
        );
      } finally {
        revertEnv();
        revertKleur();
      }

      strictEqual(error instanceof CliError, true);
      strictEqual(error.name, 'InvalidJsdocError');

      await snapshot(
        error.message,
        resolve(
          __dirname,
          '../snapshots/InvalidJsdocError/code-location-end-position-beyond-start.ans'
        )
      );
    }
  );
};
