const {
  resolve
} = require('path');

module.exports = {
  buildPath: resolve(__dirname, '..', 'build'),
  publicPath: resolve(__dirname, '..', 'public'),
  sourcePath: resolve(__dirname, '..', 'src'),
  scriptPath: resolve(__dirname, '..', 'scripts'),
};
