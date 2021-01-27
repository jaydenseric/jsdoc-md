'use strict';

const remarkBehead = require('remark-behead');
const gfm = require('remark-gfm');
const toc = require('remark-toc');
const unified = require('unified');
const InvalidJsdocError = require('./InvalidJsdocError');
const deconstructJsdocNamepath = require('./deconstructJsdocNamepath');
const jsdocDataToMdAst = require('./jsdocDataToMdAst');
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
  if (!Array.isArray(members))
    throw new TypeError('First argument `members` must be an array.');

  if (!(codeFiles instanceof Map))
    throw new TypeError(
      'Second argument `codeFiles` must be a `Map` instance.'
    );

  if (typeof topDepth !== 'number')
    throw new TypeError('Third argument `topDepth` must be a number.');

  if (topDepth < 1)
    throw new RangeError('Third argument `topDepth` must be >= 1.');

  const outlinedMembers = outlineMembers(members, codeFiles);
  const mdAst = {
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
   * @param {Array<JsdocMember>} members Outlined JSDoc members.
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
      if (depth === topDepth) mdAst.children.push({ type: 'thematicBreak' });

      mdAst.children.push({
        type: 'heading',
        depth,
        children: [{ type: 'text', value: member.heading }],
      });

      if (member.description) {
        const children = jsdocDataToMdAst(
          member.description,
          outlinedMembers,
          codeFiles
        );
        const transformHeadingLevel = remarkBehead({ depth });
        for (const node of children) transformHeadingLevel(node);
        mdAst.children.push(...children);
      }

      if (member.type)
        mdAst.children.push({
          type: 'paragraph',
          children: [
            { type: 'strong', children: [{ type: 'text', value: 'Type:' }] },
            { type: 'text', value: ' ' },
            ...typeJsdocAstToMdAst(
              typeJsdocStringToJsdocAst({ type: member.type.data }),
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
              type: property.type.data,
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
                children: jsdocDataToMdAst(
                  property.description,
                  outlinedMembers,
                  codeFiles
                ),
              },
            ],
          });
        }

        mdAst.children.push(propTable);
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
              type: parameter.type.data,
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
                children: jsdocDataToMdAst(
                  parameter.description,
                  outlinedMembers,
                  codeFiles
                ),
              },
            ],
          });
        }

        mdAst.children.push(paramTable);
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
              typeJsdocStringToJsdocAst({ type: member.returns.type.data }),
              outlinedMembers
            )
          );

        if (member.returns.description)
          children.push(
            { type: 'text', value: member.returns.type ? ' — ' : ' ' },
            ...jsdocDataToMdAst(
              member.returns.description,
              outlinedMembers,
              codeFiles
            )
          );

        mdAst.children.push({ type: 'paragraph', children });
      }

      if (member.fires) {
        mdAst.children.push({
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
              namepath.data
            );
          } catch (error) {
            throw new InvalidJsdocError(
              error.message,
              namepath.codeFileLocation,
              codeFiles.get(namepath.codeFileLocation.filePath)
            );
          }

          // The JSDoc `@fires` tag uniquely supports omitting the `event:`
          // name prefix in the event namepath.
          const eventNamepath = name.startsWith('event:')
            ? namepath.data
            : `${memberof}${membership}event:${name}`;
          const eventMember = outlinedMembers.find(
            ({ namepath: { data } }) => data === eventNamepath
          );

          if (!eventMember)
            throw new InvalidJsdocError(
              `Missing JSDoc member for event namepath \`${eventNamepath}\`.`,
              namepath.codeFileLocation,
              codeFiles.get(namepath.codeFileLocation.filePath)
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

        mdAst.children.push(firesTagsList);
      }

      if (member.see) {
        mdAst.children.push({
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
            children: jsdocDataToMdAst(see, outlinedMembers, codeFiles),
          });

        mdAst.children.push(seeTagsList);
      }

      if (member.examples) {
        const headingDepth = depth + 1;

        mdAst.children.push({
          type: 'heading',
          depth: headingDepth,
          children: [{ type: 'text', value: 'Examples' }],
        });

        for (const { caption, content } of member.examples) {
          if (caption)
            mdAst.children.push({
              type: 'paragraph',
              children: [
                {
                  type: 'emphasis',
                  children: jsdocDataToMdAst(
                    caption,
                    outlinedMembers,
                    codeFiles
                  ),
                },
              ],
            });

          if (content) {
            const children = jsdocDataToMdAst(
              content,
              outlinedMembers,
              codeFiles
            );
            const transformHeadingLevel = remarkBehead({ depth: headingDepth });

            for (const node of children) transformHeadingLevel(node);

            mdAst.children.push({ type: 'blockquote', children });
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
    .runSync(mdAst);
};
