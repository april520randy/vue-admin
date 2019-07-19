import {service} from 'utils'

// 查询(带分页)
export function queryPaging(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/pay/payChannelStatistics/pageList',
    method: 'post',
    data: jsonData
  })
}
