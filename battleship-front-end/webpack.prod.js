/* eslint-disable node/no-unpublished-require */

const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(
  common({
    browserlist: ['defaults'],
  }),
  {
    mode: 'production',
  }
);
