import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'src/index.js',
  external: [
    'harlan',
    'jquery',
    'numeral',
    'moment',
  ],
  output: {
    file: 'index.js',
    name: 'HarlanIChequesVeiculos',
    format: 'iife',
    globals: {
      harlan: 'harlan',
      jquery: '$',
      numeral: 'numeral',
      moment: 'moment',
    },
  },
  plugins: [
    resolve(),
    commonjs(),
    babel(),
  ],
};
