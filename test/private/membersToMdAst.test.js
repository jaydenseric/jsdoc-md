'use strict';

const { throws } = require('assert');
const codeToJsdocComments = require('../../private/codeToJsdocComments');
const membersToMdAst = require('../../private/membersToMdAst');
const jsdocCommentsToMembers = require('../jsdocCommentsToMembers');
const membersToMdAstSnapshot = require('../membersToMdAstSnapshot');

const TEST_CODE_FILE_PATH = '/a.js';

const jsdocTestDescription = ` * Description linking [\`A\`]{@link A}.`;

const jsdocTestParams = ` * @arg {object} a Param \`a\` description linking [\`A\`]{@link A}.
 * @argument {boolean} a.a Param \`a.a\` description.
 * @param {boolean} [b] Param \`b\` description.
 * @param {boolean} [c=true] Param \`c\` description.`;

const jsdocTestProps = ` * @property {object} a Prop \`a\` description linking [\`A\`]{@link A}.
 * @prop {boolean} a.a Prop \`a.a\` description.
 * @prop {boolean} [b] Prop \`b\` description.
 * @prop {boolean} [c=true] Prop \`c\` description.`;

const jsdocTestReturns = `@returns {boolean} Returns description linking [\`A\`]{@link A}.`;

const jsdocTestSees = ` * @see [\`A\`]{@link A}.
 * @see [\`jsdoc-md\` on npm](https://npm.im/jsdoc-md).`;

const jsdocTestExamples = ` * @example
 * Example 1 para linking [\`A\`]{@link A}.
 * @example <caption>Example 2 caption linking [\`A\`]{@link A}.</caption>
 * # Example 2 heading
 *
 * Example 2 para.
 *
 * \`\`\`js
 * // Example 2 JS code block.
 * \`\`\``;

module.exports = (tests) => {
  tests.add('`membersToMdAst` with no members.', async () => {
    await membersToMdAstSnapshot('no-members', '');
  });

  tests.add(
    '`membersToMdAst` with third parameter `topDepth` as `1` (default).',
    async () => {
      await membersToMdAstSnapshot(
        'parameter-topDepth-as-1',
        `/**
 * @kind member
 * @name A
 */`
      );
    }
  );

  tests.add(
    '`membersToMdAst` with third parameter `topDepth` as `3`.',
    async () => {
      await membersToMdAstSnapshot(
        'parameter-topDepth-as-3',
        `/**
 * @kind member
 * @name A
 */`,
        3
      );
    }
  );

  tests.add('`membersToMdAst` with a class.', async () => {
    await membersToMdAstSnapshot(
      'class',
      `/**
${jsdocTestDescription}
 * @kind class
 * @name A
 * @type {B}
${jsdocTestParams}
${jsdocTestSees}
${jsdocTestExamples}
 */`
    );
  });

  tests.add('`membersToMdAst` with a class, static method.', async () => {
    await membersToMdAstSnapshot(
      'class-static-method',
      `/**
 * @kind class
 * @name A
 */

/**
 ${jsdocTestDescription}
 * @kind function
 * @name A.a
 * @type {B}
${jsdocTestParams}
${jsdocTestSees}
${jsdocTestExamples}
 */`
    );
  });

  tests.add(
    '`membersToMdAst` with a class, static property, type object.',
    async () => {
      await membersToMdAstSnapshot(
        'class-static-property-object',
        `/**
 * @kind class
 * @name A
 */

/**
${jsdocTestDescription}
 * @kind member
 * @name A.a
 * @type {object}
${jsdocTestProps}
${jsdocTestSees}
${jsdocTestExamples}
 */`
      );
    }
  );

  tests.add('`membersToMdAst` with a class, instance method.', async () => {
    await membersToMdAstSnapshot(
      'class-instance-method',
      `/**
 * @kind class
 * @name A
 */

/**
 ${jsdocTestDescription}
 * @kind function
 * @name A#a
 * @type {B}
${jsdocTestParams}
${jsdocTestSees}
${jsdocTestExamples}
 */`
    );
  });

  tests.add(
    '`membersToMdAst` with a class, instance method, fires events.',
    async () => {
      await membersToMdAstSnapshot(
        'class-instance-method-fires-events',
        // Test the fires tag namepath with and without the optional `event:`
        // prefix.
        `/**
 * @kind class
 * @name A
 */

/**
 * @kind function
 * @name A#a
 * @fires A#event:b
 * @fires A#c
 */

/**
 * @kind event
 * @name A#event:b
 */

/**
 * @kind event
 * @name A#event:c
 */`
      );
    }
  );

  tests.add(
    '`membersToMdAst` with a class, instance property, type object.',
    async () => {
      await membersToMdAstSnapshot(
        'class-instance-property-object',
        `/**
 * @kind class
 * @name A
 */

/**
${jsdocTestDescription}
 * @kind member
 * @name A#a
 * @type {object}
${jsdocTestProps}
${jsdocTestSees}
${jsdocTestExamples}
 */`
      );
    }
  );

  tests.add('`membersToMdAst` with a class, event, type object.', async () => {
    await membersToMdAstSnapshot(
      'class-event-object',
      `/**
 * @kind class
 * @name A
 */

/**
${jsdocTestDescription}
 * @kind event
 * @name A#event:a
 * @type {object}
${jsdocTestProps}
${jsdocTestSees}
${jsdocTestExamples}
 */`
    );
  });

  tests.add(
    '`membersToMdAst` with a class, event, no `event:` name prefix.',
    async () => {
      await membersToMdAstSnapshot(
        'class-event-no-name-prefix',
        `/**
 * @kind class
 * @name A
 */

/**
 * @kind event
 * @name A#a
 */`
      );
    }
  );

  tests.add(
    '`membersToMdAst` with a class, event name conflict solved by `event:` name prefix.',
    async () => {
      await membersToMdAstSnapshot(
        'class-event-name-conflict-solved-by-prefix',
        `/**
 * @kind class
 * @name A
 */

/**
 * Method description.
 * @kind function
 * @name A#a
 */

/**
 * Event description.
 * @kind event
 * @name A#event:a
 */`
      );
    }
  );

  tests.add('`membersToMdAst` with a class, inner class.', async () => {
    await membersToMdAstSnapshot(
      'class-inner-class',
      `/**
 * @kind class
 * @name A
 */

/**
 ${jsdocTestDescription}
 * @kind class
 * @name A~B
 * @type {C}
${jsdocTestParams}
${jsdocTestSees}
${jsdocTestExamples}
 */`
    );
  });

  tests.add('`membersToMdAst` with a class, inner function.', async () => {
    await membersToMdAstSnapshot(
      'class-inner-function',
      `/**
 * @kind class
 * @name A
 */

/**
 ${jsdocTestDescription}
 * @kind function
 * @name A~a
 * @type {B}
${jsdocTestParams}
${jsdocTestSees}
${jsdocTestExamples}
 */`
    );
  });

  tests.add(
    '`membersToMdAst` with a class, inner member, type object.',
    async () => {
      await membersToMdAstSnapshot(
        'class-inner-member-object',
        `/**
 * @kind class
 * @name A
 */

/**
${jsdocTestDescription}
 * @kind member
 * @name A~a
 * @type {object}
${jsdocTestProps}
${jsdocTestSees}
${jsdocTestExamples}
 */`
      );
    }
  );

  tests.add(
    '`membersToMdAst` with a class, inner constant, type object.',
    async () => {
      await membersToMdAstSnapshot(
        'class-inner-constant-object',
        `/**
 * @kind class
 * @name A
 */

/**
${jsdocTestDescription}
 * @kind constant
 * @name A~a
 * @type {object}
${jsdocTestProps}
${jsdocTestSees}
${jsdocTestExamples}
 */`
      );
    }
  );

  tests.add(
    '`membersToMdAst` with a class, inner typedef, type object.',
    async () => {
      await membersToMdAstSnapshot(
        'class-inner-typedef-object',
        `/**
 * @kind class
 * @name A
 */

/**
${jsdocTestDescription}
 * @kind typedef
 * @name A~B
 * @type {object}
${jsdocTestProps}
${jsdocTestSees}
${jsdocTestExamples}
 */`
      );
    }
  );

  tests.add(
    '`membersToMdAst` with a class, inner typedef, type function.',
    async () => {
      await membersToMdAstSnapshot(
        'class-inner-typedef-function',
        `/**
 * @kind class
 * @name A
 */

/**
${jsdocTestDescription}
 * @kind typedef
 * @name A~B
 * @type {Function}
${jsdocTestParams}
${jsdocTestReturns}
${jsdocTestSees}
${jsdocTestExamples}
 */`
      );
    }
  );

  tests.add('`membersToMdAst` with a function.', async () => {
    await membersToMdAstSnapshot(
      'function',
      `/**
${jsdocTestDescription}
 * @kind function
 * @name A
 * @type {B}
${jsdocTestParams}
${jsdocTestReturns}
${jsdocTestSees}
${jsdocTestExamples}
 */`
    );
  });

  tests.add('`membersToMdAst` with a function, no returns type.', async () => {
    await membersToMdAstSnapshot(
      'function-no-returns-type',
      `/**
 * @kind function
 * @name A
 * @returns Returns description.
 */`
    );
  });

  tests.add('`membersToMdAst` with a member, type object.', async () => {
    await membersToMdAstSnapshot(
      'member-object',
      `/**
${jsdocTestDescription}
 * @kind member
 * @name A
 * @type {object}
${jsdocTestProps}
${jsdocTestSees}
${jsdocTestExamples}
 */`
    );
  });

  tests.add('`membersToMdAst` with a member, type function.', async () => {
    await membersToMdAstSnapshot(
      'member-function',
      `/**
${jsdocTestDescription}
 * @kind member
 * @name A
 * @type {Function}
${jsdocTestParams}
${jsdocTestReturns}
${jsdocTestSees}
${jsdocTestExamples}
 */`
    );
  });

  tests.add('`membersToMdAst` with a constant, type object.', async () => {
    await membersToMdAstSnapshot(
      'constant-object',
      `/**
${jsdocTestDescription}
 * @kind constant
 * @name A
 * @type {object}
${jsdocTestProps}
${jsdocTestSees}
${jsdocTestExamples}
 */`
    );
  });

  tests.add('`membersToMdAst` with a constant, type function.', async () => {
    await membersToMdAstSnapshot(
      'constant-function',
      `/**
${jsdocTestDescription}
 * @kind constant
 * @name A
 * @type {Function}
${jsdocTestParams}
${jsdocTestReturns}
${jsdocTestSees}
${jsdocTestExamples}
 */`
    );
  });

  tests.add('`membersToMdAst` with a typedef, type object.', async () => {
    await membersToMdAstSnapshot(
      'typedef-object',
      `/**
${jsdocTestDescription}
 * @kind typedef
 * @name A
 * @type {object}
${jsdocTestProps}
${jsdocTestSees}
${jsdocTestExamples}
 */`
    );
  });

  tests.add('`membersToMdAst` with a typedef, type function.', async () => {
    await membersToMdAstSnapshot(
      'typedef-function',
      `/**
${jsdocTestDescription}
 * @kind typedef
 * @name A
 * @type {Function}
${jsdocTestParams}
${jsdocTestReturns}
${jsdocTestSees}
${jsdocTestExamples}
 */`
    );
  });

  tests.add(
    // This also tests members with only kind and name tags can be processed.
    '`membersToMdAst` sorts members by membership, then kind, then name.',
    async () => {
      // Provide members in the opposite order expected in the markdown.
      await membersToMdAstSnapshot(
        'sort',
        `/**
 * @kind typedef
 * @name TypeB
 */

/**
 * @kind typedef
 * @name TypeA
 */

/**
 * @kind constant
 * @name constantB
 */

/**
 * @kind constant
 * @name constantA
 */

/**
 * @kind function
 * @name functionB
 */

/**
 * @kind function
 * @name functionA
 */

/**
 * @kind constant
 * @name ClassA~innerConstantB
 */

/**
 * @kind constant
 * @name ClassA~innerConstantA
 */

/**
 * @kind typedef
 * @name ClassA~TypeB
 */

/**
 * @kind typedef
 * @name ClassA~TypeA
 */

/**
 * @kind member
 * @name ClassA~innerMemberB
 */

/**
 * @kind member
 * @name ClassA~innerMemberA
 */

/**
 * @kind function
 * @name ClassA~innerFunctionB
 */

/**
 * @kind function
 * @name ClassA~innerFunctionA
 */

/**
 * @kind class
 * @name ClassA~innerClassB
 */

/**
 * @kind class
 * @name ClassA~innerClassA
 */

/**
 * @kind event
 * @name ClassA#event:c
 */

/**
 * @kind event
 * @name ClassA#b
 */

/**
 * @kind event
 * @name ClassA#event:a
 */

/**
 * @kind member
 * @name ClassA#instancePropertyB
 */

/**
 * @kind member
 * @name ClassA#instancePropertyA
 */

/**
 * @kind member
 * @name ClassA.staticPropertyB
 */

/**
 * @kind member
 * @name ClassA.staticPropertyA
 */

/**
 * @kind function
 * @name ClassA#instanceMethodB
 */

/**
 * @kind function
 * @name ClassA#instanceMethodA
 */

/**
 * @kind function
 * @name ClassA.staticMethodB
 */

/**
 * @kind function
 * @name ClassA.staticMethodA
 */

/**
 * @kind class
 * @name ClassA
 */

/**
 * @kind class
 * @name ClassB
 */`
      );
    }
  );

  tests.add('`membersToMdAst` with deeply nested members.', async () => {
    await membersToMdAstSnapshot(
      'deeply-nested-members',
      `/**
 * @kind class
 * @name A
${jsdocTestSees}
${jsdocTestExamples}
 */

/**
 * @kind function
 * @name A#b
 ${jsdocTestSees}
 ${jsdocTestExamples}
 */

/**
 * @kind function
 * @name A#b~c
 ${jsdocTestSees}
 ${jsdocTestExamples}
 */

/**
 * @kind function
 * @name A#b~c~d
 ${jsdocTestSees}
 ${jsdocTestExamples}
 */`
    );
  });

  tests.add('`membersToMdAst` with a missing event namepath.', async () => {
    const code = `/**
 * @kind class
 * @name A
 */

/**
 * @kind function
 * @name A#a
 * @fires A#event:a
 */`;
    const jsdocComments = await codeToJsdocComments(code, TEST_CODE_FILE_PATH);
    const members = jsdocCommentsToMembers(
      jsdocComments,
      code,
      TEST_CODE_FILE_PATH
    );

    throws(() => {
      membersToMdAst(members);
    }, new Error('Missing JSDoc member for event namepath “A#event:a”.'));
  });
};
