'use strict';

const remarkBehead = require('remark-behead');
const toc = require('remark-toc');
const unified = require('unified');
const getJsdocAstTag = require('./getJsdocAstTag');
const getJsdocAstTags = require('./getJsdocAstTags');
const mdToMdAst = require('./mdToMdAst');
const outlineMembers = require('./outlineMembers');
const typeJsdocAstToMdAst = require('./typeJsdocAstToMdAst');
const typeJsdocStringToJsdocAst = require('./typeJsdocStringToJsdocAst');

const MEMBERSHIP_ORDER = ['.', '#', '~'];
const KIND_ORDER = [
  'external',
  'file',
  'module',
  'namespace',
  'class',
  'function',
  'member',
  'constant',
  'event',
  'mixin',
  'typedef',
];

/**
 * Converts members to a markdown AST.
 * @kind function
 * @name membersToMdAst
 * @param {object[]} members Members.
 * @param {number} topDepth Top heading level.
 * @returns {object} Markdown AST.
 * @ignore
 */
module.exports = function membersToMdAst(members, topDepth = 1) {
  const outlinedMembers = outlineMembers(members);
  const mdast = {
    type: 'root',
    children: [
      {
        type: 'heading',
        depth: topDepth,
        children: [{ type: 'text', value: 'Table of contents' }],
      },
    ],
  };

  /**
   * Recursively constructs the markdown AST.
   * @kind function
   * @name membersToMdAst~recurse
   * @param {object[]} [members] Outline members.
   * @param {number} depth Top heading level for the members.
   * @ignore
   */
  const recurse = (members, depth) => {
    for (const member of members.sort((a, b) =>
      a.membership !== b.membership
        ? MEMBERSHIP_ORDER.indexOf(a.membership) -
          MEMBERSHIP_ORDER.indexOf(b.membership)
        : a.kind !== b.kind
        ? KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind)
        : a.name.localeCompare(b.name)
    )) {
      if (depth === topDepth) mdast.children.push({ type: 'thematicBreak' });

      mdast.children.push({
        type: 'heading',
        depth,
        children: [{ type: 'text', value: member.heading }],
      });

      if (member.description) {
        const children = mdToMdAst(member.description, outlinedMembers);
        const transformHeadingLevel = remarkBehead({ depth });
        for (const node of children) transformHeadingLevel(node);
        mdast.children.push(...children);
      }

      const typeTag = getJsdocAstTag(member.tags, 'type');
      if (typeTag)
        mdast.children.push({
          type: 'paragraph',
          children: [
            { type: 'strong', children: [{ type: 'text', value: 'Type:' }] },
            { type: 'text', value: ' ' },
            ...typeJsdocAstToMdAst(typeTag.type, outlinedMembers),
          ],
        });

      const propTags = getJsdocAstTags(member.tags, 'prop');
      if (propTags) {
        const propTable = {
          type: 'table',
          align: ['left', 'left', 'left'],
          children: [
            {
              type: 'tableRow',
              children: [
                {
                  type: 'tableCell',
                  children: [{ type: 'text', value: 'Property' }],
                },
                {
                  type: 'tableCell',
                  children: [{ type: 'text', value: 'Type' }],
                },
                {
                  type: 'tableCell',
                  children: [{ type: 'text', value: 'Description' }],
                },
              ],
            },
          ],
        };

        for (const tag of propTags) {
          const typeCellChildren = typeJsdocAstToMdAst(
            tag.type,
            outlinedMembers
          );

          if ('default' in tag)
            typeCellChildren.push(
              { type: 'text', value: ' = ' },
              ...typeJsdocAstToMdAst(
                typeJsdocStringToJsdocAst(tag.default),
                outlinedMembers
              )
            );

          propTable.children.push({
            type: 'tableRow',
            children: [
              {
                type: 'tableCell',
                children: [{ type: 'inlineCode', value: tag.name }],
              },
              { type: 'tableCell', children: typeCellChildren },
              {
                type: 'tableCell',
                children: mdToMdAst(tag.description, outlinedMembers),
              },
            ],
          });
        }

        mdast.children.push(propTable);
      }

      const paramTags = getJsdocAstTags(member.tags, 'param');
      if (paramTags) {
        const paramTable = {
          type: 'table',
          align: ['left', 'left', 'left'],
          children: [
            {
              type: 'tableRow',
              children: [
                {
                  type: 'tableCell',
                  children: [{ type: 'text', value: 'Parameter' }],
                },
                {
                  type: 'tableCell',
                  children: [{ type: 'text', value: 'Type' }],
                },
                {
                  type: 'tableCell',
                  children: [{ type: 'text', value: 'Description' }],
                },
              ],
            },
          ],
        };

        for (const tag of paramTags) {
          const typeCellChildren = typeJsdocAstToMdAst(
            tag.type,
            outlinedMembers
          );

          if ('default' in tag)
            typeCellChildren.push(
              { type: 'text', value: ' = ' },
              ...typeJsdocAstToMdAst(
                typeJsdocStringToJsdocAst(tag.default),
                outlinedMembers
              )
            );

          paramTable.children.push({
            type: 'tableRow',
            children: [
              {
                type: 'tableCell',
                children: [{ type: 'inlineCode', value: tag.name }],
              },
              { type: 'tableCell', children: typeCellChildren },
              {
                type: 'tableCell',
                children: mdToMdAst(tag.description, outlinedMembers),
              },
            ],
          });
        }

        mdast.children.push(paramTable);
      }

      const returnsTag = getJsdocAstTag(member.tags, 'returns');
      if (returnsTag) {
        const children = [
          {
            type: 'strong',
            children: [{ type: 'text', value: 'Returns:' }],
          },
        ];

        if (returnsTag.type)
          children.push(
            { type: 'text', value: ' ' },
            ...typeJsdocAstToMdAst(returnsTag.type, outlinedMembers)
          );

        if (returnsTag.description)
          children.push(
            { type: 'text', value: returnsTag.type ? ' — ' : ' ' },
            ...mdToMdAst(returnsTag.description, outlinedMembers)
          );

        mdast.children.push({ type: 'paragraph', children });
      }

      const seeTags = getJsdocAstTags(member.tags, 'see');
      if (seeTags) {
        mdast.children.push({
          type: 'heading',
          depth: depth + 1,
          children: [{ type: 'text', value: 'See' }],
        });

        const seeTagsList = { type: 'list', ordered: false, children: [] };

        for (const tag of seeTags)
          seeTagsList.children.push({
            type: 'listItem',
            children: mdToMdAst(tag.description, outlinedMembers),
          });

        mdast.children.push(seeTagsList);
      }

      const exampleTags = getJsdocAstTags(member.tags, 'example');
      if (exampleTags) {
        const headingDepth = depth + 1;

        mdast.children.push({
          type: 'heading',
          depth: headingDepth,
          children: [{ type: 'text', value: 'Examples' }],
        });

        for (const tag of exampleTags) {
          if (tag.caption)
            mdast.children.push({
              type: 'paragraph',
              children: [
                {
                  type: 'emphasis',
                  children: mdToMdAst(tag.caption, outlinedMembers),
                },
              ],
            });

          const children = mdToMdAst(tag.description, outlinedMembers);
          const transformHeadingLevel = remarkBehead({ depth: headingDepth });

          for (const node of children) transformHeadingLevel(node);

          mdast.children.push({ type: 'blockquote', children });
        }
      }

      if (member.children) recurse(member.children, depth + 1);
    }
  };

  const topMembers = outlinedMembers.filter(({ parent }) => !parent);
  recurse(topMembers, topDepth);

  // Return markdown AST.
  return unified()
    .use(toc, {
      // Prettier formatting.
      tight: true,
      skip: 'See|Examples',
    })
    .runSync(mdast);
};
