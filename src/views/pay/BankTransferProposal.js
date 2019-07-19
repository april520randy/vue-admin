import {bankTransferProposal,dictionaryItem,bankTransferOperationRecord,paymentAccount} from "api"

export default {
  data(){
    return {
      filters: {
        pno: "",
        type: "",
        status : "",
        transferDirection: "",
        proposer: "",
        transferOut : "",
        transferIn : "",
        startTime: "",
        endTime: "",
        language: this.getI18nLocale(),
        pageNum: 1,
        pageSize: 10
      },
      total : 0,
      dataList: [],
      gridLoading: false,
      statusList : [],
      typeList : [],
      bankTransferOperationRecordDataList : [],
      bankTransferOperationRecordTitle : "",
      bankTransferOperationRecordVisible : false,
      bankTransferOperationRecordGridLoading : false,
      operatingVisible : false,
      operatingDialogLabel : "",
      operatingType : "" ,
      operationData : {},
      operatingForm : {
        remark : ""
      },
      executeDialogVisible : false,
      transferOutAccountNatureList : [],
      transferOutAccountList : [],
      transferProposalData : {},
      executeForm : {
        pno : "",
        typeLabel : "",
        transferIn : "",
        transferInBankName : "",
        amount : "",
        remark : "",
        transferOutAccountNatureId : "",
        transferOutAccountId : "",
        fee : "",
        executeRemark : "",
        transferOut : ""
      },
      submitExecuteLoading :false,
      executeFormLabelWidth : "100px",
      executeFormRules: {
        transferOutAccountNatureId : [
          {required : true , message : this.$t('bankTransferProposal.message.transferOutAccountNatureIdNull'), trigger: 'blur'}
        ],
        transferOutAccountId : [
          {required : true , message : this.$t('bankTransferProposal.message.transferOutAccountNatureIdNull'), trigger: 'blur'}
        ],
        fee : [
          {required : true , message : this.$t('bankTransferProposal.message.feeNull'), trigger: 'blur'},
          { pattern: /^(([1-9]\d*)|\d)(\.\d{1,2})?$/ , message : this.$t('bankTransferProposal.message.feeError'), trigger: 'blur'}
        ]
      }

    }
  },
  methods :{
    /**
     * 获取银行转账提案记录
     */
    getBankTransferProposalPageList(){
      bankTransferProposal.findBankTransferProposalPageList(this.filters).then((response) => {
        if(response.data['code']==="10000"){
          this.dataList  = response.data['data'].list;
          this.total = response.data['data'].total;
        }else{
          let messageKey = this.global.getMessageKey(response.data['code']);
          this.$message({message: this.$t(messageKey), type: 'error'});
        }
      });
    },
    /**
     * 搜索
     */
    handleQuery (){
      this.filters.language = this.getI18nLocale();
      this.filters.pageNum = 1;
      this.getBankTransferProposalPageList();
    },
    /**
     * 重置
     */
    handleReset(){
      this.filters.pno = '';
      this.filters.type = '';
      this.filters.transferDirection = '';
      this.filters.startTime = '';
      this.filters.endTime = '';
      this.filters.transferOut = "";
      this.filters.transferIn = "";
      this.filters.proposer = "";
    },
    /**
     * 格式化时间
     * @param row
     * @param column
     * @returns {*}
     */
    dateFormat(row, column) {
      let date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return this.moment(date).format('YYYY-MM-DD HH:mm:ss');
    },
    /**
     * 提案操作列表 点击提案号触发
     * @param data
     */
    getPnoOperationList(data){
      this.bankTransferOperationRecordTitle = data.pno + "  " +"操作列表";
      let sub = {
        pno : data.pno,
        language : this.getI18nLocale()
      }
      this.bankTransferOperationRecordGridLoading = true;
      this.bankTransferOperationRecordVisible = true;
      bankTransferOperationRecord.getBankTransferOperationRecordByPno(sub).then((response) => {
        this.bankTransferOperationRecordGridLoading = false;
        if (response.data['code'] === '10000') {
          this.bankTransferOperationRecordDataList = response.data['data'];
        }else{
          let messageKey = this.global.getMessageKey(response.data['code']);
          this.$message({message: this.$t(messageKey), type: 'error'});
        }
      });
    },
    /**
     * 操作按钮点击触发 弹出输入备注框
     * @param data
     * @param type
     */
    showOperatingRemark(data , type){
      this.operatingForm.remark = "";
      //审核
      if(type === "review"){
        this.operatingDialogLabel = this.$t('bankTransferProposal.label.reviewDialogTitle');
        this.operatingVisible = true;
      }else if(type === "execute"){ //执行
        this.operatingDialogLabel = this.$t('bankTransferProposal.label.executeDialogTitle');
        this.executeDialogVisible = true;
        //初始化账户性质集合
        this.transferOutAccountNatureList = [];
        //初始化账户列表
        this.transferOutAccountList = [];
        //查询账户性质列表
        this.getTransferOutAccountNatureList();
        //查询转账提案详情
        bankTransferProposal.getBankTransferProposalByExecute(data).then((response) => {
          if(response.data['code']==="10000"){
            this.executeForm = response.data['data'];
            this.transferProposalData = Object.assign({} , this.executeForm);
            //存在转出账户类型id
            if(this.executeForm.transferOutAccountNatureId != "" && this.executeForm.transferOutAccountNatureId != null){;
              let jsonData = {bankType : this.executeForm.transferOutAccountNatureId}
              paymentAccount.getPaymentAccountListByAccountName(jsonData).then((response1) => {
                if(response1.data['code']==="10000") {
                  this.transferOutAccountList = response1.data['data'];
                  this.executeForm.transferOutAccountId = this.executeForm.transferOutAccountId !="" ? parseInt(this.executeForm.transferOutAccountId) : null;
                }else{
                  let messageKey = this.global.getMessageKey(response1.data['code']);
                  this.$message({message: this.$t(messageKey), type: 'error'});
                }
              });
            }
          }else{
            let messageKey = this.global.getMessageKey(response.data['code']);
            this.$message({message: this.$t(messageKey), type: 'error'});
          }
        });
      }else if(type === "cancel"){  //取消
        this.operatingDialogLabel = this.$t('bankTransferProposal.label.cancelDialogTitle');
        this.operatingVisible = true;
      }
      //存入触发类型
      this.operatingType = type;
      //存储操作数据
      this.operationData = data;

    },
    /**
     * 更改账户类型/账户性质触发
     */
    changeTransferOutAccountNature (_val){
      let jsonData = {
        bankType : _val
      };
      this.executeForm.transferOutAccountId = "";
      this.transferOutAccountList = [];
      paymentAccount.getPaymentAccountListByAccountName(jsonData).then((response) => {
        if(response.data['code']==="10000") {
          this.transferOutAccountList = response.data['data'];
        }else{
          let messageKey = this.global.getMessageKey(response.data['code']);
          this.$message({message: this.$t(messageKey), type: 'error'});
        }
      });
    },
    /**
     * 更改银行账户
     * @param _val
     */
    changeTransferOutAccount(_val){
      let data = this.executeForm;
      this.transferOutAccountList.forEach(function(item, i){
        if(item.id === _val){
          data.transferOut = item.accountName;
        }
      })
    },
    /**
     * 执行弹出框提交按钮触发
     */
    submitExecute(){
      this.$refs['executeForm'].validate((valid) => {
        if(valid){
          //提案号最初的转出账户不为空
          if(this.transferProposalData.transferOutAccountId != null && this.transferProposalData.transferOutAccountId != ""){
            //提案号转出账户和执行选择的转出账户不一致
            if(this.transferProposalData.transferOutAccountId != this.executeForm.transferOutAccountId){
              this.$message.error(this.$t("bankTransferProposal.message.executeError"));
              return;
            }
          }
          if(this.executeForm.fee > this.executeForm.amount){
            this.$message.error(this.$t("bankTransferProposal.message.executeError2"));
            return;
          }
          this.submitExecuteLoading = true;
          bankTransferProposal.executeBankTransferProposal(this.executeForm).then((response) => {
            this.submitExecuteLoading = false;
            this.executeDialogVisible = false;
            if (response.data['code'] === '10000') {
              //弹出成功提示
              this.$message({message: this.$t('common.message.executesuccess'), type: 'success'});
              this.handleQuery();
            }else{
              this.$message({message: response.data['message'], type: 'error'});
            }
          });
        }
      });
    },
    /**
     * Grid操作备注框 确认按钮触发，审核、执行、取消
     */
    operatingProposal(){
      let data = Object.assign({} , this.operationData);
      data.remark = this.operatingForm.remark;
      //审核
      if(this.operatingType === "review"){
        bankTransferProposal.reviewBankTransferProposal(data).then((response) => {
          this.operatingVisible = false;
          if (response.data['code'] === '10000') {
            //弹出成功提示
            this.$message({message: this.$t('common.message.reviewsuccess'), type: 'success'});
            this.handleQuery();
          }else{
            this.$message({message: response.data['message'], type: 'error'});
          }
        });
      }else if(this.operatingType === "execute"){ //执行
        bankTransferProposal.executeBankTransferProposal(data).then((response) => {
          this.operatingVisible = false;
          if (response.data['code'] === '10000') {
            this.handleQuery();
          }else{
            this.$message({message: response.data['message'], type: 'error'});
          }
        });
      }else if(this.operatingType === "cancel"){  //取消
        bankTransferProposal.cancelBankTransferProposal(data).then((response) => {
          this.operatingVisible = false;
          if (response.data['code'] === '10000') {
            //弹出成功提示
            this.$message({message: this.$t('common.message.cancelsuccess'), type: 'success'});
            this.handleQuery();
          }else{
            this.$message({message: response.data['message'], type: 'error'});
          }
        });
      }
    },
    /**
     * 更改页数
     */
    handleSizeChange(val){
      this.filters.pageSize = val;
      this.getBankTransferProposalPageList();
    },
    /**
     * 翻页
     */
    handleCurrentChange(val){
      debugger;
      this.filters.pageNum = val;
      this.getBankTransferProposalPageList();
    },
    /**
     * 获取提案状态集合
     */
    getProposalStatusList(){
      let formData = {"dictCode": "PROPOSAL_STATUS", "language": this.getI18nLocale()};
      dictionaryItem.queryList(formData).then((response) => {
        if (response.data['code'] === '10000') {
          this.statusList = response.data['data'];
        }else{
          let messageKey = this.global.getMessageKey(response.data['code']);
          this.$message({message: this.$t(messageKey), type: 'error'});
        }
      });
    },
    /**
     * 获取账户性质/账户类型集合
     */
    getTransferOutAccountNatureList(){
      if(this.transferOutAccountNatureList.length <= 0){
        let formData = {"parentDictCode": "ACCOUNT_TYPE", "parentItemCode" : "1", "language": this.getI18nLocale()};
        dictionaryItem.queryDictionarySubItemList(formData).then((response) => {
          if (response.data['code'] === '10000') {
            this.transferOutAccountNatureList = response.data['data'];
          }else{
            let messageKey = this.global.getMessageKey(response.data['code']);
            this.$message({message: this.$t(messageKey), type: 'error'});
          }
        })
      }
    }
  },
  created(){
    this.getBankTransferProposalPageList();
    this.getProposalStatusList();
  }
}
