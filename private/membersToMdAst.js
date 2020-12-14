'use strict';

const remarkBehead = require('remark-behead');
const gfm = require('remark-gfm');
const toc = require('remark-toc');
const unified = require('unified');
const InvalidJsdocError = require('./InvalidJsdocError');
const deconstructJsdocNamepath = require('./deconstructJsdocNamepath');
const mdToMdAst = require('./mdToMdAst');
const outlineMembers = require('./outlineMembers');
const typeJsdocAstToMdAst = require('./typeJsdocAstToMdAst');
const typeJsdocStringToJsdocAst = require('./typeJsdocStringToJsdocAst');

const MEMBERSHIP_ORDER = [
  '.', // Static.
  '#', // Instance.
  '~', // Inner.
];
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
 * Converts JSDoc members to a markdown AST.
 * @kind function
 * @name membersToMdAst
 * @param {Array<JsdocMember>} members JSDoc members.
 * @param {CodeFilesMap} codeFiles Map of code file paths and their code.
 * @param {number} [topDepth=1] Top heading level.
 * @returns {object} Markdown AST.
 * @ignore
 */
module.exports = function membersToMdAst(members, codeFiles, topDepth = 1) {
  const outlinedMembers = outlineMembers(members, codeFiles);
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
   * @param {Array<JsdocMember>} [members] Outlined JSDoc members.
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

      if (member.type)
        mdast.children.push({
          type: 'paragraph',
          children: [
            { type: 'strong', children: [{ type: 'text', value: 'Type:' }] },
            { type: 'text', value: ' ' },
            ...typeJsdocAstToMdAst(
              typeJsdocStringToJsdocAst({ type: member.type }),
              outlinedMembers
            ),
          ],
        });

      if (member.properties) {
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

        for (const property of member.properties) {
          const typeCellChildren = typeJsdocAstToMdAst(
            typeJsdocStringToJsdocAst({
              type: property.type,
              optional: property.optional,
            }),
            outlinedMembers
          );

          if ('default' in property)
            typeCellChildren.push(
              { type: 'text', value: ' = ' },
              ...typeJsdocAstToMdAst(
                typeJsdocStringToJsdocAst({ type: property.default }),
                outlinedMembers
              )
            );

          propTable.children.push({
            type: 'tableRow',
            children: [
              {
                type: 'tableCell',
                children: [{ type: 'inlineCode', value: property.name }],
              },
              { type: 'tableCell', children: typeCellChildren },
              {
                type: 'tableCell',
                children: mdToMdAst(property.description, outlinedMembers),
              },
            ],
          });
        }

        mdast.children.push(propTable);
      }

      if (member.parameters) {
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

        for (const parameter of member.parameters) {
          const typeCellChildren = typeJsdocAstToMdAst(
            typeJsdocStringToJsdocAst({
              type: parameter.type,
              parameter: true,
              optional: parameter.optional,
            }),
            outlinedMembers
          );

          if ('default' in parameter)
            typeCellChildren.push(
              { type: 'text', value: ' = ' },
              ...typeJsdocAstToMdAst(
                typeJsdocStringToJsdocAst({ type: parameter.default }),
                outlinedMembers
              )
            );

          paramTable.children.push({
            type: 'tableRow',
            children: [
              {
                type: 'tableCell',
                children: [{ type: 'inlineCode', value: parameter.name }],
              },
              { type: 'tableCell', children: typeCellChildren },
              {
                type: 'tableCell',
                children: mdToMdAst(parameter.description, outlinedMembers),
              },
            ],
          });
        }

        mdast.children.push(paramTable);
      }

      if (member.returns) {
        const children = [
          {
            type: 'strong',
            children: [{ type: 'text', value: 'Returns:' }],
          },
        ];

        if (member.returns.type)
          children.push(
            { type: 'text', value: ' ' },
            ...typeJsdocAstToMdAst(
              typeJsdocStringToJsdocAst({ type: member.returns.type }),
              outlinedMembers
            )
          );

        if (member.returns.description)
          children.push(
            { type: 'text', value: member.returns.type ? ' — ' : ' ' },
            ...mdToMdAst(member.returns.description, outlinedMembers)
          );

        mdast.children.push({ type: 'paragraph', children });
      }

      if (member.fires) {
        mdast.children.push({
          type: 'heading',
          depth: depth + 1,
          children: [{ type: 'text', value: 'Fires' }],
        });

        const firesTagsList = {
          type: 'list',
          ordered: false,
          spread: false,
          children: [],
        };

        for (const namepath of member.fires) {
          try {
            var { memberof, membership, name } = deconstructJsdocNamepath(
              namepath
            );
          } catch (error) {
            throw new InvalidJsdocError(
              error.message,
              member.codeFileLocation.filePath,
              member.codeFileLocation.codeLocation,
              codeFiles.get(member.codeFileLocation.filePath)
            );
          }

          // The JSDoc `@fires` tag uniquely supports omitting the `event:`
          // name prefix in the event namepath.
          const eventNamepath = name.startsWith('event:')
            ? namepath
            : `${memberof}${membership}event:${name}`;
          const eventMember = outlinedMembers.find(
            ({ namepath }) => namepath === eventNamepath
          );

          if (!eventMember)
            throw new InvalidJsdocError(
              `Missing JSDoc member for event namepath “${eventNamepath}”.`,
              member.codeFileLocation.filePath,
              member.codeFileLocation.codeLocation,
              codeFiles.get(member.codeFileLocation.filePath)
            );

          firesTagsList.children.push({
            type: 'listItem',
            spread: false,
            children: [
              {
                type: 'link',
                url: `#${eventMember.slug}`,
                children: [{ type: 'text', value: eventMember.heading }],
              },
            ],
          });
        }

        mdast.children.push(firesTagsList);
      }

      if (member.see) {
        mdast.children.push({
          type: 'heading',
          depth: depth + 1,
          children: [{ type: 'text', value: 'See' }],
        });

        const seeTagsList = {
          type: 'list',
          ordered: false,
          spread: false,
          children: [],
        };

        for (const see of member.see)
          seeTagsList.children.push({
            type: 'listItem',
            spread: false,
            children: mdToMdAst(see, outlinedMembers),
          });

        mdast.children.push(seeTagsList);
      }

      if (member.examples) {
        const headingDepth = depth + 1;

        mdast.children.push({
          type: 'heading',
          depth: headingDepth,
          children: [{ type: 'text', value: 'Examples' }],
        });

        for (const { caption, content } of member.examples) {
          if (caption)
            mdast.children.push({
              type: 'paragraph',
              children: [
                {
                  type: 'emphasis',
                  children: mdToMdAst(caption, outlinedMembers),
                },
              ],
            });

          if (content) {
            const children = mdToMdAst(content, outlinedMembers);
            const transformHeadingLevel = remarkBehead({ depth: headingDepth });

            for (const node of children) transformHeadingLevel(node);

            mdast.children.push({ type: 'blockquote', children });
          }
        }
      }

      if (member.children) recurse(member.children, depth + 1);
    }
  };

  const topMembers = outlinedMembers.filter(({ parent }) => !parent);
  recurse(topMembers, topDepth);

  // Return markdown AST.
  return unified()
    .use(gfm)
    .use(toc, {
      // Prettier formatting.
      tight: true,
      skip: 'Fires|See|Examples',
    })
    .runSync(mdast);
};
