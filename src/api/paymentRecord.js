import {service} from 'utils'

export function getPaymentRecordList(jsonData){
  jsonData = jsonData || {};
  return service({
    url : '/api/pay/paymentRecord/findPaymentRecordPageList',
    method : 'post',
    data : jsonData
  });
}

export function cancelProposal(jsonData){
  jsonData = jsonData || {};
  return service({
    url : '/api/pay/paymentRecord/cancelProposal',
    method : 'post',
    data : jsonData
  });
}

export function assignmentChannel(jsonData){
  jsonData = jsonData || {};
  return service({
    url : '/api/pay/paymentRecord/assignmentChannel',
    method : 'post',
    data : jsonData
  });
}

export function orderNotice(jsonData){
  jsonData = jsonData || {};
  return service({
    url : '/api/pay/paymentRecord/orderNotice',
    method : 'post',
    data : jsonData
  });
}
