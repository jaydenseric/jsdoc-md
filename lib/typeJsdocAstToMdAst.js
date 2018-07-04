const GithubSlugger = require('github-slugger')

const slugger = new GithubSlugger()

/**
 * Converts a doctrine JSDoc AST type node to markdown AST children list.
 * @kind function
 * @name typeJsdocAstToMdAst
 * @param {Object} [typeJsdocAst] Doctrine JSDoc AST type node.
 * @param {Array} [members=[]] Typedef name list.
 * @returns {Object[]} Markdown AST children list.
 * @ignore
 */
const typeJsdocAstToMdAst = (typeJsdocAst, members = []) => {
  switch (typeJsdocAst.type) {
    case 'OptionalType':
      return [
        ...typeJsdocAstToMdAst(typeJsdocAst.expression, members),
        { type: 'text', value: '?' }
      ]
    case 'RestType':
      return [
        { type: 'text', value: '…' },
        ...typeJsdocAstToMdAst(typeJsdocAst.expression, members)
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
    case 'FieldType':
      return [
        { type: 'text', value: `${typeJsdocAst.key}: ` },
        ...typeJsdocAstToMdAst(typeJsdocAst.value, members)
      ]
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
    case 'NameExpression':
      switch (typeJsdocAst.name) {
        case 'boolean':
        case 'number':
        case 'string':
        case 'Object':
        case 'Array':
          return [
            {
              type: 'link',
              url: `https://developer.mozilla.org/javascript/reference/global_objects/${
                typeJsdocAst.name
              }`,
              children: [{ type: 'text', value: typeJsdocAst.name }]
            }
          ]
        default: {
          const children = [{ type: 'text', value: typeJsdocAst.name }]
          const linkedMember = members.find(
            ({ namepath }) => namepath === typeJsdocAst.name
          )
          return linkedMember
            ? [
                {
                  type: 'link',
                  url: `#${slugger.slug(typeJsdocAst.name)}`,
                  children
                }
              ]
            : children
        }
      }
    case 'FunctionType': {
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

      typeJsdocAst.result
        ? children.push(
            { type: 'text', value: typeJsdocAst.params.length ? ':' : ' ):' },
            ...typeJsdocAstToMdAst(typeJsdocAst.result, members)
          )
        : children.push({
            type: 'text',
            value: !typeJsdocAst.params.length && ' )'
          })

      return children
    }
    case 'AllLiteral':
    case 'NullLiteral':
    case 'UndefinedLiteral':
    case 'NumericLiteralType':
    case 'StringLiteralType':
    case 'BooleanLiteralType':
      return [
        {
          type: 'text',
          value:
            'value' in typeJsdocAst
              ? typeJsdocAst.value
              : typeJsdocAst.type.replace('Literal', '')
        }
      ]
    default:
      throw new Error(`Unknown type ‘${typeJsdocAst.type}’.`)
  }
}

module.exports = typeJsdocAstToMdAst
