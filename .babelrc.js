const { NODE_ENV, BABEL_ENV } = process.env
const commonJS = NODE_ENV === 'test' || BABEL_ENV === 'commonjs'
const loose = true

module.exports = {
  presets: [['@babel/env', { loose, modules: false }]],
  plugins: [
    ['@babel/proposal-decorators', { legacy: true }],
    ['@babel/proposal-object-rest-spread', { loose }],
    '@babel/transform-react-jsx',
    commonJS && ['@babel/transform-modules-commonjs', { loose }],
    [
      '@babel/transform-runtime',
      {
        useESModules: !commonJS,
        version: require('./package.json').dependencies['@babel/runtime'].replace(/^[^0-9]*/, ''),
      },
    ],
  ].filter(Boolean),
}
