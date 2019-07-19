import {dictionaryItem,product,paymentChannel} from "api"

export  default {
  data(){
    return {
      formLabelWidth : "100px",
      gridLoading : false,  //查询Grid时是否展示查询中
      submitLoading : false,  //dialog提交按钮点击后是否出现保存中
      total : 0,
      //搜索条件
      filters : {
        language: this.getI18nLocale(),
        paymentType : "",
        productCode : "",
        useable : "",
        pageNum: 1,
        pageSize: 10
      },
      useableList : [],  //存储启用状态下拉数据
      productList : [],  //存储产品下拉数据
      paymentLevelList : [], //存储付款等级数据
      paymentTypeList : [], //存储付款类型数据
      addEditDialog : false, //是否展示dialog标识
      gridDataList : [],  //存储Grid数据
      selectionGridList : [], //存储Grid选择行数据
      //编辑新增dialog的from表单
      submitForm : {
        productCode : "",       //产品编号
        paymentType : "",       //付款类型
        minPaymentAmount : 0.00,//最小付款金额
        maxPaymentAmount : 0.00,//最大付款金额
        useable : "Y",          //是否开启
        paymentLevel : [],      //付款等级
        remark : ""             //备注
      },
      formRules : {
        productCode : [
          {required : true , message : this.$t('paymentaccount.message.productcodenull'), trigger: 'blur'}
        ],
        paymentType : [
          {required : true , message : this.$t('paymentaccount.message.accountnamenull'), trigger: 'blur'}
        ],
        paymentLevel : [
          {required : true , message : this.$t('paymentaccount.message.paymentlevelnull'), trigger: 'blur'}
        ],
        minPaymentAmount : [
          {required : true , pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message : this.$t('paymentaccount.message.amountvalid'), trigger: 'blur'}
        ],
        maxPaymentAmount : [
          {required : true , pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message : this.$t('paymentaccount.message.amountvalid'), trigger: 'blur'}
        ],
        useable : [
          {required : true , message : this.$t('paymentaccount.message.useablenull'), trigger: 'blur'}
        ]
      }
    }
  }

  ,
  methods:{
    //通用获取支付渠道列表方法
    getPaymentChannelList(){
      this.gridLoading = true;
      paymentChannel.getPaymentChannelList(this.filters).then((response) => {
        this.gridLoading = false;
        if(response.data['code']==="10000"){
          this.gridDataList  = response.data['data'].list;
          this.total = response.data['data'].total;
        }else{
          let messageKey = this.global.getMessageKey(response.data['code']);
          this.$message({message: this.$t(messageKey), type: 'error'});
        }
      });
    },
    //条件搜索按钮触发，根据条件查询相关信息
    handleQuery : function(){
      this.filters.language = this.getI18nLocale();
      this.filters.pageNum = 1;
      this.getPaymentChannelList();
    },
    //条件重置按钮触发，清空搜索条件
    handleReset : function(){
      this.filters.paymentType = "";
      this.filters.productCode = "";
      this.filters.useable = "";
    },
    //新增和编辑按钮触发，弹出编辑和新增dialog
    showDialog : function(_val, index , row){
      this.getPaymentLevelList();
      this.getPaymentTypeList();
      //新增按钮进入
      if(_val === "add"){
        //初始化表单
        this.submitForm = {
          productCode : "",       //产品编号
            paymentType : "",       //付款类型
            minPaymentAmount : 0.00,//最小付款金额
            maxPaymentAmount : 0.00,//最大付款金额
            useable : "Y",          //是否开启
            paymentLevel : [],      //付款等级
            remark : ""             //备注
        }
        //初始化校验器
        this.$nextTick(() => {
          this.$refs['submitForm'].clearValidate();
        });
      }else if(_val === "update"){  //编辑按钮进入
        let paymentLevel = new Array();
        //因返回数据为字符串，需要将字符串转换为数组
        row.paymentLevel.split(",").forEach(function(item, i){
          paymentLevel[i] = item;
        });
        this.submitForm = Object.assign({} , row);
        this.submitForm.paymentLevel = paymentLevel;
      }
      //显示dialog
      this.addEditDialog = true;
    },
    //勾选Grid选择复选框触发
    handleSelectionChange : function(_val){
      //将勾选的Grid行数据放入数组中存储
      this.selectionGridList = _val;
    },
    //Grid批量删除按钮触发
    handleBatchDelete : function(){
      this.$confirm(this.$t('common.message.deleteprompt'), this.$t('common.message.prompt'), {
        confirmButtonText: this.$t('common.button.confirm'),
        cancelButtonText: this.$t('common.button.cancel'),
        type: 'warning'
      }).then(() => {
        //是否选中数据
        if(this.selectionGridList.length >= 0){
          let data = JSON.stringify(this.selectionGridList);
          paymentChannel.batchDeletePaymentChannel({'deleteList' : data}).then((response) => {
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
      }).catch(() => {
        // 取消
      });
    },
    //格式化时间
    dateFormat : function(row,column,val,index){
      let date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return this.moment(date).format('YYYY-MM-DD HH:mm:ss');
    },
    //Grid行操作，启用和禁用触发
    handleStatus : function(index, row, useable){
      let updateDta = {
        id : row.id,
        useable : useable
      };
      this.insertOrUpdatePaymentChannel(updateDta);
    },
    //新增编辑dialog保存时触发
    handInsertOrUpdatePaymentChannel : function(){
      this.$refs["submitForm"].validate((valid) => {
        //校验通过
        if(valid){
          this.submitLoading = true;
          this.insertOrUpdatePaymentChannel(this.submitForm);
        }
      });
    },
    //通用更改和新增方法
    insertOrUpdatePaymentChannel : function(data){
      paymentChannel.insertOrUpdatePaymentChannel(data).then((response) => {
        this.submitLoading = false;
        if (response.data['code'] === '10000') {
          //隐藏新增dialog
          this.addEditDialog = false;
          //弹出成功提示
          this.$message({message: this.$t('common.message.addsuccess'), type: 'success'});
          //刷新页面
          this.handleQuery();
        } else {
          let messageKey = this.global.getMessageKey(response.data['code']);
          this.$message({message: this.$t(messageKey), type: 'error'});
        }
      });
    },
    //更改当页最大数据时触发
    handleSizeChange(_val){
      this.filters.pageSize = _val;
      this.getPaymentChannelList();
    },
    //更改页数触发
    handleCurrentChange(_val){
      this.filters.pageNum = _val;
      this.getPaymentChannelList();
    },
    //获取是否开启选项数据
    getUseableList(){
      let formData = {"dictCode": "COMMON_ENABLED_DISABLED", "language": this.getI18nLocale()};
      dictionaryItem.queryList(formData).then((response) => {
        this.useableList = response.data['data'];
      })
    },
    //获取支付等级数据
    getPaymentLevelList(){
      if(this.paymentLevelList.length <= 0){
        let formData = {"dictCode": "PAYMENT_LEVEL", "language": this.getI18nLocale()};
        dictionaryItem.queryList(formData).then((response) => {
          this.paymentLevelList = response.data['data'];
        })
      }
    },
    //获取付款类型数据
    getPaymentTypeList(){
      if(this.paymentTypeList.length <= 0){
        let formData = {"dictCode": "PAYMENT_TYPE", "language": this.getI18nLocale()};
        dictionaryItem.queryList(formData).then((response) => {
          this.paymentTypeList = response.data['data'];
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
          }
        })
      }
    }
  },
  created(){
    this.handleQuery();
    this.getUseableList();
    this.getProductList();
    this.getPaymentTypeList();
  }
}
