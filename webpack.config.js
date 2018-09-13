const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  context: path.join(__dirname, "src", "client"),
  entry: {
    app: './index.js'
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: 'bundle.js'
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
  devServer: {
    port: 3000,
    open: true,
    proxy: {
      '/api': 'http://localhost:8080'
    }
  },
  plugins: [
    // new CleanWebpackPlugin(["dist"]),
    new HtmlWebpackPlugin({
      template: '../../public/index.html',
      favicon: '../../public/favicon.png'
    })
  ]
};
