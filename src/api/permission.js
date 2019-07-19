import {service} from 'utils'

// 初始化权限树(带用户权限)
export function initUserPermission(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/system/permission/initUserPermission',
    method: 'post',
    data: jsonData
  })
}

export function get(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/system/permission/get',
    method: 'post',
    data: jsonData
  })
}

export function getByParentId(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/system/permission/getByParentId',
    method: 'post',
    data: jsonData
  })
}

export function insert(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/system/permission/insert',
    method: 'post',
    data: jsonData
  })
}

export function update(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/system/permission/update',
    method: 'post',
    data: jsonData
  })
}

export function del(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/system/permission/delete',
    method: 'post',
    data: jsonData
  })
}
