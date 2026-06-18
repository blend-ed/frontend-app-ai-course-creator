// eslint-disable-next-line import/no-extraneous-dependencies
const { createConfig } = require('@openedx/frontend-build');

module.exports = createConfig(
  'eslint',
  {
    rules: {
      'jsx-a11y/label-has-associated-control': [2, {
        controlComponents: ['Input'],
      }],
      'template-curly-spacing': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'no-restricted-exports': 'off',
      // There is no reason to disallow this syntax anymore; we don't use regenerator-runtime in new browsers
      'no-restricted-syntax': 'off',
      // The ported ai-studio components are loosely-typed JSX and intentionally
      // omit PropTypes (they lean on the API layer's TS types instead).
      'react/prop-types': 'off',
      'react/require-default-props': 'off',
      // Conventions carried over verbatim from the authoring ai-studio source:
      //  - `role` is a domain prop on <ChatMessage> (author of a message), not a
      //    DOM ARIA role, so jsx-a11y/aria-role is a false positive here.
      //  - the remaining rules flag intentional style in the ported components.
      'jsx-a11y/aria-role': 'off',
      'jsx-a11y/no-noninteractive-element-interactions': 'off',
      'no-continue': 'off',
      'react/no-unstable-nested-components': 'off',
      'react/no-array-index-key': 'off',
    },
  },
);
