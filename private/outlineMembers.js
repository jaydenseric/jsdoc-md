'use strict';

const GithubSlugger = require('github-slugger');

const MEMBERSHIPS = {
  '.': 'static',
  '#': 'instance',
  '~': 'inner',
};

/**
 * Enriches a member list with outline metadata and relation references.
 * @kind function
 * @name outlineMembers
 * @param {Array<object>} members Members.
 * @returns {Array<object>} Outlined members.
 * @ignore
 */
module.exports = function outlineMembers(members) {
  // Prevent modification of the input array.
  const outline = members.slice();
  const slugger = new GithubSlugger();

  for (const member of outline) {
    // Is the member top-level, or nested?
    if (member.memberof) {
      // Set the parent property.
      const parent = outline.find((mem) => mem.namepath === member.memberof);
      if (!parent)
        throw new Error(`Missing JSDoc for namepath “${member.memberof}”.`);
      member.parent = parent;

      // Update the parent member’s children property.
      if (!Array.isArray(parent.children)) parent.children = [];
      parent.children.push(member);
    }

    // Set the heading property.
    member.heading = '';

    if (member.memberof) {
      member.heading += `${member.memberof} `;

      if (member.kind !== 'event')
        member.heading += `${MEMBERSHIPS[member.membership]} `;
    }

    member.heading +=
      member.kind === 'function' &&
      member.parent &&
      member.parent.kind === 'class' &&
      member.membership !== '~'
        ? 'method '
        : member.kind === 'member' &&
          member.membership &&
          member.membership !== '~'
        ? 'property '
        : member.kind === 'typedef'
        ? 'type '
        : `${member.kind} `;

    member.heading +=
      member.kind === 'event'
        ? member.name.replace(/^event:/, '')
        : member.name;

    // Set the slug property.
    member.slug = slugger.slug(member.heading);
  }

  return outline;
};
