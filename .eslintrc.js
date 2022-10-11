module.exports = {
  extends: [
    // add more generic rulesets here, such as:
    // 'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:import/recommended',
    // 'plugin:vue/recommended' // Use this if you are using Vue.js 2.x.
  ],
  plugins: ['import', 'vue'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
    'brace-style': ['error', 'stroustrup'],
    'comma-dangle': ['error', 'always-multiline'],
    'semi': ['error', 'always'],
    'quotes': ['error', 'single'],
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        'alphabetize': { 'order': 'asc', 'caseInsensitive': true },
        'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'object', 'type'],
        'pathGroups': [
          { 'pattern': '@/assets/**', 'group': 'internal' },
          { 'pattern': '@/vendor/**', 'group': 'internal' },
          { 'pattern': '@/bootstrap', 'group': 'parent' },
          { 'pattern': '@/constants/**', 'group': 'parent' },
          { 'pattern': '@/dtos/**', 'group': 'parent' },
          { 'pattern': '@/stores/**', 'group': 'parent' },
          { 'pattern': '@/tools/**', 'group': 'parent' },
          { 'pattern': '@/transitions/**', 'group': 'parent' },
          { 'pattern': '@/App.vue', 'group': 'sibling' },
          { 'pattern': '@/components/**', 'group': 'sibling' },
          { 'pattern': '@/layouts/**', 'group': 'sibling' },
        ],
      },
    ],
    'vue/html-self-closing': ['error', {
      'html': {
        'void': 'never',
        'normal': 'never',
        'component': 'never',
      },
      'svg': 'never',
      'math': 'never',
    }],
    'vue/max-attributes-per-line': ['error', {
      'singleline': {
        'max': 1,
      },
      'multiline': {
        'max': 1,
      },
    }],
  },
};
