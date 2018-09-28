const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
// const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: "./src/client/index.js",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "bundle.js"
  },
  node: {
    fs: "empty"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: path.join(__dirname, 'src', "client"),
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000'
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin("dist"),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      favicon: "./public/favicon.png"
    }),
    // new Dotenv(), // to enable env vars (MAPBOX_TOKEN) in build for use outside of heroku
    new webpack.DefinePlugin({
      'process.env': {
         MAPBOX_TOKEN: process.env.MAPBOX_TOKEN
      }
    })
  ]
};
