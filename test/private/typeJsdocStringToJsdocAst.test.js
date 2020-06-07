'use strict';

const { deepStrictEqual, throws } = require('assert');
const typeJsdocStringToJsdocAst = require('../../private/typeJsdocStringToJsdocAst');

module.exports = (tests) => {
  tests.add(
    '`typeJsdocStringToJsdocAst` with non-paramter type, non-optional.',
    () => {
      deepStrictEqual(typeJsdocStringToJsdocAst({ type: 'a' }), {
        type: 'NameExpression',
        name: 'a',
      });
    }
  );

  tests.add(
    '`typeJsdocStringToJsdocAst` with non-parameter type, optional via option.',
    () => {
      deepStrictEqual(
        typeJsdocStringToJsdocAst({ type: 'string', optional: true }),
        {
          type: 'OptionalType',
          expression: {
            type: 'NameExpression',
            name: 'string',
          },
        }
      );
    }
  );

  tests.add(
    '`typeJsdocStringToJsdocAst` with parameter type, non-optional.',
    () => {
      deepStrictEqual(
        typeJsdocStringToJsdocAst({ type: '...*', parameter: true }),
        {
          type: 'RestType',
          expression: {
            type: 'AllLiteral',
          },
        }
      );
    }
  );

  tests.add(
    '`typeJsdocStringToJsdocAst` with parameter type, optional via type string.',
    () => {
      deepStrictEqual(
        typeJsdocStringToJsdocAst({ type: 'string=', parameter: true }),
        {
          type: 'OptionalType',
          expression: {
            type: 'NameExpression',
            name: 'string',
          },
        }
      );
    }
  );

  tests.add(
    '`typeJsdocStringToJsdocAst` with parameter type, optional via type string and option.',
    () => {
      deepStrictEqual(
        typeJsdocStringToJsdocAst({
          type: 'string=',
          parameter: true,
          optional: true,
        }),
        {
          type: 'OptionalType',
          expression: {
            type: 'NameExpression',
            name: 'string',
          },
        }
      );
    }
  );

  tests.add('`typeJsdocStringToJsdocAst` with invalid type.', () => {
    throws(() => {
      typeJsdocStringToJsdocAst({ type: '**' });
    }, new Error('Invalid JSDoc type “**”.'));
  });
};
