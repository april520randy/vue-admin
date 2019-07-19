import {bankQuotaRecord,dictionaryItem} from 'api'


export default {
  data(){
    return {
      //搜索条件
      filters : {
        language: this.getI18nLocale(),
        pageNum: 1,
        pageSize: 10,
        type : '',  //额度变更类型
        accountName: '',  //银行用户名
        bankName : '',  //银行卡名称
        bankCardNumber:'', //银行卡号
        quotaRecordType : '', //额度记录类型
        startTime : '', //开始时间
        endTime: ''  //结束时间

      },
      typeList : [], //存储额度变更类型下拉款数据
      gridLoading: false,
      dataList : [],
      quotaRecordTypeList : [],
      total: 0
    }
  },
  methods:{
    findBankQuotaRecordPageList(){
      this.gridLoading = true;
      bankQuotaRecord.findBankQuotaRecordPageList(this.filters).then((response) => {
        this.gridLoading = false;
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
     * 银行额度总计
     * @param param
     * @returns {Array}
     */
    getSummaries(param){
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总价';
          return;
        }
        if(index != 2 && index != 3){
          return ;
        }
        //获取该列当前页面所有值
        const values = data.map(item => Number(item[column.property]));
        //值不为空
        if (!values.every(value => isNaN(value))) {
          //获取列总计
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
        }
      });
      return sums;
    },
    handleQuery(){
      this.filters.language = this.getI18nLocale();
      this.filters.pageNum = 1;
      this.findBankQuotaRecordPageList();
    },
    handleReset(){
      //搜索条件
      this.filters= {
        language: this.getI18nLocale(),
        type : '',  //额度变更类型
        accountName: '',  //银行用户名
        startTime : '', //开始时间
        endTime: ''  //结束时间

      }
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
      this.findBankQuotaRecordPageList();
    },
    //更改当前页触发
    handleCurrentChange(val){
      this.filters.pageNum = val;
      this.findBankQuotaRecordPageList();
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
            this.quotaRecordTypeList = data;
          }else{
            let messageKey = this.global.getMessageKey(response.data['code']);
            this.$message({message: this.$t(messageKey), type: 'error'});
          }
        })
      }
    },
  },
  created(){
    this.findBankQuotaRecordPageList();
    this.getQuotaRecordTypeList();
  }
}
