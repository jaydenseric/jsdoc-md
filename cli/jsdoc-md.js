#!/usr/bin/env node

'use strict';

const arg = require('arg');
const reportCliError = require('../private/reportCliError');
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
    reportCliError('jsdoc-md', error);

    process.exitCode = 1;
  }
}

jsdocMdCli();
