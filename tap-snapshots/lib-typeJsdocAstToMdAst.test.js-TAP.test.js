/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type AllLiteral > Markdown AST. 1`] = `
[
  {
    "type": "text",
    "value": "*"
  }
]
`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type AllLiteral > Markdown. 1`] = `
\\*

`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type ArrayType > Markdown AST. 1`] = `
[
  {
    "type": "text",
    "value": "["
  },
  {
    "type": "text",
    "value": "*"
  },
  {
    "type": "text",
    "value": "]"
  }
]
`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type ArrayType > Markdown. 1`] = `
\\[\\*]

`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type ArrayType with multiple items > Markdown AST. 1`] = `
[
  {
    "type": "text",
    "value": "["
  },
  {
    "type": "text",
    "value": "*"
  },
  {
    "type": "text",
    "value": ", "
  },
  {
    "type": "text",
    "value": "*"
  },
  {
    "type": "text",
    "value": "]"
  }
]
`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type ArrayType with multiple items > Markdown. 1`] = `
\\[\\*, \\*]

`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type BooleanLiteralType > Markdown AST. 1`] = `
[
  {
    "type": "inlineCode",
    "value": "true"
  }
]
`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type BooleanLiteralType > Markdown. 1`] = `
\`true\`

`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type FieldType > Markdown AST. 1`] = `
[
  {
    "type": "text",
    "value": "{"
  },
  {
    "type": "text",
    "value": "a: "
  },
  {
    "type": "text",
    "value": "*"
  },
  {
    "type": "text",
    "value": "}"
  }
]
`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type FieldType > Markdown. 1`] = `
{a: \\*}

`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type FunctionType > Markdown AST. 1`] = `
[
  {
    "type": "text",
    "value": "function("
  },
  {
    "type": "text",
    "value": ")"
  }
]
`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type FunctionType > Markdown. 1`] = `
function()

`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type FunctionType with multiple parameters > Markdown AST. 1`] = `
[
  {
    "type": "text",
    "value": "function("
  },
  {
    "type": "text",
    "value": "*"
  },
  {
    "type": "text",
    "value": ", "
  },
  {
    "type": "text",
    "value": "*"
  },
  {
    "type": "text",
    "value": ")"
  }
]
`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type FunctionType with multiple parameters > Markdown. 1`] = `
function(\\*, \\*)

`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type FunctionType with new > Markdown AST. 1`] = `
[
  {
    "type": "text",
    "value": "function("
  },
  {
    "type": "text",
    "value": "new:"
  },
  {
    "type": "text",
    "value": "A"
  },
  {
    "type": "text",
    "value": ")"
  }
]
`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type FunctionType with new > Markdown. 1`] = `
function(new:A)

`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type FunctionType with new and param > Markdown AST. 1`] = `
[
  {
    "type": "text",
    "value": "function("
  },
  {
    "type": "text",
    "value": "new:"
  },
  {
    "type": "text",
    "value": "A"
  },
  {
    "type": "text",
    "value": ", "
  },
  {
    "type": "text",
    "value": "*"
  },
  {
    "type": "text",
    "value": ")"
  }
]
`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type FunctionType with new and param > Markdown. 1`] = `
function(new:A, \\*)

`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type FunctionType with parameter > Markdown AST. 1`] = `
[
  {
    "type": "text",
    "value": "function("
  },
  {
    "type": "text",
    "value": "*"
  },
  {
    "type": "text",
    "value": ")"
  }
]
`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type FunctionType with parameter > Markdown. 1`] = `
function(\\*)

`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type FunctionType with return > Markdown AST. 1`] = `
[
  {
    "type": "text",
    "value": "function("
  },
  {
    "type": "text",
    "value": ")"
  },
  {
    "type": "text",
    "value": ":"
  },
  {
    "type": "text",
    "value": "*"
  }
]
`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type FunctionType with return > Markdown. 1`] = `
function():\\*

`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type FunctionType with return and VoidLiteral > Markdown AST. 1`] = `
[
  {
    "type": "text",
    "value": "function("
  },
  {
    "type": "text",
    "value": ")"
  },
  {
    "type": "text",
    "value": ":"
  },
  {
    "type": "inlineCode",
    "value": "void"
  }
]
`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type FunctionType with return and VoidLiteral > Markdown. 1`] = `
function():

\`void\`

`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type FunctionType with this > Markdown AST. 1`] = `
[
  {
    "type": "text",
    "value": "function("
  },
  {
    "type": "text",
    "value": "this:"
  },
  {
    "type": "text",
    "value": "A"
  },
  {
    "type": "text",
    "value": ")"
  }
]
`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type FunctionType with this > Markdown. 1`] = `
function(this:A)

`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type FunctionType with this and param > Markdown AST. 1`] = `
[
  {
    "type": "text",
    "value": "function("
  },
  {
    "type": "text",
    "value": "this:"
  },
  {
    "type": "text",
    "value": "A"
  },
  {
    "type": "text",
    "value": ", "
  },
  {
    "type": "text",
    "value": "*"
  },
  {
    "type": "text",
    "value": ")"
  }
]
`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type FunctionType with this and param > Markdown. 1`] = `
function(this:A, \\*)

`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type NameExpression > Markdown AST. 1`] = `
[
  {
    "type": "text",
    "value": "A"
  }
]
`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type NameExpression > Markdown. 1`] = `
A

`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type NameExpression with member link > Markdown AST. 1`] = `
[
  {
    "type": "link",
    "url": "#type-a",
    "children": [
      {
        "type": "text",
        "value": "A"
      }
    ]
  }
]
`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type NameExpression with member link > Markdown. 1`] = `
[A](#type-a)

`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type NullLiteral > Markdown AST. 1`] = `
[
  {
    "type": "inlineCode",
    "value": "null"
  }
]
`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type NullLiteral > Markdown. 1`] = `
\`null\`

`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type NullableLiteral > Markdown AST. 1`] = `
[
  {
    "type": "text",
    "value": "?"
  }
]
`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type NullableLiteral > Markdown. 1`] = `
?

`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type NumericLiteralType > Markdown AST. 1`] = `
[
  {
    "type": "inlineCode",
    "value": "1"
  }
]
`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type NumericLiteralType > Markdown. 1`] = `
\`1\`

`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type OptionalType > Markdown AST. 1`] = `
[
  {
    "type": "text",
    "value": "*"
  },
  {
    "type": "text",
    "value": "?"
  }
]
`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type OptionalType > Markdown. 1`] = `
\\*?

`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type RecordType > Markdown AST. 1`] = `
[
  {
    "type": "text",
    "value": "{"
  },
  {
    "type": "text",
    "value": "a: "
  },
  {
    "type": "text",
    "value": "*"
  },
  {
    "type": "text",
    "value": ", "
  },
  {
    "type": "text",
    "value": "b: "
  },
  {
    "type": "text",
    "value": "*"
  },
  {
    "type": "text",
    "value": "}"
  }
]
`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type RecordType > Markdown. 1`] = `
{a: \\*, b: \\*}

`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type RestType > Markdown AST. 1`] = `
[
  {
    "type": "text",
    "value": "…"
  },
  {
    "type": "text",
    "value": "*"
  }
]
`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type RestType > Markdown. 1`] = `
…\\*

`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type StringLiteralType > Markdown AST. 1`] = `
[
  {
    "type": "inlineCode",
    "value": "a"
  }
]
`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type StringLiteralType > Markdown. 1`] = `
\`a\`

`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type TypeApplication > Markdown AST. 1`] = `
[
  {
    "type": "text",
    "value": "Array"
  },
  {
    "type": "text",
    "value": "<"
  },
  {
    "type": "text",
    "value": "*"
  },
  {
    "type": "text",
    "value": ">"
  }
]
`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type TypeApplication > Markdown. 1`] = `
Array&lt;\\*>

`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type TypeApplication with multiple applications > Markdown AST. 1`] = `
[
  {
    "type": "text",
    "value": "Array"
  },
  {
    "type": "text",
    "value": "<"
  },
  {
    "type": "text",
    "value": "*"
  },
  {
    "type": "text",
    "value": ", "
  },
  {
    "type": "text",
    "value": "*"
  },
  {
    "type": "text",
    "value": ">"
  }
]
`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type TypeApplication with multiple applications > Markdown. 1`] = `
Array&lt;\\*, \\*>

`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type UndefinedLiteral > Markdown AST. 1`] = `
[
  {
    "type": "inlineCode",
    "value": "undefined"
  }
]
`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type UndefinedLiteral > Markdown. 1`] = `
\`undefined\`

`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type UnionType > Markdown AST. 1`] = `
[
  {
    "type": "text",
    "value": "*"
  },
  {
    "type": "text",
    "value": " | "
  },
  {
    "type": "text",
    "value": "void"
  }
]
`

exports[`lib/typeJsdocAstToMdAst.test.js TAP typeJsdocAstToMdAst Type UnionType > Markdown. 1`] = `
\\* | void

`
