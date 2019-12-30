'use strict'

/**
 * Converts a doctrine JSDoc AST type node to markdown AST children list.
 * @kind function
 * @name typeJsdocAstToMdAst
 * @param {object} typeJsdocAst Doctrine JSDoc AST type node.
 * @param {object[]} [members] Outline members.
 * @returns {object[]} Markdown AST children list.
 * @ignore
 */
module.exports = function typeJsdocAstToMdAst(typeJsdocAst, members) {
  const children = []

  switch (typeJsdocAst.type) {
    case 'AllLiteral':
      children.push({ type: 'text', value: '*' })
      break
    case 'NullableLiteral':
      children.push({ type: 'text', value: '?' })
      break
    case 'NullLiteral':
      children.push({ type: 'inlineCode', value: 'null' })
      break
    case 'UndefinedLiteral':
      children.push({ type: 'inlineCode', value: 'undefined' })
      break
    case 'VoidLiteral':
      children.push({ type: 'inlineCode', value: 'void' })
      break
    case 'NumericLiteralType':
    case 'BooleanLiteralType':
      children.push({ type: 'inlineCode', value: String(typeJsdocAst.value) })
      break
    case 'StringLiteralType':
      children.push({
        type: 'inlineCode',
        value:
          // It would be nice to always display quotes around strings, but
          // escaping nested quotes would be tricky and may confuse readers
          // about what the value is exactly. Quotes are necessary if the string
          // is empty or only contains whitespace to avoid resulting empty
          // inline code and markdown rendering issues.
          typeJsdocAst.value.match(/^\s*$/)
            ? `'${typeJsdocAst.value}'`
            : typeJsdocAst.value
      })
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
      for (const [
        index,
        elementTypeJsdocAst
      ] of typeJsdocAst.elements.entries()) {
        if (index !== 0)
          children.push({
            type: 'text',
            value:
              // These are special no-break space Unicode characters.
              ' | '
          })
        children.push(...typeJsdocAstToMdAst(elementTypeJsdocAst, members))
      }
      break
    }
    case 'TypeApplication': {
      children.push(...typeJsdocAstToMdAst(typeJsdocAst.expression), {
        type: 'text',
        value: '<'
      })
      for (const [
        index,
        applicationTypeJsdocAst
      ] of typeJsdocAst.applications.entries()) {
        if (index !== 0)
          children.push({
            type: 'text',
            value:
              // This is a special no-break space Unicode character.
              ', '
          })
        children.push(...typeJsdocAstToMdAst(applicationTypeJsdocAst, members))
      }
      children.push({ type: 'text', value: '>' })
      break
    }
    case 'ArrayType': {
      children.push({ type: 'text', value: '[' })
      for (const [
        index,
        elementTypeJsdocAst
      ] of typeJsdocAst.elements.entries()) {
        if (index !== 0)
          children.push({
            type: 'text',
            value:
              // These are special no-break space Unicode characters.
              ', '
          })
        children.push(...typeJsdocAstToMdAst(elementTypeJsdocAst, members))
      }
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
      for (const [index, fieldTypeJsdocAst] of typeJsdocAst.fields.entries()) {
        if (index !== 0)
          children.push({
            type: 'text',
            value:
              // This is a special no-break space Unicode character.
              ', '
          })
        children.push(...typeJsdocAstToMdAst(fieldTypeJsdocAst, members))
      }
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
        for (const [
          index,
          paramTypeJsdocAst
        ] of typeJsdocAst.params.entries()) {
          if (index !== 0 || typeJsdocAst.this)
            children.push({
              type: 'text',
              value:
                // This is a special no-break space Unicode character.
                ', '
            })
          children.push(...typeJsdocAstToMdAst(paramTypeJsdocAst, members))
        }

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
