import Upload from '@/components/Upload'
import Import from '@/components/Import'
import {dictionaryItem,advertisement,fgameSetting} from 'api'

export default {
  components: {Upload, Import},
  data() {
    return {
      filters: {
        language: this.getI18nLocale(),
        hrefUrl:'',
        id: '',
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
        image: '',
        sorta: '',
        hrefUrl: '',
        progressShowStatus: false
      },
      editFormVisible: false,
      editForm: {
        id:'',
        image: '',
        sorta: '',
        hrefUrl: '',
        progressShowStatus: false
      },
      editLoading: false,
      addLoading: false,
      formRules: {
        keyValue: [
          {required: true, message: this.$t('advertisement.message.image'), trigger: 'change'}
        ]
      }
    }
  },
  methods: {
    getList() {
      this.loading = true;
      advertisement.queryPaging(this.filters).then((response) => {
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
    handleAddSuccess() {
      let file = this.$refs.addUpload.$el.querySelector('input');
      let formData = new FormData();
      formData.append('file', file.files[0]);
      this.addForm.progressShowStatus = true;
      fgameSetting.uploadImage(formData).then((response) => {
        this.addForm.progressShowStatus = false;
        if (response.data['code'] === '10000') {
          this.addForm.image = response.data['data']['absolutePath'];

          this.addForm.showImageUrl = response.data['data']['absolutePath'];
        } else {
          let messageKey = this.global.getMessageKey(response.data['code']);
          this.$message({message: this.$t(messageKey), type: 'error'});
        }
      })
    },
    handleEditSuccess() {
      let file = this.$refs.editUpload.$el.querySelector('input');
      let formData = new FormData();
      formData.append('file', file.files[0]);
      this.editForm.progressShowStatus = true;
      fgameSetting.uploadImage(formData).then((response) => {
        this.editForm.progressShowStatus = false;
        if (response.data['code'] === '10000') {
          this.editForm.image = response.data['data']['absolutePath'];
          this.editForm.showImageUrl = response.data['data']['absolutePath'];
        } else {
          let messageKey = this.global.getMessageKey(response.data['code']);
          this.$message({message: this.$t(messageKey), type: 'error'});
        }
      })
    },
    handleEdit(index, row) {
      this.editForm.id = row.id;
      this.editForm.image = row.image;
      this.editForm.sorta = row.sorta;
      this.editForm.hrefUrl = row.hrefUrl;
      this.editFormVisible = true;
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
      this.addForm.image = '';
      this.addForm.sorta = '';
      this.addForm.hrefUrl = '';
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
          advertisement.batchDelete({'deleteList': data}).then((response) => {
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
          this.addLoading = true;
          advertisement.insert(this.addForm).then((response) => {
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
      advertisement.update(this.editForm).then((response) => {
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
  }
}
