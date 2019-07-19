<template>
  <div class="app-container">
    <el-container heigh="100%">
      <el-aside width="40%">
        <el-tree :expand-on-click-node="false" ref="permissionTree" :load="loadTree" node-key="id" :render-content="renderContent" :render-after-expand="true" :props="defaultProps" lazy show-checkbox @node-click="nodeClick"></el-tree>
      </el-aside>
      <el-container width="60%">
        <el-main>
          <el-form :model="addForm" :rules="formRules" ref="submitForm">
            <el-form-item prop="parentName" :label="$t('permission.label.parentname')" :label-width="addFormLabelWidth">
              <el-input v-model="addForm.parentName" style="width:450px" disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item prop="name" :label="$t('permission.label.name')" :label-width="addFormLabelWidth">
              <el-input v-model="addForm.name" style="width:450px"></el-input>
            </el-form-item>
            <el-form-item prop="title" :label="$t('permission.label.title')" :label-width="addFormLabelWidth">
              <el-input v-model="addForm.title" style="width:450px"></el-input>
            </el-form-item>
            <el-form-item prop="type" :label="$t('permission.label.type')" :label-width="addFormLabelWidth">
              <el-radio v-model="addForm.type" v-for="item in typeList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-radio>
            </el-form-item>
            <el-form-item prop="permissionCode" :label="$t('permission.label.permissioncode')" :label-width="addFormLabelWidth">
              <el-input v-model="addForm.permissionCode" style="width:450px"></el-input>
            </el-form-item>
            <el-form-item prop="path" :label="$t('permission.label.path')" :label-width="addFormLabelWidth">
              <el-input v-model="addForm.path" style="width:450px"></el-input>
            </el-form-item>
            <el-form-item prop="iconCls" :label="$t('permission.label.iconcls')" :label-width="addFormLabelWidth">
              <el-input v-model="addForm.iconCls" style="width:450px"></el-input>
            </el-form-item>
            <el-form-item prop="show" :label="$t('permission.label.show')" :label-width="addFormLabelWidth">
              <el-radio v-model="addForm.show" v-for="item in showList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-radio>
            </el-form-item>
            <el-form-item prop="itemSort" :label="$t('permission.label.itemsort')" :label-width="addFormLabelWidth">
              <el-input v-model="addForm.itemSort" style="width:450px"></el-input>
            </el-form-item>
            <el-form-item prop="component" :label="$t('permission.label.component')" :label-width="addFormLabelWidth">
              <el-input v-model="addForm.component" style="width:450px"></el-input>
            </el-form-item>
          </el-form>
          <div class="dialog-footer" style="text-align:center">
            <el-button @click="handleReset" v-permission="permission.reset">{{$t('common.button.reset')}}</el-button>
            <el-button type="primary" @click.native="submit()" :loading="submitLoading" v-permission="permission.submit">{{$t('common.button.submit')}}</el-button>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>

  import PermissionManagementJS from './PermissionManagement.js'

  export default PermissionManagementJS
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-container .el-aside {
    color: #333;
    text-align: center;
    height: 650px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    background-color: #ffffff;
    line-height: 10px;
    text-align: inherit;
    background-color: floralwhite;
  }

  .el-tree /deep/ .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 20px;
  }

  .el-tree /deep/ .el-tree-node__content {
    padding: 1px;
    border: 1px solid #ddd;
    margin-bottom: -1px;
    height: 40px;
  }

  .el-tree /deep/ .el-tree-node__children {
    margin-bottom: 0px;
  }
</style>
