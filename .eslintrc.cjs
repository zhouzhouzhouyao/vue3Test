module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: [
    'vue',
    '@typescript-eslint'
  ],
  rules: {
    'no-var': 'error', // 禁止使用var
    'vue/multi-word-component-names': 'off', // 允许单个单词
    semi: ['error', 'always'], // 结尾使用;
    quotes: [2, 'single'], // 使用单引号
    indent: ['error', 2] // 缩进2格
  }
};
