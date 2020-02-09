import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: Login },
  { path: '/home', name: 'home', component: Home }
  // {
  //   path: '/about',
  //   name: 'about',
  //   component: () => import( '../views/About.vue')
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
