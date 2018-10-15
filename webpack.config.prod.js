/* eslint-disable import/no-commonjs */
const merge = require('webpack-merge');
const common = require('./webpack.config.common.js');

const webpackConfig = merge(common, {
  mode: 'production',
});

module.exports = webpackConfig;
