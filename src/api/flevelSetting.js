import {service} from 'utils'

// 查询(带分页)
export function queryPaging(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/friend/levelSetting/pageList',
    method: 'post',
    data: jsonData
  })
}

// 查询(不带分页)
export function queryList(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/friend/levelSetting/getLevelList',
    method: 'post',
    data: jsonData
  })
}
// 新增
export function insert(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/friend/levelSetting/insert',
    method: 'post',
    data: jsonData
  })
}

// 批量删除
export function batchDelete(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/friend/levelSetting/batchDelete',
    method: 'post',
    data: jsonData
  })
}
// 修改
export function update(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/friend/levelSetting/update',
    method: 'post',
    data: jsonData
  })
}



