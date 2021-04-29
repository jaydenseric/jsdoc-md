#!/usr/bin/env node

import arg from 'arg';
import CliError from '../private/CliError.mjs';
import reportCliError from '../private/reportCliError.mjs';
import jsdocMd from '../public/jsdocMd.mjs';

/**
 * Runs the `jsdoc-md` CLI.
 * @kind function
 * @name jsdocMdCli
 * @returns {Promise<void>} Resolves once the operation is done.
 * @ignore
 */
async function jsdocMdCli() {
  try {
    const { _: unexpectedArgs, ...expectedArgs } = arg(
      {
        '--source-glob': String,
        '-s': '--source-glob',
        '--markdown-path': String,
        '-m': '--markdown-path',
        '--target-heading': String,
        '-t': '--target-heading',
        '--check': Boolean,
        '-c': '--check',
      },
      {
        // Don’t throw on unexpected arguments.
        permissive: true,
      }
    );

    if (unexpectedArgs.length)
      throw new CliError(
        `Command \`jsdoc-md\` unexpected argument${
          unexpectedArgs.length === 1 ? '' : 's'
        } \`${unexpectedArgs.join('`, `')}\`.`
      );

    for (const [argName, argValue] of Object.entries(expectedArgs))
      if (typeof argValue === 'string' && !argValue)
        throw new CliError(
          `Command \`jsdoc-md\` argument \`${argName}\` requires a value.`
        );

    const {
      '--source-glob': sourceGlob,
      '--markdown-path': markdownPath,
      '--target-heading': targetHeading,
      '--check': check,
    } = expectedArgs;

    await jsdocMd({ sourceGlob, markdownPath, targetHeading, check });
  } catch (error) {
    let reportError = error;

    if (error instanceof arg.ArgError)
      switch (error.code) {
        case 'ARG_MISSING_REQUIRED_SHORTARG': {
          const [, badArgName] = error.message.match(/: (.+?)$/u);

          reportError = new CliError(
            `Command \`jsdoc-md\` argument \`${badArgName}\` requires a value, but was followed by another short argument.`
          );

          break;
        }

        case 'ARG_MISSING_REQUIRED_LONGARG': {
          const [, badArgName, aliasForArgName] = error.message.match(
            /: (.+?)(?: \(alias for (.+?)\))?$/u
          );

          reportError = new CliError(
            `Command \`jsdoc-md\` argument \`${badArgName}\`${
              aliasForArgName ? ` (alias for \`${aliasForArgName}\`)` : ''
            } requires a value.`
          );
        }
      }

    reportCliError('jsdoc-md', reportError);

    process.exitCode = 1;
  }
}

jsdocMdCli();
