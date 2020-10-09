import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/'
import { Dialog } from 'vant'
Vue.use(VueRouter)

// 路由表
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login'),
    meta: { requiresAuth: false }
  },
  {
    path: '/search',
    component: () => import('@/views/search')
  },
  {
    name: 'chat',
    path: '/chat',
    component: () => import('@/views/chat'),
    meta: { requiresAuth: true }
  },
  {
    path: '/user/:userId',
    name: 'user',
    component: () => import('@/views/user')
  },
  {
    name: 'user-profile',
    path: '/user-profile',
    component: () => import('@/views/user-profile')
  },
  {
    path: '/article/:articleId',
    name: 'article',
    component: () => import('@/views/article'),
    // 将路由动态参数映射到组件的 props 中，更推荐这种做法
    props: true
  },
  {
    path: '/',
    component: () => import('@/views/layout'),
    children: [
      {
        path: '', // 默认子路由
        name: 'home',
        component: () => import('@/views/home')
      },
      {
        path: '/qa',
        name: 'qa',
        component: () => import('@/views/qa')
      },
      {
        path: '/video',
        name: 'video',
        component: () => import('@/views/video')
      },
      {
        path: '/my',
        name: 'my',
        component: () => import('@/views/my')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  if (to.name === 'login' || !to.meta.requiresAuth) {
    return next()
  }

  if (store.state.user) {
    return next()
  }

  Dialog.confirm({
    title: '该功能需要登录，确认登录吗？'
  }).then(() => {
    next({
      name: 'login',
      query: {
        redirect: from.fullPath
      }
    })
  }).catch(() => {
    // on cancel
  })
})
export default router
