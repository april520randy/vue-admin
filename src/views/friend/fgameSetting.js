import Upload from '@/components/Upload'
import Import from '@/components/Import'
import {dictionaryItem,fgameSetting} from 'api'

export default {
  components: {Upload, Import},
  data() {
    return {
      gameCategoryList: [],
      value1:'',
      filters: {
        language: this.getI18nLocale(),
        platform:'',
        cnGame:'',
        enGame:'',
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
        cnGame:'',
        enGame:'',
        gameId:'',
        platform:'',
        gameSort:'',
        beginTime:'',
        endTime:'',
        content:'',
        path:'',
        progressShowStatus: false
      },
      addLoading: false,
      editFormVisible: false,
      editForm: {
        id:'',
        cnGame:'',
        enGame:'',
        gameId:'',
        platform:'',
        gameSort:'',
        beginTime:'',
        endTime:'',
        content:'',
        path:'',
        progressShowStatus: false
      },
      editLoading: false,
      formRules: {
        gameId: [
          {required: true, message: this.$t('fgameSetting.message.gameidnull'), trigger: 'blur'}
        ],
        platform: [
          {required: true, message: this.$t('fgameSetting.message.platformnull'), trigger: 'change'}
        ],
        cnGame: [
          {required: true, message: this.$t('fgameSetting.message.cngamenull'), trigger: 'change'}
        ],
        enGame: [
          {required: true, message: this.$t('fgameSetting.message.engamenull'), trigger: 'blur'}
        ],
        content: [
          {required: true, message: this.$t('fgameSetting.message.contentnull'), trigger: 'blur'}
        ],
        gameSort: [
          {required: true, message: this.$t('fgameSetting.message.gamesortnull'), trigger: 'change'}
        ],
        beginTime: [
          {required: true, message: this.$t('fgameSetting.message.begintimenull'), trigger: 'change'}
        ],
        endTime: [
          {required: true, message: this.$t('fgameSetting.message.endtimenull'), trigger: 'change'}
        ],
        path: [
          {required: true, message: this.$t('fgameSetting.message.pathnull'), trigger: 'change'}
        ]
      }
    }
  },
  methods: {
    getList() {
      this.loading = true;
      fgameSetting.queryPaging(this.filters).then((response) => {
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
      this.editForm.cnGame = row.cnGame;
      this.editForm.enGame = row.enGame;
      this.editForm.gameId = row.gameId;
      this.editForm.platform = row.platform;
      this.editForm.operateValue = row.operateValue;
      this.editForm.gameSort = row.gameSort;
      this.editForm.beginTime = row.beginTime;
      this.editForm.endTime = row.endTime;
      this.editForm.content = row.content;
      this.editForm.path = row.path;
      this.editForm.showImageUrl = row.path;
      this.editFormVisible = true;
    },
    handleAdd() {
      this.addForm.id = "";
      this.addForm.cnGame ="";
      this.addForm.enGame = "";
      this.addForm.gameId = "";
      this.addForm.platform = "";
      this.addForm.operateValue = "";
      this.addForm.gameSort = "";
      this.addForm.beginTime = "";
      this.addForm.endTime = "";
      this.addForm.content = "";
      this.addForm.path = "";
      this.addFormVisible = true;
      this.$nextTick(() => {
        this.$refs['addForm'].clearValidate();
      });
    },
    handleAddSuccess() {
      let file = this.$refs.addUpload.$el.querySelector('input');
      let formData = new FormData();
      formData.append('file', file.files[0]);
      this.addForm.progressShowStatus = true;
      fgameSetting.uploadImage(formData).then((response) => {
        this.addForm.progressShowStatus = false;
        if (response.data['code'] === '10000') {
          this.addForm.path = response.data['data']['absolutePath'];

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
          this.editForm.path = response.data['data']['absolutePath'];
          this.editForm.showImageUrl = response.data['data']['absolutePath'];
        } else {
          let messageKey = this.global.getMessageKey(response.data['code']);
          this.$message({message: this.$t(messageKey), type: 'error'});
        }
      })
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
          fgameSetting.batchDelete({'deleteList': data}).then((response) => {
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
          fgameSetting.insert(this.addForm).then((response) => {
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
          fgameSetting.update(this.editForm).then((response) => {
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
    getGameCategoryList() {
      let formData = {"dictCode": "GAME_CATEGORY", "language": this.getI18nLocale(), "productCode": this.getProductCode()};
      dictionaryItem.queryList(formData).then((response) => {
        this.gameCategoryList = response.data['data'];
      })
    }
  },
  created() {
    this.getGameCategoryList();
  }
}
