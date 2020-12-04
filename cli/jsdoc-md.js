#!/usr/bin/env node

'use strict';

const { inspect } = require('util');
const arg = require('arg');
const kleur = require('kleur');
const InvalidJsdocError = require('../private/InvalidJsdocError');
const errorConsole = require('../private/errorConsole');
const jsdocMd = require('../public/jsdocMd');

/**
 * Runs the `jsdoc-md` CLI.
 * @kind function
 * @name jsdocMdCli
 * @returns {Promise<void>} Resolves once the operation is done.
 * @ignore
 */
async function jsdocMdCli() {
  try {
    const {
      '--source-glob': sourceGlob,
      '--markdown-path': markdownPath,
      '--target-heading': targetHeading,
    } = arg({
      '--source-glob': String,
      '-s': '--source-glob',
      '--markdown-path': String,
      '-m': '--markdown-path',
      '--target-heading': String,
      '-t': '--target-heading',
    });

    await jsdocMd({ sourceGlob, markdownPath, targetHeading });
  } catch (error) {
    errorConsole.group(kleur.bold().red('\nError running jsdoc-md:\n'));
    errorConsole.error(
      error instanceof InvalidJsdocError
        ? error.message // coverage ignore next line
        : kleur.red(error instanceof Error ? error : inspect(error))
    );
    errorConsole.groupEnd();
    // Add a blank line for whitespace, without redundant indentation or color.
    errorConsole.error();
    process.exitCode = 1;
  }
}

jsdocMdCli();
