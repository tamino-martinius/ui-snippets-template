const commonConfig = require('./webpack.common');
const webpackMerge = require('webpack-merge');

const createConfig = (env) => {
  if (!(env && env.env)) env.env = 'dev';
  const envConfig = require(`./webpack.${env.env}.js`);
  const mergedConfig = webpackMerge(commonConfig, envConfig);
  return mergedConfig;
};

module.exports = createConfig;
