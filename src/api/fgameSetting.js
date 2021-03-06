import {service} from 'utils'

// 查询(带分页)
export function queryPaging(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/friend/gameSetting/pageList',
    method: 'post',
    data: jsonData
  })
}

// 查询(不带分页)
export function queryList(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/friend/gameSetting/list',
    method: 'post',
    data: jsonData
  })
}
// 新增
export function insert(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/friend/gameSetting/insert',
    method: 'post',
    data: jsonData
  })
}

// 修改
export function update(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/friend/gameSetting/update',
    method: 'post',
    data: jsonData
  })
}

// 删除
export function batchDelete(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/friend/gameSetting/batchDelete',
    method: 'post',
    data: jsonData
  })
}
// 上传图片
export function uploadImage(jsonData) {
  console.info(jsonData)
  jsonData = jsonData || {};
  return service({
    url: '/api/friend/gameSetting/upload',
    method: 'post',

    data: jsonData
  })
}
