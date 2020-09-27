/* eslint-disable node/no-unpublished-require */

const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const env_config = {
  mode: process.env.MODE || '',
  backend: process.env.BACKEND || '',
};

const webpack_configs = {
  development: {
    mode: 'development',
    backend: env_config.backend || 'ws://localhost:8080/ws',
    devtool: 'source-map',
    browserslist: ['last 1 chrome versions', 'last 1 firefox versions'],
  },
  production: {
    mode: 'production',
    backend: env_config.backend || '',
    devtool: undefined,
    browserslist: ['defaults'],
  },
};

function fix_mode(mode) {
  if (['development', 'dev', 'd'].includes(mode)) return 'development';
  if (['production', 'prod', 'p'].includes(mode)) return 'production';
  return 'production';
}

function js_config(webpack_config) {
  return {
    target: ['web', 'es5'],
    mode: webpack_config.mode,
    devtool: webpack_config.devtool,
    entry: {
      app: './src/js/app-entrypoint.ts',
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
          use: [
            {
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
                      debug: false,
                      // Adds specific imports for polyfills (core-js@3),
                      // when they are used in each file.
                      useBuiltIns: 'usage',
                      corejs: {version: 3},
                    },
                  ],
                ],
                cacheDirectory: true,
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
        {
          test: /\.(ts|js)$/,
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
          exclude: [/[\\/]node_modules[\\/]/],
        },
      ],
    },
    externals: {
      jquery: 'jQuery',
      'js-cookie': 'Cookies',
    },
    optimization: {
      minimizer: [new TerserPlugin()],
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
    plugins: [new CleanWebpackPlugin()],
  };
}

function css_config(webpack_config) {
  return {
    target: ['web', 'es5'],
    mode: webpack_config.mode,
    devtool: webpack_config.devtool,
    entry: {
      stylesheet: './src/css/stylesheet.css',
    },
    output: {
      path: path.resolve(__dirname, 'static/css/dist/'),
      filename: '[name].dist.js',
    },
    resolve: {
      extensions: ['.css'],
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
                    ['postcss-preset-env', {browsers: webpack_config.browserslist}],
                    [
                      'postcss-normalize',
                      {browsers: webpack_config.browserslist, forceImport: true},
                    ],
                  ],
                },
              },
            },
          ],
          exclude: [/[\\/]node_modules[\\/]/],
        },
      ],
    },
    optimization: {
      minimizer: [new OptimizeCSSAssetsPlugin({})],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name].dist.css',
      }),
    ],
  };
}

module.exports = (env, argv) => {
  const webpack_mode = fix_mode(env_config.mode || argv.mode);
  const webpack_config = webpack_configs[webpack_mode];
  return [js_config(webpack_config), css_config(webpack_config)];
};
