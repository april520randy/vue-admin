import Upload from '@/components/Upload'
import Import from '@/components/Import'
import {dictionaryItem,freport} from 'api'

export default {
  components: {Upload, Import},
  data() {
    return {
      edList: [],
      filters: {
        language: this.getI18nLocale(),
        reportName: '',
        beReportName: '',
        fCircleId: '',
        beReportStatus:'',
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
      editFormVisible: false,
      editForm: {
        id:'',
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
      freport.queryPaging(this.filters).then((response) => {
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
    //启用禁用
    handleStatus(index, row, status) {
      let formData = {"id":row.id,"beReportName": row.beReportName, "beReportStatus": status};
      freport.update(formData).then((response) => {
        if (response.data['code'] === '10000') {
          this.$message({message: this.$t('common.message.operatesuccess'), type: 'success'});
          this.handleQuery();
        } else {
          let messageKey = this.global.getMessageKey(response.data['code']);
          this.$message({message: this.$t(messageKey), type: 'error'});
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
