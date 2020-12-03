'use strict';

/**
 * Replaces inline JSDoc member links with markdown links.
 * @kind function
 * @name replaceJsdocLinks
 * @param {string} markdown Markdown.
 * @param {Array<JsdocMember>} [members] Outlined JSDoc members.
 * @returns {string} Markdown.
 * @ignore
 */
module.exports = function replaceJsdocLinks(markdown, members) {
  if (typeof markdown !== 'string')
    throw new TypeError('First argument “markdown” must be a string.');

  const regex = /{@link (.+?)}/g;

  let match;

  while ((match = regex.exec(markdown))) {
    const [jsdocLink, namepath] = match;
    const linkedMember =
      members && members.find((member) => member.namepath === namepath);
    if (linkedMember)
      markdown = markdown.replace(jsdocLink, `(#${linkedMember.slug})`);
    else
      throw new Error(`Missing JSDoc member for link namepath “${namepath}”.`);
  }

  return markdown;
};
