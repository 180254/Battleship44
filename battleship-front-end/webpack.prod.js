/* eslint-disable node/no-unpublished-require */

const common = require('./webpack.common.js');
const {merge} = require('webpack-merge');

module.exports = merge(
  common({
    browserlist: ['defaults'],
    code_mode: 'prod',
    code_backend: process.env.BACKEND || '',
  }),
  {
    mode: 'production',
  }
);
