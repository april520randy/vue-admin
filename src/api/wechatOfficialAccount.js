import {service} from 'utils'

// 查询(带分页)
export function queryPaging(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/pay/wechatOfficialAccount/pageList',
    method: 'post',
    data: jsonData
  })
}

// 查询(不带分页)
export function queryList(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/pay/wechatOfficialAccount/list',
    method: 'post',
    data: jsonData
  })
}

// 新增
export function insert(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/pay/wechatOfficialAccount/insert',
    method: 'post',
    data: jsonData
  })
}

// 修改
export function update(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/pay/wechatOfficialAccount/update',
    method: 'post',
    data: jsonData
  })
}
