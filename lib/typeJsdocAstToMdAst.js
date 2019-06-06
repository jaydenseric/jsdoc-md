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
  const children = []

  switch (typeJsdocAst.type) {
    case 'AllLiteral':
      children.push({ type: 'text', value: '*' })
      break
    case 'NullableLiteral':
      children.push({ type: 'text', value: '?' })
      break
    case 'NullLiteral':
      children.push({ type: 'text', value: 'null' })
      break
    case 'UndefinedLiteral':
      children.push({ type: 'text', value: 'undefined' })
      break
    case 'VoidLiteral':
      children.push({ type: 'text', value: 'void' })
      break
    case 'NumericLiteralType':
    case 'StringLiteralType':
    case 'BooleanLiteralType':
      children.push({ type: 'text', value: String(typeJsdocAst.value) })
      break
    case 'RestType':
      children.push(
        { type: 'text', value: '…' },
        ...typeJsdocAstToMdAst(typeJsdocAst.expression, members)
      )
      break
    case 'OptionalType':
      children.push(...typeJsdocAstToMdAst(typeJsdocAst.expression, members), {
        type: 'text',
        value: '?'
      })
      break
    case 'UnionType': {
      typeJsdocAst.elements.forEach((typeJsdocAst, index) => {
        if (index !== 0)
          children.push({
            type: 'text',
            value:
              // These are special no-break space Unicode characters.
              ' | '
          })
        children.push(...typeJsdocAstToMdAst(typeJsdocAst, members))
      })
      break
    }
    case 'TypeApplication': {
      children.push(...typeJsdocAstToMdAst(typeJsdocAst.expression), {
        type: 'text',
        value: '<'
      })
      typeJsdocAst.applications.forEach((typeJsdocAst, index) => {
        if (index !== 0)
          children.push({
            type: 'text',
            value:
              // This is a special no-break space Unicode character.
              ', '
          })
        children.push(...typeJsdocAstToMdAst(typeJsdocAst, members))
      })
      children.push({ type: 'text', value: '>' })
      break
    }
    case 'ArrayType': {
      children.push({ type: 'text', value: '[' })
      typeJsdocAst.elements.forEach((typeJsdocAst, index) => {
        if (index !== 0)
          children.push({
            type: 'text',
            value:
              // This is a special no-break space Unicode character.
              ', '
          })
        children.push(...typeJsdocAstToMdAst(typeJsdocAst, members))
      })
      children.push({ type: 'text', value: ']' })
      break
    }
    case 'FieldType':
      children.push(
        { type: 'text', value: `${typeJsdocAst.key}: ` },
        ...typeJsdocAstToMdAst(typeJsdocAst.value, members)
      )
      break
    case 'RecordType': {
      children.push({ type: 'text', value: '{' })
      typeJsdocAst.fields.forEach((typeJsdocAst, index) => {
        if (index !== 0)
          children.push({
            type: 'text',
            value:
              // This is a special no-break space Unicode character.
              ', '
          })
        children.push(...typeJsdocAstToMdAst(typeJsdocAst, members))
      })
      children.push({ type: 'text', value: '}' })
      break
    }
    case 'NameExpression': {
      const linkedMember =
        members &&
        members.find(({ namepath }) => namepath === typeJsdocAst.name)

      children.push(
        linkedMember
          ? {
              type: 'link',
              url: `#${linkedMember.slug}`,
              children: [{ type: 'text', value: typeJsdocAst.name }]
            }
          : { type: 'text', value: typeJsdocAst.name }
      )

      break
    }
    case 'FunctionType': {
      children.push({ type: 'text', value: 'function(' })

      if (typeJsdocAst.this)
        children.push(
          { type: 'text', value: `${typeJsdocAst.new ? 'new' : 'this'}:` },
          ...typeJsdocAstToMdAst(typeJsdocAst.this, members)
        )

      if (typeJsdocAst.params.length)
        typeJsdocAst.params.forEach((paramTypeJsdocAst, index) => {
          if (index !== 0 || typeJsdocAst.this)
            children.push({
              type: 'text',
              value:
                // This is a special no-break space Unicode character.
                ', '
            })
          children.push(...typeJsdocAstToMdAst(paramTypeJsdocAst, members))
        })

      children.push({ type: 'text', value: ')' })

      if (typeJsdocAst.result)
        children.push(
          { type: 'text', value: ':' },
          ...typeJsdocAstToMdAst(typeJsdocAst.result, members)
        )

      break
    }
    default:
      throw new Error(`Unknown JSDoc type “${typeJsdocAst.type}”.`)
  }

  return children
}

module.exports = typeJsdocAstToMdAst
