import Upload from '@/components/Upload'
import {carouselMapConfig, dictionaryItem} from 'api'

export default {
  components: {Upload},
  data() {
    return {
      permission: {
        query: 'personal.carouselmapconfig.query',
        reset: 'personal.carouselmapconfig.reset',
        add: 'personal.carouselmapconfig.add',
        edit: 'personal.carouselmapconfig.edit',
        delete: 'personal.carouselmapconfig.delete'
      },
      positionList: [],
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
        position: '',
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
        displaySide: ''
      },
      addLoading: false,
      editFormVisible: false,
      editTypeVisible: false,
      editForm: {
        id: null,
        itemSort: null,
        position: '',
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
        displaySide: ''
      },
      editLoading: false,
      formRules: {
        position: [
          {required: true, message: this.$t('carouselmapconfig.message.positionnull'), trigger: 'change'}
        ],
        title: [
          {required: true, message: this.$t('carouselmapconfig.message.titlenull'), trigger: 'blur'}
        ],
        effectiveType: [
          {required: true, message: this.$t('carouselmapconfig.message.effectivetypenull'), trigger: 'change'}
        ],
        imageUrl: [
          {required: true, message: this.$t('carouselmapconfig.message.imageurlnull'), trigger: 'change'}
        ],
        associateId: [
          {required: true, message: this.$t('carouselmapconfig.message.associateidnull'), trigger: 'change'}
        ],
        displaySide: [
          {required: true, message: this.$t('carouselmapconfig.message.displaysidenull'), trigger: 'change'}
        ]
      }
    }
  },
  methods: {
    getList() {
      this.loading = true;
      carouselMapConfig.queryPaging(this.filters).then((response) => {
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
      this.addForm.position = '';
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
      this.addForm.displaySide = '1';
      this.addTypeVisible = false;
      this.addFormVisible = true;
      this.$nextTick(() => {
        this.addForm.position = this.positionList[0].itemCode;
        this.getAssociateIdList(this.addForm.position, this.addForm.displaySide, -1);
        this.$refs['addForm'].clearValidate();
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
          carouselMapConfig.batchDelete({'deleteList': data}).then((response) => {
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
    handleSizeChange(val) {
      this.filters.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.filters.pageNum = val;
      this.getList();
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
    handleEdit(index, row) {
      this.editForm.id = row.id;
      this.editForm.itemSort = row.itemSort;
      this.editForm.position = row.position;
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
      this.getAssociateIdList(this.editForm.position, this.editForm.displaySide, this.editForm.id);
      this.handleEditEffectiveTypeChange(this.editForm.effectiveType);
      this.editFormVisible = true;
    },
    handleAddPositionChange(val) {
      this.getAssociateIdList(val, this.addForm.displaySide, -1);
    },
    handleEditPositionChange(val) {
      this.getAssociateIdList(val, this.editForm.displaySide, this.editForm.id);
    },
    handleAddEffectiveTypeChange(val) {
      if ("2" === val) {
        this.addTypeVisible = true;
      } else {
        this.addTypeVisible = false;
      }
    },
    handleEditEffectiveTypeChange(val) {
      if ("2" === val) {
        this.editTypeVisible = true;
      } else {
        this.editTypeVisible = false;
      }
    },
    handleAddSuccess() {
      let file = this.$refs.addUpload.$el.querySelector('input');
      let formData = new FormData();
      formData.append('file', file.files[0]);
      this.addForm.progressShowStatus = true;
      carouselMapConfig.uploadImage(formData).then((response) => {
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
    handleEditSuccess() {
      let file = this.$refs.editUpload.$el.querySelector('input');
      let formData = new FormData();
      formData.append('file', file.files[0]);
      this.editForm.progressShowStatus = true;
      carouselMapConfig.uploadImage(formData).then((response) => {
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
    addSubmit() {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          if ("2" === this.addForm.effectiveType) {
            if (this.addForm.maintenanceTime.length != 2) {
              this.$message({message: this.$t("carouselmapconfig.message.starttimeorendtimeisnull"), type: 'warning'});
              return;
            } else {
              this.addForm.effectiveStartTime = this.moment(this.addForm.maintenanceTime[0]).format('YYYY-MM-DD HH:mm:ss');
              this.addForm.effectiveEndTime = this.moment(this.addForm.maintenanceTime[1]).format('YYYY-MM-DD HH:mm:ss');
            }
          }
          this.addLoading = true;
          carouselMapConfig.insert(this.addForm).then((response) => {
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
          if ("2" === this.editForm.effectiveType) {
            if (this.editForm.maintenanceTime.length != 2) {
              this.$message({message: this.$t("carouselmapconfig.message.starttimeorendtimeisnull"), type: 'warning'});
              return;
            } else {
              this.editForm.effectiveStartTime = this.moment(this.editForm.maintenanceTime[0]).format('YYYY-MM-DD HH:mm:ss');
              this.editForm.effectiveEndTime = this.moment(this.editForm.maintenanceTime[1]).format('YYYY-MM-DD HH:mm:ss');
            }
          }
          this.editLoading = true;
          carouselMapConfig.update(this.editForm).then((response) => {
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
    handleAddDisplaySideChange(val) {
      this.getAssociateIdList(this.addForm.position, val, -1);
    },
    handleEditDisplaySideChange(val) {
      this.getAssociateIdList(this.editForm.position, val, this.editForm.id);
    },
    getAssociateIdList(position, displaySide, id) {
      this.associateIdList = [];
      this.associateIdList.push({"id": 0, "title": this.$t("carouselmapconfig.label.firstactivityposition")});
      let formData = {"position": position, "displaySide": displaySide, "language": this.getI18nLocale()};
      carouselMapConfig.queryList(formData).then((response) => {
        if (response.data['code'] === '10000') {
          let arr = response.data['data'];
          for (var i = 0, len = arr.length; i < len; i++) {
            if (id != arr[i].id) {
              this.associateIdList.push({"id": arr[i].id, "title": arr[i].title + " >> " + this.$t("carouselmapconfig.label.after")});
            }
          }
        }
      })
    },
    getPositionList() {
      let formData = {"dictCode": "CAROUSEL_MAP_POSITION", "language": this.getI18nLocale()};
      dictionaryItem.queryList(formData).then((response) => {
        this.positionList = response.data['data'];
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
    }
  },
  created() {
    this.getPositionList();
    this.getEffectiveTypeList();
    this.getDisplaySideList();
  }
}
