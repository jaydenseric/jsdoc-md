import { strictEqual, throws } from 'assert';
import CliError from '../../private/CliError.mjs';

export default (tests) => {
  tests.add('`CliError` with first argument `message` not a string.', () => {
    throws(() => {
      new CliError(true);
    }, new TypeError('First argument `message` must be a string.'));
  });

  tests.add('`CliError` with arguments valid.', () => {
    const message = 'Message.';
    const error = new CliError(message);

    strictEqual(error instanceof Error, true);
    strictEqual(error.name, 'CliError');
    strictEqual(error.message, message);
  });
};
