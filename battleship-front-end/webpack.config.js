/* eslint-disable node/no-unpublished-require */

const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const env_config = {
  mode: process.env.MODE || 'dev', // 'dev' | 'prod'
  backend: process.env.BACKEND || '',
};
const webpack_config = {
  dev: {
    mode: 'development',
    backend: env_config.backend || 'ws://localhost:8080/ws',
    devtool: 'inline-source-map',
    browserslist: ['last 2 Chrome versions', 'last 2 Firefox versions'],
  },
  prod: {
    mode: 'production',
    backend: env_config.backend || '',
    devtool: '',
    browserslist: ['defaults'],
  },
}[env_config.mode];

module.exports = {
  mode: webpack_config.mode,
  devtool: webpack_config.devtool,
  entry: {
    app: './static/js/app/app.entrypoint.ts',
  },
  output: {
    path: path.resolve(__dirname, 'static/js/dist/'),
    filename: '[name].dist.js',
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
  module: {
    rules: [
      {
        test: /\.m?(ts|js)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: webpack_config.browserslist,
                  // Note: These optimizations will be enabled by default in Babel 8
                  bugfixes: true,
                  //A normal mode follows the semantics of ECMAScript 6 as closely as possible.
                  //A loose mode produces simpler ES5 code.
                  loose: true,
                  // Outputs to console.log the polyfills and transform plugins enabled
                  debug: true,
                  // Adds specific imports for polyfills when they are used in each file.
                  useBuiltIns: 'usage',
                  corejs: {version: 3, proposals: false},
                },
              ],
            ],
            cacheDirectory: true,
          },
        },
        exclude: [path.resolve(__dirname, './node_modules/core-js/')],
      },
      {
        test: /\.m?ts$/,
        use: [{loader: 'ts-loader'}],
        exclude: [],
      },
      {
        test: /\.m?(ts|js)$/,
        use: [
          {
            loader: 'string-replace-loader',
            options: {
              search: 'CONFIG_MODE',
              replace: webpack_config.mode,
            },
          },
          {
            loader: 'string-replace-loader',
            options: {
              search: 'CONFIG_BACKEND',
              replace: webpack_config.backend,
            },
          },
        ],
        exclude: [],
      },
    ],
  },
  externals: {
    jquery: 'jQuery',
    'js-cookie': 'Cookies',
  },
  optimization: {
    runtimeChunk: {
      name: 'runtime',
    },
  },
  plugins: [new CleanWebpackPlugin()],
};
