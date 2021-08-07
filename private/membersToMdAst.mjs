import remarkBehead from 'remark-behead';
import remarkGfm from 'remark-gfm';
import remarkToc from 'remark-toc';
import { unified } from 'unified';
import InvalidJsdocError from './InvalidJsdocError.mjs';
import deconstructJsdocNamepath from './deconstructJsdocNamepath.mjs';
import jsdocDataMdToMdAst from './jsdocDataMdToMdAst.mjs';
import jsdocDataTypeToMdAst from './jsdocDataTypeToMdAst.mjs';
import outlineMembers from './outlineMembers.mjs';

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
export default function membersToMdAst(members, codeFiles, topDepth = 1) {
  if (!Array.isArray(members))
    throw new TypeError('Argument 1 `members` must be an array.');

  if (!(codeFiles instanceof Map))
    throw new TypeError('Argument 2 `codeFiles` must be a `Map` instance.');

  if (typeof topDepth !== 'number')
    throw new TypeError('Argument 3 `topDepth` must be a number.');

  if (topDepth < 1) throw new RangeError('Argument 3 `topDepth` must be >= 1.');

  const outlinedMembers = outlineMembers(members, codeFiles);
  const mdAst = { type: 'root', children: [] };

  /**
   * Recursively constructs the markdown AST.
   * @kind function
   * @name membersToMdAst~recurse
   * @param {Array<JsdocMember>} members Outlined JSDoc members.
   * @param {number} depth Top heading level for the members.
   * @ignore
   */
  const recurse = (members, depth) => {
    let memberIndex = 0;

    for (const member of members.sort((a, b) =>
      a.membership !== b.membership
        ? MEMBERSHIP_ORDER.indexOf(a.membership) -
          MEMBERSHIP_ORDER.indexOf(b.membership)
        : a.kind !== b.kind
        ? KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind)
        : a.name.localeCompare(b.name)
    )) {
      // Show a horizontal rule before all top level members, after the first.
      if (depth === topDepth && memberIndex)
        mdAst.children.push({ type: 'thematicBreak' });

      mdAst.children.push({
        type: 'heading',
        depth,
        children: [{ type: 'text', value: member.heading }],
      });

      if (member.description) {
        const children = jsdocDataMdToMdAst(
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
            ...jsdocDataTypeToMdAst(
              member.type,
              outlinedMembers,
              codeFiles,
              false,
              false
            ),
          ],
        });

      if (member.properties) {
        const propertiesTableHasColumnType = member.properties.some(
          ({ type, default: defaultValue }) => type || defaultValue
        );
        const propertiesTableHasColumnDescription = member.properties.some(
          ({ description }) => description
        );
        const propertiesTableAlign = ['left'];
        const propertiesTableRowHeader = {
          type: 'tableRow',
          children: [
            {
              type: 'tableCell',
              children: [{ type: 'text', value: 'Property' }],
            },
          ],
        };

        if (propertiesTableHasColumnType) {
          propertiesTableAlign.push('left');
          propertiesTableRowHeader.children.push({
            type: 'tableCell',
            children: [{ type: 'text', value: 'Type' }],
          });
        }

        if (propertiesTableHasColumnDescription) {
          propertiesTableAlign.push('left');
          propertiesTableRowHeader.children.push({
            type: 'tableCell',
            children: [{ type: 'text', value: 'Description' }],
          });
        }

        const propertiesTable = {
          type: 'table',
          align: propertiesTableAlign,
          children: [propertiesTableRowHeader],
        };

        for (const property of member.properties) {
          const propertiesTableRow = {
            type: 'tableRow',
            children: [
              {
                type: 'tableCell',
                children: [{ type: 'inlineCode', value: property.name }],
              },
            ],
          };

          if (propertiesTableHasColumnType) {
            const typeTableCell = {
              type: 'tableCell',
              children: property.type
                ? jsdocDataTypeToMdAst(
                    property.type,
                    outlinedMembers,
                    codeFiles,
                    property.optional,
                    false
                  )
                : [],
            };

            if (property.default)
              typeTableCell.children.push(
                { type: 'text', value: ' = ' },
                ...jsdocDataTypeToMdAst(
                  property.default,
                  outlinedMembers,
                  codeFiles,
                  false,
                  false
                )
              );

            propertiesTableRow.children.push(typeTableCell);
          }

          if (propertiesTableHasColumnDescription)
            propertiesTableRow.children.push({
              type: 'tableCell',
              children: property.description
                ? jsdocDataMdToMdAst(
                    property.description,
                    outlinedMembers,
                    codeFiles
                  )
                : [],
            });

          propertiesTable.children.push(propertiesTableRow);
        }

        mdAst.children.push(propertiesTable);
      }

      if (member.parameters) {
        const parametersTableHasColumnType = member.parameters.some(
          ({ type, default: defaultValue }) => type || defaultValue
        );
        const parametersTableHasColumnDescription = member.parameters.some(
          ({ description }) => description
        );
        const parametersTableAlign = ['left'];
        const parametersTableRowHeader = {
          type: 'tableRow',
          children: [
            {
              type: 'tableCell',
              children: [{ type: 'text', value: 'Parameter' }],
            },
          ],
        };

        if (parametersTableHasColumnType) {
          parametersTableAlign.push('left');
          parametersTableRowHeader.children.push({
            type: 'tableCell',
            children: [{ type: 'text', value: 'Type' }],
          });
        }

        if (parametersTableHasColumnDescription) {
          parametersTableAlign.push('left');
          parametersTableRowHeader.children.push({
            type: 'tableCell',
            children: [{ type: 'text', value: 'Description' }],
          });
        }

        const parametersTable = {
          type: 'table',
          align: parametersTableAlign,
          children: [parametersTableRowHeader],
        };

        for (const parameter of member.parameters) {
          const parametersTableRow = {
            type: 'tableRow',
            children: [
              {
                type: 'tableCell',
                children: [{ type: 'inlineCode', value: parameter.name }],
              },
            ],
          };

          if (parametersTableHasColumnType) {
            const typeTableCell = {
              type: 'tableCell',
              children: parameter.type
                ? jsdocDataTypeToMdAst(
                    parameter.type,
                    outlinedMembers,
                    codeFiles,
                    parameter.optional,
                    true
                  )
                : [],
            };

            if (parameter.default)
              typeTableCell.children.push(
                { type: 'text', value: ' = ' },
                ...jsdocDataTypeToMdAst(
                  parameter.default,
                  outlinedMembers,
                  codeFiles,
                  false,
                  false
                )
              );

            parametersTableRow.children.push(typeTableCell);
          }

          if (parametersTableHasColumnDescription)
            parametersTableRow.children.push({
              type: 'tableCell',
              children: parameter.description
                ? jsdocDataMdToMdAst(
                    parameter.description,
                    outlinedMembers,
                    codeFiles
                  )
                : [],
            });

          parametersTable.children.push(parametersTableRow);
        }

        mdAst.children.push(parametersTable);
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
            ...jsdocDataTypeToMdAst(
              member.returns.type,
              outlinedMembers,
              codeFiles,
              false,
              false
            )
          );

        if (member.returns.description)
          children.push(
            { type: 'text', value: member.returns.type ? ' — ' : ' ' },
            ...jsdocDataMdToMdAst(
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
            children: jsdocDataMdToMdAst(see, outlinedMembers, codeFiles),
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
                  children: jsdocDataMdToMdAst(
                    caption,
                    outlinedMembers,
                    codeFiles
                  ),
                },
              ],
            });

          if (content) {
            const children = jsdocDataMdToMdAst(
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

      memberIndex++;
    }
  };

  const topMembers = outlinedMembers.filter(({ parent }) => !parent);
  recurse(topMembers, topDepth);

  // If there’s multiple members, insert a Table of Contents (ToC) at the start.
  if (outlinedMembers.length > 1) {
    // Temporarily insert a heading for the ToC to be inserted under.
    mdAst.children.unshift({
      type: 'heading',
      depth: topDepth,
      children: [{ type: 'text', value: 'Table of contents' }],
    });

    const mdAstWithToC = unified()
      .use(remarkGfm)
      .use(remarkToc, {
        // Prettier formatting.
        tight: true,
        skip: 'Fires|See|Examples',
      })
      .runSync(mdAst);

    // Remove the temporary ToC heading.
    mdAstWithToC.children.shift();

    return mdAstWithToC;
  }

  return mdAst;
}
