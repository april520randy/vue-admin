import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../views/layout/Layout'

Vue.use(Router)

const _import = require('./_import_' + process.env.NODE_ENV)
console.log(process.env.NODE_ENV)

export const constantRouterMap = [
  {path: '/login', component: _import('login/index'), hidden: true},
  {
    path: '',
    component: Layout,
    redirect: 'home',
    children: [
      {
        path: 'home',
        component: _import('home/index'),
        name: 'home',
        meta: {title: 'home', icon: 'dashboard', noCache: true}
      }
    ]
  },
  {
    path: '/test',
    component: _import('test'),
  },
]

export default new Router({
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})
