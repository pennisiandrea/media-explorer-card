import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/card.js',
  output: {
    file: 'media-explorer-card.js',
    format: 'es',
  },
  plugins: [
    resolve({
      browser: true,
    }),
    commonjs({
      include: 'node_modules/**'
    })
  ]
};