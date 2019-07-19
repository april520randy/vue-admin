import ProductSelect from '@/components/ProductSelect'
import {dictionaryItem, sw} from 'api'

export default {
  components: {ProductSelect},
  data() {
    return {
      permission: {
        query: 'system.switch.query',
        reset: 'system.switch.reset',
        add: 'system.switch.add',
        edit: 'system.switch.edit',
        delete: 'system.switch.delete',
        open: 'system.switch.open',
        close: 'system.switch.close'
      },
      typeList: [],
      statusList: [],
      filters: {
        language: this.getI18nLocale(),
        code: '',
        type: '',
        status: '',
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
        type: ''
      },
      addLoading: false,
      editFormVisible: false,
      editForm: {
        id: null,
        code: '',
        name: '',
        type: ''
      },
      editLoading: false,
      closeFormVisible: false,
      closeForm: {
        id: '',
        maintenanceTime: []
      },
      closeLoading: false,
      formRules: {
        code: [
          {required: true, message: this.$t('switch.message.codenull'), trigger: 'blur'}
        ],
        name: [
          {required: true, message: this.$t('switch.message.namenull'), trigger: 'blur'}
        ],
        type: [
          {required: true, message: this.$t('switch.message.typenull'), trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    getList() {
      this.loading = true;
      sw.queryPaging(this.filters).then((response) => {
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
      this.addForm.code = '';
      this.addForm.name = '';
      this.addForm.type = '';
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
          sw.batchDelete({'deleteList': data}).then((response) => {
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
      this.editForm.type = row.type;
      this.editFormVisible = true;
    },
    handleOpen(index, row) {
      let formData = {};
      formData.id = row.id;
      formData.mode = 'open';
      sw.updateSwitch(formData).then((response) => {
        if (response.data['code'] === '10000') {
          this.$message({message: this.$t('common.message.operatesuccess'), type: 'success'});
          this.handleQuery();
        } else {
          let messageKey = this.global.getMessageKey(response.data['code']);
          this.$message({message: this.$t(messageKey), type: 'error'});
        }
      })
    },
    handleClose(index, row) {
      this.closeForm.id = row.id;
      this.closeForm.maintenanceTime = [];
      this.closeFormVisible = true;
    },
    closeSubmit() {
      if (this.closeForm.maintenanceTime.length == 0) {
        this.$message({message: this.$t('switch.message.maintenancetimenull'), type: 'warning'});
        return;
      }
      this.closeForm.startTime = this.moment(this.closeForm.maintenanceTime[0]).format('YYYY-MM-DD HH:mm:ss');
      this.closeForm.endTime = this.moment(this.closeForm.maintenanceTime[1]).format('YYYY-MM-DD HH:mm:ss');
      this.closeForm.mode = 'close';
      this.closeLoading = true;
      sw.updateSwitch(this.closeForm).then((response) => {
        this.closeLoading = false;
        if (response.data['code'] === '10000') {
          this.closeFormVisible = false;
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
          sw.insert(this.addForm).then((response) => {
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
          sw.update(this.editForm).then((response) => {
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
    getTypeList() {
      let formData = {"dictCode": "SWITCH_TYPE", "language": this.getI18nLocale()};
      dictionaryItem.queryList(formData).then((response) => {
        this.typeList = response.data['data'];
      })
    },
    getStatusList() {
      let formData = {"dictCode": "COMMON_OPEN_CLOSE", "language": this.getI18nLocale()};
      dictionaryItem.queryList(formData).then((response) => {
        this.statusList = response.data['data'];
      })
    },
    showProduct() {
      return this.getProductCode() === 'al' ? true : false;
    }
  },
  created() {
    this.getTypeList();
    this.getStatusList();
  }
}
