import {service} from 'utils'

// 查询(带分页)
export function queryPaging(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/system/dictionaryItem/pageList',
    method: 'post',
    data: jsonData
  })
}

// 查询(不带分页)
export function queryList(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/system/dictionaryItem/list',
    method: 'post',
    data: jsonData
  })
}

export function queryDictionarySubItemList(jsonData){
  jsonData = jsonData || {};
  return service({
    url: '/api/system/dictionarySubItem/findDictionarySubItemList',
    method: 'post',
    data: jsonData
  })
}
