/* eslint-disable node/no-unpublished-require */

const path = require('path');
const rndm = require('rndm');
const webpack = require('webpack');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const SriPlugin = require('webpack-subresource-integrity');

const itdepends_configs = {
  development: {
    mode: 'development',
    backend: process.env.BACKEND || 'ws://localhost:8080/ws',
    devtool: 'source-map',
    browserslist: ['last 2 chrome versions', 'last 2 firefox versions'],
    sriEnabled: false,
  },
  production: {
    mode: 'production',
    backend: process.env.BACKEND || '',
    devtool: undefined,
    browserslist: ['defaults'],
    sriEnabled: true,
  },
};

function fix_mode(mode) {
  if (['development', 'dev', 'd'].includes(mode)) return 'development';
  if (['production', 'prod', 'p'].includes(mode)) return 'production';
  return 'production';
}

module.exports = (env, argv) => {
  const itdepends_mode = fix_mode(process.env.MODE || argv.mode || '');
  const itdepends_config = itdepends_configs[itdepends_mode];

  // https://github.com/jharris4/html-webpack-tags-plugin/issues/56
  const someSalt = rndm.base36(8);

  return {
    target: `browserslist:${itdepends_config.browserslist}`,
    mode: itdepends_config.mode,
    devtool: itdepends_config.devtool,
    entry: {
      app: path.resolve(__dirname, 'src/js/app-entrypoint.ts'),
      stylesheet: path.resolve(__dirname, 'src/css/stylesheet.css'),
    },
    output: {
      path: path.resolve(__dirname, 'dist/'),
      filename: '[name].[contenthash].js',
      hashDigestLength: 8,
      crossOriginLoading: 'anonymous',
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
                    ['postcss-preset-env', {browsers: itdepends_config.browserslist}],
                    [
                      'postcss-normalize',
                      {browsers: itdepends_config.browserslist, forceImport: true},
                    ],
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
                      targets: itdepends_config.browserslist,
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
        WEBPACK_DEFINE_MODE: JSON.stringify(itdepends_config.mode),
        WEBPACK_DEFINE_BACKEND: JSON.stringify(itdepends_config.backend),
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
            to: `jquery.${someSalt}.min.js`,
          },
          {
            from: path.resolve(__dirname, 'node_modules/js-cookie/dist/js.cookie.min.js'),
            to: `js.cookie.${someSalt}.min.js`,
          },
        ],
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src/index.html'),
        filename: 'index.html',
        minify: false,
        scriptLoading: 'defer',
        inject: false,
      }),
      new HtmlWebpackTagsPlugin({
        tags: [`jquery.${someSalt}.min.js`, `js.cookie.${someSalt}.min.js`],
        append: false, // it means prepend
      }),
      new SriPlugin({
        hashFuncNames: ['sha3-224', 'sha256'],
        enabled: itdepends_config.sriEnabled,
      }),
    ],
  };
};
