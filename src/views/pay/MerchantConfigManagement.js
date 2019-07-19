import ProductSelect from '@/components/ProductSelect'
import {dictionaryItem, merchantConfig} from 'api'

export default {
  components: {ProductSelect},
  data() {
    return {
      permission: {
        query: 'pay.merchantconfig.query',
        reset: 'pay.merchantconfig.reset',
        edit: 'pay.merchantconfig.edit',
        open: 'pay.merchantconfig.open',
        close: 'pay.merchantconfig.close',
        enabled: 'pay.merchantconfig.enabled',
        disabled: 'pay.merchantconfig.disabled'
      },
      payWayList: [],
      useTypeList: [],
      paySwitchList: [],
      useableList: [],
      lockFlagList: [],
      allLevelList: [],
      levelsList: [],
      creditGradeList: [],
      filters: {
        language: this.getI18nLocale(),
        merchantCode: '',
        merchantName: '',
        payWay: '',
        useType: '',
        paySwitch: '',
        useable: '',
        lockFlag: '',
        productCode: '',
        sortName: '',
        sortType: '',
        pageNum: 1,
        pageSize: 10
      },
      dataList: [],
      total: 0,
      loading: false,
      multipleSelection: [],
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
      isIndeterminate: true,
      checkAll: false,
      formRules: {
        fee: [
          {required: true, message: this.$t('merchantconfig.message.feenull'), trigger: 'blur'}
        ],
        pcFee: [
          {required: true, message: this.$t('merchantconfig.message.pcfeenull'), trigger: 'blur'}
        ],
        phoneFee: [
          {required: true, message: this.$t('merchantconfig.message.phonefeenull'), trigger: 'blur'}
        ],
        minPay: [
          {required: true, message: this.$t('merchantconfig.message.minpaynull'), trigger: 'blur'}
        ],
        maxPay: [
          {required: true, message: this.$t('merchantconfig.message.maxpaynull'), trigger: 'blur'}
        ],
        useType: [
          {required: true, message: this.$t('merchantconfig.message.usetypenull'), trigger: 'blur'}
        ],
        paySwitch: [
          {required: true, message: this.$t('merchantconfig.message.payswitchnull'), trigger: 'blur'}
        ],
        useable: [
          {required: true, message: this.$t('merchantconfig.message.useablenull'), trigger: 'blur'}
        ],
        lockFlag: [
          {required: true, message: this.$t('merchantconfig.message.lockflagnull'), trigger: 'blur'}
        ],
        creditGrade: [
          {required: true, message: this.$t('merchantconfig.message.creditgradenull'), trigger: 'change'}
        ]
      }
    }
  },
  methods: {
    getList() {
      this.loading = true;
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
    handleOpen() {
      this.batchUpdate("paySwitch", "Y", "merchantconfig.message.openprompt");
    },
    handleClose() {
      this.batchUpdate("paySwitch", "N", "merchantconfig.message.closeprompt");
    },
    handleEnabled() {
      this.batchUpdate("useable", "Y", "merchantconfig.message.enabledprompt");
    },
    handleDisabled() {
      this.batchUpdate("useable", "N", "merchantconfig.message.disabledprompt");
    },
    batchUpdate(type, status, message) {
      this.$confirm(this.$t(message), this.$t('common.message.prompt'), {
        confirmButtonText: this.$t('common.button.confirm'),
        cancelButtonText: this.$t('common.button.cancel'),
        type: 'warning'
      }).then(() => {
        if (this.multipleSelection.length == 0) {
          this.$message({type: 'warning', message: this.$t('common.message.selectdata')});
        } else {
          let data = JSON.stringify(this.multipleSelection);
          merchantConfig.batchUpdate({'updateList': data, 'type': type, 'status': status}).then((response) => {
            if (response.data['code'] === '10000') {
              this.$message({message: this.$t('common.message.operatesuccess'), type: 'success'});
              this.handleQuery();
            } else {
              let messageKey = this.global.getMessageKey(response.data['code']);
              this.$message({message: this.$t(messageKey), type: 'error'});
            }
          })
        }
      }).catch(() => {
        // 取消
      })
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
      this.isIndeterminate = true;
      this.checkAll = false;
      this.editForm.levels = [];
      if (row.levels) {
        this.editForm.levels = row.levels.split(",");
      }
      this.editForm.creditGrade = [];
      if (row.creditGrade) {
        this.editForm.creditGrade = row.creditGrade.split(",");
        this.handleCheckedChange(this.editForm.creditGrade);
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
    handleCheckAllChange(val) {
      let creditGradeOptions = [];
      for (let i = 0, len = this.creditGradeList.length; i < len; i++) {
        creditGradeOptions.push(this.creditGradeList[i].itemCode);
      }
      this.editForm.creditGrade = val ? creditGradeOptions : [];
      this.isIndeterminate = false;
    },
    handleCheckedChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.creditGradeList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.creditGradeList.length;
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
