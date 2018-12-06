const {
  sourcePath,
  buildPath,
  scriptPath
} = require('./paths');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const config = {
  target: 'web',
  entry: {
    'bundle': [
      scriptPath + '/render.ts',
      sourcePath + '/',
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'static/js/[name].[hash].js',
    path: buildPath,
    chunkFilename: 'static/js/[name].chunk.js',
    publicPath: './',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      checkSyntacticErrors: true
    }),
    new CopyWebpackPlugin(
      [{
        from: 'public'
      }, ], {
        ignore: [
          // Boilerplate will not be copied
          'index.html',
        ],
      },
    )
  ],
};

module.exports = config;
