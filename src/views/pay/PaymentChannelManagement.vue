<template>
  <div class="app-container">
    <section>
      <!--条件搜索区-->
      <el-col class="toolbar" style="padding-bottom: 0px;">
        <el-form :model="filters" ref="filters" :inline="true">
          <!--支付类型-->
          <el-form-item prop="paymentType" :label="$t('paymentchannel.label.paymenttype')">
            <el-select v-model="filters.paymentType" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in paymentTypeList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <!--所属产品-->
          <el-form-item prop="productCode" :label="$t('paymentchannel.label.productname')">
            <el-select v-model="filters.productCode" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in productList" :label="item.name" :value="item.code" :key="item.name"></el-option>
            </el-select>
          </el-form-item>
          <!--是否启用-->
          <el-form-item prop="useable" :label="$t('paymentchannel.label.useable')">
            <el-select v-model="filters.useable" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in useableList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <!--搜索和重置按钮-->
          <el-form-item>
            <el-button type="primary" @click="handleQuery">{{$t('common.button.query')}}</el-button>
            <el-button @click="handleReset">{{$t('common.button.reset')}}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <!--Grid按钮新增和删除-->
      <el-col class="toolbar" style="padding-bottom: 0px;">
        <el-form>
          <!--新增和删除按钮-->
          <el-form-item>
            <el-button type="primary" @click="showDialog('add')">{{$t('common.button.add')}}</el-button>
            <el-button type="danger" @click="handleBatchDelete">{{$t('common.button.delete')}}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <!--Grid-->
      <el-table :data="gridDataList" border stripe fit highlight-current-row v-loading="gridLoading" :element-loading-text="$t('common.label.inthequery')" @selection-change="handleSelectionChange" style="width: 100%;">
        <el-table-column type="selection" width="30"></el-table-column>
        <!--产品名称-->
        <el-table-column align="center" prop="productCode" :label="$t('paymentchannel.label.productname')">
          <template slot-scope="scope">
            <span style="font-weight: bold;">{{scope.row.productName}}</span>
          </template>
        </el-table-column>
        <!--付款类型-->
        <el-table-column align="center" prop="paymentType" :label="$t('paymentchannel.label.paymenttype')" width="80">
          <template slot-scope="scope">
            <span style="font-weight: bold;">{{scope.row.paymentTypeLabel}}</span>
          </template>
        </el-table-column>
        <!--付款等级-->
        <el-table-column align="center" prop="paymentLevel" :label="$t('paymentchannel.label.paymentlevel')"></el-table-column>
        <!--最小付款金额-->
        <el-table-column align="center" prop="minPaymentAmount" :label="$t('paymentchannel.label.minpaymentamount')"></el-table-column>
        <!--最大付款金额-->
        <el-table-column align="center" prop="maxPaymentAmount" :label="$t('paymentchannel.label.maxpaymentamount')"></el-table-column>
        <!--备注-->
        <el-table-column align="center" :showOverflowTooltip="true"  prop="remark" :label="$t('paymentchannel.label.remark')"></el-table-column>
        <!--启用状态-->
        <el-table-column align="center" prop="useable" :label="$t('paymentchannel.label.useable')" width="80">
          <template slot-scope="scope" :center="true">
            <span v-if="scope.row.useable==='N'" style="color: #fd5757;font-weight: bold;">{{scope.row.useableLabel}}</span>
            <span v-if="scope.row.useable==='Y'" style="color: #3e8f3e;font-weight: bold;">{{scope.row.useableLabel}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="updateTime" :label="$t('paymentchannel.label.updatetime')" :formatter="dateFormat" width="180"></el-table-column>
        <el-table-column align="center" prop="updateUser" :label="$t('paymentchannel.label.updateuser')"></el-table-column>
        <!--操作-->
        <el-table-column :label="$t('common.label.operate')" width="150">
          <template slot-scope="scope">
            <el-button size="mini" @click="showDialog('update',scope.$index,scope.row)">{{$t('common.button.edit')}}</el-button>
            <el-button v-if="scope.row.useable==='N'" size="mini" @click="handleStatus(scope.$index,scope.row,'Y')">{{$t('common.button.enabled')}}</el-button>
            <el-button v-if="scope.row.useable==='Y'" size="mini" type="danger" @click="handleStatus(scope.$index,scope.row,'N')">{{$t('common.button.disabled')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--新增编辑弹出dialog-->
      <el-dialog :center="true" id="paymentChannelDialog" :title="$t('paymentchannel.label.edittitle')" :visible.sync="addEditDialog" :close-on-click-modal="false">
        <el-form :model="submitForm" ref="submitForm" id="submitForm" :rules="formRules">
          <!--产品下拉-->
          <el-form-item prop="productCode" :label="$t('paymentchannel.label.productname')" :label-width="formLabelWidth">
            <el-select v-model="submitForm.productCode" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in productList" :label="item.name" :value="item.code" :key="item.code"></el-option>
            </el-select>
          </el-form-item>
          <!--付款类型-->
          <el-form-item prop="paymentType" :label="$t('paymentchannel.label.paymenttype')" :label-width="formLabelWidth">
            <el-select v-model="submitForm.paymentType" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in paymentTypeList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <!--最小付款金额-->
          <el-form-item prop="minPaymentAmount" :label="$t('paymentchannel.label.minpaymentamount')" :label-width="formLabelWidth">
            <el-input v-model="submitForm.minPaymentAmount" class="paymentAmount"></el-input>
          </el-form-item>
          <!--最大付款金额-->
          <el-form-item prop="maxPaymentAmount" :label="$t('paymentchannel.label.maxpaymentamount')" :label-width="formLabelWidth">
            <el-input v-model="submitForm.maxPaymentAmount" class="paymentAmount"></el-input>
          </el-form-item>
          <!--是否可用-->
          <el-form-item prop="useable" :label="$t('paymentchannel.label.useable')" :label-width="formLabelWidth">
            <el-radio v-model="submitForm.useable" v-for="item in useableList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-radio>
          </el-form-item>
          <!--支付等级-->
          <el-form-item prop="paymentLevel" :label="$t('paymentchannel.label.paymentlevel')" :label-width="formLabelWidth">
            <el-checkbox-group v-model="submitForm.paymentLevel">
              <el-checkbox v-for="item in paymentLevelList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <!--备注-->
          <el-form-item prop="remark" :label="$t('paymentchannel.label.remark')" :label-width="formLabelWidth">
            <el-input v-model="submitForm.remark"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addEditDialog=false">{{$t('common.button.cancel')}}</el-button>
          <el-button type="primary" @click.native="handInsertOrUpdatePaymentChannel" :loading="submitLoading">{{$t('common.button.submit')}}</el-button>
        </div>
      </el-dialog>
      <el-col class="toolbar">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="filters.pageNum" :page-size="filters.pageSize" :page-sizes="[10,20,30,40,50,100,200,300,400,500]" :total="total" layout="total,sizes,prev,pager,next,jumper" style="float: right;"></el-pagination>
      </el-col>
    </section>
  </div>
</template>

<script>
  import PaymentChannelManagementJS from './PaymentChannelManagement.js'
  export default PaymentChannelManagementJS;
</script>

<style lang="scss" rel="stylesheet/scss">
  #paymentChannelDialog .paymentAmount > input {
    width : 29% !important
  }
  #paymentChannelDialog #submitForm .el-form-item__content{
    margin-left: 110px !important
  }
  #paymentChannelDialog #submitForm .el-form-item__label{
    width: 110px !important
  }
</style>
