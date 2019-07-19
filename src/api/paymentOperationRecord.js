import {service} from 'utils'

export function findPaymentOperationRecordListByPno(jsonData){
  jsonData = jsonData || {};
  return service({
    url : '/api/pay/paymentOperationRecord/findPaymentOperationRecordListByPno',
    method : 'post',
    data : jsonData
  });
}
