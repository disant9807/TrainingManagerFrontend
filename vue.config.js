module.exports = {
  productionSourceMap: false,
  publicPath: '/',
  transpileDependencies: ['vuetify'],
  configureWebpack: {
    devtool: 'source-map',
    performance: {
      hints: false
    },
    devServer: {
      open: true
    }
  },
  css: {
    sourceMap: process.env.NODE_ENV !== 'production',
    extract: { ignoreOrder: true }
  }
};
