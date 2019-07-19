import {whiteListConfig} from 'api'

export default {
  data() {
    return {
      permission: {
        query: 'system.whiteListConfig.query',
        reset: 'system.whiteListConfig.reset',
        add: 'system.whiteListConfig.add',
        edit: 'system.whiteListConfig.edit',
        delete: 'system.whiteListConfig.delete'
      },
      filters: {
        code: '',
        pageNum: 1,
        pageSize: 10
      },
      dataList: [],
      loading: false,
      total: 0,
      multipleSelection: [],
      formLabelWidth: '120px',
      addFormVisible: false,
      addForm: {
        code: '',
        name: '',
        value: '',
        remark:''
      },
      addLoading: false,
      editFormVisible: false,
      editForm: {
        id: null,
        code: '',
        name: '',
        value:'',
        remark: ''
      },
      editLoading: false,
      formRules: {
        code: [
          {required: true, message: this.$t('whiteListConfig.message.codenull'), trigger: 'blur'}
        ],
        name: [
          {required: true, message: this.$t('whiteListConfig.message.namenull'), trigger: 'blur'}
        ],
        value:[
          {required: true, message: this.$t('whiteListConfig.message.valuenull'), trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    getList() {
      this.loading = true;
      whiteListConfig.queryPaging(this.filters).then((response) => {
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
      this.filters.pageNum = 1;
      this.getList();
    },
    handleReset() {
      this.$refs["filters"].resetFields();
    },
    handleAdd() {
      this.addForm.code = '';
      this.addForm.name = '';
      this.addForm.value = '';
      this.addForm.remark = '';
      this.addFormVisible = true;
      this.$nextTick(() => {
        this.$refs['addForm'].clearValidate();
      });
    },
    handleBatchDelete() {
      this.$confirm(this.$t('common.message.deleteprompt1'), this.$t('common.message.prompt'), {
        confirmButtonText: this.$t('common.button.confirm'),
        cancelButtonText: this.$t('common.button.cancel'),
        type: 'warning'
      }).then(() => {
        if (this.multipleSelection.length == 0) {
          this.$message({type: 'warning', message: this.$t('common.message.selectdata')});
        } else {
          let data = JSON.stringify(this.multipleSelection);
          whiteListConfig.batchDelete({'deleteList': data}).then((response) => {
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
      this.editForm.code = row.code;
      this.editForm.name = row.name;
      this.editForm.value = row.value;
      this.editForm.remark = row.remark;
      this.editFormVisible = true;
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
          whiteListConfig.insert(this.addForm).then((response) => {
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
          whiteListConfig.update(this.editForm).then((response) => {
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
    }
  }
}
