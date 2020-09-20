const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const env_config = {
  mode: process.env.MODE || 'dev',
  backend: process.env.BACKEND || '',
};
const webpack_configs = {
  development: {
    mode: 'development',
    backend: env_config.backend || 'ws://localhost:8080/ws',
    devtool: 'inline-source-map',
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
  return 'development';
}

module.exports = (env, argv) => {
  const webpack_mode = fix_mode(argv.mode || env_config.mode);
  const webpack_config = webpack_configs[webpack_mode];

  return {
    target: 'web',
    mode: webpack_config.mode,
    devtool: webpack_config.devtool,
    entry: {
      app: './static/js/app/app-entrypoint.ts',
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
          exclude: [
            // Babels adds some core-js polyfills. Do not process that polyfills. It breaks app.
            /[\\/]node_modules[\\/]core-js[\\/]/,
          ],
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
};
