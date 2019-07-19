import {paymentRecord,product,dictionaryItem,paymentChannel,paymentAccount,paymentOperationRecord} from 'api'
export default {
  //存放变量
  data(){
    return {
      dataList : [], //存储Grid数据集合
      paymentRecordData : {}, //存储当前需要重新分配的订单数据
      paymentChannelList: [], //存储分配渠道弹出dialog中渠道列表数据
      paymentChannelSelectData : {},//存储渠道列表选中数据
      paymentTypeList : [], //存储付款类型数据
      paymentOperationRecordList : [],  //存储订单操作记录列表
      paymentOperationRecordVisible: false,
      paymentOperationRecordGridLoading: false,
      paymentOperationRecordTitle : "",
      pagePaymentAmountSum : 0,
      totalPageAmount : "0.00",  //当页总计
      totalPageFee : "0.00",    //当页手续费总计
      totalAmount : "0.00",     //总计
      totalFee : "0.00",        //手续费总计
      transferFlag : false,     //标识是否转成功进入
      paymentChannelFilters : {
        language: this.getI18nLocale(),
        pageNum: 1,
        pageSize: 10,
        productCode : '',
        paymentType:""
      },
      paymentChannelRadio: "",
      manualPaymentVisible: false,  //人工付款dialog是否显示标识
      manualPaymentBankList: [],  //人工付款银行列表
      manualPaymentForm: {  //人开付款form表单
        proOrderNo : "", //订单号
        loginName : "",   //会员账号
        customerName : "",  //客户姓名
        customerCardNumber: "", //客户银行卡号
        customerBank : "",  //客户银行名称
        paymentAmount: 0, //付款金额
        bankPrimaryId: "",  //付款卡ID
        paymentFee: 0,  //付款手续费
        remark: "",  //付款备注
        productCode : ""
      },
      formLabelWidth: '120px',
      productList : [], //产品集合
      paymentResultList : [], //付款结果集合
      noticeStatusList : [],  //通知状态集合
      gridLoading : false, //用于判断是否展示Grid的加载中提示
      paymentChanneGridLoading : false, //用于判断是否展示渠道Grid的加载中提示
      total: 0,
      paymentChannelTotal : 0,
      filters : { //存储查询参数
        language: this.getI18nLocale(),
        pageNum: 1,
        pageSize: 10,
        productCode : '',
        proOrderNo : '',
        loginName : '',
        paymentResult : '',
        paymentType : "",
        noticeStatus : '',
        createStartTime : "",
        createEndTime : '',
        paymentStartTime : '',
        paymentEndTime : ''
      },
      paymentResultVisible: false, //付款结果列按钮使用，是否展示数据详情dialog
      paymentResultDialogTitle : "",  //弹窗title
      cancelVisible : false,   //取消弹窗标识
      cancelForm: {
        cancelRemark : "" //用来存储取消原因
      },
      cancelData : {},     //用来存储当前取消数据对象
      cancelRule : {
        cancelRemark : [
          {required : true , message : this.$t('paymentrecord.message.cancelremarknull'), trigger: 'blur'}
        ]
      },
      //人工付款form表单校验
      manualPaymentRule: {
        //付款卡
        bankPrimaryId : [
          {required : true , message : this.$t('paymentrecord.message.bankprimarynonull'), trigger: 'blur'}
        ],
        //付款手续费
        paymentFee : [
          {required : true , message : this.$t('paymentrecord.message.paymentfeenull'), trigger: 'blur'},
          {pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message : this.$t('paymentrecord.message.paymentfeeerror'), trigger: 'blur'}
        ],
        //备注
        remark : [
          {required : true , message : this.$t('paymentrecord.message.remark'), trigger: 'blur'}
        ]
      }
    }
  },
  //存放方法
  methods:{
    /**
     * 取付款记录数据列表
     */
    getPaymentRecordList(){
      this.gridLoading = true;
      paymentRecord.getPaymentRecordList(this.filters).then((response) => {
        this.gridLoading = false;
        if(response.data["code"] === "10000"){
          this.dataList = response.data['data'].list;
          this.total = response.data['data'].total;
          this.totalPageAmount = response.data.totalPageAmount;
          this.totalPageFee = response.data.totalPageFee;
          this.totalAmount = response.data.totalAmount;
          this.totalFee = response.data.totalFee;
        }else{
          let messageKey = this.global.getMessageKey(response.data['code']);
          this.$message({message: this.$t(messageKey), type: 'error'});
        }
      });
    },
    /**
     * 查询渠道信息，分配渠道按钮触发
     */
    getPaymentChannelListByRecord(){
      this.paymentChanneGridLoading = true;
      paymentChannel.getPaymentChannelListByRecord(this.paymentChannelFilters).then((response) => {
        this.paymentChanneGridLoading = false;
        if(response.data["code"] === "10000"){
          this.paymentChannelList = response.data['data'].list;
          this.paymentChannelTotal = response.data['data'].total;
        }else{
          let messageKey = this.global.getMessageKey(response.data['code']);
          this.$message({message: this.$t(messageKey), type: 'error'});
        }
      });
    },
    /**
     * 搜索通用方法
     */
    handleQuery : function(){
      this.filters.language = this.getI18nLocale();
      this.filters.pageNum = 1;
      this.getPaymentRecordList();
    },
    /**
     * 重置方法
     */
    handleReset : function(){
      this.filters = { //存储查询参数
        language: this.getI18nLocale(),
        pageNum: 1,
        pageSize: 10,
        productCode : '',
        proOrderNo : '',
        loginName : '',
        paymentResult : '',
        noticeStatus : '',
        createStartTime : '',
        createEndTime : '',
        paymentStartTime : '',
        paymentEndTime : ''
      }
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
      if (val == undefined) {
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
     * 初始化时间
     */
    initDate(){
      var date = new Date();
      this.filters.createStartTime = this.moment(date).format('YYYY-MM-DD 00:00:00');
      this.filters.createEndTime = this.moment(date).format('YYYY-MM-DD 23:59:59');
      this.filters.createStartTime = this.moment(date).format('YYYY-MM-DD 00:00:00');
      this.filters.createEndTime = this.moment(date).format('YYYY-MM-DD 23:59:59');
    },
    /**
     * 点击订单提案号触发，查询当前订单操作记录
     * @param row
     */
    orderInformation(row){
      this.paymentOperationRecordTitle = row.proOrderNo + "  " +"操作列表";
      var param = {
        proOrderNo : row.proOrderNo,
        language: this.getI18nLocale()
      }
      this.paymentOperationRecordVisible = true;
      paymentOperationRecord.findPaymentOperationRecordListByPno(param).then((response) => {
        if(response.data["code"] === "10000"){
          this.paymentOperationRecordList = response.data['data'];
        }else{
          let messageKey = this.global.getMessageKey(response.data['code']);
          this.$message({message: this.$t(messageKey), type: 'error'});
        }
      });
    },
    /**
     * 分配渠道按钮，重新分配付款渠道
     * @param index 下标
     * @param data  当前行数据
     */
    showPaymentResultDialog(index,data){
      //给弹窗title赋值
      this.paymentResultDialogTitle = data.proOrderNo + "-" + this.$t('paymentrecord.label.assignmentchannel');
      //展示弹窗
      this.paymentResultVisible = true;
      //初始化查询数据，只能选择当前订单对应产品的渠道列表
      this.paymentChannelFilters.productCode = data.productCode;
      //初始化单选数据
      this.paymentChannelRadio = "";
      //初始化选中渠道数据
      this.paymentChannelSelectData = {};
      //将触发的当前数据存储到对象中,用于分配渠道使用
      this.paymentRecordData = data;
      //初始化渠道列表数据
      this.getPaymentChannelListByRecord();
    },
    /**
     * 分配渠道dialog中单选按钮触发
     * @param data
     * @param column
     * @param event
     */
    paymentChannelClickRow(data , column , event){
      this.paymentChannelRadio = data.id;
      this.paymentChannelSelectData = data;
    },
    /**
     * 分配渠道dialog中确定按钮触发，调用后台分配渠道入口
     */
    assignmentChannel(){
      if(this.paymentChannelSelectData.id != null){
        //如果当前渠道和选择渠道是同一渠道，则直接return并告知用户
        if(this.paymentRecordData.paymentType === this.paymentChannelSelectData.paymentType){
          this.$message({message: this.$t('paymentrecord.message.paymentchannelselectdatanotsame'), type: 'warning'});
          return ;
        }
        //将选中渠道的渠道类型更新到订单中提交给后台
        let paymenteData = Object.assign({} , this.paymentRecordData);
        paymenteData.paymentType = this.paymentChannelSelectData.paymentType;
        //人工付款渠道，展示人工付款dialog
        if(this.paymentChannelSelectData.paymentType === "3"){
          //隐藏分配渠道dialog
          this.paymentResultVisible = false;
          //调用转成功方法将值塞入默认对象中
          this.transferSuccess(paymenteData);

        }else{  //其他付款渠道
          //调用分配渠道方法
          paymentRecord.assignmentChannel(paymenteData).then((response) => {
            this.paymentResultVisible = false;
            if (response.data['code'] === '10000') {
              this.$message({message: this.$t('common.message.operatesuccess'), type: 'success'});
            } else {
              this.$message({message: response.data['message'], type: 'error'});
            }
            this.handleQuery();
          });
        }
      }else{
        this.$message({message: this.$t('paymentrecord.message.paymentchannelselectdatanull'), type: 'warning'});
      }
    },
    /**
     * 转成功按钮
     * @param data
     */
    transferSuccess : function(data){
      this.getPaymentAccountList(data);
      //展示人工付款dialog
      this.manualPaymentVisible = true;
      //给默认值
      this.manualPaymentForm.customerName = data.customerName;
      this.manualPaymentForm.customerCardNumber = data.customerCardNumber;
      this.manualPaymentForm.customerBank = data.customerBank;
      this.manualPaymentForm.paymentAmount = data.paymentAmount;
      this.manualPaymentForm.loginName = data.loginName;
      this.manualPaymentForm.proOrderNo = data.proOrderNo;
      this.manualPaymentForm.paymentType = data.paymentType;
      this.manualPaymentForm.bankPrimaryId = "";
      this.manualPaymentForm.paymentFee = 0;
      this.manualPaymentForm.remark = "";
      this.manualPaymentForm.transfer = true;
      this.transferFlag = true;
    },
    /**
     * 人工付款确定按钮触发
     */
    manualPaymentSubmit : function(){
      this.$refs['manualPaymentForm'].validate((valid) => {
        if(valid){
          this.manualPaymentForm.productCode = this.paymentChannelSelectData.productCode;
          //调用分配渠道方法
          paymentRecord.assignmentChannel(this.manualPaymentForm).then((response) => {
            this.manualPaymentVisible = false;
            if (response.data['code'] === '10000') {
              this.$message({message: this.$t('common.message.operatesuccess'), type: 'success'});
            } else {
              this.$message({message: response.data['message'], type: 'error'});
            }
            this.handleQuery();
          });
        }else{
          return false;
        }
      });
    },
    /**
     * 取消按钮触发，展示取消原因输入框，并将当前数据放入取消对象中
     * @param index
     * @param row
     */
    showCancelDialog(index,row){
      this.cancelForm.cancelRemark = "";
      this.cancelVisible = true;
      this.cancelData = row;
      //初始化校验器
      this.$nextTick(() => {
        this.$refs['cancelForm'] ? this.$refs['cancelForm'].clearValidate() : "";
      });
    },
    /**
     * 取消按钮触发
     * @param index
     * @param row
     */
    cancelProposal(){
      this.$refs["cancelForm"].validate((valid) => {
        if(valid){
          this.$confirm(this.$t('common.message.cancelprompt') ,this.$t('common.message.prompt'), {
            confirmButtonText: this.$t('common.button.confirm'),
            cancelButtonText: this.$t('common.button.cancel'),
            type: 'warning'
          }).then(() => {
            let data = Object.assign({},this.cancelData);
            data.cancelRemark = this.cancelForm.cancelRemark;
            paymentRecord.cancelProposal(data).then((response) => {
              this.cancelVisible = false;
              if (response.data['code'] === '10000') {
                this.$message({message: this.$t('common.message.operatesuccess'), type: 'success'});
              } else {
                this.$message({message: response.data['message'], type: 'error'});
              }
              this.handleQuery();
              //初始化校验器
              this.$nextTick(() => {
                this.$refs['cancelForm'] ? this.$refs['cancelForm'].clearValidate() : "";
              });
            });
          }).catch(() => {
            // 取消
          });
        }else{
          return false;
        }
      });
    },
    /**
     * 订单手动通知按钮
     * @param index
     * @param row
     */
    orderNotice(index,row){
      this.$confirm(this.$t('paymentrecord.label.noticeLabel') ,this.$t('common.message.prompt'), {
        confirmButtonText: this.$t('common.button.confirm'),
        cancelButtonText: this.$t('common.button.cancel'),
        type: 'warning'
      }).then(() => {
        paymentRecord.orderNotice(row).then((response) => {
          if (response.data['code'] === '10000') {
            this.$message({message: this.$t('common.message.operatesuccess'), type: 'success'});
          } else {
            this.$message({message: response.data['message'], type: 'error'});
          }
          this.handleQuery();
        });
      }).catch(() => {
        // 取消
      });
    },
    handleSizeChange(val){
      this.filters.pageSize = val;
      this.getPaymentRecordList();
    },
    handleCurrentChange(val){
      this.filters.pageNum = val;
      this.getPaymentRecordList();
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
    },
    //获取付款结果集合
    getPaymentResultList() {
      if(this.paymentResultList.length <= 0){
        let formData = {"dictCode": "PAYMENT_RESULT", "language": this.getI18nLocale()};
        dictionaryItem.queryList(formData).then((response) => {
          if (response.data['code'] === '10000') {
            this.paymentResultList = response.data['data'];
          }
        })
      }
    },
    //获取通知状态集合
    getNoticeStatusList() {
      if(this.noticeStatusList.length <= 0){
        let formData = {"dictCode": "PAYMENT_NOTICE_STATUS", "language": this.getI18nLocale()};
        dictionaryItem.queryList(formData).then((response) => {
          if (response.data['code'] === '10000') {
            this.noticeStatusList = response.data['data'];
          }
        })
      }
    },
    //获取付款账号
    getPaymentAccountList(data){
      let param = {
        useable : "Y",
        paymentType :  data.paymentType,
        productCode : data.productCode,
        language : this.getI18nLocale()
      };
      //查询付款银行列表
      paymentAccount.getPaymentAccountList(param).then((response) => {
        if (response.data['code'] === '10000') {
          this.manualPaymentBankList = response.data['data'];
        }
      });
    },
    //获取付款类型
    getPaymentTypeList(){
      if(this.paymentTypeList.length <= 0){
        let formData = {"dictCode": "PAYMENT_TYPE", "language": this.getI18nLocale()};
        dictionaryItem.queryList(formData).then((response) => {
          if (response.data['code'] === '10000') {
            this.paymentTypeList = response.data['data'];
          }
        })
      }
    },


  },
  //钩子函数，页面加载立即调用
  created(){
    this.initDate();
    this.getPaymentRecordList();
    this.getProductList();
    this.getPaymentResultList();
    this.getNoticeStatusList();
    this.getPaymentTypeList();
  }
}
