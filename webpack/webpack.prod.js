const {
  publicPath,
  sourcePath
} = require('./paths');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

console.log('publicPath', publicPath);
console.log('sourcePath', sourcePath);

const config = {
  bail: true, // Don't attempt to continue if there are any errors.
  devtool: 'source-map',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          ecma: 6,
        },
      }),
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true, // Injects js code
      template: publicPath + '/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
      },
      'DEBUG': false,
      '__DEVTOOLS__': false,
    }),
    new ExtractTextPlugin({
      filename: 'static/css/index.css',
      allChunks: true
    }),
    new CompressionWebpackPlugin({
      filename: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.(js|html|css)$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
  ],
  module: {
    rules: [{
        test: /\.html?$/,
        loader: 'raw-loader',
        include: sourcePath,
        exclude: /node_modules/,
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
        exclude: [
          '/node_modules/',
        ],
      },
      {
        test: /\.ts$/,
        use: [{
          loader: 'ts-loader',
          options: {
            happyPackMode: true,
          },
        }, ],
        include: sourcePath,
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        include: sourcePath,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
              loader: 'css-loader',
              options: {
                sourceMap: true,
                importLoaders: 1,
                minimize: true,
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                plugins: () => [
                  require("postcss-each")(),
                  require("postcss-nested")(),
                  require("postcss-cssnext")({
                    features: {
                      customProperties: {
                        warnings: false,
                        preserve: true,
                      },
                    },
                  }),
                ],
              },
            },
          ],
        }),
      },
    ],
  },
};

module.exports = config;
