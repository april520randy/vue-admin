import {operator, permission, userPermission} from 'api'

export default {
  data() {
    return {
      permission: {
        query: 'system.operator.query',
        reset: 'system.operator.reset',
        add: 'system.operator.add',
        edit: 'system.operator.edit',
        delete: 'system.operator.delete',
        assignpermissions: 'system.operator.assignpermissions'
      },
      filters: {
        language: this.getI18nLocale(),
        username: '',
        pageNum: 1,
        pageSize: 10
      },
      dataList: [],
      total: 0,
      loading: false,
      multipleSelection: [],
      addPermissionFormVisible: false,
      addPermissionLoading: false,
      treeNodeList: [],
      defaultChecked: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      userId: null
    }
  },
  methods: {
    getList() {
      this.loading = true;
      operator.queryPaging(this.filters).then((response) => {
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    dateFormatItem(row) {
      let date = row['lastLoginTime'];
      if (date == undefined) {
        return "";
      }
      return this.moment(date).format('YYYY-MM-DD HH:mm:ss');
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
    handleAddPermission(index, row) {
      this.userId = row.id;
      this.defaultChecked = [];
      permission.initUserPermission({'userId': this.userId}).then((response) => {
        this.treeNodeList = response.data['data']['treeNodeList'];
        let userNodeList = response.data['data']['userNodeList'];
        if (userNodeList && userNodeList.length > 0) {
          for (let i = 0, len = userNodeList.length; i < len; i++) {
            this.defaultChecked.push(userNodeList[i].permissionId);
          }
        }
        this.addPermissionFormVisible = true;
      })
    },
    addPermissionSubmit() {
      let arr = this.$refs.tree.getCheckedKeys();
      if (arr.length == 0) {
        this.$message({message: this.$t('common.message.selectdata'), type: 'warning'});
        return;
      }
      this.addPermissionLoading = true;
      let data = {};
      data.userId = this.userId;
      data.createList = [];
      for (let i = 0, len = arr.length; i < len; i++) {
        data.createList.push({'permissionId': arr[i]});
      }
      userPermission.insert(data).then((response) => {
        this.addPermissionLoading = false;
        if (response.data['code'] === '10000') {
          this.addPermissionFormVisible = false;
          this.$message({message: this.$t('common.message.addsuccess'), type: 'success'});
          this.handleQuery();
        } else {
          let messageKey = this.global.getMessageKey(response.data['code']);
          this.$message({message: this.$t(messageKey), type: 'error'});
        }
      })
    }
  }
}
