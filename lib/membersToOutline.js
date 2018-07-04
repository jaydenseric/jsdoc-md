/**
 * Converts a members list to an outline.
 * @kind function
 * @name membersToOutline
 * @param {Object[]} members Outline members.
 * @returns {Object[]} Outline.
 * @ignore
 */
const membersToOutline = members => {
  // Prevent modification of the input array.
  let membersClone = members.slice()

  /**
   * Recursively constructs the outline.
   * @kind function
   * @name membersToOutline~recurse
   * @param {string} parentNamepath JSDoc namepath of the parent member.
   * @returns {Object[]} Outline.
   * @ignore
   */
  const recurse = parentNamepath => {
    const outline = []

    // Reduce the search each time members are placed in the outline.
    membersClone = membersClone.filter(member => {
      if (member.memberof === parentNamepath) {
        outline.push({ ...member, members: recurse(member.namepath) })
        return false
      }
      return true
    })

    return outline
  }

  return recurse()
}

module.exports = membersToOutline
