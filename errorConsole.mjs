import { Console } from "console";

/**
 * The `console` API, but all output is to `stderr`. This allows `console.group`
 * to be used with `console.error`.
 * @kind member
 * @name errorConsole
 * @ignore
 */
const errorConsole = new Console({
  stdout: process.stderr,
  stderr: process.stderr,
});

export default errorConsole;
