import {paymentAccount,dictionaryItem,product} from 'api'

export default {
  data(){
    return{
      useableList : [],  //启用状态下拉默认值
      dataList : [],  //存储Grid数据集合
      paymentLevelList: [], //存储付款等级数据集合
      paymentTypeList: [],  //存储付款类型数据集合
      transferTypeList: [], //存储转账类型数据集合
      bankInfoList: [],     //存储银行信息数据集合
      productList: [],      //存储产品数据集合
      loading: false,       //标识查询数据时是否展示加载中
      total: 0,
      formLabelWidth: '120px',
      selectionGridList: [],  //存储Grid选中数据
      accountTypeList : [],
      bankTypeList : [],
      //存储搜索条件
      filters: {
        productCode : "",
        language: this.getI18nLocale(),
        bankName: '', //银行卡名称
        bankCard: '', //银行卡卡号
        accountName: '', //用户名,
        useable: '',  //是否可用
        pageNum: 1,
        pageSize: 10
      },
      addFormVisible: false, //是否弹出新增窗口
      submitLoading: false,  //标识提交数据时是否展示加载中
      //存储提交form表单
      addForm: {
        bankCode: '',
        bankName: '',
        bankPrimaryNo: '',
        bankSecondaryNo: '',
        paymentType: '',
        accountFlowRestriction : 0.00,
        minPaymentAmount : 0.00,
        maxPaymentAmount : 0.00,
        useable: 'Y',
        paymentLevel: [],
        remark: "",
        accountName: '',
        accountType : '',
        bankType : "",
        productCode: ''
      },
      //自定义校验器
      formRules : {
        accountName : [
          {required : true , message : this.$t('paymentaccount.message.accountnamenull'), trigger: 'blur'}
        ],
        bankCode : [
          {required : true , message : this.$t('paymentaccount.message.bankinfonull'), trigger: 'blur'}
        ],
        bankName : [
          {required : true , message : this.$t('paymentaccount.message.banknamenull'), trigger: 'blur'}
        ],
        bankPrimaryNo : [
          {required : true , message : this.$t('paymentaccount.message.bankprimarynonull'), trigger: 'blur'},
          { pattern: /(^[0-9]*$)/ , message : this.$t('paymentaccount.message.banknoerror'), trigger: 'blur'}
        ],
        bankSecondaryNo : [
          {message : this.$t('paymentaccount.message.banksecondarynonull'), trigger: 'blur'},
          {pattern: /(^[0-9]*$)/ , message : this.$t('paymentaccount.message.banknoerror'), trigger: 'blur'}
        ],
        paymentType : [
          {required : true , message : this.$t('paymentaccount.message.paymenttypenull'), trigger: 'blur'}
        ],
        accountType : [
          {required : true , message : this.$t('paymentaccount.message.accounttypenull'), trigger: 'blur'}
        ],
        bankType : [
          {required : true , message : this.$t('paymentaccount.message.banktypenull'), trigger: 'blur'}
        ],
        useable : [
          {required : true , message : this.$t('paymentaccount.message.useablenull'), trigger: 'blur'}
        ],
        productCode : [
          {required : true , message : this.$t('paymentaccount.message.productcodenull'), trigger: 'blur'}
        ]
      }
    }
  },
  methods:{
    //公共获取数据方法
    getPaymentAccountPageList(){
      this.loading = true;
      paymentAccount.getPaymentAccountPageList(this.filters).then((response) => {
        this.loading = false;
        if(response.data['code']==="10000"){
          this.dataList  = response.data['data'].list;
          this.total = response.data['data'].total;
        }else{
          let messageKey = this.global.getMessageKey(response.data['code']);
          this.$message({message: this.$t(messageKey), type: 'error'});
        }
      });
    },
    //搜索方法
    handleQuery(){
      this.filters.language = this.getI18nLocale();
      this.filters.pageNum = 1;
      this.getPaymentAccountPageList();
    },
    //重置方法
    handleReset(){
      this.filters.bankName = "";
      this.filters.bankCard = "";
      this.filters.accountName = "";
      this.filters.useable = "";
      this.filters.productCode = "";
    },
    /**
     * 星号格式化银行卡 只显示头四位和结尾四位
     * @param row
     * @param columns
     * @param val
     * @param index
     * @returns {*}
     */
    formatBankCar(row , columns , val , index){
      if(val == null){
        return "";
      }
      //获取需要转换星号的尾数 前4和后4位显示
      var carLength = val.length - 8;
      var first = val.substr(0 , 4);
      var last = val.substr(val.length - 4, val.length);
      for(var i = 0 ;i<carLength; i ++){
        first += "*";
      }
      return first + last;
    },
    //展示弹窗，根据val的值判断是新增还是更新
    showDialog(val, index, row){
      //初始化付款等级
      this.getPaymentLevelList();
      //初始化付款类型
      this.getPaymentTypeList();
      //初始化转账类型
      this.getTransferTypeList();
      //初始化银行信息
      this.getBankInfoList();
      //初始化账户类型信息
      this.getAccountTypeList(true);
      //新增按钮
      if(val === "add"){
        //清空上一次编辑的值
        this.addForm= {
          bankCode: '',
          bankName: '',
          bankPrimaryNo: '',
          bankSecondaryNo: '',
          paymentType: '',
          accountFlowRestriction : 0.00,
          minPaymentAmount : 0.00,
          maxPaymentAmount : 0.00,
          useable: 'Y',
          paymentLevel: [],
          remark: "",
          accountName: '',
          accountType : '',
          bankType : "",
          productCode: ''
        };
        this.bankTypeList = [];
        //初始化校验器
        this.$nextTick(() => {
          this.$refs['addForm'].clearValidate();
        });
      }else if(val === "update"){//编辑按钮
        this.addForm = Object.assign({} , row);
      }
      this.addFormVisible = true;
    },
    //选择账户类型触发
    changeAccountType(_val){
      //清空银行类型
      this.bankTypeList = [];
      this.addForm.bankType = "";
      var language = this.getI18nLocale();
      let v = this;
      this.accountTypeList.forEach(function(item,i){
        if(item.itemCode === _val){
          let formData = {"parentDictCode": item.dictCode, "parentItemCode" : _val, "language": language};
          v.getBankTypeList(formData);
        }
      });
    },
    //新增付款账户
    insertOrUpdatePaymentAccount(){
      this.$refs['addForm'].validate((valid) => {
        //校验是否都通过
        if(valid){
          this.submitLoading = true;
          paymentAccount.insertOrUpdatePaymentAccount(this.addForm).then((response) => {
            this.submitLoading = false;
            if (response.data['code'] === '10000') {
              //隐藏新增dialog
              this.addFormVisible = false;
              //弹出成功提示
              this.$message({message: this.$t('common.message.addsuccess'), type: 'success'});
              //刷新页面
              this.handleQuery();
            } else {
              this.$message({message: response.data['message'], type: 'error'});
            }
          });
        }else{
          return false;
        }
      });
    },
    //批量删除
    handleBatchDelete(){
      this.$confirm(this.$t('common.message.deleteprompt'), this.$t('common.message.prompt'), {
        confirmButtonText: this.$t('common.button.confirm'),
        cancelButtonText: this.$t('common.button.cancel'),
        type: 'warning'
      }).then(() => {
        //是否选中数据
        if(this.selectionGridList.length >= 0){
          let data = JSON.stringify(this.selectionGridList);
          paymentAccount.batchDeletePaymentAccount({'deleteList' : data}).then((response) => {
            if (response.data['code'] === '10000') {
              this.$message({message: this.$t('common.message.deletesuccess'), type: 'success'});
              this.handleQuery();
            } else {
              let messageKey = this.global.getMessageKey(response.data['code']);
              this.$message({message: this.$t(messageKey), type: 'error'});
            }
          });
        }else{
          this.$message({type: 'warning', message: this.$t('common.message.selectdata')});
        }
      });
    },
    //选择Grid行触发
    handleSelectionChange(val){
      this.selectionGridList = val;
    },
    //更改账户是否禁用和启用
    handleStatus(index, row, useable){
      let data = Object.assign({} , row);
      data.useable = useable
      paymentAccount.insertOrUpdatePaymentAccount(data).then((response) => {
        if (response.data['code'] === '10000') {
          //隐藏新增dialog
          this.addFormVisible = false;
          //弹出成功提示
          this.$message({message: this.$t('common.message.addsuccess'), type: 'success'});
          //刷新页面
          this.handleQuery();
        } else {
          this.$message({message: response.data['message'], type: 'error'});
        }
      });
    },
    //格式化时间
    dateFormat(row, column) {
      let date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return this.moment(date).format('YYYY-MM-DD HH:mm:ss');
    },
    //更改当前页展示数据量触发
    handleSizeChange(val){
      this.filters.pageSize = val;
      this.getPaymentAccountPageList();
    },
    //更改当前页触发
    handleCurrentChange(val){
      this.filters.pageNum = val;
      this.getPaymentAccountPageList();
    },
    //选中银行后触发
    changeBankInfo(val){
      let bankName = "";
      //获取银行编码对应的银行名称
      this.bankInfoList.forEach(function(item , i){
        if(item.itemCode === val){
          bankName = item.itemValue;
          return;
        }
      })
      this.addForm.bankName = bankName;
    },
    //获取是否开启选项数据
    getUseableList(){
      let formData = {"dictCode": "COMMON_ENABLED_DISABLED", "language": this.getI18nLocale()};
      dictionaryItem.queryList(formData).then((response) => {
        if (response.data['code'] === '10000') {
          this.useableList = response.data['data'];
        }else{
          let messageKey = this.global.getMessageKey(response.data['code']);
          this.$message({message: this.$t(messageKey), type: 'error'});
        }
      })
    },
    //获取支付等级数据
    getPaymentLevelList(){
      if(this.paymentLevelList.length <= 0){
        let formData = {"dictCode": "PAYMENT_LEVEL", "language": this.getI18nLocale()};
        dictionaryItem.queryList(formData).then((response) => {
          if (response.data['code'] === '10000') {
            this.paymentLevelList = response.data['data'];
          }else{
            let messageKey = this.global.getMessageKey(response.data['code']);
            this.$message({message: this.$t(messageKey), type: 'error'});
          }
        })
      }
    },
    //获取付款类型数据
    getPaymentTypeList(){
      if(this.paymentTypeList.length <= 0){
        let formData = {"dictCode": "PAYMENT_TYPE", "language": this.getI18nLocale()};
        dictionaryItem.queryList(formData).then((response) => {
          if (response.data['code'] === '10000') {
            this.paymentTypeList = response.data['data'];
          }else{
            let messageKey = this.global.getMessageKey(response.data['code']);
            this.$message({message: this.$t(messageKey), type: 'error'});
          }
        })
      }
    },
    //获取转账类型数据
    getTransferTypeList(){
      if(this.transferTypeList.length <= 0){
        let formData = {"dictCode": "PAYMENT_TRANSFER_TYPE", "language": this.getI18nLocale()};
        dictionaryItem.queryList(formData).then((response) => {
          if (response.data['code'] === '10000') {
            this.transferTypeList = response.data['data'];
          }else{
            let messageKey = this.global.getMessageKey(response.data['code']);
            this.$message({message: this.$t(messageKey), type: 'error'});
          }
        })
      }
    },
    //获取银行数据
    getBankInfoList(){
      if(this.bankInfoList.length <= 0){
        let formData = {"dictCode": "COMMON_BANK", "language": this.getI18nLocale()};
        dictionaryItem.queryList(formData).then((response) => {
          if (response.data['code'] === '10000') {
            this.bankInfoList = response.data['data'];
          }else{
            let messageKey = this.global.getMessageKey(response.data['code']);
            this.$message({message: this.$t(messageKey), type: 'error'});
          }
        })
      }
    },
    //获取产品编码数据
    getProductList() {
      if(this.productList.length <= 0){
        product.queryList().then((response) => {
          if (response.data['code'] === '10000') {
            response.data['data'].forEach(function(item , i){
              if(item.code === 'al'){
                response.data['data'].splice(i,1);
                return ;
              }
            })
            this.productList =  response.data['data'];
          }else{
            let messageKey = this.global.getMessageKey(response.data['code']);
            this.$message({message: this.$t(messageKey), type: 'error'});
          }
        })
      }
    },
    //获取账户类型集合
    getAccountTypeList(flag){
      let v = this;
      let language = this.getI18nLocale();
      if(this.accountTypeList.length <= 0){
        let formData = {"dictCode": "ACCOUNT_TYPE", "language": language};
        dictionaryItem.queryList(formData).then((response) => {
          if (response.data['code'] === '10000') {
            v.accountTypeList = response.data['data'];
            if(flag){
              v.accountTypeList.forEach(function(item,i){
                if(item.itemCode === v.addForm.accountType){
                  console.log(item.dictCode);
                  let formData = {"parentDictCode": item.dictCode, "parentItemCode" : v.addForm.accountType, "language": language};
                  v.getBankTypeList(formData);
                }
              });
            }
          }else{
            let messageKey = this.global.getMessageKey(response.data['code']);
            this.$message({message: this.$t(messageKey), type: 'error'});
          }
        })
      }
    },
    //获取银行类型集合
    getBankTypeList(jsonData){
      dictionaryItem.queryDictionarySubItemList(jsonData).then((response) => {
        if (response.data['code'] === '10000') {
          this.bankTypeList = response.data['data'];
        }else{
          let messageKey = this.global.getMessageKey(response.data['code']);
          this.$message({message: this.$t(messageKey), type: 'error'});
        }
      })
    }
  },
  //页面加载完成后调用
  created(){
    this.testVm = this;
    //初始化Grid数据
    this.getPaymentAccountPageList();
    //初始化启用状态下拉
    this.getUseableList();
    //初始化产品名称
    this.getProductList();
  }
}
