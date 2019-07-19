export default {
  bankTransferProposal : {
    label : {
      pno : "提案号",
      proposer : "提案人",
      status : "提案状态",
      type : "提案类型",
      loginname : "银行账户",
      transferDirection : "转账方向",
      transferOut : "转出",
      transferIn : "转入",
      transferInName : "收款人姓名",
      transferInBank : "收款人银行",
      amount : "额度",
      createTime : "加入时间",
      fee : "手续费",
      remark : "备注",
      accountNature : "账户性质",
      transferOutAccount : "转出账户",
      reviewDialogTitle:"是否执行审核操作，请输入审核备注:",
      executeDialogTitle:"是否进行执行操作，请输入执行备注:",
      cancelDialogTitle:"是否取消提案，请输入取消备注:"
    },
    message : {
      transferOutAccountNatureIdNull : "账户性质不能为空",
      transferOutAccountIdNull : "装出账户不能为空",
      feeNull : "手续费不能是空值",
      feeError : "请输入正确的手续费格式",
      executeError : "执行转出账户与提交订单不匹配",
      executeError2 : "手续费不能大于金额"
    }
  }
}
