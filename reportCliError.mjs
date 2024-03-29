import kleur from "kleur";
import { inspect } from "util";

import CliError from "./CliError.mjs";
import errorConsole from "./errorConsole.mjs";

/**
 * Reports a CLI error via the process `stderr`.
 * @kind function
 * @name reportCliError
 * @param {string} cliDescription CLI description.
 * @param {*} error Error to report.
 * @ignore
 */
export default function reportCliError(cliDescription, error) {
  if (typeof cliDescription !== "string")
    throw new TypeError("Argument 1 `cliDescription` must be a string.");

  errorConsole.group(
    // Whitespace blank lines shouldn’t have redundant indentation or color.
    `\n${kleur.bold().red(`Error running ${cliDescription}:`)}\n`
  );

  errorConsole.error(
    error instanceof CliError
      ? error.message
      : error instanceof Error
      ? // Rarely, an error doesn’t have a stack. In that case, the standard
        // `toString` method returns the error’s `name` + `: ` + the `message`.
        // This is consistent with the first part of a standard Node.js
        // error’s `stack`.
        error.stack || error
      : inspect(error)
  );

  errorConsole.groupEnd();

  // Whitespace blank line.
  errorConsole.error();
}
