module.exports = {
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-export-namespace-from',
  ],
  presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
};
