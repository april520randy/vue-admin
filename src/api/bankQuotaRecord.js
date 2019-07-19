import {service} from 'utils'

/**
 * 查询银行额度记录列表
 * @param jsonData
 * @returns {*}
 */
export function findBankQuotaRecordPageList(jsonData){
  jsonData = jsonData || {};
  return service({
    url: '/api/pay/bankQuotaRecord/findBankQuotaRecordPageList',
    method: 'post',
    data: jsonData
  })
}

/**
 * 手工增加银行额度记录
 * @param jsonData
 * @returns {*}
 */
export function manualInsertBankQuotaRecord(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/pay/bankQuotaRecord/manualInsertBankQuotaRecord',
    method: 'post',
    data: jsonData
  })
}
