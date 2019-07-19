import {dictionaryItem, thirdPaymentBank} from 'api'

export default {
  data() {
    return {
      permission: {
        query: 'pay.thirdpaymentbank.query',
        reset: 'pay.thirdpaymentbank.reset',
        add: 'pay.thirdpaymentbank.add',
        edit: 'pay.thirdpaymentbank.edit',
        delete: 'pay.thirdpaymentbank.delete',
        enabled: 'pay.thirdpaymentbank.enabled',
        disabled: 'pay.thirdpaymentbank.disabled'
      },
      ynList: [],
      edList: [],
      filters: {
        language: this.getI18nLocale(),
        payType: '',
        description: '',
        pageNum: 1,
        pageSize: 10
      },
      dataList: [],
      total: 0,
      loading: false,
      multipleSelection: [],
      formLabelWidth: '120px',
      addFormVisible: false,
      addForm: {
        payType: '',
        bankCode: '',
        bankZHName: '',
        bankENName: '',
        itemSort: null,
        description: '',
        recommend: ''
      },
      addLoading: false,
      editFormVisible: false,
      editForm: {
        id: null,
        payType: '',
        bankCode: '',
        bankZHName: '',
        bankENName: '',
        itemSort: null,
        description: '',
        useable: '',
        recommend: ''
      },
      editLoading: false,
      formRules: {
        payType: [
          {required: true, message: this.$t('thirdpaymentbank.message.paytypenull'), trigger: 'blur'}
        ],
        bankCode: [
          {required: true, message: this.$t('thirdpaymentbank.message.bankcodenull'), trigger: 'blur'}
        ],
        bankZHName: [
          {required: true, message: this.$t('thirdpaymentbank.message.bankzhnamenull'), trigger: 'blur'}
        ],
        bankENName: [
          {required: true, message: this.$t('thirdpaymentbank.message.bankennamenull'), trigger: 'blur'}
        ],
        itemSort: [
          {required: true, message: this.$t('thirdpaymentbank.message.itemsortnull'), trigger: 'blur'}
        ],
        recommend: [
          {required: true, message: this.$t('thirdpaymentbank.message.recommendnull'), trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    getList() {
      this.loading = true;
      thirdPaymentBank.queryPaging(this.filters).then((response) => {
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
    handleAdd() {
      this.addForm.payType = '';
      this.addForm.bankCode = '';
      this.addForm.bankZHName = '';
      this.addForm.bankENName = '';
      this.addForm.itemSort = null;
      this.addForm.description = '';
      this.addForm.recommend = 'N';
      this.addFormVisible = true;
      this.$nextTick(() => {
        this.$refs['addForm'].clearValidate();
      });
    },
    handleBatchDelete() {
      this.$confirm(this.$t('common.message.deleteprompt'), this.$t('common.message.prompt'), {
        confirmButtonText: this.$t('common.button.confirm'),
        cancelButtonText: this.$t('common.button.cancel'),
        type: 'warning'
      }).then(() => {
        if (this.multipleSelection.length == 0) {
          this.$message({type: 'warning', message: this.$t('common.message.selectdata')});
        } else {
          let data = JSON.stringify(this.multipleSelection);
          thirdPaymentBank.batchDelete({'deleteList': data}).then((response) => {
            if (response.data['code'] === '10000') {
              this.$message({message: this.$t('common.message.deletesuccess'), type: 'success'});
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    dateFormat(row, column) {
      let date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return this.moment(date).format('YYYY-MM-DD HH:mm:ss');
    },
    handleEdit(index, row) {
      this.editForm.id = row.id;
      this.editForm.payType = row.payType;
      this.editForm.bankCode = row.bankCode;
      this.editForm.bankZHName = row.bankZHName;
      this.editForm.bankENName = row.bankENName;
      this.editForm.itemSort = row.itemSort;
      this.editForm.description = row.description;
      this.editForm.useable = row.useable;
      this.editForm.recommend = row.recommend;
      this.editFormVisible = true;
    },
    handleStatus(index, row, useable) {
      let formData = {"id": row.id, "useable": useable};
      thirdPaymentBank.update(formData).then((response) => {
        if (response.data['code'] === '10000') {
          this.$message({message: this.$t('common.message.operatesuccess'), type: 'success'});
          this.handleQuery();
        } else {
          let messageKey = this.global.getMessageKey(response.data['code']);
          this.$message({message: this.$t(messageKey), type: 'error'});
        }
      })
    },
    handleSizeChange(val) {
      this.filters.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.filters.pageNum = val;
      this.getList();
    },
    addSubmit() {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this.addLoading = true;
          thirdPaymentBank.insert(this.addForm).then((response) => {
            this.addLoading = false;
            if (response.data['code'] === '10000') {
              this.addFormVisible = false;
              this.$message({message: this.$t('common.message.addsuccess'), type: 'success'});
              this.handleQuery();
            } else {
              let messageKey = this.global.getMessageKey(response.data['code']);
              this.$message({message: this.$t(messageKey), type: 'error'});
            }
          })
        } else {
          return false;
        }
      })
    },
    editSubmit() {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          this.editLoading = true;
          thirdPaymentBank.update(this.editForm).then((response) => {
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
        } else {
          return false;
        }
      })
    },
    getYNList() {
      let formData = {"dictCode": "COMMON_YES_NO", "language": this.getI18nLocale()};
      dictionaryItem.queryList(formData).then((response) => {
        this.ynList = response.data['data'];
      })
    },
    getEDList() {
      let formData = {"dictCode": "COMMON_ENABLED_DISABLED", "language": this.getI18nLocale()};
      dictionaryItem.queryList(formData).then((response) => {
        this.edList = response.data['data'];
      })
    }
  },
  created() {
    this.getYNList();
    this.getEDList();
  }
}
