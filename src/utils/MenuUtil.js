const _import = require('@/router/_import_' + process.env.NODE_ENV)

export default (routers, data) => {
  // 这里之所以要重新遍历一下，是因为，通常我们动态路由的时候，是获取服务端数据，这个component属性是一个字符串，或者可能连字段名都是其他的key，所以这里要做一些转换
  generateMenu(routers, data);
}

function generateMenu(routers, data) {
  data.forEach((item) => {
    let menu = Object.assign({}, item);
    menu.component = _import(menu.component);
    menu.meta = {};
    if (item.iconCls) {
      menu.meta.icon = item.iconCls;
    }
    if (item.title) {
      menu.meta.title = item.title;
    }
    if (item.children && item.children.length > 0) {
      menu.alwaysShow = true;
      menu.redirect = 'noredirect';
      menu.children = [];
      generateMenu(menu.children, item.children);
    }
    routers.push(menu);
  })
}
