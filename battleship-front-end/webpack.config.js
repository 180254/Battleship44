const path = require('path');
const zlib = require('zlib');
const zopfli = require('@gfx/zopfli');

const webpack = require('webpack');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const JsonMinimizerPlugin = require('json-minimizer-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const configs = {
  development: {
    mode: 'development',
    backend: process.env.BACKEND || 'ws://localhost:8080/ws',
    filenamePrefix: '[name]',
    devtool: 'source-map',
    browserslist: ['last 2 chrome versions', 'last 2 firefox versions'],
    extraOptimizations: {
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
    extraPlugins: [],
  },

  production: {
    mode: 'production',
    backend: process.env.BACKEND || '',
    filenamePrefix: '[name].[contenthash]',
    devtool: undefined,
    browserslist: ['defaults'],
    extraOptimizations: {},
    extraPlugins: [
      new CompressionPlugin({
        // https://github.com/google/zopfli
        // Very good, but slow, zlib compression. Good for pre-compressed content.
        algorithm: zopfli.gzip,
        filename: '[path][base].gz',
        test: /\.(html|js|map|css|svg|json|txt)$/,
        compressionOptions: {
          // just defaults
          verbose: false,
          verbose_more: false,
          numiterations: 15,
          blocksplitting: true,
          blocksplittingmax: 15,
        },
        minRatio: Number.MAX_SAFE_INTEGER,
      }),
      new CompressionPlugin({
        algorithm: zlib.brotliCompress,
        filename: '[path][base].br',
        test: /\.(html|js|map|css|svg|json|txt)$/,
        compressionOptions: {
          params: {
            // BROTLI_MAX_QUALITY is ok for pre-compressed content.
            // For dynamic compression it is better to use quality=4.
            // - https://www.iiwnz.com/improve-website-speed-by-compression/
            // - https://blogs.akamai.com/2016/02/understanding-brotlis-potential.html
            // - https://blog.cloudflare.com/results-experimenting-brotli/
            [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY,
            [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_DEFAULT_MODE,
            [zlib.constants.BROTLI_PARAM_SIZE_HINT]: 0,
          },
        },
        minRatio: Number.MAX_SAFE_INTEGER,
      }),
    ],
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
      app: [
        // js-cookie is an app runtime dependency
        'js-cookie',
        /**
         * core-js@3 do not polyfill window.fetch
         * https://caniuse.com/?search=fetch
         * https://github.com/developit/unfetch
         * https://github.com/github/fetch
         */
        'unfetch/polyfill',
        path.resolve(__dirname, 'src/js/app-entrypoint.ts'),
        path.resolve(__dirname, 'src/css/stylesheet.css'),
      ],
    },
    output: {
      path: path.resolve(__dirname, 'dist/'),
      filename: `${itdepends.filenamePrefix}.js`,
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
            {loader: MiniCssExtractPlugin.loader},
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
                    // https://babeljs.io/docs/en/babel-preset-env#options
                    {
                      targets: itdepends.browserslist,
                      // "Note: These optimizations will be enabled by default in Babel 8"
                      bugfixes: true,
                      // "A normal mode follows the semantics of ECMAScript 6
                      //  as closely as possible. A loose mode produces simpler ES5 code."
                      loose: true,
                      // "Outputs to console.log the polyfills and transform plugins enabled"
                      debug: false,
                      // Adds specific imports for polyfills (core-js@3),
                      // when they are used, in each file.
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
    optimization: {
      minimizer: [
        new TerserPlugin({
          exclude: /.min.js$/,
          terserOptions: {
            compress: {
              passes: 2,
            },
          },
        }),
        new CssMinimizerPlugin(),
        new JsonMinimizerPlugin(),
      ],
      ...itdepends.extraOptimizations,
    },
    plugins: [
      new CleanWebpackPlugin(),
      new webpack.DefinePlugin({
        WEBPACK_DEFINE_MODE: JSON.stringify(itdepends.mode),
        WEBPACK_DEFINE_BACKEND: JSON.stringify(itdepends.backend),
      }),
      new MiniCssExtractPlugin({
        filename: `${itdepends.filenamePrefix}.css`,
      }),
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'src/flags/*.png'),
            to: 'flags/',
            flatten: true,
          },
          {
            from: path.resolve(__dirname, 'src/flags/LICENSE.txt'),
            to: 'flags/',
            flatten: true,
          },
          {
            from: path.resolve(__dirname, 'src/i18n/*.json'),
            to: 'i18n/',
            flatten: true,
          },
          {
            from: path.resolve(__dirname, 'src/og/*.png'),
            to: 'og/',
            flatten: true,
          },
          {
            from: path.resolve(__dirname, 'src/og/*.webp'),
            to: 'og/',
            flatten: true,
          },
          {
            from: path.resolve(__dirname, 'src/favicon.png'),
            to: 'favicon.png',
          },
        ],
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src/index.html'),
        filename: 'index.html',
        minify: false,
        inject: false,
        scriptLoading: 'defer',
        xhtml: true,
        cache: false, // https://github.com/webpack/webpack/issues/10761
      }),
      ...itdepends.extraPlugins,
    ],
  };
};
