import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { removePosition } from 'unist-util-remove-position';
import CodeLocation from './CodeLocation.mjs';
import CodePosition from './CodePosition.mjs';
import InvalidJsdocError from './InvalidJsdocError.mjs';
import codePositionToIndex from './codePositionToIndex.mjs';
import unescapeJsdoc from './unescapeJsdoc.mjs';

/**
 * Converts JSDoc data containing markdown to a markdown AST, replacing inline
 * JSDoc `link` tags with markdown links.
 * @kind function
 * @name jsdocDataMdToMdAst
 * @param {JsdocData} jsdocData JSDoc data containing markdown.
 * @param {Array<JsdocMember>} members Outlined JSDoc members.
 * @param {CodeFilesMap} codeFiles Map of code file paths and their code.
 * @returns {object} Markdown AST.
 * @ignore
 */
export default function jsdocDataMdToMdAst(jsdocData, members, codeFiles) {
  if (typeof jsdocData !== 'object')
    throw new TypeError('Argument 1 `jsdocData` must be an object.');

  if (typeof jsdocData.codeFileLocation !== 'object')
    throw new TypeError(
      'Argument 1 `jsdocData` property `codeFileLocation` must be an object.'
    );

  if (typeof jsdocData.codeFileLocation.filePath !== 'string')
    throw new TypeError(
      'Argument 1 `jsdocData` property `codeFileLocation` property `filePath` must be a string.'
    );

  if (!(jsdocData.codeFileLocation.codeLocation instanceof CodeLocation))
    throw new TypeError(
      'Argument 1 `jsdocData` property `codeFileLocation` property `codeLocation` must be a `CodeLocation` instance.'
    );

  if (typeof jsdocData.data !== 'string')
    throw new TypeError(
      'Argument 1 `jsdocData` property `data` must be a string.'
    );

  if (!Array.isArray(members))
    throw new TypeError('Argument 2 `members` must be an array.');

  if (!(codeFiles instanceof Map))
    throw new TypeError('Argument 3 `codeFiles` must be a `Map` instance.');

  // The JSDoc data comes from `comment-parser`, which strips the JSDoc comment
  // fences (e.g. ` * `) from each line. These need to be present when searching
  // for JSDoc inline links, so their regex match indexes can be used to derive
  // code locations for namepath error messages. The relevant source code region
  // is extracted for the search.
  const code = codeFiles.get(jsdocData.codeFileLocation.filePath);
  const jsdocDataCode = code.substring(
    codePositionToIndex(jsdocData.codeFileLocation.codeLocation.start, code),
    codePositionToIndex(jsdocData.codeFileLocation.codeLocation.end, code) + 1
  );

  // Within each JSDoc inline link match, group what comes before the JSDoc
  // namepath so it’s length can be added to the match index to get the namepath
  // offset, so a code location can be derived for a namepath error message.
  const regex =
    /(?<beforeNamepath>\{[ \t]*@link[ \t]+)(?<namepathData>\S+?)[ \t]*\}/gu;

  let replacedMd = jsdocData.data;
  let match;

  while ((match = regex.exec(jsdocDataCode))) {
    const {
      0: jsdocInlineLinkData,
      index: jsdocInlineLinkOffsetStart,
      groups: { beforeNamepath, namepathData },
    } = match;

    const linkedMember = members.find(
      ({ namepath: { data } }) => data === namepathData
    );

    if (linkedMember)
      replacedMd = replacedMd.replace(
        jsdocInlineLinkData,
        `(#${linkedMember.slug})`
      );
    else {
      let { line, column } = jsdocData.codeFileLocation.codeLocation.start;
      let charIndex = 0;

      const nextChar = () => {
        if (jsdocDataCode[charIndex] === '\n') {
          line++;
          column = 1;
        } else column++;

        charIndex++;
      };

      const namepathOffsetStart =
        jsdocInlineLinkOffsetStart + beforeNamepath.length;
      const namepathOffsetEnd = namepathOffsetStart + namepathData.length - 1;

      while (charIndex < namepathOffsetStart) nextChar();

      const namepathStart = new CodePosition(line, column);

      while (charIndex < namepathOffsetEnd) nextChar();

      throw new InvalidJsdocError(
        `Missing JSDoc member for JSDoc inline link namepath \`${namepathData}\`.`,
        {
          filePath: jsdocData.codeFileLocation.filePath,
          codeLocation: new CodeLocation(
            namepathStart,
            new CodePosition(line, column)
          ),
        },
        code
      );
    }
  }

  // The AST nodes from a parsed markdown string contain `position` data
  // (https://github.com/syntax-tree/unist#position). This data should be
  // removed because it will no longer be correct once these AST nodes are
  // inserted into another AST. While leaving the incorrect data in place is
  // technically more efficient and harmless to the public API, it bloats
  // private test snapshots.
  return removePosition(
    unified().use(remarkParse).use(remarkGfm).parse(unescapeJsdoc(replacedMd)),

    // Delete the `position` properties from nodes instead of only replacing
    // their values with `undefined`.
    true
  ).children;
}
