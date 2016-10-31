var path = require("path");

module.exports = {
  entry: {
    'elm-highcharts-demo': [
      './src/index.js'
    ]
  },

  output: {
    path: path.resolve(__dirname + '/docs'),
    filename: '[name].js'
  },

  module: {
    loaders: [
      {
        test:    /\.html$/,
        exclude: /node_modules/,
        loader:  'file?name=[name].[ext]'
      },
      {
        test:    /\.elm$/,
        exclude: [/elm-stuff/, /node_modules/],
        loader:  'elm-webpack'
      },
    ],

    noParse: /\.elm$/
  },

  devServer: {
    inline: true,
    historyApiFallback: true,
    stats: { colors: true }
  }
};
