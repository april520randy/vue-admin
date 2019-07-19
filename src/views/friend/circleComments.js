import Upload from '@/components/Upload'
import Import from '@/components/Import'
import {dictionaryItem,fcircleComments} from 'api'

export default {
  components: {Upload, Import},
  data() {
    return {
      statusList: [],
      filters: {
        language: this.getI18nLocale(),
        id: '',
        fCircleId: '',
        userName: '',
        nickName: '',
        content: '',
        comments: '',
        createTime: '',
        theTime: '',
        endTime: '',
        status: '',
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
        fCircleId: '',
        userName: '',
        nickName: '',
        content: '',
        comments: '',
        createTime: '',
        status: '',
        progressShowStatus: false
      },
      addLoading: false,
      editFormVisible: false,
      editForm: {
        progressShowStatus: false
      },
      editLoading: false,
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
      fcircleComments.queryPaging(this.filters).then((response) => {
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
    handleAdd() {
      this.$nextTick(() => {
        this.$refs['addForm'].clearValidate();
      });
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
    //评论
    commentOpen(row) {
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
        this.addForm.fCircleId = row.fCircleId;
        this.addForm.userName = row.userName;
        this.addForm.publishUserId = row.publishUserId;
        this.addForm.nickName = row.nickName;
        this.addForm.content = row.content;
        this.addForm.comments = value;
        fcircleComments.insert(this.addForm).then((response) => {
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
    //状态扭转
    handleStatus(row, status) {
      let formData = {"id": row.id, "status": status};
      fcircleComments.update(formData).then((response) => {
        if (response.data['code'] === '10000') {
          this.$message({message: this.$t('common.message.operatesuccess'), type: 'success'});
          this.handleQuery();
        } else {
          let messageKey = this.global.getMessageKey(response.data['code']);
          this.$message({message: this.$t(messageKey), type: 'error'});
        }
      })
    },
    getStatusList() {
      let formData = {"dictCode": "COMMON_YES_NO", "language": this.getI18nLocale()};
      dictionaryItem.queryList(formData).then((response) => {
        this.statusList = response.data['data'];
      })
    }
  },
  created() {
    this.getStatusList();
  }
}
