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
      }),
    ],

  },
  // chainWebpack: config => {
  //   config
  //     .plugin('html')
  //     .tap(args => {
  //       console.log('WHAT HERE -> ', args)
  //       return [/* new args to pass to html-webpack-plugin's constructor */]
  //     })
  // }
};
