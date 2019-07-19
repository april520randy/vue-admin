import {service} from 'utils'

// 登录
export function login(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/system/operator/login',
    method: 'post',
    data: jsonData
  })
}

// 登出
export function logout(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/system/operator/logout',
    method: 'post',
    data: jsonData
  })
}
