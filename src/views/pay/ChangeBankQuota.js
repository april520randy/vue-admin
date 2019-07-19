import {dictionaryItem,paymentAccount,bankQuotaRecord} from 'api'

export default {
  data(){
    return {
      formLabelWidth : "130px",
      submitForm : {
        accountName : "", //银行账户名
        localQuota: "", //银行当前本地额度
        changeType : "",  //增加的额度类型 是扣除还是增加
        accountType: "",  //账户类型
        bankType : "",  //银行类型
        quotaRecordType : "",  //额度记录类型
        amount : "",    //增减额度
        remark : ""     //备注

      },
      changeTypeList : [],  //增加还是扣除
      quotaRecordTypeList : [], //额度记录类型
      bankTypeList : [],      //银行类型
      accountTypeList : [],   //账户类型
      submitLoading : false,
      formRules : {
        accountName : [
          {required : true , message : this.$t('changeBankQuota.message.accountNameNull'), trigger: 'blur'}
        ],
        localQuota : [
          {required : true , message : this.$t('changeBankQuota.message.localQuotaNull'), trigger: 'blur'}
        ],
        changeType : [
          {required : true , message : this.$t('changeBankQuota.message.changeTypeNull'), trigger: 'blur'}
        ],
        quotaRecordType : [
          {required : true , message : this.$t('changeBankQuota.message.quotaRecordTypeNull'), trigger: 'blur'}
        ],
        accountType : [
          {required : true , message : this.$t('changeBankQuota.message.accountTypeNull'), trigger: 'blur'}
        ],
        bankType : [
          {required : true , message : this.$t('changeBankQuota.message.bankTypeNull'), trigger: 'blur'}
        ],
        amount : [
          {required : true , message : this.$t('changeBankQuota.message.amountNull'), trigger: 'blur'}
        ]
      }
    }
  },
  methods:{
    //重置
    handleReset(){
      this.submitForm = {
        accountName : "", //银行账户名
        localQuota: "", //银行当前本地额度
        changeType : "",  //增加的额度类型 是扣除还是增加
        accountType: "",  //账户类型
        bankType : "",  //银行类型
        quotaRecordType : "",  //额度记录类型
        amount : "",    //增减额度
        remark : ""     //备注
      }
    },
    /**
     * 根据填写的银行账户关联出信息
     */
    getPaymentAccount(){
      paymentAccount.getPaymentAccountListByAccountName(this.submitForm).then((response) => {
        if(response.data.code === "10000"){
          var data = response.data.data;
          if(data.length === 1){
            this.submitForm.localQuota = data[0].localQuota;
          }else{
            this.submitForm.localQuota = "0.00";
          }
        }else{
          let messageKey = this.global.getMessageKey(response.data['code']);
          this.$message({message: this.$t(messageKey), type: 'error'});
        }
      });
    },
    /**
     * 选择账户类型触发
     */
    changeAccountType(_val){
      //清空银行类型
      this.bankTypeList = [];
      this.submitForm.bankType = "";
      var language = this.getI18nLocale();
      let v = this;
      this.accountTypeList.forEach(function(item,i){
        if(item.itemCode === _val){
          let formData = {"parentDictCode": item.dictCode, "parentItemCode" : _val, "language": language};
          v.getBankTypeList(formData);
        }
      });
    },
    /**
     * 获取增减额度类型
     */
    getChangeTypeList(){
      if(this.changeTypeList.length <= 0){
        let formData = {"dictCode": "INCREASE_BANK_QUOTA_TYPE", "language": this.getI18nLocale()};
        dictionaryItem.queryList(formData).then((response) => {
          if(response.data.code === "10000"){
            this.changeTypeList = response.data['data'];
          }else{
            let messageKey = this.global.getMessageKey(response.data['code']);
            this.$message({message: this.$t(messageKey), type: 'error'});
          }
        })
      }
    },
    /**
     * 获取额度记录类型
     */
    getQuotaRecordTypeList(){
      if(this.quotaRecordTypeList.length <= 0){
        let formData = {"dictCode": "QUOTA_RECORD_TYPE", "language": this.getI18nLocale()};
        dictionaryItem.queryList(formData).then((response) => {
          if(response.data.code === "10000"){
            var data = response.data.data;
            for(var i = 0;i < data.length;i++){
              if(data[i].itemCode === "1" || data[i].itemCode === "2"){
                data.splice(i , 1);
                i --;
              }
            }
            this.quotaRecordTypeList = data;
          }else{
            let messageKey = this.global.getMessageKey(response.data['code']);
            this.$message({message: this.$t(messageKey), type: 'error'});
          }
        })
      }
    },
    /**
     * 获取账户类型集合
     */
    getAccountTypeList(){
      let v = this;
      let language = this.getI18nLocale();
      if(this.accountTypeList.length <= 0){
        let formData = {"dictCode": "ACCOUNT_TYPE", "language": language};
        dictionaryItem.queryList(formData).then((response) => {
          v.accountTypeList = response.data['data'];
        })
      }
    },
    /**
     * 获取银行类型集合
     */
    getBankTypeList(jsonData){
      dictionaryItem.queryDictionarySubItemList(jsonData).then((response) => {
        this.bankTypeList = response.data['data'];
      })
    },
    submit(){
      this.$refs['submitForm'].validate((valid) => {
        if(valid){
          this.submitLoading = true;
          bankQuotaRecord.manualInsertBankQuotaRecord(this.submitForm).then((response) => {
            this.submitLoading = false;
            if(response.data.code === "10000"){
              //弹出成功提示
              this.$message({message: this.$t('common.message.addsuccess'), type: 'success'});
              //清空
              this.handleReset();
            }else{
              this.$message({message: response.data['message'], type: 'error'});
            }
          });
        }else{
          return false;
        }
      });

    }
  },
  created(){
    this.getChangeTypeList();
    this.getQuotaRecordTypeList();
    this.getAccountTypeList();
  }
}
