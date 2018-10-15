/* eslint-disable import/no-commonjs */
const merge = require('webpack-merge');
const common = require('./webpack.config.common.js');
const AutoDllPlugin = require('autodll-webpack-plugin');
const package = require('./package.json');

const webpackConfig = merge(common, {
  devtool: 'cheap-module-eval-source-map',
  mode: 'production',
  plugins: [
    new AutoDllPlugin({
      filename: '[name]_[hash].dll.js',
      inherit: true,
      entry: {
        vendor: Object.keys(package.dependencies),
      },
    }),
  ]
});

module.exports = webpackConfig;

