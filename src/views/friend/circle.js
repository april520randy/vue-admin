import Upload from '@/components/Upload'
import Import from '@/components/Import'
import {dictionaryItem, fcircle,fcircleComments} from 'api'

export default {
  components: {Upload, Import},
  data() {
    return {
      statusList: [0,1],
      ynList:[],
      commentsList: [],
      fCircleId:'', //帖子id
      rowId:'',
      headUrl:'', //头像
      imageList:[], //图片地址
      videoList:[], //视频地址
      content:'',//内容
      _dom:"",
      playStatus:'',
      muteStatus:'',
      isMute:true,
      isPlay:false,
      filters: {
        language: this.getI18nLocale(),
        id: '',
        userName: '',
        nickName: '',
        createTime: '',
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
        progressShowStatus: false
      },
      addLoading: false,

      editFormVisible: false,
      editForm: {
        progressShowStatus: false
      },
      editLoading: false,

      //评论列表
      listForm1Visible: false,
      listForm1: {
        gameId: '',
        progressShowStatus: false
      },
      list1Loading: false,
      formRules: {
        gameId: [
          {required: true, message: this.$t('gameconfig.message.gameidnull'), trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    playClick(){
      this.isPlay = !this.isPlay;
      this.playStatus= 'autoplay';
    },
    closeSoundClick(){
      this.isMute = !this.isMute;
      if(this.isMute){
        this.muteStatus = '';
      }else{
        this.muteStatus = 'muted';
      }
    },
    getList() {
      this.loading = true;
      fcircle.queryPaging(this.filters).then((response) => {
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
    getByCircleDetailed(row, expandedRows){
      let formData = {"id": row.id};
      fcircle.getByCircleDetailedVo(formData).then((response) => {
        this.loading = false;
        if (response.data['code'] === '10000') {
          console.info(response.data['data']);
          var data = response.data['data'];
          this.imageList = data.imgList;
          this.headUrl = data.headUrl;
          this.videoList = data.videoList;
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
    handleShelve() {
      this.batchUpdate('N', 'gameconfig.message.shelveprompt');
    },
    handleUnshelve() {
      this.batchUpdate('Y', 'gameconfig.message.unshelveprompt');
    },
    dateFormat(row, column) {
      let date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return this.moment(date).format('YYYY-MM-DD HH:mm:ss');
    },
    handleEdit(index, row) {
      let rows = document.getElementById("table").rows;
      if(rows== undefined && rows!== null){
        for(var i=1;i<rows.length;i++){
          (function(i){
            let temp=rows[i].cells[0].childNodes[1].value;
            let obj=rows[i];
            obj.ondblclick=function(){alert(temp);};
          })(i)

        }
      }
      let formData = {"id": row.id};
      let data  ;
      fcircle.getByCircleDetailedVo(formData).then((response) => {
        if (response.data['code'] === '10000') {
          data = response.data['data'];
          console.info(data);
          this.headUrl = data.headUrl;
          this.imageList = data.imgList;
          this.videoList = data.videoList;
          this.playClick();
        } else {
          let messageKey = this.global.getMessageKey(response.data['code']);
          this.$message({message: this.$t(messageKey), type: 'error'});
        }
      })
      this.editForm.nickName = row.nickName;
      this.editForm.content = row.content;
      this.editForm.status = row.status;
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

    //状态扭转
    handleStatus(type, row, status) {
      let formData;
      if(type == 1){
        formData = {"id": row.id, "status": status};
      }else if(type == 2){
        formData = {"id": row.id, "circleSort": status};
      }else if(type == 3){
        formData = {"id": row.id, "bright": status};
      }else if(type == 4){
        formData = {"id": row.id, "hot": status};
      }
      fcircle.update(formData).then((response) => {
        if (response.data['code'] === '10000') {
          this.$message({message: this.$t('common.message.operatesuccess'), type: 'success'});
          this.handleQuery();
        } else {
          let messageKey = this.global.getMessageKey(response.data['code']);
          this.$message({message: this.$t(messageKey), type: 'error'});
        }
      })
    },
    //评论
    commentOpen1(row,type) {
      this.$prompt('请输入评论内容', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^.{1,150}$/,
        inputErrorMessage: '评论内容不正确请重新输入!'
      }).then(({value}) => {
        this.$message({
          type: 'success',
          message: '您的评论内容是: ' + value
        });
        //如果为1表示在朋友圈列表评论 如果为2表示在评论列表评论
        //注意业务代码
        if(type==1){
          this.rowId = row.id;
        }else{
          this.rowId = row.fCircleId;
        }
        let formData = {
          "fCircleId": this.rowId,
          "userName": row.userName,
          "publishUserId": row.userId,
          "nickName": row.nickName,
          "content": row.content,
          "comments": value
        };
        fcircleComments.insert(formData).then((response) => {
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    },

    //帖子评论列表
    commentList(id,type) {
      if(type == 1){
        this.filters.pageNum = 0;
        this.filters.pageSize = 10;
      }
      this.filters.fCircleId = id;
      fcircleComments.queryPaging(this.filters).then((response) => {
        this.commentsList = response.data['data'].list;
        this.total1 = response.data['data'].total;
      });
      this.fCircleId = id;
      this.listForm1Visible = true;
    },
    //评论列表状态扭转
    commenthandleStatus(row, status) {
        let formData = {"id": row.id, "status": status};
        fcircleComments.update(formData).then((response) => {
        if (response.data['code'] === '10000') {
          this.$message({message: this.$t('common.message.operatesuccess'), type: 'success'});
          this.commentList(this.fCircleId,2);
        } else {
          let messageKey = this.global.getMessageKey(response.data['code']);
          this.$message({message: this.$t(messageKey), type: 'error'});
        }
      })
    },
    handleSelectionChange1(val) {
      this.multipleSelection = val;
    },
    handleSizeChange1(val) {
      this.filters.pageSize = val;
      this.commentList(this.fCircleId,2);
    },
    handleCurrentChange1(val) {
      this.filters.pageNum = val;
      this.commentList(this.fCircleId,2);
    },
    getStatusList() {
        let formData = {"dictCode": "FRIEND_YES_NO", "language": this.getI18nLocale()};
        dictionaryItem.queryList(formData).then((response) => {
          this.statusList = response.data['data'];
        })
    },
    getYNList() {
      let formData = {"dictCode": "FRIEND_YES_NO", "language": this.getI18nLocale()};
      dictionaryItem.queryList(formData).then((response) => {
        this.ynList = response.data['data'];
      })
    },
  },
  created() {
    this.getStatusList();
    this.getYNList();
  }
}
