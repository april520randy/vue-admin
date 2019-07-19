import {service} from 'utils'

// 查询(带分页)
export function queryPaging(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/game/gameConfig/pageList',
    method: 'post',
    data: jsonData
  })
}

// 查询(不带分页)
export function queryList(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/game/gameConfig/list',
    method: 'post',
    data: jsonData
  })
}

// 新增
export function insert(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/game/gameConfig/insert',
    method: 'post',
    data: jsonData
  })
}

// 修改
export function update(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/game/gameConfig/update',
    method: 'post',
    data: jsonData
  })
}

// 批量修改(上架/下架)
export function batchShelves(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/game/gameConfig/batchShelves',
    method: 'post',
    data: jsonData
  })
}

// 删除
export function batchDelete(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/game/gameConfig/batchDelete',
    method: 'post',
    data: jsonData
  })
}

// 上传图片
export function uploadImage(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/game/gameConfig/upload',
    method: 'post',
    
    data: jsonData
  })
}

// 导入
export function importExcel(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/game/gameConfig/importExcel',
    method: 'post',
    data: jsonData
  })
}
