'use strict';

const { deepStrictEqual, strictEqual, throws } = require('assert');
const CodeLocation = require('../../private/CodeLocation');
const CodePosition = require('../../private/CodePosition');
const parseJsdocExample = require('../../private/parseJsdocExample');

const TEST_CODE_FILE_PATH = '/a.js';

module.exports = (tests) => {
  tests.add(
    '`parseJsdocExample` with first argument `jsdocData` not an object.',
    () => {
      throws(() => {
        parseJsdocExample(true);
      }, new TypeError('First argument `jsdocData` must be an object.'));
    }
  );

  tests.add(
    '`parseJsdocExample` with first argument `jsdocData` property `codeFileLocation` not an object.',
    () => {
      throws(() => {
        parseJsdocExample({
          codeFileLocation: true,
        });
      }, new TypeError('First argument `jsdocData` property `codeFileLocation` must be an object.'));
    }
  );

  tests.add(
    '`parseJsdocExample` with first argument `jsdocData` property `codeFileLocation` property `filePath` not a string.',
    () => {
      throws(() => {
        parseJsdocExample({
          codeFileLocation: {
            filePath: true,
          },
        });
      }, new TypeError('First argument `jsdocData` property `codeFileLocation` property `filePath` must be a string.'));
    }
  );

  tests.add(
    '`parseJsdocExample` with first argument `jsdocData` property `codeFileLocation` property `codeLocation` not a `CodeLocation` instance.',
    () => {
      throws(() => {
        parseJsdocExample({
          codeFileLocation: {
            filePath: TEST_CODE_FILE_PATH,
            codeLocation: true,
          },
        });
      }, new TypeError('First argument `jsdocData` property `codeFileLocation` property `codeLocation` must be a `CodeLocation` instance.'));
    }
  );

  tests.add(
    '`parseJsdocExample` with first argument `jsdocData` property `data` not a string.',
    () => {
      throws(() => {
        parseJsdocExample({
          codeFileLocation: {
            filePath: TEST_CODE_FILE_PATH,
            codeLocation: new CodeLocation(new CodePosition(2, 4)),
          },
          data: true,
        });
      }, new TypeError('First argument `jsdocData` property `data` must be a string.'));
    }
  );

  tests.add('`parseJsdocExample` with caption, empty, no content.', () => {
    strictEqual(
      parseJsdocExample({
        codeFileLocation: {
          filePath: TEST_CODE_FILE_PATH,
          codeLocation: new CodeLocation(new CodePosition(2, 4)),
        },
        data: '<caption></caption>',
      }),
      null
    );
  });

  tests.add('`parseJsdocExample` with caption, populated, no content.', () => {
    deepStrictEqual(
      parseJsdocExample({
        codeFileLocation: {
          filePath: TEST_CODE_FILE_PATH,
          codeLocation: new CodeLocation(new CodePosition(2, 4)),
        },
        data: `<caption>abc
def</caption>`,
      }),
      {
        caption: {
          codeFileLocation: {
            filePath: TEST_CODE_FILE_PATH,
            codeLocation: new CodeLocation(
              new CodePosition(2, 13),
              new CodePosition(3, 3)
            ),
          },
          data: `abc
def`,
        },
      }
    );
  });

  tests.add(
    '`parseJsdocExample` with caption, empty, content, extra caption close syntax.',
    () => {
      deepStrictEqual(
        parseJsdocExample({
          codeFileLocation: {
            filePath: TEST_CODE_FILE_PATH,
            codeLocation: new CodeLocation(new CodePosition(2, 4)),
          },
          data: '<caption></caption></caption>',
        }),
        {
          content: {
            codeFileLocation: {
              filePath: TEST_CODE_FILE_PATH,
              codeLocation: new CodeLocation(
                new CodePosition(2, 23),
                new CodePosition(2, 32)
              ),
            },
            data: '</caption>',
          },
        }
      );
    }
  );

  tests.add('`parseJsdocExample` with caption, populated, content.', () => {
    deepStrictEqual(
      parseJsdocExample({
        codeFileLocation: {
          filePath: TEST_CODE_FILE_PATH,
          codeLocation: new CodeLocation(new CodePosition(2, 4)),
        },
        data: `<caption>abc
def</caption>hij
klm`,
      }),
      {
        caption: {
          codeFileLocation: {
            filePath: TEST_CODE_FILE_PATH,
            codeLocation: new CodeLocation(
              new CodePosition(2, 13),
              new CodePosition(3, 3)
            ),
          },
          data: `abc
def`,
        },
        content: {
          codeFileLocation: {
            filePath: TEST_CODE_FILE_PATH,
            codeLocation: new CodeLocation(
              new CodePosition(3, 14),
              new CodePosition(4, 3)
            ),
          },
          data: `hij
klm`,
        },
      }
    );
  });

  tests.add(
    '`parseJsdocExample` with caption, populated, space, content.',
    () => {
      deepStrictEqual(
        parseJsdocExample({
          codeFileLocation: {
            filePath: TEST_CODE_FILE_PATH,
            codeLocation: new CodeLocation(new CodePosition(2, 4)),
          },
          data: `<caption>abc
def</caption> hij
klm`,
        }),
        {
          caption: {
            codeFileLocation: {
              filePath: TEST_CODE_FILE_PATH,
              codeLocation: new CodeLocation(
                new CodePosition(2, 13),
                new CodePosition(3, 3)
              ),
            },
            data: `abc
def`,
          },
          content: {
            codeFileLocation: {
              filePath: TEST_CODE_FILE_PATH,
              codeLocation: new CodeLocation(
                new CodePosition(3, 15),
                new CodePosition(4, 3)
              ),
            },
            data: `hij
klm`,
          },
        }
      );
    }
  );

  tests.add(
    '`parseJsdocExample` with caption, populated, multiple spaces, content.',
    () => {
      deepStrictEqual(
        parseJsdocExample({
          codeFileLocation: {
            filePath: TEST_CODE_FILE_PATH,
            codeLocation: new CodeLocation(new CodePosition(2, 4)),
          },
          data: `<caption>abc
def</caption>  hij
klm`,
        }),
        {
          caption: {
            codeFileLocation: {
              filePath: TEST_CODE_FILE_PATH,
              codeLocation: new CodeLocation(
                new CodePosition(2, 13),
                new CodePosition(3, 3)
              ),
            },
            data: `abc
def`,
          },
          content: {
            codeFileLocation: {
              filePath: TEST_CODE_FILE_PATH,
              codeLocation: new CodeLocation(
                new CodePosition(3, 15),
                new CodePosition(4, 3)
              ),
            },
            data: ` hij
klm`,
          },
        }
      );
    }
  );

  tests.add(
    '`parseJsdocExample` with caption, populated, newline, content.',
    () => {
      deepStrictEqual(
        parseJsdocExample({
          codeFileLocation: {
            filePath: TEST_CODE_FILE_PATH,
            codeLocation: new CodeLocation(new CodePosition(2, 4)),
          },
          data: `<caption>abc
def</caption>
hij
klm`,
        }),
        {
          caption: {
            codeFileLocation: {
              filePath: TEST_CODE_FILE_PATH,
              codeLocation: new CodeLocation(
                new CodePosition(2, 13),
                new CodePosition(3, 3)
              ),
            },
            data: `abc
def`,
          },
          content: {
            codeFileLocation: {
              filePath: TEST_CODE_FILE_PATH,
              codeLocation: new CodeLocation(
                new CodePosition(4, 1),
                new CodePosition(5, 3)
              ),
            },
            data: `hij
klm`,
          },
        }
      );
    }
  );

  tests.add(
    '`parseJsdocExample` with caption, populated, multiple newlines, content.',
    () => {
      deepStrictEqual(
        parseJsdocExample({
          codeFileLocation: {
            filePath: TEST_CODE_FILE_PATH,
            codeLocation: new CodeLocation(new CodePosition(2, 4)),
          },
          data: `<caption>abc
def</caption>

hij
klm`,
        }),
        {
          caption: {
            codeFileLocation: {
              filePath: TEST_CODE_FILE_PATH,
              codeLocation: new CodeLocation(
                new CodePosition(2, 13),
                new CodePosition(3, 3)
              ),
            },
            data: `abc
def`,
          },
          content: {
            codeFileLocation: {
              filePath: TEST_CODE_FILE_PATH,
              codeLocation: new CodeLocation(
                new CodePosition(4, 1),
                new CodePosition(6, 3)
              ),
            },
            data: `
hij
klm`,
          },
        }
      );
    }
  );

  tests.add('`parseJsdocExample` with no caption, content.', () => {
    deepStrictEqual(
      parseJsdocExample({
        codeFileLocation: {
          filePath: TEST_CODE_FILE_PATH,
          codeLocation: new CodeLocation(new CodePosition(2, 4)),
        },
        data: `abc
def`,
      }),
      {
        content: {
          codeFileLocation: {
            filePath: TEST_CODE_FILE_PATH,
            codeLocation: new CodeLocation(
              new CodePosition(2, 4),
              new CodePosition(3, 3)
            ),
          },
          data: `abc
def`,
        },
      }
    );
  });
};
