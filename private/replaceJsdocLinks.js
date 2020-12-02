'use strict';

/**
 * Replaces inline JSDoc member links with markdown links.
 * @kind function
 * @name replaceJsdocLinks
 * @param {string} md Markdown.
 * @param {Array<object>} [members] Outlined JSDoc members.
 * @returns {string} Markdown.
 * @ignore
 */
module.exports = function replaceJsdocLinks(md, members) {
  const regex = /{@link (.+?)}/g;
  let match;
  while ((match = regex.exec(md))) {
    const [jsdocLink, namepath] = match;
    const linkedMember =
      members && members.find((member) => member.namepath === namepath);
    if (linkedMember) md = md.replace(jsdocLink, `(#${linkedMember.slug})`);
    else
      throw new Error(`Missing JSDoc member for link namepath “${namepath}”.`);
  }
  return md;
};
