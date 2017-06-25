import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
let routes = [
  {
    path: '/',
    name: 'home',
    meta: {
      title: 'Home'
    },
    component: require('@/components/Home')
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login'
    },
    component: require('@/components/login')
  },
  {
    path: '/signup',
    name: 'signup',
    meta: {
      title: 'Signup'
    },
    component: require('@/components/signup')
  },
  { path: '*', redirect: '/' } // If no route matched redirect to home
]

const router = new Router({
  mode: 'history',
  routes,
  linkActiveClass: 'is-active'
})

/* Router before each hook used to update page title dynamically */
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | Developer Stream`
  next()
})

export default router
