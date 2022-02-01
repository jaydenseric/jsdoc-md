import { strictEqual, throws } from "assert";

import unescapeJsdoc from "./unescapeJsdoc.mjs";

export default (tests) => {
  tests.add("`unescapeJsdoc` with argument 1 `content` not a string.", () => {
    throws(() => {
      unescapeJsdoc(true);
    }, new TypeError("Argument 1 `content` must be a string."));
  });

  tests.add("`unescapeJsdoc` unescapes multiline comment ends.", () => {
    strictEqual(unescapeJsdoc("*/ *\\/ *\\\\/ *\\\\\\/"), "*/ */ *\\/ *\\\\/");
  });
};
