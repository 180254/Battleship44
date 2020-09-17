/* eslint-disable node/no-unpublished-require */

const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

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
            {
              loader: 'string-replace-loader',
              options: {
                search: 'CONFIG_MODE',
                replace: conf['code_mode'],
              },
            },
            {
              loader: 'string-replace-loader',
              options: {
                search: 'CONFIG_BACKEND',
                replace: conf['code_backend'],
              },
            },
          ],
        },
      ],
    },
    plugins: [new CleanWebpackPlugin()],
  };
};
