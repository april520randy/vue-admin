import Upload from '@/components/Upload'
import Import from '@/components/Import'
import {dictionaryItem,fkeyword} from 'api'

export default {
  components: {Upload, Import,UE},
  data() {
    return {
      filters: {
        language: this.getI18nLocale(),
        id: '',
        keyValue: '',
        pageNum: 1,
        pageSize: 10
      },
      dataList: [],
      total: 0,
      btnloading: false,
      loading: false,
      multipleSelection: [],
      formLabelWidth: '100px',
      addFormVisible: false,
      addForm: {
        id: '',
        keyValue: '',
        progressShowStatus: false
      },
      addLoading: false,
      formRules: {
        keyValue: [
          {required: true, message: this.$t('fkeyword.message.keyvaluenull'), trigger: 'change'}
        ]
      }
    }
  },
  methods: {
    getList() {
      this.loading = true;
      fkeyword.queryPaging(this.filters).then((response) => {
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
      this.addForm.id = '';
      this.addForm.keyValue = '';
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
          fkeyword.batchDelete({'deleteList': data}).then((response) => {
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
    dateFormat(row, column) {
      let date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return this.moment(date).format('YYYY-MM-DD HH:mm:ss');
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
          // this.addForm.keyValue = this.addForm.keyValue.join(',');

          this.addLoading = true;
          fkeyword.insert(this.addForm).then((response) => {
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
    }
  }
}
