'use strict';

const { deepStrictEqual } = require('assert');
const mdToMdAst = require('../../lib/mdToMdAst');

module.exports = (tests) => {
  tests.add('`mdToMdAst`.', () => {
    deepStrictEqual(
      JSON.stringify(mdToMdAst('a'), null, 2),
      `[
  {
    "type": "paragraph",
    "children": [
      {
        "type": "text",
        "value": "a",
        "position": {
          "start": {
            "line": 1,
            "column": 1,
            "offset": 0
          },
          "end": {
            "line": 1,
            "column": 2,
            "offset": 1
          },
          "indent": []
        }
      }
    ],
    "position": {
      "start": {
        "line": 1,
        "column": 1,
        "offset": 0
      },
      "end": {
        "line": 1,
        "column": 2,
        "offset": 1
      },
      "indent": []
    }
  }
]`
    );
  });
};
