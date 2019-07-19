import Upload from '@/components/Upload'
import Import from '@/components/Import'
import {dictionaryItem, gameConfig} from 'api'

export default {
  components: {Upload, Import},
  data() {
    return {
      permission: {
        query: 'game.gameconfig.query',
        reset: 'game.gameconfig.reset',
        add: 'game.gameconfig.add',
        edit: 'game.gameconfig.edit',
        delete: 'game.gameconfig.delete',
        shelve: 'game.gameconfig.shelve',
        unshelve: 'game.gameconfig.unshelve',
        import: 'game.gameconfig.import'
      },
      gameStatusList: [],
      gameCategoryList: [],
      gameTerminalList: [],
      gameTypeList: [],
      jackpotFlagList: [],
      recommendFlagList: [],
      popularFlagList: [],
      deleteFlagList: [],
      gameLineList: [],
      gameTagList: [],
      ynList: [],
      recommendIndexList: [],
      gameStyleList: [],
      openModeList: [],
      filters: {
        language: this.getI18nLocale(),
        gameId: '',
        gameCode: '',
        gameCName: '',
        gameEName: '',
        gameStatus: '',
        gameCategory: '',
        gameTerminal: '',
        jackpotFlag: '',
        recommendFlag: '',
        popularFlag: '',
        openMode: '',
        deleteFlag: '',
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
        gameId: '',
        gameCode: '',
        gameCName: '',
        gameEName: '',
        gameLine: '',
        gameStatus: '',
        gameCategory: '',
        gameTerminal: '',
        openMode: '',
        gameType: [],
        gameStyle: '',
        gameTag: [],
        gameLanguage: '',
        gameSort: null,
        recommendIndex: null,
        popularityIndex: null,
        jackpotFlag: '',
        recommendFlag: '',
        popularFlag: '',
        trdFlag: '',
        description: '',
        imageUrl: '',
        showImageUrl: '',
        fileId: '',
        progressShowStatus: false
      },
      addLoading: false,
      editFormVisible: false,
      editForm: {
        id: null,
        gameId: '',
        gameCode: '',
        gameCName: '',
        gameEName: '',
        gameLine: '',
        gameStatus: '',
        gameCategory: '',
        gameTerminal: '',
        openMode: '',
        gameType: [],
        gameStyle: '',
        gameTag: [],
        gameLanguage: '',
        gameSort: null,
        recommendIndex: null,
        popularityIndex: null,
        jackpotFlag: '',
        recommendFlag: '',
        popularFlag: '',
        trdFlag: '',
        description: '',
        imageUrl: '',
        showImageUrl: '',
        fileId: '',
        progressShowStatus: false
      },
      editLoading: false,
      formRules: {
        gameId: [
          {required: true, message: this.$t('gameconfig.message.gameidnull'), trigger: 'blur'}
        ],
        gameCode: [
          {required: true, message: this.$t('gameconfig.message.gamecodenull'), trigger: 'blur'}
        ],
        gameCName: [
          {required: true, message: this.$t('gameconfig.message.gamecnamenull'), trigger: 'blur'}
        ],
        gameEName: [
          {required: true, message: this.$t('gameconfig.message.gameenamenull'), trigger: 'blur'}
        ],
        gameLine: [
          {required: true, message: this.$t('gameconfig.message.gamelinenull'), trigger: 'change'}
        ],
        imageUrl: [
          {required: true, message: this.$t('gameconfig.message.imageurlnull'), trigger: 'change'}
        ],
        gameStatus: [
          {required: true, message: this.$t('gameconfig.message.gamestatusnull'), trigger: 'change'}
        ],
        gameCategory: [
          {required: true, message: this.$t('gameconfig.message.gamecategorynull'), trigger: 'change'}
        ],
        gameTerminal: [
          {required: true, message: this.$t('gameconfig.message.gameterminalnull'), trigger: 'change'}
        ],
        openMode: [
          {required: true, message: this.$t('gameconfig.message.openmodenull'), trigger: 'change'}
        ],
        gameType: [
          {required: true, message: this.$t('gameconfig.message.gametypenull'), trigger: 'change'}
        ],
        recommendIndex: [
          {required: true, message: this.$t('gameconfig.message.recommendindexnull'), trigger: 'blur'}
        ],
        popularityIndex: [
          {required: true, message: this.$t('gameconfig.message.popularityindexnull'), trigger: 'blur'}
        ],
        jackpotFlag: [
          {required: true, message: this.$t('gameconfig.message.jackpotflagnull'), trigger: 'change'}
        ],
        recommendFlag: [
          {required: true, message: this.$t('gameconfig.message.recommendflagnull'), trigger: 'change'}
        ],
        popularFlag: [
          {required: true, message: this.$t('gameconfig.message.popularflagnull'), trigger: 'change'}
        ],
        trdFlag: [
          {required: true, message: this.$t('gameconfig.message.trdflagnull'), trigger: 'change'}
        ]
      }
    }
  },
  methods: {
    getList() {
      this.loading = true;
      gameConfig.queryPaging(this.filters).then((response) => {
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
      this.addForm.gameId = '';
      this.addForm.gameCode = '';
      this.addForm.gameCName = '';
      this.addForm.gameEName = '';
      this.addForm.gameLine = '';
      this.addForm.gameStatus = '';
      this.addForm.gameCategory = '';
      this.addForm.gameTerminal = '';
      this.addForm.gameType = [];
      this.addForm.gameStyle = '';
      this.addForm.gameTag = [];
      this.addForm.gameLanguage = '';
      this.addForm.gameSort = 0;
      this.addForm.recommendIndex = 1;
      this.addForm.popularityIndex = null;
      this.addForm.jackpotFlag = 'N';
      this.addForm.recommendFlag = 'N';
      this.addForm.popularFlag = 'N';
      this.addForm.trdFlag = 'N';
      this.addForm.description = '';
      this.addForm.imageUrl = '';
      this.addForm.showImageUrl = 'https://tg.shdunjiusy.com/cm/upload.jpg';
      this.addForm.progressShowStatus = false;
      this.addForm.fileId = 'addFile';
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
          gameConfig.batchDelete({'deleteList': data}).then((response) => {
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
    handleShelve() {
      this.batchUpdate('N', 'gameconfig.message.shelveprompt');
    },
    handleUnshelve() {
      this.batchUpdate('Y', 'gameconfig.message.unshelveprompt');
    },
    batchUpdate(deleteFlag, message) {
      this.$confirm(this.$t(message), this.$t('common.message.prompt'), {
        confirmButtonText: this.$t('common.button.confirm'),
        cancelButtonText: this.$t('common.button.cancel'),
        type: 'warning'
      }).then(() => {
        if (this.multipleSelection.length == 0) {
          this.$message({type: 'warning', message: this.$t('common.message.selectdata')});
        } else {
          let data = JSON.stringify(this.multipleSelection);
          gameConfig.batchShelves({'shelvesList': data, 'deleteFlag': deleteFlag}).then((response) => {
            if (response.data['code'] === '10000') {
              this.$message({message: this.$t('common.message.operatesuccess'), type: 'success'});
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
    gameTypeFormat(gameType) {
      let arr = [];
      if (this.gameTypeList && this.gameTypeList.length > 0) {
        var typeArr = gameType.split(",");
        for (var j = 0; j < typeArr.length; j++) {
          var type = typeArr[j];
          for (var i = 0, len = this.gameTypeList.length; i < len; i++) {
            if (type === this.gameTypeList[i].itemCode) {
              arr.push(this.gameTypeList[i].itemValue);
            }
          }
        }
      }
      return arr.join(",");
    },
    gameTagFormat(gameTag) {
      let arr = [];
      if (this.gameTagList && this.gameTagList.length > 0) {
        var tagArr = gameTag.split(",");
        for (var j = 0; j < tagArr.length; j++) {
          var tag = tagArr[j];
          for (var i = 0, len = this.gameTagList.length; i < len; i++) {
            if (tag === this.gameTagList[i].itemCode) {
              arr.push(this.gameTagList[i].itemValue);
            }
          }
        }
      }
      return arr.join(",");
    },
    handleEdit(index, row) {
      this.editForm.id = row.id;
      this.editForm.gameId = row.gameId;
      this.editForm.gameCode = row.gameCode;
      this.editForm.gameCName = row.gameCName;
      this.editForm.gameEName = row.gameEName;
      this.editForm.gameLine = row.gameLine;
      this.editForm.gameStatus = row.gameStatus;
      this.editForm.gameCategory = row.gameCategory;
      this.editForm.gameTerminal = row.gameTerminal;
      this.editForm.openMode = row.openMode;
      this.editForm.gameStyle = row.gameStyle;
      this.editForm.gameLanguage = row.gameLanguage;
      this.editForm.gameSort = row.gameSort;
      this.editForm.recommendIndex = row.recommendIndex;
      this.editForm.popularityIndex = row.popularityIndex;
      this.editForm.jackpotFlag = row.jackpotFlag;
      this.editForm.recommendFlag = row.recommendFlag;
      this.editForm.popularFlag = row.popularFlag;
      this.editForm.trdFlag = row.trdFlag;
      this.editForm.description = row.description;
      if (row.gameType) {
        this.editForm.gameType = row.gameType.split(",");
      }
      if (row.gameTag) {
        this.editForm.gameTag = row.gameTag.split(",");
      }
      this.editForm.imageUrl = row.imageUrl;
      this.editForm.showImageUrl = row.imageUrl;
      this.editForm.fileId = 'editFile';
      this.editForm.progressShowStatus = false;
      this.editFormVisible = true;
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
    handleAddSuccess() {
      if (this.addForm.gameCategory == '') {
        this.$message({message: this.$t('gameconfig.message.selectgamecategory'), type: 'warning'});
        return;
      }
      let file = this.$refs.addUpload.$el.querySelector('input');
      let formData = new FormData();
      formData.append('file', file.files[0]);
      formData.append("gameCategory", this.addForm.gameCategory);
      this.addForm.progressShowStatus = true;
      gameConfig.uploadImage(formData).then((response) => {
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
      if (this.editForm.gameCategory == '') {
        this.$message({message: this.$t('gameconfig.message.selectgamecategory'), type: 'warning'});
        return;
      }
      let file = this.$refs.editUpload.$el.querySelector('input');
      let formData = new FormData();
      formData.append('file', file.files[0]);
      formData.append("gameCategory", this.editForm.gameCategory);
      this.editForm.progressShowStatus = true;
      gameConfig.uploadImage(formData).then((response) => {
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
    importExcel() {
      let file = this.$refs.import.$el.querySelector('input');
      let fd = new FormData();
      fd.append("file", file.files[0]);
      this.btnloading = true;
      gameConfig.importExcel(fd).then((response) => {
        this.btnloading = false;
        if (response.data['code'] === '10000') {
          this.$message({message: this.$t('common.message.importsuccess'), type: 'success'});
          this.handleQuery();
        } else {
          let messageKey = this.global.getMessageKey(response.data['code']);
          this.$message({message: this.$t(messageKey), type: 'error'});
        }
      })
    },
    addSubmit() {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this.addForm.gameType = this.addForm.gameType.join(',');
          this.addForm.gameTag = this.addForm.gameTag.join(',');
          this.addLoading = true;
          gameConfig.insert(this.addForm).then((response) => {
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
          this.editForm.gameType = this.editForm.gameType.join(',');
          this.editForm.gameTag = this.editForm.gameTag.join(',');
          this.editLoading = true;
          gameConfig.update(this.editForm).then((response) => {
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
    getGameStatusList() {
      let formData = {"dictCode": "GAME_STATUS", "language": this.getI18nLocale()};
      dictionaryItem.queryList(formData).then((response) => {
        this.gameStatusList = response.data['data'];
      })
    },
    getGameCategoryList() {
      let formData = {"dictCode": "GAME_CATEGORY", "language": this.getI18nLocale(), "productCode": this.getProductCode()};
      dictionaryItem.queryList(formData).then((response) => {
        this.gameCategoryList = response.data['data'];
      })
    },
    getGameTerminalList() {
      let formData = {"dictCode": "GAME_TERMINAL", "language": this.getI18nLocale()};
      dictionaryItem.queryList(formData).then((response) => {
        this.gameTerminalList = response.data['data'];
      })
    },
    getGameTypeList() {
      let formData = {"dictCode": "GAME_TYPE", "language": this.getI18nLocale(), "productCode": this.getProductCode()};
      dictionaryItem.queryList(formData).then((response) => {
        this.gameTypeList = response.data['data'];
      })
    },
    getJackpotFlagList() {
      let formData = {"dictCode": "COMMON_YES_NO", "language": this.getI18nLocale()};
      dictionaryItem.queryList(formData).then((response) => {
        this.jackpotFlagList = response.data['data'];
      })
    },
    getRecommendFlagList() {
      let formData = {"dictCode": "COMMON_YES_NO", "language": this.getI18nLocale()};
      dictionaryItem.queryList(formData).then((response) => {
        this.recommendFlagList = response.data['data'];
      })
    },
    getPopularFlagList() {
      let formData = {"dictCode": "COMMON_YES_NO", "language": this.getI18nLocale()};
      dictionaryItem.queryList(formData).then((response) => {
        this.popularFlagList = response.data['data'];
      })
    },
    getDeleteFlagList() {
      let formData = {"dictCode": "GAME_DELETE_FLAG", "language": this.getI18nLocale()};
      dictionaryItem.queryList(formData).then((response) => {
        this.deleteFlagList = response.data['data'];
      })
    },
    getGameLineList() {
      let formData = {"dictCode": "GAME_LINE", "language": this.getI18nLocale(), "productCode": this.getProductCode()};
      dictionaryItem.queryList(formData).then((response) => {
        this.gameLineList = response.data['data'];
      })
    },
    getGameTagList() {
      let formData = {"dictCode": "GAME_TAG", "language": this.getI18nLocale(), "productCode": this.getProductCode()};
      dictionaryItem.queryList(formData).then((response) => {
        this.gameTagList = response.data['data'];
      })
    },
    getYNList() {
      let formData = {"dictCode": "COMMON_YES_NO", "language": this.getI18nLocale()};
      dictionaryItem.queryList(formData).then((response) => {
        this.ynList = response.data['data'];
      })
    },
    getRecommendIndexList() {
      let formData = {"dictCode": "GAME_RECOMMEND_INDEX", "language": this.getI18nLocale()};
      dictionaryItem.queryList(formData).then((response) => {
        let arr = response.data['data'];
        for (var i = 0, len = arr.length; i < len; i++) {
          this.recommendIndexList.push(arr[i].itemValue);
        }
      })
    },
    getGameStyleList() {
      let formData = {"dictCode": "GAME_STYLE", "language": this.getI18nLocale(), "productCode": this.getProductCode()};
      dictionaryItem.queryList(formData).then((response) => {
        this.gameStyleList = response.data['data'];
      })
    },
    getOpenModeList() {
      let formData = {"dictCode": "GAME_OPEN_MODE", "language": this.getI18nLocale()};
      dictionaryItem.queryList(formData).then((response) => {
        this.openModeList = response.data['data'];
      })
    }
  },
  created() {
    this.getGameStatusList();
    this.getGameCategoryList();
    this.getGameTerminalList();
    this.getGameTypeList();
    this.getJackpotFlagList();
    this.getRecommendFlagList();
    this.getPopularFlagList();
    this.getDeleteFlagList();
    this.getGameLineList();
    this.getGameTagList();
    this.getYNList();
    this.getRecommendIndexList();
    this.getGameStyleList();
    this.getOpenModeList();
  }
}
