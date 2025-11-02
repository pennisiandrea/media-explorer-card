import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/card.js',
  output: {
    file: 'media-explorer-card.js',
    format: 'es',
  },
  plugins: [
    resolve()
  ]
};