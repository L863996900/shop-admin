import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home'
import Welcome from '../components/Welcome.vue'
import User from '../components/user/User'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  { path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [{
      path: '/welcome', component: Welcome
    }, {
      path: '/users', component: User
    }]
  }
  // {
  //   path: '/about',
  //   name: 'about',
  //   component: () => import('../components/Welcome.vue')
  // }
]

const router = new VueRouter({
  routes
})
// 挂载路由导航守卫
// to ：将要访问的路径
// from：从那个路径跳转而来
// next：函数放行
//  next() 放行 next('/login') 强制跳转
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) {
    return next('/login')
  }
  next()
})

export default router
