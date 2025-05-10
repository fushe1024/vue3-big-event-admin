import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/index'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/LoginPage.vue'),
      meta: {
        title: '登录'
      }
    },
    {
      path: '/',
      redirect: '/article/manage',
      name: 'home',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      children: [
        {
          path: 'article/manage',
          name: 'manage',
          component: () => import('@/views/article/ArticleManage.vue'),
          meta: {
            title: '文章管理'
          }
        },
        {
          path: 'article/channel',
          name: 'channel',
          component: () => import('@/views/article/ArticleChannel.vue'),
          meta: {
            title: '文章分类'
          }
        },
        {
          path: 'user/profile',
          name: 'profile',
          component: () => import('@/views/user/UserProfile.vue'),
          meta: {
            title: '个人中心'
          }
        },
        {
          path: 'user/avatar',
          name: 'avatar',
          component: () => import('@/views/user/UserAvatar.vue'),
          meta: {
            title: '头像'
          }
        },
        {
          path: 'user/password',
          name: 'password',
          component: () => import('@/views/user/UserPassword.vue'),
          meta: {
            title: '修改密码'
          }
        }
      ]
    }
  ]
})

// 全局前置守卫
router.beforeEach((to) => {
  // 设置标题

  // eslint-disable-next-line no-constant-binary-expression
  document.title = `大事件管理 - ${to.meta.title}` || 'Vue3 Admin'

  // 判断是否登录
  const userStore = useUserStore()
  const token = userStore.token

  if (!token && to.path !== '/login') {
    // 如果没有 token 且不是登录页，重定向到登录页
    ElMessage.error('请先登录')
    return '/login'
  } else if (token && to.path === '/login') {
    // 如果有 token 且是登录页，重定向到首页
    ElMessage.error('请先退出登录')
    return '/'
  }
})

export default router
