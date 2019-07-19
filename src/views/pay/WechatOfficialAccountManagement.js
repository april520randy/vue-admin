import ProductSelect from '@/components/ProductSelect'
import {dictionaryItem, wechatOfficialAccount} from 'api'

export default {
  components: {ProductSelect},
  data() {
    return {
      edList: [],
      channelTypeList: [],
      filters: {
        language: this.getI18nLocale(),
        merchantCode: '',
        useable: '',
        channelType: '',
        productCode: '',
        pageNum: 1,
        pageSize: 10
      },
      dataList: [],
      loading: false,
      total: 0,
      formLabelWidth: '130px',
      addFormVisible: false,
      addForm: {
        payName: '',
        merchantCode: '',
        merchantSecret: '',
        notifyUrl: '',
        mallUrl: '',
        middUrl: '',
        apiUrl: '',
        maximumAmount: null,
        channelType: '',
        remain: '',
        remark: '',
        productCode: ''
      },
      addLoading: false,
      editFormVisible: false,
      editForm: {
        id: null,
        payName: '',
        merchantCode: '',
        notifyUrl: '',
        mallUrl: '',
        middUrl: '',
        apiUrl: '',
        maximumAmount: null,
        channelType: '',
        remark: '',
        productCode: ''
      },
      editLoading: false,
      formRules: {
        payName: [
          {required: true, message: this.$t('wechatofficialaccount.message.paynamenull'), trigger: 'blur'}
        ],
        merchantCode: [
          {required: true, message: this.$t('wechatofficialaccount.message.merchantcodenull'), trigger: 'blur'}
        ],
        merchantSecret: [
          {required: true, message: this.$t('wechatofficialaccount.message.merchantsecretnull'), trigger: 'blur'}
        ],
        notifyUrl: [
          {required: true, message: this.$t('wechatofficialaccount.message.notifyurlnull'), trigger: 'blur'}
        ],
        mallUrl: [
          {required: true, message: this.$t('wechatofficialaccount.message.mallurlnull'), trigger: 'blur'}
        ],
        middUrl: [
          {required: true, message: this.$t('wechatofficialaccount.message.middurlnull'), trigger: 'blur'}
        ],
        apiUrl: [
          {required: true, message: this.$t('wechatofficialaccount.message.apiurlnull'), trigger: 'blur'}
        ],
        maximumAmount: [
          {required: true, message: this.$t('wechatofficialaccount.message.maximumamountnull'), trigger: 'blur'}
        ],
        channelType: [
          {required: true, message: this.$t('wechatofficialaccount.message.channeltypenull'), trigger: 'blur'}
        ],
        productCode: [
          {required: true, message: this.$t('wechatofficialaccount.message.productcodenull'), trigger: 'change'}
        ]
      }
    }
  },
  methods: {
    getList() {
      this.loading = true;
      wechatOfficialAccount.queryPaging(this.filters).then((response) => {
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
      this.addForm.payName = '';
      this.addForm.merchantCode = '';
      this.addForm.merchantSecret = '';
      this.addForm.notifyUrl = '';
      this.addForm.mallUrl = '';
      this.addForm.middUrl = '';
      this.addForm.apiUrl = '';
      this.addForm.maximumAmount = null;
      this.addForm.accumulatedAmount = null;
      this.addForm.channelType = '';
      this.addForm.remain = '';
      this.addForm.remark = '';
      this.addForm.productCode = '';
      this.addFormVisible = true;
      this.$nextTick(() => {
        this.$refs['addForm'].clearValidate();
      });
    },
    dateFormatItem(row) {
      let date = row['createTime'];
      if (date == undefined) {
        return "";
      }
      return this.moment(date).format('YYYY-MM-DD HH:mm:ss');
    },
    handleStatus(index, row, useable) {
      let formData = {"id": row.id, "useable": useable};
      wechatOfficialAccount.update(formData).then((response) => {
        if (response.data['code'] === '10000') {
          this.$message({message: this.$t('common.message.operatesuccess'), type: 'success'});
          this.handleQuery();
        } else {
          let messageKey = this.global.getMessageKey(response.data['code']);
          this.$message({message: this.$t(messageKey), type: 'error'});
        }
      })
    },
    handleEdit(index, row) {
      this.editForm.id = row.id;
      this.editForm.payName = row.payName;
      this.editForm.merchantCode = row.merchantCode;
      this.editForm.notifyUrl = row.notifyUrl;
      this.editForm.mallUrl = row.mallUrl;
      this.editForm.middUrl = row.middUrl;
      this.editForm.apiUrl = row.apiUrl;
      this.editForm.maximumAmount = row.maximumAmount;
      this.editForm.channelType = row.channelType;
      this.editForm.remark = row.remark;
      this.editForm.productCode = row.productCode;
      this.editFormVisible = true;
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
          wechatOfficialAccount.insert(this.addForm).then((response) => {
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
          wechatOfficialAccount.update(this.editForm).then((response) => {
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
    getChannelTypeList() {
      let formData = {"dictCode": "COMMON_CHANNEL_TYPE", "language": this.getI18nLocale()};
      dictionaryItem.queryList(formData).then((response) => {
        this.channelTypeList = response.data['data'];
      })
    }
  },
  created() {
    this.getEDList();
    this.getChannelTypeList();
  }
}
