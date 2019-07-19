<template>
  <div class="app-container">
    <section>
      <el-col class="toolbar" style="padding-bottom: 0px;">
        <el-form :model="filters" ref="filters" :inline="true">
          <el-form-item prop="username" :label="$t('operator.label.username')">
            <el-input v-model="filters.username"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery" v-permission="permission.query">{{$t('common.button.query')}}</el-button>
            <el-button @click="handleReset" v-permission="permission.reset">{{$t('common.button.reset')}}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-table :data="dataList" border stripe fit highlight-current-row v-loading="loading" :element-loading-text="$t('common.label.inthequery')" @selection-change="handleSelectionChange" style="width: 100%;">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" class="demo-table-expand">
              <el-form-item :label="$t('operator.label.logintimes')">
                <span>{{props.row.loginTimes}}</span>
              </el-form-item>
              <el-form-item :label="$t('operator.label.lastloginip')">
                <span>{{props.row.lastLoginIp}}</span>
              </el-form-item>
              <el-form-item :label="$t('operator.label.lastlogintime')">
                <span>{{dateFormatItem(props.row)}}</span>
              </el-form-item>
              <el-form-item :label="$t('operator.label.validtype')">
                <span>{{props.row.validTypeLabel}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="username" :label="$t('operator.label.username')"></el-table-column>
        <el-table-column :label="$t('operator.label.status')">
          <template slot-scope="scope">
            <span v-if="scope.row.status==='N'" style="color: red;">{{scope.row.statusLabel}}</span>
            <span v-if="scope.row.status==='Y'" style="color: blue;">{{scope.row.statusLabel}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="phoneNumber" :label="$t('operator.label.phonenumber')"></el-table-column>
        <el-table-column prop="employeeId" :label="$t('operator.label.employeeid')"></el-table-column>
        <el-table-column prop="productName" :label="$t('common.label.product')"></el-table-column>
        <el-table-column prop="createTime" :label="$t('common.label.createtime')" :formatter="dateFormat" width="180"></el-table-column>
        <el-table-column prop="createUser" :label="$t('common.label.createuser')"></el-table-column>
        <el-table-column :label="$t('common.label.operate')" width="100">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleAddPermission(scope.$index, scope.row)" v-permission="permission.assignpermissions">{{$t('common.button.assignpermissions')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col class="toolbar">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="filters.pageNum" :page-size="filters.pageSize" :page-sizes="[10,20,30,40,50,100,200,300,400,500]" :total="total" layout="total,sizes,prev,pager,next,jumper" style="float: right;"></el-pagination>
      </el-col>
      <el-dialog :title="$t('common.label.assignpermissions')" :visible.sync="addPermissionFormVisible" :close-on-click-modal="false" size="tiny">
        <el-tree :data="treeNodeList" show-checkbox default-expand-all check-strictly node-key="id" ref="tree" highlight-current :default-checked-keys="defaultChecked" :props="defaultProps"></el-tree>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addPermissionFormVisible=false" v-permission="permission.assignpermissions">{{$t('common.button.cancel')}}</el-button>
          <el-button type="primary" @click.native="addPermissionSubmit" :loading="addPermissionLoading" v-permission="permission.assignpermissions">{{$t('common.button.submit')}}</el-button>
        </div>
      </el-dialog>
    </section>
  </div>
</template>

<script>

  import OperatorManagementJS from './OperatorManagement.js'

  export default OperatorManagementJS
</script>
