import {service} from 'utils'

// 查询(带分页)
export function queryPaging(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/friend/advertisement/pageList',
    method: 'post',
    data: jsonData
  })
}

// 查询(不带分页)
export function queryList(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/friend/advertisement/list',
    method: 'post',
    data: jsonData
  })
}
// 新增
export function insert(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/friend/advertisement/insert',
    method: 'post',
    data: jsonData
  })
}

// 批量删除
export function batchDelete(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/friend/advertisement/batchDelete',
    method: 'post',
    data: jsonData
  })
}

