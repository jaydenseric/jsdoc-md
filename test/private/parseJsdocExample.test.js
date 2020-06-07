'use strict';

const { deepStrictEqual } = require('assert');
const parseJsdocExample = require('../../private/parseJsdocExample');

module.exports = (tests) => {
  tests.add('`parseJsdocExample` with caption only.', () => {
    deepStrictEqual(parseJsdocExample('<caption>a</caption>'), {
      caption: 'a',
    });
  });

  tests.add('`parseJsdocExample` with caption, content.', () => {
    deepStrictEqual(parseJsdocExample(`<caption>a</caption>b`), {
      caption: 'a',
      content: 'b',
    });
  });

  tests.add('`parseJsdocExample` with caption, space, content.', () => {
    deepStrictEqual(parseJsdocExample(`<caption>a</caption> b`), {
      caption: 'a',
      content: 'b',
    });
  });

  tests.add(
    '`parseJsdocExample` with caption, multiple spaces, content.',
    () => {
      deepStrictEqual(parseJsdocExample(`<caption>a</caption>  b`), {
        caption: 'a',
        content: ' b',
      });
    }
  );

  tests.add('`parseJsdocExample` with caption, newline, content.', () => {
    deepStrictEqual(
      parseJsdocExample(`<caption>a</caption>
b`),
      { caption: 'a', content: 'b' }
    );
  });

  tests.add(
    '`parseJsdocExample` with caption, multiple newlines, content.',
    () => {
      deepStrictEqual(
        parseJsdocExample(`<caption>a</caption>

b`),
        { caption: 'a', content: '\nb' }
      );
    }
  );

  tests.add('`parseJsdocExample` with content only.', () => {
    deepStrictEqual(parseJsdocExample('a'), {
      content: 'a',
    });
  });
};
