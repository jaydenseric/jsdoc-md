import { strictEqual, throws } from "assert";

import replaceMdSection from "./replaceMdSection.mjs";

export default (tests) => {
  tests.add(
    "`replaceMdSection` with argument 1 `markdown` not a string.",
    () => {
      throws(
        () => replaceMdSection(true),
        new TypeError("Argument 1 `markdown` must be a string.")
      );
    }
  );

  tests.add(
    "`replaceMdSection` with argument 1 `markdown` not a populated string.",
    () => {
      throws(
        () => replaceMdSection(""),
        new TypeError("Argument 1 `markdown` must be a populated string.")
      );
    }
  );

  tests.add(
    "`replaceMdSection` with argument 2 `targetHeading` not a string.",
    () => {
      throws(
        () => replaceMdSection("a", true),
        new TypeError("Argument 2 `targetHeading` must be a string.")
      );
    }
  );

  tests.add(
    "`replaceMdSection` with argument 2 `targetHeading` not a populated string.",
    () => {
      throws(
        () => replaceMdSection("a", ""),
        new TypeError("Argument 2 `targetHeading` must be a populated string.")
      );
    }
  );

  tests.add(
    "`replaceMdSection` with argument 3 `replacementMdAst` not an object.",
    () => {
      throws(
        () => replaceMdSection("a", "a", true),
        new TypeError("Argument 3 `replacementMdAst` must be an object.")
      );
    }
  );

  tests.add("`replaceMdSection` with the target heading present.", () => {
    const targetHeading = "Target";

    strictEqual(
      replaceMdSection(
        `# Preserve

## ${targetHeading}

Replace.

## Preserve
`,
        targetHeading,
        {
          type: "root",
          children: [
            {
              type: "paragraph",
              children: [
                {
                  type: "text",
                  value: "Replaced.",
                },
              ],
            },
          ],
        }
      ),
      `# Preserve

## ${targetHeading}

Replaced.

## Preserve
`
    );
  });
};
