import {service} from "utils"

export function getPaymentChannelList(jsonData){
  jsonData = jsonData || {};
  return service({
    url: '/api/pay/paymentChannel/findPaymentChannelPageList',
    method: 'post',
    data: jsonData
  })
}


/**
 * 新增付款渠道
 * @param jsonData
 * @returns {*}
 */
export function insertOrUpdatePaymentChannel(jsonData){
  jsonData = jsonData || {};
  //因付款等级存储为字符串，页面存储为数组，需要将数组转换为字符串,号隔开
  if(jsonData.paymentLevel != null && jsonData.paymentLevel.length > 0){
    let level = "";
    Array.from(jsonData.paymentLevel).sort().forEach(function(item , i){
      level = level + item + ",";
    })
    jsonData.paymentLevel =level.substring(0 , level.length - 1);
  }
  return service({
    url: '/api/pay/paymentChannel/insertOrUpdatePaymentChannel',
    method: 'post',
    data: jsonData
  });
}

/**
 * 批量删除付款渠道
 * @param jsonData
 * @returns {*}
 */
export function batchDeletePaymentChannel(jsonData){
  jsonData = jsonData || {};
  return service({
    url: '/api/pay/paymentChannel/batchDeletePaymentChannel',
    method: 'post',
    data: jsonData
  });
}

/**
 * 给付款记录使用的付款渠道查询
 * @param jsonData
 */
export function getPaymentChannelListByRecord(jsonData){
  jsonData = jsonData || {};
  return service({
    url: '/api/pay/paymentChannel/getPaymentChannelListByRecord',
    method: 'post',
    data: jsonData
  });
}
