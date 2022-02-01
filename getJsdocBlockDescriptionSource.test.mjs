import { deepStrictEqual, throws } from "assert";
import { parse } from "comment-parser";
import snapshot from "snapshot-assertion";

import COMMENT_PARSER_OPTIONS from "./COMMENT_PARSER_OPTIONS.mjs";
import getJsdocBlockDescriptionSource from "./getJsdocBlockDescriptionSource.mjs";

export default (tests) => {
  tests.add(
    "`getJsdocBlockDescriptionSource` with argument 1 `jsdocBlock` not an object.",
    () => {
      throws(() => {
        getJsdocBlockDescriptionSource(true);
      }, new TypeError("Argument 1 `jsdocBlock` must be an object."));
    }
  );

  tests.add(
    "`getJsdocBlockDescriptionSource` with no description, tag.",
    () => {
      const [jsdocBlock] = parse("/**@a*/", {
        ...COMMENT_PARSER_OPTIONS,
        startLine: 1,
      });

      deepStrictEqual(getJsdocBlockDescriptionSource(jsdocBlock), []);
    }
  );

  tests.add(
    "`getJsdocBlockDescriptionSource` with a description, no tags.",
    async () => {
      const [jsdocBlock] = parse(
        `/**
 * Line 1.
 * Line 2.
 */`,
        {
          ...COMMENT_PARSER_OPTIONS,
          startLine: 1,
        }
      );

      await snapshot(
        JSON.stringify(getJsdocBlockDescriptionSource(jsdocBlock), null, 2),
        new URL(
          "./test/snapshots/getJsdocBlockDescriptionSource/description-no-tags.json",
          import.meta.url
        )
      );
    }
  );

  tests.add(
    "`getJsdocBlockDescriptionSource` with a description, tags.",
    async () => {
      const [jsdocBlock] = parse(
        `/**
 * Line 1.
 * Line 2.
 * @a
 * @b
 */`,
        {
          ...COMMENT_PARSER_OPTIONS,
          startLine: 1,
        }
      );

      await snapshot(
        JSON.stringify(getJsdocBlockDescriptionSource(jsdocBlock), null, 2),
        new URL(
          "./test/snapshots/getJsdocBlockDescriptionSource/description-tags.json",
          import.meta.url
        )
      );
    }
  );
};
