import babel from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser'

export default {
  input: './src/index.js',
  output: {
    file: './dist/selector-specificity.js',
    format: 'umd',
    name: 'specificity'
  },
  plugins: [
    babel({ babelHelpers: 'bundled' }),
    terser()
  ]
}
