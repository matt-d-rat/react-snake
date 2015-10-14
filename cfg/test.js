var path = require('path');
var srcPath = path.join(__dirname, '/../src/');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  cache: false,
  module: {
    loaders: [
      {
        test: /\.(png|jpg|gif|woff|woff2|css|sass|scss|less|styl)$/,
        loader: 'null-loader'
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: [
          path.join(__dirname, '/../src'),
          path.join(__dirname, '/../test')
        ]
      }
    ]
  },
  resolve: {
    modulesDirectories: ['node_modules', 'components'],
    extensions: ['', '.js', '.jsx'],
    alias: {
      actions: srcPath + 'actions/',
      helpers: path.join(__dirname, '/../test/helpers'),
      components: srcPath + 'components/',
      sources: srcPath + 'sources/',
      stores: srcPath + 'stores/',
      styles: srcPath + 'styles/'
    }
  },
  plugins: [
    new webpack.IgnorePlugin(/react-addons/),
    new webpack.IgnorePlugin(/react-dom/)
  ],
  // node: {
  //   console: 'empty',
  //   fs: 'empty',
  //   net: 'empty',
  //   tls: 'empty',
  //   child_process: 'empty'
  // }
};
