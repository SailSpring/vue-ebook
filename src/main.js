import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/styles/icon.css'
// import './assets/fonts/daysOne.css'
import './assets/styles/global.scss'
import i18n from './lang'
// mockjs的初始化
// 不支持blob对象，只能支持text的文本进行图书阅读展示，一旦涉及到下载类、资源类应用时不能使用mock.js，第二种mock的方法，利用本地调试模式启动的http服务
// （vue.config.js），在这个服务中添加一些自定义的接口
// import './mock'
import './utils/boost'
import './utils/create-api'

Vue.config.productionTip = false
Vue.config.devtools = true

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
