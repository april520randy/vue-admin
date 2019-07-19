<template>
  <div class="app-container">
    <el-container>
      <el-aside width="240px">
        <!--转出账户树-->
        <el-tree :load="loadNodeTransferOut" id="transferOutNode" ref="transferOutNode" node-key="id" :props="defaultProps"  lazy show-checkbox @check-change="handleOutNodeChange" @node-click="handleOutNodeClick"></el-tree>
        <!--转入账户树-->
        <el-tree :load="loadNodeTransferIn" id="transferInNode"  ref="transferInNode" node-key="id" :props="defaultProps"  lazy show-checkbox @check-change="handleInNodeChange" @node-click="handleInNodeClick"></el-tree>
      </el-aside>
      <el-container>
        <el-main>
          <el-form :model="submitData" :inline="true" :rules="formRules" ref="submitForm">
            <!--转出-->
            <el-form-item prop="transferOutAccount" :label="$t('bankTransfer.label.transferOut')" >
              <el-input v-model="submitData.transferOutAccount" style="width:450px" disabled="disabled"></el-input>
            </el-form-item>
            <!--转入-->
            <el-form-item prop="transferInAccount" :label="$t('bankTransfer.label.transferIn')">
              <el-input v-model="submitData.transferInAccount" style="width:450px" disabled="disabled"></el-input>
            </el-form-item>
            <!--转账方式-->
            <el-form-item prop="transferType" :label="$t('bankTransfer.label.transferType')" style="width: 100%;text-align: left;" :label-width="inputWidth">
              <el-radio v-model="submitData.transferType" v-for="item in transferTypeList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-radio>
            </el-form-item>
            <!--转出金额-->
            <el-form-item prop="transferAmount" :label="$t('bankTransfer.label.transferAmount')" style="width: 100%;text-align: left;" :label-width="inputWidth">
              <el-input v-model="submitData.transferAmount" style="width:450px"></el-input>
            </el-form-item>
            <!--手续费-->
            <el-form-item prop="transferFee" :label="$t('bankTransfer.label.transferFee')" style="width: 100%;text-align: left;" :label-width="inputWidth">
              <el-input v-model="submitData.transferFee" style="width:450px"></el-input>
            </el-form-item>
            <!--转出数量-->
            <el-form-item prop="transferQuantity" :label="$t('bankTransfer.label.transferQuantity')" style="width: 100%;text-align: left;" :label-width="inputWidth">
              <el-input v-model="submitData.transferQuantity" style="width:450px"></el-input>
            </el-form-item>
            <!--备注-->
            <el-form-item prop="transferRemark" :label="$t('bankTransfer.label.transferRemark')" style="width: 100%;text-align: left;" :label-width="inputWidth">
              <el-input type="textarea" :rows="3" v-model="submitData.transferRemark" style="width:450px"></el-input>
            </el-form-item>
          </el-form>
          <div class="dialog-footer" style="text-align: left;margin-left:40%">
            <el-button @click="handleReset">{{$t('common.button.reset')}}</el-button>
            <el-button type="primary" @click.native="submit()" id="ddd" :loading="submitLoading">{{$t('common.button.submit')}}</el-button>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import BankTransferJS from './BankTransfer.js'
    export default BankTransferJS;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  /*.app-container /deep/ .el-header, .el-footer {*/
    /*background-color: #B3C0D1;*/
    /*color: #333;*/
    /*text-align: center;*/
    /*line-height: 60px;*/
  /*}*/

  .app-container /deep/ .el-aside {
    color: #333;
    text-align: center;
    height:650px;
  }

  .app-container  /deep/ .el-main {
    line-height : 10px;
    text-align: inherit;
    background-color: floralwhite;
  }


  .app-container /deep/ .el-main .el-input.is-disabled .el-input__inner{
    background-color : floralwhite;
    border-color : floralwhite;
    color : #000000;
    cursor : default;
  }
  .el-tree /deep/  .el-tree-node__content{
    padding: 1px;
    border: 1px solid #ddd;
    margin-bottom: -1px;
  }

  .app-container /deep/ .treeBackgroundColor {
    background-color: #428bca;
  }
  .app-container /deep/ .treeFontColor{
    color: #ffffff;
  }

  .app-container /deep/ #transferOutNode .el-checkbox__inner{
    cursor:default !important;
  }

  .app-container /deep/ #transferInNode .el-checkbox__inner{
    cursor:default !important;
  }

  /*.el-form--inline .el-form-item__label{*/
    /*float: left*/
  /*}*/


  .app-container /deep/ .el-main:first-child{
    text-align: center !important;
  }
  .app-container /deep/ .el-main:nth-child(2){
    text-align: center !important;
  }
</style>
