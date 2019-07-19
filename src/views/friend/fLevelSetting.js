import Upload from '@/components/Upload'
import Import from '@/components/Import'
import {dictionaryItem,flevelSetting} from 'api'

export default {
  components: {Upload, Import},
  data() {
    return {
      levelList: [],
      edList: [],
      restrictList: [],
      filters: {
        language: this.getI18nLocale(),
        id:'',
        name: '',
        theTime:'',
        endTime:'',
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
        id:'',
        name: '',
        account: '',
        flag: '',
        operateType: '',
        operateValue: '',
        isPublish: '',
        isPraise: '',
        isComment: '',
        progressShowStatus: false
      },
      addLoading: false,
      editFormVisible: false,
      editForm: {
        id:'',
        name: '',
        account: '',
        flag: '',
        operateType: '',
        operateValue: '',
        isPublish: '',
        isPraise: '',
        isComment: '',
        progressShowStatus: false
      },
      editLoading: false,
      formRules: {
        flag: [
          {required: true, message: this.$t('flevelSetting.message.flagnull'), trigger: 'change'}
        ]
      }
    }
  },
  methods: {
    getList() {
      this.loading = true;
      flevelSetting.queryPaging(this.filters).then((response) => {
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
      this.filters.theTime="";
      this.filters.endTime="";
    },
    handleEdit(index, row) {
      this.editForm.id = row.id;
      this.editForm.name = row.name;
      this.editForm.account = row.account;
      this.editForm.flag = row.flag;
      this.editForm.operateType = row.operateType+"";
      this.editForm.operateValue = row.operateValue;
      this.editForm.isPublish = row.isPublish;
      this.editForm.isPraise = row.isPraise;
      this.editForm.isComment = row.isComment;
      this.editFormVisible = true;
    },
    handleAdd() {
     this.addForm.id = "";
      this.addForm.name = "";
      this.addForm.account = "";
      this.addForm.flag = "";
      this.addForm.operateType = "";
      this.addForm.operateValue ="";
      this.addForm.isPublish = "";
      this.addForm.isPraise = "";
      this.addForm.isComment = "";
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
          flevelSetting.batchDelete({'deleteList': data}).then((response) => {
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
          flevelSetting.insert(this.addForm).then((response) => {
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
          flevelSetting.update(this.editForm).then((response) => {
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
    getRestrictList() {
      let formData = {"dictCode": "FRIEND_LEVEL_RESTRICT", "language": this.getI18nLocale()};
      dictionaryItem.queryList(formData).then((response) => {
        this.restrictList = response.data['data'];
      })
    },
    getEDList() {
      let formData = {"dictCode": "COMMON_ENABLED_DISABLED", "language": this.getI18nLocale()};
      dictionaryItem.queryList(formData).then((response) => {
        this.edList = response.data['data'];
      })
    },
    getLevelList() {
      let formData = {"dictCode": "USER_LEVEL", "language": this.getI18nLocale(), "productCode": this.getProductCode()};
      dictionaryItem.queryList(formData).then((response) => {
        this.levelList = response.data['data'];
      })
    },
    getUEContent() {
      let content = this.$refs.ue.getUEContent();
      this.$notify({
        title: '获取成功，可在控制台查看！',
        message: content,
        type: 'success'
      });
      console.log(content)
    }
  },
  created() {
    this.getLevelList();
    this.getEDList();
    this.getRestrictList();
  },

mounted() {
  // 实例化editor编辑器
  this.editor = UE.getEditor('editor');
  // console.log(this.editor.setContent("1223"))
}
}
