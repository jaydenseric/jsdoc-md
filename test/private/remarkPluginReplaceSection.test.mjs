import { deepStrictEqual, throws } from 'assert';
import remarkGfm from 'remark-gfm';
import { unified } from 'unified';

import remarkPluginReplaceSection from '../../private/remarkPluginReplaceSection.mjs';

export default (tests) => {
  tests.add(
    '`remarkPluginReplaceSection` with option `targetHeading` not a string.',
    () => {
      throws(() => {
        remarkPluginReplaceSection({ targetHeading: true });
      }, new TypeError('Option `targetHeading` must be a string.'));
    }
  );

  tests.add(
    '`remarkPluginReplaceSection` with option `replacementAst` not an object.',
    () => {
      throws(() => {
        remarkPluginReplaceSection({ replacementAst: true });
      }, new TypeError('Option `replacementAst` must be an object.'));
    }
  );

  tests.add('`remarkPluginReplaceSection` with defaults.', () => {
    deepStrictEqual(
      unified()
        .use(remarkGfm)
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
        .use(remarkGfm)
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
      unified().use(remarkGfm).use(remarkPluginReplaceSection).runSync({
        type: 'root',
        children: [],
      });
    }, new Error('Missing target heading `API`.'));
  });
};
