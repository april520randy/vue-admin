import {dictionaryItem,paymentAccount,bankTransferProposal} from "api"

export default {
  data(){
    return {
      defaultProps: {
        children: [],
        label: 'itemValue',
        isLeaf: 'leaf'
      },
      accountTypeList : [],
      selectInternalAccountList : [], //内部账户选中集合
      selectExternalAccountList : [], //外部账户选中集合
      transferTypeList : [],
      submitData : {
        transferOutAccount : '',
        transferOutAccountId : "",
        transferInAccount : '',
        transferInAccountId : "",
        transferType : "1",
        transferAmount : "0",
        transferFee : "0",
        transferQuantity : "1",
        transferRemark : ""
      },
      inputWidth: "30%",
      submitLoading : false,
      formRules : {
        // transferOutAccount : [
        //   {required : true , message : this.$t('bankTransfer.message.transferOutNull'), trigger: 'blur'}
        // ],
        transferInAccount : [
          {required : true , message : this.$t('bankTransfer.message.transferInNull'), trigger: 'blur'}
        ],
        transferType : [
          {required : true , message : this.$t('bankTransfer.message.transferTypeNull'), trigger: 'blur'}
        ],
        transferAmount : [
          {required : true , message : this.$t('bankTransfer.message.transferAmountNull'), trigger: 'blur'},
          { pattern: /^(([1-9]\d*)|\d)(\.\d{1,2})?$/ , message : this.$t('bankTransfer.message.transferAmountError'), trigger: 'blur'}
        ],
        transferFee : [
          {required : true , message : this.$t('bankTransfer.message.transferFeeNull'), trigger: 'blur'},
          { pattern: /^(([1-9]\d*)|\d)(\.\d{1,2})?$/ , message : this.$t('bankTransfer.message.transferFeeError'), trigger: 'blur'}
        ],
        transferQuantity : [
          {required : true , message : this.$t('bankTransfer.message.transferQuantityNull'), trigger: 'blur'},
          { pattern: /(^[0-9]*$)/ , message : this.$t('bankTransfer.message.transferQuantityError'), trigger: 'blur'}
        ]
      }
    }
  },
  methods:{
    submit(){
      this.$refs['submitForm'].validate((valid) => {
        if(valid){
          this.submitLoading = true;
          bankTransferProposal.insertBankTransferProposal(this.submitData).then((response) => {
            this.submitLoading = false;
            if (response.data['code'] === '10000') {
              this.$message({message: this.$t('common.message.addsuccess'), type: 'success'});
              this.handleReset();
            }else{
              let messageKey = this.global.getMessageKey(response.data['code']);
              this.$message({message: response.data["message"], type: 'error'});
            }
          });
        }else{
          return false;
        }
      })
    },
    handleReset(){
      this.submitData = {
        transferOutAccount : '',
        transferOutAccountId : "",
        transferInAccount : '',
        transferInAccountId : '',
        transferType : "1",
        transferAmount : "0",
        transferFee : "0",
        transferQuantity : "1",
        transferRemark : ""
      }
      let transferOutNode = this.$refs.transferOutNode;
      let transferInNode = this.$refs.transferInNode;
      transferOutNode.setCheckedNodes(transferOutNode.getCheckedKeys() ,false);
      transferInNode.setCheckedNodes(transferInNode.getCheckedKeys() ,false);
    },
    /**
     * 初始化转出账户
     * @param node
     * @param resolve
     * @returns {*}
     */
    loadNodeTransferOut(node, resolve){
      if(node.level  === 0){
        return resolve([{"itemValue":"转出账户","id":"1","disabled" : true}]);
      }
      this.initNodeData(node , resolve);
      return resolve([]);

    },

    /**
     * 初始化转入账户
     * @param node
     * @param resolve
     * @returns {*}
     */
    loadNodeTransferIn(node, resolve){
      if(node.level  === 0){
        return resolve([{"itemValue":"转入账户","id":"2","disabled" : true}])
      }
      this.initNodeData(node,resolve);
      return resolve([]);

    },
    /**
     * 转出账户点击事件
     * @param data
     * @param node
     * @param el
     */
    handleOutNodeClick(data,node,el){
      this.handleClass(this.$refs["transferOutNode"] , data.id , node);
      // node.setChecked(data.id,true,true,true)
      // if(node.level === 3){
      //   if(node.checked === true){
      //     node.checked = false;
      //   }else{
      //     node.checked = true;
      //   }
      // }
      // let nodes = [];
      // if(node.level === 1){
      //   nodes = el.$el.parentElement.parentElement.children;
      //   for(let i = 0;i < nodes.length;i ++){
      //     nodes[i].firstElementChild.firstElementChild.style.backgroundColor = "";
      //     nodes[i].firstElementChild.firstElementChild.lastElementChild.style.color = "";
      //   }
      // }else if(node.level === 2){
      //   nodes = el.$el.parentElement.children;
      //   for(let i = 0;i < nodes.length;i ++){
      //     nodes[i].firstElementChild.style.backgroundColor = "";
      //     nodes[i].firstElementChild.lastElementChild.style.color = "";
      //   }
      // }
      //
      // if(el.$el.firstElementChild.style.backgroundColor === ""){
      //   el.$el.firstElementChild.style.backgroundColor = "#428bca";
      //   el.$el.firstElementChild.lastElementChild.style.color = "#ffffff";
      // }else{
      //   el.$el.firstElementChild.style.backgroundColor = "";
      //   el.$el.firstElementChild.lastElementChild.style.color = "";
      // }
    },
    /**
     * 转入账户点击事件
     * @param data
     * @param node
     * @param el
     */
    handleInNodeClick(data,node,el){
      this.handleClass(this.$refs["transferInNode"] , data.id , node);
    },
    /**
     * 点击节点触发
     * @param el
     * @param key
     * @param node
     */
    handleClass(el , key , node){
      if(node.level === 4){
        if(node.checked === true){
          el.setChecked(key , false);
        }else{
          el.setCheckedKeys([]);
          el.setChecked(key , true);
        }
      }
    },

    /**
     * 转出账户更新事件
     * @param data
     * @param select
     * @param chiSelect
     */
    handleOutNodeChange(data , select , chiSelect){
      this.handleChange(data,select,chiSelect,this.$refs["transferOutNode"] , 'out');
    },
    /**
     * 转入账户更新事件
     * @param data
     * @param select
     * @param chiSelect
     */
    handleInNodeChange(data , select , chiSelect){
      this.handleChange(data,select,chiSelect,this.$refs["transferInNode"] , 'in');
    },
    /**
     * 节点选中触发
     * @param data
     * @param select
     * @param chiSelect
     * @param el
     */
    handleChange(data , select , chiSelect , el , type){
      let node = el.getNode(data.id);
      if(node){
        if(node.level === 1 || node.level === 2 || node.level === 3) return;
        if(node.level === 4 && chiSelect === false){
          if(select === true){
            el.setCheckedKeys([]);
            el.setChecked(data.id , true);
            if(type === "out"){
              this.submitData.transferOutAccount = data.remark;
              this.submitData.transferOutAccountId = data.id;
            }else{
              this.submitData.transferInAccount = data.remark;
              this.submitData.transferInAccountId = data.id;
            }

          }else{
            if(type === "out"){
              this.submitData.transferOutAccount = "";
              this.submitData.transferOutAccountId = "";
            }else{
              this.submitData.transferInAccount = "";
              this.submitData.transferInAccountId = "";
            }
          }
        }
      }
    },
    /**
     * 初始化节点数据
     * @param node
     * @param resolve
     * @returns {*}
     */
    initNodeData(node,resolve){
      //点开第一层
      if(node.level === 1) {
        let formData = {"dictCode": "ACCOUNT_TYPE", "language": this.getI18nLocale()};
        dictionaryItem.queryList(formData).then((response) => {
          if(response.data['code']==="10000"){
            let data = response.data['data'];
            if (node.level === 1) {
              if(data.length > 0){
                data.forEach(function(item, i){
                  item.disabled = true;
                });
                return resolve(data);
              }
            }
          }else{
            let messageKey = this.global.getMessageKey(response.data['code']);
            this.$message({message: this.$t(messageKey), type: 'error'});
          }
        })
      }else  if(node.level === 2){ //点开第二层
        let formData = {"parentDictCode": node.data.dictCode, "parentItemCode" : node.data.itemCode, "language": this.getI18nLocale()};
        dictionaryItem.queryDictionarySubItemList(formData).then((response) => {
          if(response.data['code']==="10000"){
            let data = response.data['data'];
            return resolve(data);
          }else{
            let messageKey = this.global.getMessageKey(response.data['code']);
            this.$message({message: this.$t(messageKey), type: 'error'});
          }
        })
      }else if(node.level === 3){ //第三层
        let jsonData = {
          accountType : node.parent.data.itemCode,
          bankType : node.data.itemCode
        };
        paymentAccount.getPaymentAccountListByAccountName(jsonData).then((response) => {
          if(response.data['code']==="10000") {
            let data = response.data['data'];
            if(data.length > 0){
              data.forEach(function(item , i){
                item.itemValue = item.remark;
                item.leaf = true;
              })
            }
            return resolve(data);
          }else{
            let messageKey = this.global.getMessageKey(response.data['code']);
            this.$message({message: this.$t(messageKey), type: 'error'});
          }
        });
        return resolve([]);
      }else{
        return resolve([]);
      }
    },

    /**
     * 初始化转账类型
     */
    initTransferTypeList(){
      let formData = {"dictCode": "TRANSFER_TYPE", "language": this.getI18nLocale()};
      dictionaryItem.queryList(formData).then((response) => {
        if (response.data['code'] === '10000') {
          this.transferTypeList = response.data['data'];
        }else{
          let messageKey = this.global.getMessageKey(response.data['code']);
          this.$message({message: this.$t(messageKey), type: 'error'});
        }
      })
    }


  },
  created(){
    this.initTransferTypeList();
  }
}
