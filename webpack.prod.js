const merge = require('webpack-merge');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin('dist'),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      favicon: './public/favicon.png'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        MAPBOX_TOKEN: process.env.MAPBOX_TOKEN
      }
    })
  ]
});
