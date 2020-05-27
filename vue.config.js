// 传递的参数，第一个是全局的application对象 第二个是要模拟的接口的url 第三个是要传递什么样的数据
function mock(app, url, data) {
  app.get(url, (request, response) => {
    response.json(data)
  })
}

// 依次传入data
const homeData = require('./src/mock/bookHome')
const shelfData = require('./src/mock/bookShelf')
const listData = require('./src/mock/bookList')
const flatListData = require('./src/mock/bookFlatList')

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? './'
    : '/',
  devServer: {
    public: '120.95.132.23:8080',
    hot: true,
    disableHostCheck: true,
    before (app) {
      mock(app, '/book/home', homeData)
      mock(app, '/book/shelf', shelfData)
      mock(app, '/book/list', listData)
      mock(app, '/book/flat-list', flatListData)
    }
  }
}
