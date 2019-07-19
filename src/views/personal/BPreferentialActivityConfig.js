import Upload from '@/components/Upload'
import Import from '@/components/Import'
import {bPreferentialActivityConfig, dictionaryItem} from 'api'
export default {
  components: {Upload, Import},
  data() {
    return {
      preferentialTypeList: [],
      effectiveTypeList: [],
      displaySideList: [],
      associateIdList: [],
      filters: {
        language: this.getI18nLocale(),
        position: '',
        effectiveType: '',
        displaySide: '',
        title: '',
        pageNum: 1,
        pageSize: 10
      },
      dataList: [],
      total: 0,
      loading: false,
      multipleSelection: [],
      formLabelWidth: '110px',
      addFormVisible: false,
      addTypeVisible: false,
      addForm: {
        category: '',
        title: '',
        effectiveType: '',
        effectiveStartTime: '',
        effectiveEndTime: '',
        maintenanceTime: [],
        imageUrl: '',
        showImageUrl: '',
        fileId: '',
        progressShowStatus: false,
        jumpLink: '',
        associateId: null,
        displaySide: []
      },
      addLoading: false,
      editFormVisible: false,
      editTypeVisible: false,
      editForm: {
        id: null,
        sort: null,
        position: '',
        category: '',
        title: '',
        effectiveType: '',
        effectiveStartTime: '',
        effectiveEndTime: '',
        maintenanceTime: [],
        imageUrl: '',
        showImageUrl: '',
        fileId: '',
        progressShowStatus: false,
        jumpLink: '',
        associateId: null,
        displaySide: []
      },
      editLoading: false,
      formRules: {
        position: [
          {required: true, message: this.$t('bPreferentialActivityConfig.message.preferentialTypenull'), trigger: 'change'}
        ],
        title: [
          {required: true, message: this.$t('bPreferentialActivityConfig.message.titlenull'), trigger: 'blur'}
        ],
        effectiveType: [
          {required: true, message: this.$t('bPreferentialActivityConfig.message.effectivetypenull'), trigger: 'change'}
        ],
        imageUrl: [
          {required: true, message: this.$t('bPreferentialActivityConfig.message.imageurlnull'), trigger: 'change'}
        ],
        associateId: [
          {required: true, message: this.$t('bPreferentialActivityConfig.message.associateidnull'), trigger: 'change'}
        ],
        displaySide: [
          {required: true, message: this.$t('bPreferentialActivityConfig.message.displaysidenull'), trigger: 'change'}
        ]

      }
    }
  },
  methods: {
    handleQuery() {
      this.filters.language = this.getI18nLocale();
      this.filters.pageNum = 1;
      this.getList();
    },
    handleReset() {
      this.$refs["filters"].resetFields();
    },
    getList() {
      this.loading = true;
      bPreferentialActivityConfig.queryPaging(this.filters).then((response) => {
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
    getPreferentialTypeList() {
      let formData = {"dictCode": "PREFERENTIAL_TYPE", "language": this.getI18nLocale(), "productCode": this.getProductCode()};
      dictionaryItem.queryList(formData).then((response) => {
        this.preferentialTypeList = response.data['data'];
      })
    },
    getEffectiveTypeList() {
      let formData = {"dictCode": "CAROUSEL_MAP_EFFECTIVE_TYPE", "language": this.getI18nLocale()};
      dictionaryItem.queryList(formData).then((response) => {
        this.effectiveTypeList = response.data['data'];
      })
    },
    getDisplaySideList() {
      let formData = {"dictCode": "CAROUSEL_MAP_DISPLAY_SIDE", "language": this.getI18nLocale()};
      dictionaryItem.queryList(formData).then((response) => {
        this.displaySideList = response.data['data'];
      })
    },
    displaySideFormat(displaySideTag) {
      let arr = [];
      if (this.displaySideList && this.displaySideList.length > 0) {
        var tagArr = displaySideTag.split(",");
        for (var j = 0; j < tagArr.length; j++) {
          var tag = tagArr[j];
          for (var i = 0, len = this.displaySideList.length; i < len; i++) {
            if (tag === this.displaySideList[i].itemCode) {
              arr.push(this.displaySideList[i].itemValue);
            }
          }
        }
      }
      return arr.join(",");
    },

    handleAdd() {
      this.addForm.category = '';
      this.addForm.title = '';
      this.addForm.effectiveType = '';
      this.addForm.effectiveStartTime = '';
      this.addForm.effectiveEndTime = '';
      this.addForm.maintenanceTime = [];
      this.addForm.imageUrl = '';
      this.addForm.showImageUrl = 'https://tg.shdunjiusy.com/cm/upload.jpg';
      this.addForm.fileId = 'addFile';
      this.addForm.progressShowStatus = false;
      this.addForm.jumpLink = '';
      this.addForm.associateId = null;
      this.addForm.displaySide = [];
      this.addTypeVisible = false;
      this.addFormVisible = true;
      this.$nextTick(() => {
        this.addForm.category = this.getPreferentialTypeList[0].itemCode;
        this.getAssociateIdList(this.addForm.category, this.addForm.displaySide, -1);
        this.$refs['addForm'].clearValidate();
      })
    },
    handleSizeChange(val) {
      this.filters.pageSize = val;
      this.getList();
    },
    handleAddPositionChange(val) {
      this.getAssociateIdList(val, this.addForm.displaySide, -1);
    },
    handleAddDisplaySideChange(val) {
      this.getAssociateIdList(this.addForm.position, val, -1);
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
          bPreferentialActivityConfig.batchDelete({'deleteList': data}).then((response) => {
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


    getAssociateIdList(category, displaySide, id) {
      this.associateIdList = [];
      this.associateIdList.push({"id": 0, "title": this.$t("bPreferentialActivityConfig.label.firstactivityposition")});
      this.filters.language = this.getI18nLocale();
      this.filters.pageNum = 1;
      this.filters.position = category;
      this.filters.displaySide = displaySide;
      bPreferentialActivityConfig.queryPaging(this.filters).then((response) => {
        if (response.data['code'] === '10000') {
          this.filters.displaySide = null;
            let arr = response.data['data'];
            for (var i = 0, len = arr.length; i < len; i++) {
              if (id != arr[i].id) {
                this.associateIdList.push({"id": arr[i].id, "title": arr[i].title + " >> " + this.$t("bPreferentialActivityConfig.label.after")});
              }
            }
        }
      })




    },

    handleEditDisplaySideChange(val) {
      this.getAssociateIdList(this.editForm.category, val, this.editForm.id);
    },


    dateFormat(row, column) {
      let date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return this.moment(date).format('YYYY-MM-DD HH:mm:ss');
    },
    dateFormatItem(row, columnName) {
      let date = row[columnName];
      if (date == undefined) {
        return "";
      }
      return this.moment(date).format('YYYY-MM-DD HH:mm:ss');
    },
    handleCurrentChange(val) {
      this.filters.pageNum = val;
      this.getList();
    },
    addSubmit() {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          if ("2" === this.addForm.effectiveType) {
            if (this.addForm.maintenanceTime.length != 2) {
              this.$message({message: this.$t("bPreferentialActivityConfig.message.starttimeorendtimeisnull"), type: 'warning'});
              return;
            } else {
              this.addForm.effectiveStartTime = this.moment(this.addForm.maintenanceTime[0]).format('YYYY-MM-DD HH:mm:ss');
              this.addForm.effectiveEndTime = this.moment(this.addForm.maintenanceTime[1]).format('YYYY-MM-DD HH:mm:ss');
            }
          }
          this.addForm.displaySide = this.addForm.displaySide.join(',');
          this.addLoading = true;
          bPreferentialActivityConfig.insert(this.addForm).then((response) => {
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
    handleAddEffectiveTypeChange(val) {
      if ("2" === val) {
        this.addTypeVisible = true;
      } else {
        this.addTypeVisible = false;
      }
    },
    handleAddSuccess() {
      let file = this.$refs.addUpload.$el.querySelector('input');
      let formData = new FormData();
      formData.append('file', file.files[0]);
      this.addForm.progressShowStatus = true;
      bPreferentialActivityConfig.uploadImage(formData).then((response) => {
        this.addForm.progressShowStatus = false;
        if (response.data['code'] === '10000') {
          this.addForm.imageUrl = response.data['data']['absolutePath'];
          this.addForm.showImageUrl = response.data['data']['absolutePath'];
        } else {
          let messageKey = this.global.getMessageKey(response.data['code']);
          this.$message({message: this.$t(messageKey), type: 'error'});
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleEdit(index, row) {
      this.editForm.id = row.id;
      this.editForm.sort = row.sort;
      this.editForm.category = row.category;
      this.editForm.title = row.title;
      this.editForm.effectiveType = row.effectiveType;
      this.editForm.effectiveStartTime = '';
      this.editForm.effectiveEndTime = '';
      this.editForm.imageUrl = row.imageUrl;
      this.editForm.showImageUrl = row.imageUrl;
      this.editForm.fileId = 'editFile';
      this.editForm.progressShowStatus = false;
      this.editForm.jumpLink = row.jumpLink;
      this.editForm.associateId = row.associateId;
      this.editForm.displaySide = row.displaySide;
      this.editForm.maintenanceTime = [];
      if (row.effectiveStartTime && row.effectiveEndTime) {
        let st = new Date(row.effectiveStartTime);
        let et = new Date(row.effectiveEndTime);
        this.editForm.maintenanceTime.push(st);
        this.editForm.maintenanceTime.push(et);
      }
      this.getAssociateIdList(this.editForm.category, this.editForm.displaySide, this.editForm.id);
      this.handleEditEffectiveTypeChange(this.editForm.effectiveType);
      this.editFormVisible = true;
      if (row.displaySide) {
        this.editForm.displaySide = row.displaySide.split(",");
      }
    },
    handleEditEffectiveTypeChange(val) {
      if ("2" === val) {
        this.editTypeVisible = true;
      } else {
        this.editTypeVisible = false;
      }
    },
    handleEditCateoryChange(val) {
      this.getAssociateIdList(val, this.editForm.displaySide, this.editForm.id);
    },
    handleEditSuccess() {
      let file = this.$refs.editUpload.$el.querySelector('input');
      let formData = new FormData();
      formData.append('file', file.files[0]);
      this.editForm.progressShowStatus = true;
      bPreferentialActivityConfig.uploadImage(formData).then((response) => {
        this.editForm.progressShowStatus = false;
        if (response.data['code'] === '10000') {
          this.editForm.imageUrl = response.data['data']['absolutePath'];
          this.editForm.showImageUrl = response.data['data']['absolutePath'];
        } else {
          let messageKey = this.global.getMessageKey(response.data['code']);
          this.$message({message: this.$t(messageKey), type: 'error'});
        }
      })
    },
    editSubmit() {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          if ("2" === this.editForm.effectiveType) {
            if (this.editForm.maintenanceTime.length != 2) {
              this.$message({message: this.$t("bPreferentialActivityConfig.message.starttimeorendtimeisnull"), type: 'warning'});
              return;
            } else {
              this.editForm.effectiveStartTime = this.moment(this.editForm.maintenanceTime[0]).format('YYYY-MM-DD HH:mm:ss');
              this.editForm.effectiveEndTime = this.moment(this.editForm.maintenanceTime[1]).format('YYYY-MM-DD HH:mm:ss');
            }
          }
          this.editForm.displaySide = this.editForm.displaySide.join(',');
          this.editLoading = true;
          bPreferentialActivityConfig.update(this.editForm).then((response) => {
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







  },
  created() {
    this.getPreferentialTypeList();
    this.getEffectiveTypeList();
    this.getDisplaySideList();
  }
}
