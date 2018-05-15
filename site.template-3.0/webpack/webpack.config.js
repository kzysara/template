if(module.hot){
    module.hot.accept()
}

const path = require('path');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');


module.exports = {
    devtool: "source-map",
    context: path.resolve(__dirname, 'src'),
    entry: {
        app: './assets/js/app.js',
        admin: './assets/js/admin.js',
        global: './assets/scss/globals.scss',
        style: './assets/scss/style.scss',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist/',
        filename: 'assets/js/[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(css|scss)$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                url: true,
                                minimize: false,
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
                })
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]?[hash]',
                        limit: 10000, //10kb
                        publicPath: '../',
                    }
                }
            },
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'src'),
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['es2015', {modules: false}]
                        ]
                    }
                }]
            },
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'commons',
            filename: 'assets/js/commons.js'
        }),
        new UglifyJSPlugin({
            test: /\.js($|\?)/i,
            sourceMap: true
        }),
        new ExtractTextPlugin({
            filename:  function(getPath){
                return getPath('assets/css/[name].bundle.css');
            },
            allChunks: true
        }),
        // new CopyWebpackPlugin(
        //     [
        //         {from:"../data_tmp/**/*", to:"../"},
        //         {from:"../index.html", to:"../"}
        //     ]
        // ),
    ],
    // devServer: {
    //     hot: true,
    //     contentBase: path.join(__dirname, "dist"),
    //     compress: true,
    //     port: 9000,
    //     filename: 'bundle.js',
    //     publicPath: '/',
    //     historyApiFallback: true,
    //     proxy: {
    //         "**": "http://localhost:3000"
    //     }
    // },

}

