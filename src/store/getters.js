const getters = {
  language: state => state.user.language,
  sidebar: state => state.user.sidebar,
  permission_routers: state => state.user.routers,
  addRouters: state => state.user.addRouters,
  visitedViews: state => state.tagsView.visitedViews
}

export default getters
