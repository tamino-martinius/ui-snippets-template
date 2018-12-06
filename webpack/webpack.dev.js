const {
  publicPath,
  sourcePath
} = require('./paths');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

console.log('publicPath', publicPath);
console.log('sourcePath', sourcePath);

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
const host = process.env.HOST || 'localhost';

const config = {
  devtool: 'inline-source-map',
  output: {
    pathinfo: true,
  },
  devServer: {
    // All options here: https://webpack.js.org/configuration/dev-server/
    hot: true, // enable Hot Module Reload - Auto refresh on code change
    contentBase: publicPath,
    publicPath: '/',
    host: host,
    https: protocol === 'https',
    port: DEFAULT_PORT,
    disableHostCheck: true,
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true, // Injects js code
      template: publicPath + '/index.html',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  module: {
    rules: [{
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
        exclude: '/node_modules/',
      },
      {
        test: /\.html?$/,
        loader: 'raw-loader',
        include: sourcePath,
        exclude: /node_modules/,
      },
      {
        enforce: 'pre',
        test: /\.ts$/,
        use: "source-map-loader",
        exclude: '/node_modules/',
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
        use: [{
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 1,
              minimize: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => ([
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
              ])
            },
          },
        ],
      },
    ],
  },
};

module.exports = config;
