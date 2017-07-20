var path = require("path")
var ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
    entry: {
        "build/bundle": "./js/app.js"
    },
    output: {
        path: path.resolve("."),
        filename: "[name].js"
    },
    // watch: true,
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: 'env'
                    }
                }
            }, {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'autoprefixer-loader']
            }, {
                test: /\.html$/,
                use: 'file-loader'
            }
        ],
    },
    resolve: {
        extensions: ['.js', '.css', '.html']
    },
    plugins: [
        new ExtractTextPlugin('[name].css')
    ]
}