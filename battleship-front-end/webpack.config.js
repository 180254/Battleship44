const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
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
        use: [{loader: 'babel-loader'}, {loader: 'ts-loader'}],
      },
      {
        test: /\.js$/,
        use: [{loader: 'babel-loader'}],
      },
    ],
  },
  externals: {
    jquery: 'jquery',
    'js-cookie': 'js-cookie',
  },

  plugins: [
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
