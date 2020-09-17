/* eslint-disable node/no-unpublished-require */

const CopyPlugin = require('copy-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const path = require('path');

module.exports = conf => {
  const babel_loader_options = {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: conf['browserlist'],
        },
      ],
    ],
  };

  return {
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
          test: /\.ts$/,
          use: [
            {
              loader: 'babel-loader',
              options: babel_loader_options,
            },
            {loader: 'ts-loader'},
          ],
        },
        {
          test: /\.js$/,
          use: [
            {
              loader: 'babel-loader',
              options: babel_loader_options,
            },
          ],
        },
      ],
    },
    externals: {
      jquery: 'jquery',
      'js-cookie': 'js-cookie',
    },
    plugins: [
      new CleanWebpackPlugin(),
      new CopyPlugin({
        patterns: [
          {
            from: './node_modules/jquery/dist/jquery.slim.min.js',
            to: 'jquery.slim.min.js',
          },
          {
            from: './node_modules/jquery-ui-dist/jquery-ui.min.js',
            to: 'jquery-ui.min.js',
          },
          {
            from: './node_modules/cookies-js/dist/cookies.min.js',
            to: 'cookies.min.js',
          },
        ],
      }),
    ],
  };
};
