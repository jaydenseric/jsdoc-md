const MEMBERSHIPS = {
  '.': 'static',
  '#': 'instance',
  '~': 'inner'
}

/**
 * Enriches a member list with outline metadata and relation references.
 * @kind function
 * @name outlineMembers
 * @param {Object[]} members Members.
 * @returns {Object[]} Outlined members.
 * @ignore
 */
const outlineMembers = members => {
  // Prevent modification of the input array.
  const outline = members.slice()

  outline.forEach(member => {
    // Is the member top-level, or nested?
    if (member.memberof) {
      // Set the parent property.
      const parent = outline.find(mem => mem.namepath === member.memberof)
      if (!parent)
        throw new Error(`Missing JSDoc for namepath “${member.memberof}”.`)
      member.parent = parent

      // Update the parent member’s children property.
      if (!Array.isArray(parent.children)) parent.children = []
      parent.children.push(member)
    }

    // Set the heading property.
    member.heading = `${member.memberof ? `${member.memberof} ` : ''}${
      member.parent && member.parent.kind === 'class'
        ? `${MEMBERSHIPS[member.membership]} ${
            member.kind === 'function' && member.membership !== '~'
              ? 'method'
              : member.kind === 'member'
                ? 'property'
                : member.kind
          }`
        : member.kind === 'typedef'
          ? 'type'
          : member.kind
    } ${member.name}`
  })

  return outline
}

module.exports = outlineMembers
