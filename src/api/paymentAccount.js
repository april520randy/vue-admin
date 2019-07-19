import {service} from 'utils'

/**
 * 获取付款账号分页列表
 * @param jsonData
 * @returns {*}
 */
export function getPaymentAccountPageList(jsonData){
  jsonData = jsonData || {};
  return service({
    url: '/api/pay/paymentAccount/findPaymentAccountPageList',
    method: 'post',
    data: jsonData
  })
}

/**
 * 获取付款账号列表
 * @returns {*}
 */
export function getPaymentAccountList(jsonData){
  jsonData = jsonData || {};
  return service({
    url: '/api/pay/paymentAccount/findPaymentAccountList',
    method: 'post',
    data: jsonData
  })
}

/**
 * 获取付款账号列表
 * @returns {*}
 */
export function getPaymentAccountListByAccountName(jsonData){
  jsonData = jsonData || {};
  return service({
    url: '/api/pay/paymentAccount/findPaymentAccountListByAccountName',
    method: 'post',
    data: jsonData
  })
}

/**
 * 新增付款账号
 * @param jsonData
 * @returns {*}
 */
export function insertOrUpdatePaymentAccount(jsonData){
  jsonData = jsonData || {};
  //因付款等级存储为字符串，页面存储为数组，需要将数组转换为字符串,号隔开
  if(jsonData.paymentLevel != null && jsonData.paymentLevel.length > 0){
    let level = "";
    jsonData.paymentLevel.forEach(function(item , i){
      level = level + item + ",";
    })
    jsonData.paymentLevel =level.substring(0 , level.length - 1);
  }
  return service({
    url: '/api/pay/paymentAccount/insertOrUpdatePaymentAccount',
    method: 'post',
    data: jsonData
  });
}

/**
 * 批量删除付款账号
 * @param jsonData
 * @returns {*}
 */
export function batchDeletePaymentAccount(jsonData){
  jsonData = jsonData || {};
  return service({
    url: '/api/pay/paymentAccount/batchDeletePaymentAccount',
    method: 'post',
    data: jsonData
  });
}
