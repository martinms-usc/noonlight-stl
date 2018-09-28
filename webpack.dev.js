const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:8080'
    }
  },
  plugins: [
    new Dotenv(), // to enable env vars (MAPBOX_TOKEN) in build for use production outside of heroku
    new CleanWebpackPlugin("dist"),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      favicon: "./public/favicon.png"
    })
  ]
});