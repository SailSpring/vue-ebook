import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/store'
  },
  {
    path: '/ebook',
    component: () => import('../views/ebook/index.vue'),
    // 设置动态路由，不需要全部刷新url
    children: [
      {
        path: ':fileName',
        component: () => import('../components/ebook/EbookReader')
      }
    ]
  },
  {
    path: '/store',
    component: () => import('../views/store/index.vue'),
    redirect: '/store/shelf',
    children: [
      {
        path: 'shelf',
        component: () => import('../views/store/StoreShelf')
      },
      {
        path: 'category',
        component: () => import('../views/store/StoreCategory')
      },
      {
        path: 'home',
        component: () => import('../views/store/StoreHome')
      },
      {
        path: 'list',
        component: () => import('../views/store/StoreList')
      },
      {
        // 没有加斜杠，相对路径 ，拼在/store/detail后面
        path: 'detail',
        component: () => import('../views/store/StoreDetail')
      },
      {
        // 没有加斜杠，相对路径 ，拼在/store/detail后面
        path: 'speaking',
        component: () => import('../views/store/StoreSpeaking')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
