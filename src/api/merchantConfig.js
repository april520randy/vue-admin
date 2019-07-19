import {service} from 'utils'

// 查询(带分页)
export function queryPaging(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/pay/merchantConfig/pageList',
    method: 'post',
    data: jsonData
  })
}

// 修改
export function update(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/pay/merchantConfig/update',
    method: 'post',
    data: jsonData
  })
}

// 批量修改(开启/关闭、禁用/启用)
export function batchUpdate(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/pay/merchantConfig/batchUpdate',
    method: 'post',
    data: jsonData
  })
}
