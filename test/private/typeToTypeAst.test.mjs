import { deepStrictEqual, throws } from "assert";

import typeToTypeAst from "../../private/typeToTypeAst.mjs";

export default (tests) => {
  tests.add("`typeToTypeAst` with non-paramter type, non-optional.", () => {
    deepStrictEqual(typeToTypeAst({ type: "a" }), {
      type: "NameExpression",
      name: "a",
    });
  });

  tests.add(
    "`typeToTypeAst` with non-parameter type, optional via option.",
    () => {
      deepStrictEqual(typeToTypeAst({ type: "string", optional: true }), {
        type: "OptionalType",
        expression: {
          type: "NameExpression",
          name: "string",
        },
      });
    }
  );

  tests.add("`typeToTypeAst` with parameter type, non-optional.", () => {
    deepStrictEqual(typeToTypeAst({ type: "...*", parameter: true }), {
      type: "RestType",
      expression: {
        type: "AllLiteral",
      },
    });
  });

  tests.add(
    "`typeToTypeAst` with parameter type, optional via type string.",
    () => {
      deepStrictEqual(typeToTypeAst({ type: "string=", parameter: true }), {
        type: "OptionalType",
        expression: {
          type: "NameExpression",
          name: "string",
        },
      });
    }
  );

  tests.add(
    "`typeToTypeAst` with parameter type, optional via type string and option.",
    () => {
      deepStrictEqual(
        typeToTypeAst({
          type: "string=",
          parameter: true,
          optional: true,
        }),
        {
          type: "OptionalType",
          expression: {
            type: "NameExpression",
            name: "string",
          },
        }
      );
    }
  );

  tests.add(
    "`typeToTypeAst` with parameter type, non-optional, event namepath.",
    () => {
      deepStrictEqual(typeToTypeAst({ type: "A#event:a", parameter: true }), {
        type: "NameExpression",
        name: "A#event:a",
      });
    }
  );

  tests.add("`typeToTypeAst` with invalid type.", () => {
    throws(() => {
      typeToTypeAst({ type: "**" });
    }, new TypeError("Invalid JSDoc type `**`."));
  });
};
