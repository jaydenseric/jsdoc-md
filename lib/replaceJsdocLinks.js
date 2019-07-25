/**
 * Replaces inline JSDoc member links with markdown links.
 * @param {string} md Markdown.
 * @param {object[]} [members] Outline members.
 * @returns {string} Markdown.
 */
const replaceJsdocLinks = (md, members) => {
  const regex = /{@link (.+?)}/g
  let match
  while ((match = regex.exec(md))) {
    const [jsdocLink, namepath] = match
    const linkedMember =
      members && members.find(member => member.namepath === namepath)
    if (linkedMember) md = md.replace(jsdocLink, `(#${linkedMember.slug})`)
    else
      throw new Error(`Missing JSDoc member for link namepath “${namepath}”.`)
  }
  return md
}

module.exports = replaceJsdocLinks
