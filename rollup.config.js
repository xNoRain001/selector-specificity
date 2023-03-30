import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'

export default {
  input: './src/index.js',
  output: {
    file: './dist/selector-specificity.js',
    format: 'umd',
    name: 'specificity'
  },
  plugins: [
    babel({ exclude: './node_modules/**' }),
    resolve()
  ]
}