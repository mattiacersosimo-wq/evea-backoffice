const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.fallback = {
    process: require.resolve('process/browser'),
    zlib: require.resolve('browserify-zlib'),
    stream: require.resolve('stream-browserify'),
    util: require.resolve('util'),
    buffer: require.resolve('buffer'),
    asset: require.resolve('assert'),
    'react/jsx-runtime':require.resolve("react/jsx-runtime.js"),
    'react/jsx-dev-runtime':require.resolve("react/jsx-dev-runtime.js")
  };

  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser.js',
      Buffer: ['buffer', 'Buffer'],
    })
  );

  return config;
};