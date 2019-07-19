import {dictionaryItem, thirdPointCard} from 'api'

export default {
  data() {
    return {
      permission: {
        query: 'pay.thirdpointcard.query',
        reset: 'pay.thirdpointcard.reset',
        add: 'pay.thirdpointcard.add',
        edit: 'pay.thirdpointcard.edit',
        delete: 'pay.thirdpointcard.delete',
        enabled: 'pay.thirdpointcard.enabled',
        disabled: 'pay.thirdpointcard.disabled'
      },
      ynList: [],
      edList: [],
      filters: {
        language: this.getI18nLocale(),
        cardZHName: '',
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
        cardCode: '',
        cardZHName: '',
        cardENName: '',
        cardRate: null,
        cardDenomination: '',
        itemSort: null,
        recommend: ''
      },
      addLoading: false,
      editFormVisible: false,
      editForm: {
        id: null,
        cardCode: '',
        cardZHName: '',
        cardENName: '',
        cardRate: null,
        cardDenomination: '',
        itemSort: null,
        useable: '',
        recommend: ''
      },
      editLoading: false,
      formRules: {
        cardCode: [
          {required: true, message: this.$t('thirdpointcard.message.cardcodenull'), trigger: 'blur'}
        ],
        cardZHName: [
          {required: true, message: this.$t('thirdpointcard.message.cardzhnamenull'), trigger: 'blur'}
        ],
        cardENName: [
          {required: true, message: this.$t('thirdpointcard.message.cardennamenull'), trigger: 'blur'}
        ],
        cardRate: [
          {required: true, message: this.$t('thirdpointcard.message.cardratenull'), trigger: 'blur'}
        ],
        cardDenomination: [
          {required: true, message: this.$t('thirdpointcard.message.carddenominationnull'), trigger: 'blur'}
        ],
        itemSort: [
          {required: true, message: this.$t('thirdpointcard.message.itemsortnull'), trigger: 'blur'}
        ],
        recommend: [
          {required: true, message: this.$t('thirdpointcard.message.recommendnull'), trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    getList() {
      this.loading = true;
      thirdPointCard.queryPaging(this.filters).then((response) => {
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
      this.addForm.cardCode = '';
      this.addForm.cardZHName = '';
      this.addForm.cardENName = '';
      this.addForm.cardRate = null;
      this.addForm.cardDenomination = '';
      this.addForm.itemSort = null;
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
          thirdPointCard.batchDelete({'deleteList': data}).then((response) => {
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
      this.editForm.cardCode = row.cardCode;
      this.editForm.cardZHName = row.cardZHName;
      this.editForm.cardENName = row.cardENName;
      this.editForm.cardRate = row.cardRate;
      this.editForm.cardDenomination = row.cardDenomination;
      this.editForm.itemSort = row.itemSort;
      this.editForm.useable = row.useable;
      this.editForm.recommend = row.recommend;
      this.editFormVisible = true;
    },
    handleStatus(index, row, useable) {
      let formData = {"id": row.id, "useable": useable};
      thirdPointCard.update(formData).then((response) => {
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
          thirdPointCard.insert(this.addForm).then((response) => {
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
          thirdPointCard.update(this.editForm).then((response) => {
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
