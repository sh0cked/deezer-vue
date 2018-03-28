const webpack = require('webpack');

module.exports = {
  configureWebpack: {
    output: {
      publicPath: process.env.GH_PAGES ? './' : '/',
    },
    plugins: [
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.DefinePlugin({
        BASE_PATH: JSON.stringify(process.env.GH_PAGES ? '/deezer-vue' : '/'),
        GH_PAGES: JSON.stringify(process.env.GH_PAGES)
      }),
    ],

  }
};
