import antfu from '@antfu/eslint-config'

export default antfu({
  type: 'lib',
  vue: true,
  typescript: true,

  jsonc: true,

  ignores: [
    'node_modules',
    'docs',
  ],
}, {
  rules: {
    'no-console': 'off',
  },
})
