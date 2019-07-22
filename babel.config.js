module.exports = {
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-optional-chaining',
  ],
  presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
};
