'use strict';

const { deepStrictEqual, throws } = require('assert');
const gfm = require('remark-gfm');
const unified = require('unified');
const remarkPluginReplaceSection = require('../../private/remarkPluginReplaceSection');

module.exports = (tests) => {
  tests.add('`remarkPluginReplaceSection` with defaults.', () => {
    deepStrictEqual(
      unified()
        .use(gfm)
        .use(remarkPluginReplaceSection)
        .runSync({
          type: 'root',
          children: [
            {
              type: 'heading',
              depth: 1,
              children: [
                {
                  type: 'text',
                  value: 'API',
                },
              ],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  value: 'Replace.',
                },
              ],
            },
          ],
        }),
      {
        type: 'root',
        children: [
          {
            type: 'heading',
            depth: 1,
            children: [
              {
                type: 'text',
                value: 'API',
              },
            ],
          },
        ],
      }
    );
  });

  tests.add('`remarkPluginReplaceSection` with options.', () => {
    deepStrictEqual(
      unified()
        .use(gfm)
        .use(remarkPluginReplaceSection, {
          targetHeading: 'A',
          replacementAst: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    value: 'Replaced.',
                  },
                ],
              },
            ],
          },
        })
        .runSync({
          type: 'root',
          children: [
            {
              type: 'heading',
              depth: 1,
              children: [
                {
                  type: 'text',
                  value: 'A',
                },
              ],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  value: 'Replace.',
                },
              ],
            },
            {
              type: 'heading',
              depth: 1,
              children: [
                {
                  type: 'text',
                  value: 'B',
                },
              ],
            },
          ],
        }),
      {
        type: 'root',
        children: [
          {
            type: 'heading',
            depth: 1,
            children: [
              {
                type: 'text',
                value: 'A',
              },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                value: 'Replaced.',
              },
            ],
          },
          {
            type: 'heading',
            depth: 1,
            children: [
              {
                type: 'text',
                value: 'B',
              },
            ],
          },
        ],
      }
    );
  });

  tests.add('`remarkPluginReplaceSection` with a missing heading.', () => {
    throws(() => {
      unified().use(gfm).use(remarkPluginReplaceSection).runSync({
        type: 'root',
        children: [],
      });
    }, new Error('Missing target heading “API”.'));
  });
};
