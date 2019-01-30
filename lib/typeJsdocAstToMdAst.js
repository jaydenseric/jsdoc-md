// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects
const GLOBAL_OBJECTS_MDN = [
  'Array',
  'ArrayBuffer',
  'AsyncFunction',
  'Atomics',
  'BigInt',
  'Boolean',
  'DataView',
  'Date',
  'decodeURI',
  'decodeURIComponent',
  'encodeURI',
  'encodeURIComponent',
  'Error',
  'escape',
  'eval',
  'EvalError',
  'Float32Array',
  'Float64Array',
  'Function',
  'Generator',
  'GeneratorFunction',
  'globalThis',
  'Infinity',
  'Int8Array',
  'Int16Array',
  'Int32Array',
  'InternalError',
  'Intl',
  'isFinite',
  'isNaN',
  'JSON',
  'Map',
  'Math',
  'NaN',
  'null',
  'Number',
  'Object',
  'parseFloat',
  'parseInt',
  'Promise',
  'Proxy',
  'RangeError',
  'ReferenceError',
  'Reflect',
  'RegExp',
  'Set',
  'SharedArrayBuffer',
  'String',
  'Symbol',
  'SyntaxError',
  'TypeError',
  'Uint8Array',
  'Uint8ClampedArray',
  'Uint16Array',
  'Uint32Array',
  'undefined',
  'unescape',
  'uneval',
  'URIError',
  'WeakMap',
  'WeakSet',
  'WebAssembly'
]

/**
 * Converts a doctrine JSDoc AST type node to markdown AST children list.
 * @kind function
 * @name typeJsdocAstToMdAst
 * @param {Object} typeJsdocAst Doctrine JSDoc AST type node.
 * @param {Object[]} [members] Outline members.
 * @returns {Object[]} Markdown AST children list.
 * @ignore
 */
const typeJsdocAstToMdAst = (typeJsdocAst, members) => {
  switch (typeJsdocAst.type) {
    case 'AllLiteral':
      return [{ type: 'text', value: '*' }]
    case 'NullLiteral':
    case 'UndefinedLiteral':
      return [
        {
          type: 'text',
          value: typeJsdocAst.type.replace('Literal', '').toLowerCase()
        }
      ]
    case 'NumericLiteralType':
    case 'StringLiteralType':
    case 'BooleanLiteralType':
      return [{ type: 'text', value: String(typeJsdocAst.value) }]
    case 'RestType':
      return [
        { type: 'text', value: '…' },
        ...typeJsdocAstToMdAst(typeJsdocAst.expression, members)
      ]
    case 'FieldType':
      return [
        { type: 'text', value: `${typeJsdocAst.key}: ` },
        ...typeJsdocAstToMdAst(typeJsdocAst.value, members)
      ]
    case 'OptionalType':
      return [
        ...typeJsdocAstToMdAst(typeJsdocAst.expression, members),
        { type: 'text', value: '?' }
      ]
    case 'UnionType': {
      return typeJsdocAst.elements.reduce(
        (children, typeJsdocAst, index, array) => {
          children.push(...typeJsdocAstToMdAst(typeJsdocAst, members))
          if (index + 1 !== array.length)
            children.push({ type: 'text', value: ' | ' })
          return children
        },
        []
      )
    }
    case 'TypeApplication': {
      return [
        ...typeJsdocAstToMdAst(typeJsdocAst.expression),
        { type: 'text', value: '<' },
        ...typeJsdocAst.applications.reduce(
          (children, typeJsdocAst, index, array) => {
            children.push(...typeJsdocAstToMdAst(typeJsdocAst, members))
            if (index + 1 !== array.length)
              children.push({ type: 'text', value: ', ' })
            return children
          },
          []
        ),
        { type: 'text', value: '>' }
      ]
    }
    case 'ArrayType': {
      return [
        { type: 'text', value: '[' },
        ...typeJsdocAst.elements.reduce(
          (children, typeJsdocAst, index, array) => {
            children.push(...typeJsdocAstToMdAst(typeJsdocAst, members))
            if (index + 1 !== array.length)
              children.push({ type: 'text', value: ', ' })
            return children
          },
          []
        ),
        { type: 'text', value: ']' }
      ]
    }
    case 'RecordType': {
      return [
        { type: 'text', value: '{' },
        ...typeJsdocAst.fields.reduce(
          (children, typeJsdocAst, index, array) => {
            children.push(...typeJsdocAstToMdAst(typeJsdocAst, members))
            if (index + 1 !== array.length)
              children.push({ type: 'text', value: ', ' })
            return children
          },
          []
        ),
        { type: 'text', value: '}' }
      ]
    }
    case 'NameExpression': {
      const linkedMember =
        members &&
        members.find(({ namepath }) => namepath === typeJsdocAst.name)

      return [
        linkedMember
          ? {
              type: 'link',
              url: `#${linkedMember.slug}`,
              children: [{ type: 'text', value: typeJsdocAst.name }]
            }
          : GLOBAL_OBJECTS_MDN.includes(typeJsdocAst.name)
          ? {
              type: 'link',
              url: `https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/${
                typeJsdocAst.name
              }`,
              children: [{ type: 'text', value: typeJsdocAst.name }]
            }
          : { type: 'text', value: typeJsdocAst.name }
      ]
    }
    case 'FunctionType': {
      // Some possible function types:
      //   - function():
      //   - function(...types): result
      //   - function(new:Object, [...types]): result
      //   - function(this:Object, [...types]): result

      const children = [
        {
          type: 'text',
          value: `function(${
            typeJsdocAst.this ? (typeJsdocAst.new ? 'new:' : 'this:') : ''
          }`
        }
      ]

      if (typeJsdocAst.this) {
        children.push(...typeJsdocAstToMdAst(typeJsdocAst.this, members))
        if (typeJsdocAst.params.length)
          children.push({ type: 'text', value: ', ' })
      }

      if (typeJsdocAst.params.length)
        typeJsdocAst.params.forEach((typeJsdocAst, index, array) => {
          children.push(...typeJsdocAstToMdAst(typeJsdocAst, members), {
            type: 'text',
            value: index + 1 !== array.length ? ', ' : ')'
          })
        })

      if (typeJsdocAst.result)
        children.push(
          { type: 'text', value: typeJsdocAst.params.length ? ':' : '):' },
          ...typeJsdocAstToMdAst(typeJsdocAst.result, members)
        )

      if (!typeJsdocAst.params.length && !typeJsdocAst.result)
        children.push({ type: 'text', value: ')' })

      return children
    }
    default:
      throw new Error(`Unknown JSDoc type “${typeJsdocAst.type}”.`)
  }
}

module.exports = typeJsdocAstToMdAst
