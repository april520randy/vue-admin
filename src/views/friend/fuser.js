import Upload from '@/components/Upload'
import Import from '@/components/Import'
import {dictionaryItem,fuser} from 'api'

export default {
  components: {Upload, Import},
  data() {
    return {
      edList:[],
      userFollowList:[],
      type:'', //类型
      userId:'', //用户id
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
        gameId: '',
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
    getList() {
      this.loading = true;
      fuser.queryPaging(this.filters).then((response) => {
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
      this.show(this.userId,this.type,2);
    },
    handleCurrentChange1(val) {
      this.filters.pageNum = val;
      this.show(this.userId,this.type,2);
    },
    dateFormat(row, column) {
      let date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return this.moment(date).format('YYYY-MM-DD HH:mm:ss');
    },
    //启用禁用
    handleStatus(index, row, status) {
      let formData = {"id": row.id, "status": status};
      fuser.update(formData).then((response) => {
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
    show(userId,type,num) {
      //let formData = {"userId": userId,"type":type};
      this.filters.userId = userId;
      this.filters.type = type;
      //解决同一个页面 传递分页参数获取问题
      if(num == 1){
        this.filters.pageNum = 0;
        this.filters.pageSize = 10;
      }
      fuser.queryList(this.filters).then((response) => {
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
          fuser.update(this.editForm).then((response) => {
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
