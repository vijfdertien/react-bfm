const path = require('path')

const { NODE_ENV } = process.env

const filename = `react-bfm${NODE_ENV === 'production' ? '.min' : ''}.js`

const config = {
  mode: NODE_ENV === 'production' ? 'production' : 'development',
  devtool: NODE_ENV === 'production' ? undefined : false,
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename,
    library: 'ReactBFM',
    libraryTarget: 'umd',
  },
  externals: {
    react: {
      root: 'React',
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimize: NODE_ENV === 'production',
  },
}

module.exports = config
