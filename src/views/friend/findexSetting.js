
import Upload from '@/components/Upload'
import Import from '@/components/Import'
import {dictionaryItem,findexSetting,fgameSetting} from 'api'


export default {
  components: {Upload, Import},
  data() {
    return {
      msg: '',
      myConfig: {
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 340,
        // 初始容器宽度
        initialFrameWidth: '100%',
        UEDITOR_HOME_URL: '/static/UEditor/'
      },
      edList: [],
      typeList: [],
      imgUrlList:[],//标题图片存储
      indexTypeList: [],
      filters: {
        language: this.getI18nLocale(),
        id:'',
        flag: '',
        indexType: '',
        indexSort: '',
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
        type: '',
        content: '',
        publish: '',
        indexSort:'',
        flag:'',
        title:'',
        indexType:'',
        videoUrl:'',
        publishTime:'',
        failureTime:'',
        progressShowStatus: false
      },
      addLoading: false,
      editFormVisible: false,
      editForm: {
        id:'',
        type: '',
        content: '',
        publish: '',
        title: '',
        indexSort:'',
        flag:'',
        indexType:'',
        videoUrl:'',
        // imgUrlList:'',
        publishTime:'',
        failureTime:'',
        progressShowStatus: false
      },
      editLoading: false,
      formRules: {
        type: [
          {required: true, message: this.$t('findexSetting.message.typenull'), trigger: 'blur'}
        ],
        flag: [
          {required: true, message: this.$t('findexSetting.message.flagnull'), trigger: 'change'}
        ],
        title: [
          {required: true, message: this.$t('findexSetting.message.titlenull'), trigger: 'blur'}
        ],
        indexType: [
          {required: true, message: this.$t('findexSetting.message.indextypenull'), trigger: 'change'}
        ],
        indexSort: [
          {required: true, message: this.$t('findexSetting.message.indexsortnull'), trigger: 'blur'}
        ],
        publishTime: [
          {required: true, message: this.$t('findexSetting.message.publishtimenull'), trigger: 'blur'}
        ],
        failureTime: [
          {required: true, message: this.$t('findexSetting.message.failuretimenull'), trigger: 'change'}
        ]
      }
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    //
    handleAvatarSuccess(file){
      let formData = new FormData();
      formData.append('file', file.raw);
      this.addForm.progressShowStatus = true;
      fgameSetting.uploadImage(formData).then((response) => {
        this.addForm.progressShowStatus = false;
        if (response.data['code'] === '10000') {
            this.addForm.imgUrl =   response.data['data']['absolutePath']+","+this.addForm.imgUrl;
            alert("图片："+file.name+"上传成功");
            this.editForm.imgUrlList = "";
        } else {
          let messageKey = this.global.getMessageKey(response.data['code']);
          this.$message({message: this.$t(messageKey), type: 'error'});
        }
      })
    },
    handleEditSuccess(file){
      let formData = new FormData();
      formData.append('file', file.raw);
      this.addForm.progressShowStatus = true;
      fgameSetting.uploadImage(formData).then((response) => {
        this.addForm.progressShowStatus = false;
        if (response.data['code'] === '10000') {
          if(this.editForm.imgUrl != null && this.editForm.imgUrl !=""){
            this.editForm.imgUrl = this.editForm.imgUrl + response.data['data']['absolutePath']+",";
          }else{
            this.editForm.imgUrl =response.data['data']['absolutePath'];
          }
          alert("图片："+file.name+"上传成功");
        } else {
          let messageKey = this.global.getMessageKey(response.data['code']);
          this.$message({message: this.$t(messageKey), type: 'error'});
        }
      })
    },

    getList() {
      this.loading = true;
      findexSetting.queryPaging(this.filters).then((response) => {
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
      this.editForm.type = row.type+"";
      this.editForm.content = row.content;
      this.editForm.publish = row.publish;
      this.editForm.indexSort = row.indexSort;
      this.editForm.flag = row.flag;
      this.editForm.indexType = row.indexType+"";
      this.editForm.publishTime = row.publishTime;
      this.editForm.failureTime = row.failureTime;
      this.editForm.showImageUrl = row.imgUrl;
      this.editForm.videoUrl= row.videoUrl;
      this.editForm.imgUrl = "";
      this.editForm.title = row.title;
      this.editFormVisible = true;
      this.imgUrlList = row.imgUrlList;
      this.msg = row.content;
    },
    handleAdd() {
      this.addForm.id = "";
      this.addForm.type = "";
      this.addForm.content = "";
      this.addForm.publish = "";
      this.addForm.indexSort = "";
      this.addForm.flag = "";
      this.addForm.indexType = "";
      this.addForm.publishTime = "";
      this.addForm.failureTime = "";
      this.addForm.imgUrl = "";
      this.addForm.showImageUrl="";
      this.imgUrlList = "";
      this.addForm.videoUrl="";
      this.addForm.title = "";
      this.msg = "";
      this.addFormVisible = true;
      this.$nextTick(() => {
        this.$refs['addForm'].clearValidate();
      });
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
          console.info(11);
          var content = this.msg;
          console.info(content)
          this.addForm.content = content;
          this.addLoading = true;
          findexSetting.insert(this.addForm).then((response) => {
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
          var content = this.msg;
          this.editForm.content = content;
          findexSetting.update(this.editForm).then((response) => {
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
    },
    getTypeList() {
      let formData = {"dictCode": "FRIEND_INDEX_SETTING", "language": this.getI18nLocale()};
      dictionaryItem.queryList(formData).then((response) => {
        this.typeList = response.data['data'];
      })
    },
    getIndexTypeList() {
      let formData = {"dictCode": "FRIEND_INDEX_TYPE", "language": this.getI18nLocale()};
      dictionaryItem.queryList(formData).then((response) => {
        this.indexTypeList = response.data['data'];
      })
    }
    ,ready (editorInstance) {
      console.log(`编辑器实例${editorInstance.key}: `, editorInstance)
    }
  },
  created() {
    var ue = UE.getEditor('editor',{
      initialFrameWidth:"100%",   //初始化宽度
      initialFrameHeight:400,     //初始化高度
    });
    this.getEDList();
    this.getTypeList();
    this.getIndexTypeList();
  },

}
