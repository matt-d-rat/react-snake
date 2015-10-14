var webpackCfg = require('./webpack.config');

module.exports = function(config) {
  config.set({
    basePath: '',
    browsers: ['Chrome', 'PhantomJS'],
    files: [
      'test/loadtests.js'
    ],
    port: 8080,
    captureTimeout: 60000,
    frameworks: ['phantomjs-shim', 'mocha', 'chai', 'sinon', 'sinon-chai'],
    client: {
      mocha: {}
    },
    singleRun: true,
    reporters: ['mocha'],
    preprocessors: {
      'test/loadtests.js': ['webpack', 'sourcemap']
    },
    webpack: webpackCfg,
    webpackServer: {
      noInfo: true
    }
  });
};
