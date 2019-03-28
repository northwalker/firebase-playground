import Vue from 'vue'
import Router from 'vue-router'
import Auth from './views/Auth.vue'
import Test from './views/Test.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '',
      component: Auth,
      children: [
        {
          path: '/',
          redirect: '/signin'
        },
        {
          path: 'signin',
          name: 'signin',
          component: () => import(/* webpackChunkName: "signin" */ '@/components/SignIn.vue')
        },
        {
          path: 'signup',
          name: 'signup',
          component: () => import(/* webpackChunkName: "signup" */ '@/components/SignUp.vue')
        }
      ]
    },
    {
      path: '/test',
      name: 'test',
      component: Test,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/welcome',
      name: 'welcome',
      component: () => import(/* webpackChunkName: "welcome" */ '@/views/Welcome.vue'),
      meta: {
        requiresAuth: true
      }
    }
  ]
})
