/* eslint-disable node/no-unpublished-require */

const common = require('./webpack.common.js');
const {merge} = require('webpack-merge');

module.exports = merge(
  common({
    browserlist: ['last 1 Chrome versions', 'last 1 Firefox versions'],
  }),
  {
    mode: 'development',
    devtool: 'source-map',
  }
);
