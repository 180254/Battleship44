/* eslint-disable node/no-unpublished-require */

const path = require('path');
const webpack = require('webpack');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');

const jQueryVersion = require('jquery/package.json').version;
const jsCookieVersion = require('js-cookie/package.json').version;

const configs = {
  development: {
    mode: 'development',
    backend: process.env.BACKEND || 'ws://localhost:8080/ws',
    devtool: 'source-map',
    browserslist: ['last 2 chrome versions', 'last 2 firefox versions'],
  },
  production: {
    mode: 'production',
    backend: process.env.BACKEND || '',
    devtool: undefined,
    browserslist: ['defaults'],
  },
};

function fixMode(mode) {
  if (['development', 'dev', 'd'].includes(mode)) return 'development';
  if (['production', 'prod', 'p'].includes(mode)) return 'production';
  return 'production';
}

module.exports = (env, argv) => {
  const mode = fixMode(process.env.MODE || argv.mode || '');
  const itdepends = configs[mode];

  return {
    target: `browserslist:${itdepends.browserslist}`,
    mode: itdepends.mode,
    devtool: itdepends.devtool,
    entry: {
      app: path.resolve(__dirname, 'src/js/app-entrypoint.ts'),
      stylesheet: path.resolve(__dirname, 'src/css/stylesheet.css'),
    },
    output: {
      path: path.resolve(__dirname, 'dist/'),
      filename: '[name].[contenthash].js',
      hashDigestLength: 8,
    },
    resolve: {
      extensions: ['.js', '.ts', '.css'],
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {loader: 'css-loader', options: {importLoaders: 1}},
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    ['postcss-preset-env', {browsers: itdepends.browserslist}],
                    ['postcss-normalize', {browsers: itdepends.browserslist, forceImport: true}],
                  ],
                },
              },
            },
          ],
          exclude: [/[\\/]node_modules[\\/]/],
        },
        {
          test: /\.(ts|js)$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  [
                    '@babel/preset-env',
                    {
                      targets: itdepends.browserslist,
                      // Note: These optimizations will be enabled by default in Babel 8
                      bugfixes: true,
                      //A normal mode follows the semantics of ECMAScript 6 as closely as possible.
                      //A loose mode produces simpler ES5 code.
                      loose: true,
                      // Outputs to console.log the polyfills and transform plugins enabled
                      debug: false,
                      // Adds specific imports for polyfills (core-js@3),
                      // when they are used in each file.
                      useBuiltIns: 'usage',
                      corejs: {version: 3},
                    },
                  ],
                ],
              },
            },
          ],
          exclude: [/[\\/]node_modules[\\/]/],
        },
        {
          test: /\.ts$/,
          use: [{loader: 'ts-loader'}],
          exclude: [/[\\/]node_modules[\\/]/],
        },
      ],
    },
    externals: {
      jquery: 'jQuery',
      'js-cookie': 'Cookies',
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          exclude: /.min.js$/,
        }),
        new CssMinimizerPlugin(),
      ],
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
    plugins: [
      new CleanWebpackPlugin(),
      new webpack.DefinePlugin({
        WEBPACK_DEFINE_MODE: JSON.stringify(itdepends.mode),
        WEBPACK_DEFINE_BACKEND: JSON.stringify(itdepends.backend),
      }),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
      }),
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'src/flags/'),
            to: 'flags/',
          },
          {
            from: path.resolve(__dirname, 'src/i18n/'),
            to: 'i18n/',
          },
          {
            from: path.resolve(__dirname, 'src/favicon.png'),
            to: 'favicon.png',
          },
          {
            from: path.resolve(__dirname, 'node_modules/jquery/dist/jquery.min.js'),
            to: `jquery.${jQueryVersion}.min.js`,
          },
          {
            from: path.resolve(__dirname, 'node_modules/js-cookie/dist/js.cookie.min.js'),
            to: `js.cookie.${jsCookieVersion}.min.js`,
          },
        ],
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src/index.html'),
        filename: 'index.html',
        minify: false,
        scriptLoading: 'defer',
        xhtml: true,
        inject: false,
      }),
      new HtmlWebpackTagsPlugin({
        tags: [`jquery.${jQueryVersion}.min.js`, `js.cookie.${jsCookieVersion}.min.js`],
        append: false, // it means prepend
      }),
    ],
  };
};
