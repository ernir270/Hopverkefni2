module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'prettier'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'no-restricted-syntax': 0,
    'import/prefer-default-export': 0,
    'no-plusplus': 0, // leyfa að hafa '++'
    'import/no-mutable-exports': 0, // annars kemur eslint villa sem er held ég ekki hægt að laga, því breytan má ekki vera const
    'prefer-arrow-callback': 0, // leyfa functions að vera í 'addEventListener'
    'func-names':0, // leyfa functions að hafa ekki nafn, þannig functions eru fyrir 'addEventListener'
    'no-param-reassign': 0, // leyfa reassign á parameter
    'prefer-destructuring': 0, // leyfa að hafa t.d. array[0][1]
    'import/no-cycle': 0, // leyfa dependency cycle
    quotes: ['error', 'single'],
    'no-console': [
      'warn',
      {
        allow: ['warn', 'error', 'info', 'group', 'groupCollapsed', 'groupEnd'],
      },
    ],
    'import/extensions': 0,
    'max-len': [
      'warn',
      {
        code: 100,
        ignoreUrls: true,
        ignoreComments: true,
        ignoreTemplateLiterals: true,
      },
    ],
  },
};
