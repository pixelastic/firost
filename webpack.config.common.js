/* eslint-disable import/no-commonjs */
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
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
  plugins: [
    // Will create a cache of the dependency graph on first build so subsequent
    // builds can re-use it, improving performance time
    new HardSourceWebpackPlugin({
      cacheDirectory: path.resolve(
        __dirname,
        'node_modules/.cache/hard-source/[confighash]'
      ),
    }),
  ],
};

module.exports = webpackConfig;
