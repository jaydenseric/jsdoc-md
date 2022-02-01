import { strictEqual, throws } from 'assert';
import kleur from 'kleur';
import revertableGlobals from 'revertable-globals';
import snapshot from 'snapshot-assertion';

import CliError from '../../private/CliError.mjs';
import CodeLocation from '../../private/CodeLocation.mjs';
import CodePosition from '../../private/CodePosition.mjs';
import InvalidJsdocError from '../../private/InvalidJsdocError.mjs';

export default (tests) => {
  tests.add(
    '`InvalidJsdocError` with argument 1 `message` not a string.',
    () => {
      throws(() => {
        new InvalidJsdocError(true);
      }, new TypeError('Argument 1 `message` must be a string.'));
    }
  );

  tests.add(
    '`InvalidJsdocError` with argument 2 `codeFileLocation` not an object.',
    () => {
      throws(() => {
        new InvalidJsdocError('a', true);
      }, new TypeError('Argument 2 `codeFileLocation` must be an object.'));
    }
  );

  tests.add(
    '`InvalidJsdocError` with argument 2 `codeFileLocation` property `filePath` not a string.',
    () => {
      throws(() => {
        new InvalidJsdocError('a', {});
      }, new TypeError('Argument 2 `codeFileLocation` property `filePath` must be a string.'));
    }
  );

  tests.add(
    '`InvalidJsdocError` with argument 2 `codeFileLocation` property `codeLocation` not a `CodeLocation` instance.',
    () => {
      throws(() => {
        new InvalidJsdocError('a', {
          filePath: '/a.js',
          codeLocation: true,
        });
      }, new TypeError('Argument 2 `codeFileLocation` property `codeLocation` must be a `CodeLocation` instance.'));
    }
  );

  tests.add('`InvalidJsdocError` with argument 3 `code` not a string.', () => {
    throws(() => {
      new InvalidJsdocError(
        'a',
        {
          filePath: '/a.js',
          codeLocation: new CodeLocation(new CodePosition(1, 4)),
        },
        true
      );
    }, new TypeError('Argument 3 `code` must be a string.'));
  });

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
        new URL(
          '../snapshots/InvalidJsdocError/code-location-end-position-none.ans',
          import.meta.url
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
        new URL(
          '../snapshots/InvalidJsdocError/code-location-end-position-matching-start.ans',
          import.meta.url
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
        new URL(
          '../snapshots/InvalidJsdocError/code-location-end-position-beyond-start.ans',
          import.meta.url
        )
      );
    }
  );
};
