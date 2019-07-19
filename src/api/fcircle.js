import {service} from 'utils'

// 查询(带分页)
export function queryPaging(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/friend/circle/pageList',
    method: 'post',
    data: jsonData
  })
}

// 查询(带分页)
export function queryCommentsPaging(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/friend/circleComments/pageList',
    method: 'post',
    data: jsonData
  })
}

// 查询(不带分页)
export function queryList(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/friend/circle/list',
    method: 'post',
    data: jsonData
  })
}

// 修改
export function update(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/friend/circle/update',
    method: 'post',
    data: jsonData
  })
}

// 批量修改(上架/下架)
export function getById(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/friend/circle/getById',
    method: 'post',
    data: jsonData
  })
}

// 删除
export function batchDelete(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/friend/circle/batchDelete',
    method: 'post',
    data: jsonData
  })
}

// 详细
export function getByCircleDetailedVo(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/friend/circle/getByCircleDetailedVo',
    method: 'post',
    data: jsonData
  })
}
