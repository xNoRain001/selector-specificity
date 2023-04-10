import babel from '@rollup/plugin-babel'

export default {
  input: './src/index.js',
  output: {
    file: './dist/selector-specificity.js',
    format: 'umd',
    name: 'specificity'
  },
  plugins: [babel({ babelHelpers: 'bundled' })]
}