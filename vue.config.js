module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? './'
    : '/',
  devServer: {
    public: '120.95.132.23:8080',
    hot: true,
    disableHostCheck: true
  }
}
