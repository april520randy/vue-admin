import Vue from 'vue'
import router from './router'
import ElementUI from 'element-ui'
import store from './store'
import i18n from './lang'
import moment from 'moment'
import fun from './commons/fun'
import global from './commons/Global'
import MenuUtil from '@/utils/MenuUtil'
import './icons'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css'
import '@/assets/styles/index.scss'
import Index from './Index'
import '../static/UEditor/ueditor.config.js'
import '../static/UEditor/ueditor.all.min.js'
import '../static/UEditor/lang/zh-cn/zh-cn.js'
import '../static/UEditor/ueditor.parse.min.js'

const VueUeditorWrap = require('vue-ueditor-wrap') // CommonJS

Vue.component('vue-ueditor-wrap', VueUeditorWrap)
Vue.config.productionTip = false
Vue.use(fun)
Vue.prototype.moment = moment
Vue.prototype.global = global

Vue.prototype.hasPermission = function (key) {
  let buttonArray = JSON.parse(window.sessionStorage.getItem('button'));
  if (buttonArray) {
    for (let i = 0, len = buttonArray.length; i < len; i++) {
      if (buttonArray[i]["permissionCode"] === key) {
        return true;
      }
    }
  }
  return false;
}

Vue.directive('permission', {
  bind: function (el, binding, vnode) {
    let result = vnode.context.hasPermission(binding.value);
    if (!result) {
      el.style.display = 'none';
    }
  }
})

router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    window.sessionStorage.removeItem('operator');
  }
  let user = window.sessionStorage.getItem('operator');
  if (!user && to.path != '/login') {
    next({path: '/login'});
  } else {
    next();
  }
})

let data = JSON.parse(window.sessionStorage.getItem('router'));
if (data) {
  let routers = [];
  MenuUtil(routers, data);
  store.dispatch('generateRoutes', routers);
  router.addRoutes(routers);
}

Vue.use(ElementUI, {
  size: 'medium',
  i18n: (key, value) => i18n.t(key, value)
})

new Vue({
  router,
  store,
  i18n,
  render: h => h(Index)
}).$mount('#app')
