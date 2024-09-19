import antfu from '@antfu/eslint-config'

export default antfu(
  {
    stylistic: true,
    svelte: {
      'overrides': {
        'svelte/sort-attributes': 1,
      },
      'svelte/html-self-closing': [1, {
        void: 'always',
        normal: 'never',
        component: 'always',
        svelte: 'always',
      }],
    },
    unocss: true,
    formatters: {
      css: true,
      html: true,
    },
  },
  {
    rules: {
      'antfu/top-level-function': 0,
      'import/order': [1, {
        'alphabetize': {
          order: 'asc',
          caseInsensitive: true,
        },
        'newlines-between': 'always',
      }],
    },
  },
)
