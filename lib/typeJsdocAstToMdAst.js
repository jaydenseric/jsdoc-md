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

      if (linkedMember)
        return [
          {
            type: 'link',
            url: `#${linkedMember.slug}`,
            children: [{ type: 'text', value: typeJsdocAst.name }]
          }
        ]

      const lowercaseName = typeJsdocAst.name.toLowerCase()
      switch (lowercaseName) {
        case 'array':
        case 'boolean':
        case 'date':
        case 'function':
        case 'number':
        case 'object':
        case 'promise':
        case 'string':
        case 'uint8array':
          return [
            {
              type: 'link',
              url: `https://mdn.io/${lowercaseName}`,
              children: [{ type: 'text', value: typeJsdocAst.name }]
            }
          ]
      }

      return [{ type: 'text', value: typeJsdocAst.name }]
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
