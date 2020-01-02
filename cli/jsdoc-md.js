#!/usr/bin/env node

'use strict'

const arg = require('arg')
const jsdocMd = require('../lib/jsdocMd')

const {
  '--source-glob': sourceGlob,
  '--markdown-path': markdownPath,
  '--target-heading': targetHeading
} = arg({
  '--source-glob': String,
  '-s': '--source-glob',
  '--markdown-path': String,
  '-m': '--markdown-path',
  '--target-heading': String,
  '-t': '--target-heading'
})

jsdocMd({ sourceGlob, markdownPath, targetHeading })
