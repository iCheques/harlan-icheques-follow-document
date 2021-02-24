import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';

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
    name: 'HarlanFollowDocument',
    format: 'iife',
    globals: {
      harlan: 'harlan',
      jquery: '$',
      numeral: 'numeral',
      moment: 'moment',
      toastr: 'toastr',
    },
  },
  plugins: [
    resolve({
      preferBuiltins: false,
      jsnext: true,
      main: true,
      browser: true,
    }),
    commonjs(),
    babel(),
    uglify(),
  ],
};
