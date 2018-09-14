/* eslint-disable import/no-commonjs */
const path = require('path');
const webpackConfig = {
  entry: path.resolve(__dirname, 'src/index.js'),
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
    libraryTarget: 'umd',
  },
  mode: 'production',
  performance: { hints: false },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        enforce: 'pre',
        use: { loader: 'babel-loader' },
      },
    ],
  },
};

module.exports = webpackConfig;
