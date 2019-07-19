import {service} from 'utils'

/**
 * 新增银行转账提案
 * @param jsonData
 * @returns {*}
 */
export function insertBankTransferProposal(jsonData){
  jsonData = jsonData || {};
  return service({
    url: '/api/pay/bankTransferProposal/insertBankTransferProposal',
    method: 'post',
    data: jsonData
  })
}

/**
 * 获取银行转账提案列表
 * @param jsonData
 * @returns {*}
 */
export function findBankTransferProposalPageList(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/pay/bankTransferProposal/findBankTransferProposalPageList',
    method: 'post',
    data: jsonData
  })
}

/**
 * 查询转账提案详情，用于执行按钮触发时执行
 * @param jsonData
 * @returns {*}
 */
export function getBankTransferProposalByExecute(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/pay/bankTransferProposal/getBankTransferProposalByExecute',
    method: 'post',
    data: jsonData
  })
}



/**
 * 审核银行转账提案
 * @param jsonData
 * @returns {*}
 */
export function reviewBankTransferProposal(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/pay/bankTransferProposal/reviewBankTransferProposal',
    method: 'post',
    data: jsonData
  })
}


/**
 * 执行银行转账提案
 * @param jsonData
 * @returns {*}
 */
export function executeBankTransferProposal(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/pay/bankTransferProposal/executeBankTransferProposal',
    method: 'post',
    data: jsonData
  })
}

/**
 * 取消银行转账提案
 * @param jsonData
 * @returns {*}
 */
export function cancelBankTransferProposal(jsonData) {
  jsonData = jsonData || {};
  return service({
    url: '/api/pay/bankTransferProposal/cancelBankTransferProposal',
    method: 'post',
    data: jsonData
  })
}
