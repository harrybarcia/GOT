const path = require('path');
const BabiliPlugin = require('babili-webpack-plugin');

const webpackConfig = {
  cache: false,
  mode: 'development', // or 'production'
  entry: './app/main.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        },
        include: [path.resolve(__dirname, '../app')]
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 100000
        }
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      }
    ]
  }
};

if (process.env.NODE_ENV === 'production') {
  webpackConfig.plugins = [new BabiliPlugin({})];
  webpackConfig.devtool = 'source-map';
} else {
  webpackConfig.devtool = 'eval-source-map';
}

module.exports = webpackConfig;
