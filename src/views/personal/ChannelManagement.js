import {dictionaryItem, merchantConfig} from 'api'

export default {
  data() {
    return {
      permission: {
        query: 'personal.channelmanagement.query',
        reset: 'personal.channelmanagement.reset',
        edit: 'personal.channelmanagement.edit'
      },
      payWayList: [],
      useTypeList: [],
      paySwitchList: [],
      useableList: [],
      lockFlagList: [],
      allLevelList: [],
      creditGradeList: [],
      filters: {
        language: this.getI18nLocale(),
        productCode: this.getProductCode(),
        merchantCode: '',
        merchantName: '',
        payWay: '',
        useType: '',
        paySwitch: '',
        useable: '',
        lockFlag: '',
        sortType: '',
        sortName: '',
        pageNum: 1,
        pageSize: 10
      },
      dataList: [],
      total: 0,
      loading: false,
      formLabelWidth: '120px',
      editFormVisible: false,
      editForm: {
        id: null,
        merchantCode: '',
        merchantName: '',
        payPlatform: '',
        fee: null,
        pcFee: null,
        phoneFee: null,
        minPay: null,
        maxPay: null,
        registerTime: null,
        registerMonth: null,
        cutAmount: null,
        levels: [],
        creditGrade: [],
        fixedAmount: '',
        recommendAmount: '',
        payWay: '',
        useType: '',
        paySort: null,
        paySwitch: '',
        useable: '',
        lockFlag: '',
        showName: '',
        remark: ''
      },
      editLoading: false,
      formRules: {
        lockFlag: [
          {required: true, message: this.$t('merchantconfig.message.lockflagnull'), trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    getList() {
      this.loading = true;
      this.filters.language = this.getI18nLocale();
      this.filters.productCode = this.getProductCode();
      this.filters.useable = 'Y';
      merchantConfig.queryPaging(this.filters).then((response) => {
        this.loading = false;
        if (response.data['code'] === '10000') {
          this.dataList = response.data['data'].list;
          this.total = response.data['data'].total;
        } else {
          let messageKey = this.global.getMessageKey(response.data['code']);
          this.$message({message: this.$t(messageKey), type: 'error'});
        }
      })
    },
    handleQuery() {
      this.filters.language = this.getI18nLocale();
      this.filters.pageNum = 1;
      this.getList();
    },
    handleReset() {
      this.$refs["filters"].resetFields();
    },
    dateFormat(row, column) {
      let date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return this.moment(date).format('YYYY-MM-DD HH:mm:ss');
    },
    levelsFormat(row) {
      let productCode = row.productCode;
      let levels = row.levels;
      if ('' === levels || null === levels) {
        return '';
      }
      let values = [];
      let arr = levels.split(",");
      for (let i = 0, len1 = arr.length; i < len1; i++) {
        let a = arr[i];
        for (let j = 0, len2 = this.allLevelList.length; j < len2; j++) {
          let o = this.allLevelList[j];
          if ((a === o.itemCode) && (productCode === o.productCode)) {
            values.push(o.itemValue);
            break;
          }
        }
      }
      return values.join(",");
    },
    creditGradeFormat(row) {
      let creditGrade = row.creditGrade;
      if ('' === creditGrade || null === creditGrade) {
        return '';
      }
      let values = [];
      let arr = creditGrade.split(",");
      for (let i = 0, len1 = arr.length; i < len1; i++) {
        let a = arr[i];
        for (let j = 0, len2 = this.creditGradeList.length; j < len2; j++) {
          let o = this.creditGradeList[j];
          if (a === o.itemCode) {
            values.push(o.itemValue);
            break;
          }
        }
      }
      return values.join(",");
    },
    handleSizeChange(val) {
      this.filters.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.filters.pageNum = val;
      this.getList();
    },
    sortChange(column, prop, order) {
      if (column.order == 'ascending') {
        this.filters.sortType = 'asc';
      } else if (column.order == 'descending') {
        this.filters.sortType = 'desc';
      }
      this.filters.sortName = column.prop;
      this.getList();
    },
    handleEdit(index, row) {
      this.editForm.id = row.id;
      this.editForm.merchantCode = row.merchantCode;
      this.editForm.merchantName = row.merchantName;
      this.editForm.payPlatform = row.payPlatform;
      this.editForm.fee = row.fee;
      this.editForm.pcFee = row.pcFee;
      this.editForm.phoneFee = row.phoneFee;
      this.editForm.minPay = row.minPay;
      this.editForm.maxPay = row.maxPay;
      this.editForm.registerMonth = row.registerMonth;
      this.editForm.cutAmount = row.cutAmount;
      this.editForm.fixedAmount = row.fixedAmount;
      this.editForm.recommendAmount = row.recommendAmount;
      this.editForm.payWay = row.payWay;
      this.editForm.useType = row.useType;
      this.editForm.paySort = row.paySort;
      this.editForm.paySwitch = row.paySwitch;
      this.editForm.useable = row.useable;
      this.editForm.lockFlag = row.lockFlag;
      this.editForm.showName = row.showName;
      this.editForm.remark = row.remark;
      this.editForm.levels = [];
      if (row.levels) {
        this.editForm.levels = row.levels.split(",");
      }
      this.editForm.creditGrade = [];
      if (row.creditGrade) {
        this.editForm.creditGrade = row.creditGrade.split(",");
      }
      this.editForm.registerTime = null;
      if (row.registerTime) {
        this.editForm.registerTime = new Date(row.registerTime);
      }
      this.levelsList = [];
      for (let j = 0, len2 = this.allLevelList.length; j < len2; j++) {
        let o = this.allLevelList[j];
        if (row.productCode === o.productCode) {
          this.levelsList.push(o);
        }
      }
      this.editFormVisible = true;
    },
    editSubmit() {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          this.editForm.levels = this.editForm.levels.join(',');
          if (this.editForm.creditGrade && this.editForm.creditGrade.length > 0) {
            let arr = [];
            for (let i = 0, len1 = this.creditGradeList.length; i < len1; i++) {
              let oi = this.creditGradeList[i];
              for (let j = 0, len2 = this.editForm.creditGrade.length; j < len2; j++) {
                let jo = this.editForm.creditGrade[j];
                if ((oi.itemCode) === jo) {
                  arr.push(jo);
                }
              }
            }
            this.editForm.creditGrade = arr.join(',');
          }
          this.editLoading = true;
          merchantConfig.update(this.editForm).then((response) => {
            this.editLoading = false;
            if (response.data['code'] === '10000') {
              this.editFormVisible = false;
              this.$message({message: this.$t('common.message.editsuccess'), type: 'success'});
              this.handleQuery();
            } else {
              let messageKey = this.global.getMessageKey(response.data['code']);
              this.$message({message: this.$t(messageKey), type: 'error'});
            }
          })
        }
      })
    },
    getPayWayList() {
      let formData = {"dictCode": "MERCHANT_PAY_WAY", "language": this.getI18nLocale()};
      dictionaryItem.queryList(formData).then((response) => {
        this.payWayList = response.data['data'];
      })
    },
    getUseTypeList() {
      let formData = {"dictCode": "COMMON_CHANNEL_TYPE", "language": this.getI18nLocale()};
      dictionaryItem.queryList(formData).then((response) => {
        this.useTypeList = response.data['data'];
      })
    },
    getPaySwitchList() {
      let formData = {"dictCode": "COMMON_OPEN_CLOSE", "language": this.getI18nLocale()};
      dictionaryItem.queryList(formData).then((response) => {
        this.paySwitchList = response.data['data'];
      })
    },
    getUseableList() {
      let formData = {"dictCode": "COMMON_ENABLED_DISABLED", "language": this.getI18nLocale()};
      dictionaryItem.queryList(formData).then((response) => {
        this.useableList = response.data['data'];
      })
    },
    getLockFlagList() {
      let formData = {"dictCode": "COMMON_YES_NO", "language": this.getI18nLocale()};
      dictionaryItem.queryList(formData).then((response) => {
        this.lockFlagList = response.data['data'];
      })
    },
    getAllLevelList() {
      let formData = {"dictCode": "USER_LEVEL", "language": this.getI18nLocale()};
      dictionaryItem.queryList(formData).then((response) => {
        this.allLevelList = response.data['data'];
      })
    },
    getCreditGradeList() {
      let formData = {"dictCode": "MERCHANT_CREDIT_GRADE", "language": this.getI18nLocale()};
      dictionaryItem.queryList(formData).then((response) => {
        this.creditGradeList = response.data['data'];
      })
    }
  },
  created() {
    this.getPayWayList();
    this.getUseTypeList();
    this.getPaySwitchList();
    this.getUseableList();
    this.getLockFlagList();
    this.getAllLevelList();
    this.getCreditGradeList();
  }
}
