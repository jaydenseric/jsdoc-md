import { deepStrictEqual, throws } from "assert";
import { parse } from "comment-parser";

import CodeLocation from "./CodeLocation.mjs";
import CodePosition from "./CodePosition.mjs";
import COMMENT_PARSER_OPTIONS from "./COMMENT_PARSER_OPTIONS.mjs";
import getJsdocSourceTokenCodeLocation from "./getJsdocSourceTokenCodeLocation.mjs";

export default (tests) => {
  tests.add(
    "`getJsdocSourceTokenCodeLocation` with argument 1 `jsdocSource` not an array.",
    () => {
      throws(() => {
        getJsdocSourceTokenCodeLocation(true);
      }, new TypeError("Argument 1 `jsdocSource` must be an array."));
    }
  );

  tests.add(
    "`getJsdocSourceTokenCodeLocation` with argument 2 `dataTokenName` not a string.",
    () => {
      const [
        {
          tags: [{ source }],
        },
      ] = parse("/** @abc {def} hij Klm nop. */", {
        ...COMMENT_PARSER_OPTIONS,
        startLine: 1,
      });

      throws(() => {
        getJsdocSourceTokenCodeLocation(source, true);
      }, new TypeError("Argument 2 `dataTokenName` must be a string."));
    }
  );

  tests.add(
    "`getJsdocSourceTokenCodeLocation` with argument 2 `dataTokenName` not an data token name.",
    () => {
      const [
        {
          tags: [{ source }],
        },
      ] = parse("/** @abc {def} hij Klm nop. */", {
        ...COMMENT_PARSER_OPTIONS,
        startLine: 1,
      });

      throws(() => {
        getJsdocSourceTokenCodeLocation(source, "notavalidtokenname");
      }, new TypeError("Argument 2 `dataTokenName` must be a JSDoc source data token name."));
    }
  );

  tests.add(
    "`getJsdocSourceTokenCodeLocation` with argument 3 `firstLineStartColumnNumber` not a `CodePosition` instance.",
    () => {
      const [
        {
          tags: [{ source }],
        },
      ] = parse("/** @abc {def} hij Klm nop. */", {
        ...COMMENT_PARSER_OPTIONS,
        startLine: 1,
      });

      throws(() => {
        getJsdocSourceTokenCodeLocation(source, "name", true);
      }, new TypeError("Argument 3 `startCodePosition` must be a `CodePosition` instance."));
    }
  );

  tests.add(
    "`getJsdocSourceTokenCodeLocation` with source token missing.",
    () => {
      const startLine = 1;
      const [
        {
          tags: [{ source }],
        },
      ] = parse("/** @abc {def} hij */", {
        ...COMMENT_PARSER_OPTIONS,
        startLine,
      });

      throws(() => {
        getJsdocSourceTokenCodeLocation(
          source,
          "description",
          new CodePosition(startLine, 1)
        );
      }, new Error("Unable to get a code location for JSDoc source token `description`."));
    }
  );

  tests.add(
    "`getJsdocSourceTokenCodeLocation` with start line 1 column 1, singleline block tag, data token `type`.",
    () => {
      const startLine = 1;
      const [
        {
          tags: [{ source }],
        },
      ] = parse("/** @abc {def} hij Klm nop. */", {
        ...COMMENT_PARSER_OPTIONS,
        startLine,
      });

      deepStrictEqual(
        getJsdocSourceTokenCodeLocation(
          source,
          "type",
          new CodePosition(startLine, 1)
        ),
        new CodeLocation(new CodePosition(1, 10), new CodePosition(1, 14))
      );
    }
  );

  tests.add(
    "`getJsdocSourceTokenCodeLocation` with start line 2 column 3, singleline block tag, data token `type`.",
    () => {
      const startLine = 2;
      const [
        {
          tags: [{ source }],
        },
      ] = parse("/** @abc {def} hij Klm nop. */", {
        ...COMMENT_PARSER_OPTIONS,
        startLine,
      });

      deepStrictEqual(
        getJsdocSourceTokenCodeLocation(
          source,
          "type",
          new CodePosition(startLine, 3)
        ),
        new CodeLocation(new CodePosition(2, 12), new CodePosition(2, 16))
      );
    }
  );

  tests.add(
    "`getJsdocSourceTokenCodeLocation` with start line 1 column 1, singleline block tag, data token `name`.",
    () => {
      const startLine = 1;
      const [
        {
          tags: [{ source }],
        },
      ] = parse("/** @abc {def} hij Klm nop. */", {
        ...COMMENT_PARSER_OPTIONS,
        startLine,
      });

      deepStrictEqual(
        getJsdocSourceTokenCodeLocation(
          source,
          "name",
          new CodePosition(startLine, 1)
        ),
        new CodeLocation(new CodePosition(1, 16), new CodePosition(1, 18))
      );
    }
  );

  tests.add(
    "`getJsdocSourceTokenCodeLocation` with start line 1 column 1, singleline block tag, data token `description`.",
    () => {
      const startLine = 1;
      const [
        {
          tags: [{ source }],
        },
      ] = parse("/** @abc {def} hij Klm nop. */", {
        ...COMMENT_PARSER_OPTIONS,
        startLine,
      });

      deepStrictEqual(
        getJsdocSourceTokenCodeLocation(
          source,
          "description",
          new CodePosition(startLine, 1)
        ),
        new CodeLocation(new CodePosition(1, 20), new CodePosition(1, 28))
      );
    }
  );

  tests.add(
    "`getJsdocSourceTokenCodeLocation` with start line 1 column 1, a multiline block tag, data token `description`.",
    () => {
      const startLine = 1;
      const [
        {
          tags: [{ source }],
        },
      ] = parse(
        `/**
 * @abc {def} hij Klm
 * nop.
 */`,
        {
          ...COMMENT_PARSER_OPTIONS,
          startLine,
        }
      );

      deepStrictEqual(
        getJsdocSourceTokenCodeLocation(
          source,
          "description",
          new CodePosition(startLine, 1)
        ),
        new CodeLocation(new CodePosition(2, 19), new CodePosition(3, 7))
      );
    }
  );

  tests.add(
    "`getJsdocSourceTokenCodeLocation` with start line 2 column 3, multiline block tag, data token `description`.",
    () => {
      const startLine = 2;
      const [
        {
          tags: [{ source }],
        },
      ] = parse(
        `/**
   * @abc {def} hij Klm
   * nop.
   */`,
        {
          ...COMMENT_PARSER_OPTIONS,
          startLine,
        }
      );

      deepStrictEqual(
        getJsdocSourceTokenCodeLocation(
          source,
          "description",
          new CodePosition(startLine, 3)
        ),
        new CodeLocation(new CodePosition(3, 21), new CodePosition(4, 9))
      );
    }
  );
};
