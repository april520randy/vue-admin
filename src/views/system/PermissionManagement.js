import {dictionaryItem, permission} from 'api'

export default {
  data() {
    return {
      permission: {
        submit: 'system.permission.submit',
        reset: 'system.permission.reset'
      },
      permissionData: {},
      typeList: [],
      showList: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      addForm: {
        parentId: null,
        parentName: '',
        name: '',
        title: '',
        type: '',
        permissionCode: '',
        path: '',
        iconCls: '',
        show: '',
        itemSort: 0,
        component: ''
      },
      addFormLabelWidth: "120px",
      submitLoading: false,
      buttonFlag: false,
      formRules: {
        name: [
          {required: true, message: this.$t('permission.message.namenull'), trigger: 'blur'}
        ],
        type: [
          {required: true, message: this.$t('permission.message.typenull'), trigger: 'blur'}
        ],
        show: [
          {required: true, message: this.$t('permission.message.shownull'), trigger: 'blur'}
        ],
        itemSort: [
          {required: true, message: this.$t('permission.message.itemsortnull'), trigger: 'blur'},
          {pattern: /(^[0-9]*$)/, message: this.$t('permission.message.itemsortnumber'), trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    loadTree(node, resolve) {
      if (node.level == 0) {
        let data = {parentId: -1};
        this.initTreeData(data, resolve);
      } else {
        let data = {parentId: node.data.id};
        this.initTreeData(data, resolve);
      }
    },
    initTreeData(data, resolve) {
      permission.getByParentId(data).then((response) => {
        if (response.data['code'] === "10000") {
          return resolve(response.data['data']);
        } else {
          let messageKey = this.global.getMessageKey(response.data['code']);
          this.$message({message: this.$t(messageKey), type: 'error'});
        }
      });
    },
    renderContent(h, {node, data, store}) {
      return typeof h === "function" ? (<span class="custom-tree-node"><span>{node.label}</span><span><el-button size="mini" type="primary" v-permission="system.permission.add" on-click={ () => this.append(data) }>Append</el-button><el-button size="mini" type="primary" v-permission="system.permission.delete" on-click={ () => this.remove(node, data) }>Delete</el-button></span></span>) : "";
    },
    append(data) {
      this.buttonFlag = true;
      this.handleReset();
      this.addForm.parentId = data.id;
    },
    remove(node, data) {
      let parentJson = {parentId: data.id};
      permission.getByParentId(parentJson).then((response) => {
        if (response.data['code'] === "10000") {
          let dataList = response.data['data'];
          if (dataList.length > 0) {
            this.$message({message: this.$t('permission.message.nodenotdel'), type: 'error'});
          } else {
            this.$confirm(this.$t('common.message.deleteprompt'), this.$t('common.message.prompt'), {
              confirmButtonText: this.$t('common.button.confirm'),
              cancelButtonText: this.$t('common.button.cancel'),
              type: 'warning'
            }).then(() => {
              let json = {id: data.id};
              permission.del(json).then((response) => {
                if (response.data['code'] === "10000") {
                  this.$message({message: this.$t('common.message.deletesuccess'), type: 'success'});
                  node.parent != null ? node.parent.expanded = false : "";
                  node.parent != null ? node.parent.loaded = false : "";
                  this.handleReset();
                } else {
                  let messageKey = this.global.getMessageKey(response.data['code']);
                  this.$message({message: this.$t(messageKey), type: 'error'});
                }
              })
            }).catch(() => {

            });
          }
        } else {
          let messageKey = this.global.getMessageKey(response.data['code']);
          this.$message({message: this.$t(messageKey), type: 'error'});
        }
      })
    },
    nodeClick(data, node, el) {
      if (!this.buttonFlag) {
        Object.assign(this.addForm, data);
      }
      if (this.buttonFlag) {
        this.addForm.parentName = data.name;
      } else {
        if (node.parent.data != null) {
          this.addForm.parentName = node.parent.data.name;
        } else {
          this.addForm.parentName = data.name;
        }
      }
      this.buttonFlag = false;
      this.permissionData = data;
    },
    handleReset() {
      let addForm = this.addForm;
      Object.keys(addForm).forEach(function (key) {
        if (key === "itemSort") {
          addForm[key] = 0;
        } else {
          addForm[key] = null;
        }
      });
    },
    submit() {
      this.$refs['submitForm'].validate((valid) => {
        if (valid) {
          let node = this.$refs['permissionTree'].getNode(this.permissionData);
          let addForm = this.addForm;
          addForm.children = null;
          if (addForm.id === null || addForm.id === '' || addForm.id === undefined) {
            permission.insert(addForm).then((response) => {
              if (response.data['code'] === "10000") {
                this.$message({message: this.$t('common.message.addsuccess'), type: 'success'});
                if (node.expanded === true && node.childNodes.length <= 0) {
                  node.parent.expanded = false;
                  node.parent.loaded = false;
                } else {
                  node.expanded = false;
                  node.loaded = false;
                }
                this.handleReset();
              } else {
                let messageKey = this.global.getMessageKey(response.data['code']);
                this.$message({message: this.$t(messageKey), type: 'error'});
              }
            });
          } else {
            permission.update(addForm).then((response) => {
              if (response.data['code'] === "10000") {
                this.$message({message: this.$t('common.message.editsuccess'), type: 'success'});
                node.parent.expanded = false;
                node.parent.loaded = false;
                this.handleReset();
              } else {
                let messageKey = this.global.getMessageKey(response.data['code']);
                this.$message({message: this.$t(messageKey), type: 'error'});
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    getTypeList() {
      let formData = {"dictCode": "PERMISSION_TYPE", "language": this.getI18nLocale()};
      dictionaryItem.queryList(formData).then((response) => {
        this.typeList = response.data['data'];
      })
    },
    getShowList() {
      let formData = {"dictCode": "COMMON_YES_NO", "language": this.getI18nLocale()};
      dictionaryItem.queryList(formData).then((response) => {
        this.showList = response.data['data'];
      })
    }
  },
  created() {
    this.getTypeList();
    this.getShowList();
  }
}
