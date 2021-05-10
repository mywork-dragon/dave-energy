module.exports = {
  presets: ['@babel/env', '@babel/react', '@babel/typescript'],
  plugins: [
    [
      'transform-class-properties',
      {
        spec: true,
      },
    ],
    [
      '@babel/plugin-transform-runtime',
      {
        regenerator: true,
      },
    ],
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-optional-chaining',
    'babel-plugin-styled-components',
  ],
};
