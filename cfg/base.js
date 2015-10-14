var path = require('path');

var port = 8000;
var srcPath = path.join(__dirname, '/../src');
var publicPath = '/assets/';

//var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    port: port,
    debug: true,
    output: {
        path: path.join(__dirname, '/../dist/assets'),
        filename: 'app.js',
        publicPath: publicPath
    },
    devServer: {
        contentBase: './src/',
        historyApiFallback: true,
        hot: true,
        port: port,
        publicPath: publicPath,
        noInfo: false
    },
    resolve: {
        modulesDirectories: ['node_modules', 'components'],
        extensions: ['', '.js', '.jsx'],
        alias: {
            actions: srcPath + '/actions/',
            components: srcPath + '/components/',
            stores: srcPath + '/stores/',
            images: srcPath + '/images/'
        }
    },
    module: {
        preLoaders: [
            {
                test: /\.(js|jsx)$/,
                include: path.join(__dirname, 'src'),
                loader: 'eslint-loader'
            }
        ],
        loaders: [
            // {
            //     test: /\.css$/,
            //     exclude: /node_modules/,
            //     loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader')
            // },
            // {
            //     test: /\.scss/,
            //     exclude: /node_modules/,
            //     loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader!sass-loader?outputStyle=expanded')
            // },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                loader: 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader'
            },
            {
                test: /\.scss/,
                exclude: /node_modules/,
                loader: 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader!sass-loader?outputStyle=expanded'
            },
            {
                test: /\.(png|jpg|gif|woff|woff2)$/,
                loader: 'url-loader?limit=8192'
            }
        ]
    },
    postcss: [
        require('autoprefixer')
    ]
    // plugins: [
    //     //new ExtractTextPlugin('style.css', { allChunks: true })
    // ]
};