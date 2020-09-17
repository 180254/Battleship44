/* eslint-disable node/no-unpublished-require */

const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
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
                '@babel/preset-env',
                {
                  targets: [
                    'last 2 Chrome versions',
                    'last 2 Firefox versions',
                  ],
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
              replace: 'dev',
            },
          },
          {
            loader: 'string-replace-loader',
            options: {
              search: 'CONFIG_BACKEND',
              replace: process.env.BACKEND || 'ws://localhost:8080/ws',
            },
          },
        ],
      },
    ],
  },
  plugins: [new CleanWebpackPlugin()],
};
