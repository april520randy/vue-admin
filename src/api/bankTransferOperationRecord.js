import {service} from 'utils'


export function getBankTransferOperationRecordByPno(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/pay/bankTransferOperationRecord/findBankTransferOperationRecord',
    method: 'post',
    data: jsonData
  })
}
