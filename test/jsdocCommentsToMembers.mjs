import jsdocCommentToMember from "../private/jsdocCommentToMember.mjs";

/**
 * Converts JSDoc comments to members.
 * @kind function
 * @name jsdocCommentsToMembers
 * @param {Array<string>} jsdocComments JSDoc comments.
 * @param {CodeFilesMap} codeFiles Map of code file paths and their code.
 * @param {string} codeFilePath File path for the code containing the JSDoc comment.
 * @returns {Array<JsdocMember>} JSDoc members.
 * @ignore
 */
export default function jsdocCommentsToMembers(
  jsdocComments,
  codeFiles,
  codeFilePath
) {
  if (!Array.isArray(jsdocComments))
    throw new TypeError("Argument 1 `jsdocComments` must be an array.");

  if (!(codeFiles instanceof Map))
    throw new TypeError("Argument 2 `codeFiles` must be a `Map` instance.");

  if (typeof codeFilePath !== "string")
    throw new TypeError("Argument 3 `codeFilePath` must be a string.");

  if (codeFilePath === "")
    throw new TypeError(
      "Argument 3 `codeFilePath` must be a populated string."
    );

  const members = [];

  for (const jsdocComment of jsdocComments) {
    const member = jsdocCommentToMember(jsdocComment, codeFiles, codeFilePath);
    if (member) members.push(member);
  }

  return members;
}
