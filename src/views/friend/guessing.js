import Upload from '@/components/Upload'
import Import from '@/components/Import'
import {dictionaryItem,guessing,fgameSetting} from 'api'

export default {
  components: {Upload, Import},
  data() {
    return {
      edList:[],
      guessingList:[],
      type:'', //类型
      userId:'', //用户id
      imageUrl:'',
      imageUrla:'',
      imageUrlb:'',
      type:'',
      filters: {
        language: this.getI18nLocale(),
        id: '',
        userName: '',
        nickName: '',
        content: '',
        type:'', //类型
        userId:'', //用户id
        theTime:'',
        endTime:'',
        pageNum: 1,
        pageSize: 10
      },
      dataList: [],
      total: 0,
      total1: 0,
      btnloading: false,
      loading: false,
      multipleSelection: [],
      formLabelWidth: '100px',
      addFormVisible: false,
      addForm: {
        theme: '',
        content: '',
        optiona: '',
        optionb: '',
        oddsa: '',
        oddsb: '',
        urla: '',
        urlb: '',
        beginTime: '',
        endTime: '',
        type: '',
        fileId: '',
        progressShowStatus: false
      },
      addLoading: false,
      editFormVisible: false,
      editForm: {
        id: null,
        gameId: '',
        popularFlag: '',
        progressShowStatus: false
      },
      editLoading: false,
      //粉丝列表，关注列表
      listFormVisible: false,
      listForm: {
        gameId: '',
        fileId: '',
        progressShowStatus: false
      },
      listLoading: false,

      formRules: {
        gameId: [
          {required: true, message: this.$t('gameconfig.message.gameidnull'), trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
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
          guessing.batchDelete({'deleteList': data}).then((response) => {
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

    handleAvatarSuccess(res,file){

      if(this.type =='1'){
        this.imageUrla = URL.createObjectURL(file.raw);
      }else if(this.type =='2'){
        this.imageUrlb = URL.createObjectURL(file.raw);
      }else{
        this.imageUrl = URL.createObjectURL(file.raw);
      }
      let formData = new FormData();
      formData.append('file', file.raw);
      this.addForm.progressShowStatus = true;
      fgameSetting.uploadImage(formData).then((response) => {
        this.addForm.progressShowStatus = false;
        if (response.data['code'] === '10000') {
          if(this.type =='1'){
            this.addForm.urla = response.data['data']['absolutePath'];
          }else if(this.type =='2'){
            this.addForm.urlb = response.data['data']['absolutePath'];
          }else{
            this.addForm.url = response.data['data']['absolutePath'];
          }
        } else {
          let messageKey = this.global.getMessageKey(response.data['code']);
          this.$message({message: this.$t(messageKey), type: 'error'});
        }
      })
    },

    beforeAvatarUpload(type,file) {
      console.info(type);
      this.type = type;
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    getList() {
      this.loading = true;
      guessing.queryPaging(this.filters).then((response) => {
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
      this.filters.theTime="";
      this.filters.endTime="";
    },
    handleEdit(index, row) {
      this.editForm.id = row.id;
      this.editFormVisible = true;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSelectionChange1(val) {
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

    handleSizeChange1(val) {
      this.filters.pageSize = val;
      this.show(this.userId,this.type);
    },
    handleCurrentChange1(val) {
      this.filters.pageNum = val;
      this.show(this.userId,this.type);
    },
    dateFormat(row, column) {
      let date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return this.moment(date).format('YYYY-MM-DD HH:mm:ss');
    },
    handleAdd() {
      this.addForm.id = '';
      this.addForm.id = '';
      this.addForm.id = '';
      this.addForm.id = '';
      this.addForm.id = '';
      this.addForm.id = '';
      this.addForm.id = '';
      this.addForm.id = '';
      this.addForm.id = '';
      this.addForm.id = '';


      this.addFormVisible = true;
      this.$nextTick(() => {
        //this.$refs['addForm'].clearValidate();
      });
    },
    addSubmit() {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this.addLoading = true;
          guessing.insert(this.addForm).then((response) => {
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
    //启用禁用
    handleStatus(index, row, status) {
      let formData = {"id": row.id, "onOff": status};
      guessing.update(formData).then((response) => {
        if (response.data['code'] === '10000') {
          this.$message({message: this.$t('common.message.operatesuccess'), type: 'success'});
          this.handleQuery();
        } else {
          let messageKey = this.global.getMessageKey(response.data['code']);
          this.$message({message: this.$t(messageKey), type: 'error'});
        }
      })
    },
    //注意定义属性
    show(userId,type) {
      //let formData = {"userId": userId,"type":type};
      this.filters.userId = userId;
      this.filters.type = type;
      guessing.queryList(this.filters).then((response) => {
        this.userFollowList = response.data['data'].list;
        this.total1 = response.data['data'].total;
      });
      this.userId = userId;
      this.type = type;
      this.listFormVisible = true;
    },
    editSubmit() {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          this.editLoading = true;
          guessing.update(this.editForm).then((response) => {
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
    getEDList() {
      let formData = {"dictCode": "COMMON_ENABLED_DISABLED", "language": this.getI18nLocale()};
      dictionaryItem.queryList(formData).then((response) => {
        this.edList = response.data['data'];
      })
    }
  },
  created() {
    this.getEDList();
  }
}
