module.exports = {
  parserOpts: {
    plugins: [
      'classProperties',
      ['decorators', { decoratorsBeforeExport: false }],
      'dynamicImport',
      'objectRestSpread'
    ]
  }
}
