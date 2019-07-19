import Cookies from 'js-cookie'
import {constantRouterMap} from '@/router'

const user = {
  state: {
    language: Cookies.get('language') || 'zh',
    routers: constantRouterMap,
    addRouters: [],
    sidebar: {
      opened: !+Cookies.get('sidebarStatus')
    }
  },
  mutations: {
    SET_LANGUAGE: (state, language) => {
      Cookies.set('language', language);
      state.language = language;
    },
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers);
    },
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1);
      } else {
        Cookies.set('sidebarStatus', 0);
      }
      state.sidebar.opened = !state.sidebar.opened;
    }
  },
  actions: {
    setLanguage({commit}, language) {
      commit('SET_LANGUAGE', language);
    },
    generateRoutes({commit}, data) {
      return new Promise(resolve => {
        commit('SET_ROUTERS', data);
        resolve();
      });
    },
    toggleSideBar({commit}) {
      commit('TOGGLE_SIDEBAR');
    }
  }
}

export default user
