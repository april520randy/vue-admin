import {service} from 'utils'

// 新增
export function insert(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/system/userPermission/insert',
    method: 'post',
    data: jsonData
  })
}
