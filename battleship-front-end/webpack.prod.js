/* eslint-disable node/no-unpublished-require */

const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    app: './static/js/app/app.entrypoint.ts',
    apploader: './static/js/app/app.loader.js',
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
        test: /\.(ts|js)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                'minify',
                {
                  // Fixes ' Couldn't find intersection' error.
                  // https://github.com/babel/minify/issues/904
                  builtIns: false,
                  // Dangerous option. App doesn't work will all when enabled.
                  deadcode: false,
                },
              ],
              [
                '@babel/preset-env',
                {
                  targets: ['defaults'],
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.ts$/,
        use: [{loader: 'ts-loader'}],
      },
      {
        test: /\.(ts|js)$/,
        use: [
          {
            loader: 'string-replace-loader',
            options: {
              search: 'CONFIG_MODE',
              replace: 'prod',
            },
          },
          {
            loader: 'string-replace-loader',
            options: {
              search: 'CONFIG_BACKEND',
              replace: process.env.BACKEND || '',
            },
          },
        ],
      },
    ],
  },
  plugins: [new CleanWebpackPlugin()],
};
