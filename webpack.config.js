'use strict';

const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MinifyPlugin = require("babel-minify-webpack-plugin");

module.exports = {
	target: 'web',
	mode: 'development',
	entry: './app.js',
	output: {
		filename: 'bundle.js',
		path: __dirname + '/build/js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
					{loader: 'babel-loader'}
				]
			}
		]
	},
	optimization: {
	    minimizer: [new UglifyJsPlugin({
	    	test: /\.js(\?.*)?$/i
	    })]
	 },
	 plugins: [
	    new MinifyPlugin({}, {
	    	test:/\.js($|\?)/i
	    })
	  ]
}