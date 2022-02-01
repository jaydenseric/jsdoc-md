import { deepStrictEqual, throws } from "assert";

import deconstructJsdocNamepath from "./deconstructJsdocNamepath.mjs";

export default (tests) => {
  tests.add(
    "`deconstructJsdocNamepath` with argument 1 `namepath` not a string.",
    () => {
      throws(() => {
        deconstructJsdocNamepath(undefined);
      }, new TypeError("Argument 1 `namepath` must be a string."));
    }
  );

  tests.add("`deconstructJsdocNamepath` with no nested members.", () => {
    deepStrictEqual(deconstructJsdocNamepath("a"), {
      memberof: undefined,
      membership: undefined,
      name: "a",
    });
  });

  tests.add(
    "`deconstructJsdocNamepath` with nested static, instance and inner members.",
    () => {
      deepStrictEqual(deconstructJsdocNamepath("a.B#c~d"), {
        memberof: "a.B#c",
        membership: "~",
        name: "d",
      });
    }
  );

  tests.add("`deconstructJsdocNamepath` with a namepath prefix.", () => {
    deepStrictEqual(deconstructJsdocNamepath("A#event:a"), {
      memberof: "A",
      membership: "#",
      name: "event:a",
    });
  });

  tests.add("`deconstructJsdocNamepath` with invalid namepaths.", () => {
    for (const namepath of ["", "a..b", "a..b.c", "a."])
      throws(() => {
        deconstructJsdocNamepath(namepath);
      }, new SyntaxError(`Invalid JSDoc namepath \`${namepath}\`.`));
  });
};
