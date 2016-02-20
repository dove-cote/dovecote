var path = require('path');
var webpack = require('webpack');
var StatsPlugin = require('stats-webpack-plugin');

var IS_PROD = process.env.PRODUCTION == 'true';

var DEV_PLUGINS = [
    new webpack.HotModuleReplacementPlugin()
];

var PROD_PLUGINS = [
    new webpack.DefinePlugin({
        'process.env':{
            'NODE_ENV': JSON.stringify('production')
        }
    }),
    new webpack.optimize.UglifyJsPlugin({
        compress:{
            warnings: true
        }
    }),

    new StatsPlugin('stats.json', {
        hash: true,
        assets: true,
        chunks: false,
        modules: false,
        exclude: [/node_modules[\\\/]react/]
    })
];

var PLUGINS = IS_PROD ? PROD_PLUGINS : DEV_PLUGINS;

module.exports = {
    devtool: 'eval',
    entry: [
        'webpack-dev-server/client?http://localhost:3000',
        'webpack/hot/only-dev-server',
        './src/index'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: IS_PROD ? 'bundle.[hash].js' : 'bundle.js',
        publicPath: '/static/'
    },
    plugins: PLUGINS,
    module: {
        loaders: [{
            test: /\.module\.css$/,
            loaders: [
                'style-loader',
                'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!'
            ]
        },{
            test: /\.js$/,
            loaders: ['react-hot', 'babel'],
            include: path.join(__dirname, 'src')
        }]
    }
};
