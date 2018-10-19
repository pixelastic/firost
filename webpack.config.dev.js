/* eslint-disable import/no-commonjs */
const merge = require('webpack-merge');
const common = require('./webpack.config.common.js');

const webpackConfig = merge(common, {
  devtool: 'cheap-module-eval-source-map',
  mode: 'development',
});

module.exports = webpackConfig;
