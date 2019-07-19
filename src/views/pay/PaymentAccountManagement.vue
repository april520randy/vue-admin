<template>
  <div class="app-container">
    <section>
      <!--条件搜索区-->
      <el-col class="toolbar" style="padding-bottom: 0px;">
        <el-form :model="filters" ref="filters" :inline="true">
          <!--产品下拉-->
          <el-form-item prop="productCode" :label="$t('paymentaccount.label.productname')">
            <el-select v-model="filters.productCode" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in productList" :label="item.name" :value="item.code" :key="item.code"></el-option>
            </el-select>
          </el-form-item>
          <!--银行卡名称-->
          <el-form-item prop="bankName" :label="$t('paymentaccount.label.bankname')">
            <el-input v-model="filters.bankName"></el-input>
          </el-form-item>
          <!--银行卡卡号-->
          <el-form-item prop="bankCard" :label="$t('paymentaccount.label.bankcard')">
            <el-input v-model="filters.bankCard"></el-input>
          </el-form-item>
          <!--用户名-->
          <el-form-item prop="accountName" :label="$t('paymentaccount.label.accountname')">
            <el-input v-model="filters.accountName"></el-input>
          </el-form-item>
          <!--是否启用-->
          <el-form-item prop="useable" :label="$t('paymentaccount.label.useablestatus')">
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
      <el-table :data="dataList" border stripe fit highlight-current-row v-loading="loading" :element-loading-text="$t('common.label.inthequery')" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="30"></el-table-column>
        <!--产品名称-->
        <el-table-column align="center" prop="productCode" :label="$t('paymentaccount.label.productname')" width="120">
          <template slot-scope="scope">
            <span style="font-weight: bold;">{{scope.row.productName}}</span>
          </template>
        </el-table-column>
        <!--银行名称-->
        <el-table-column align="center" prop="bankName" :label="$t('paymentaccount.label.bankname')"></el-table-column>
        <!--银行卡号-->
        <el-table-column align="center" prop="bankPrimaryNo" :label="$t('paymentaccount.label.bankprimaryno')" width="180" :formatter="formatBankCar"></el-table-column>
        <!--银行卡号-->
        <el-table-column align="center" prop="bankSecondaryNo" :label="$t('paymentaccount.label.banksecondaryno')" width="180" :formatter="formatBankCar"></el-table-column>
        <!--用户名-->
        <el-table-column align="center" prop="accountName" :label="$t('paymentaccount.label.accountname')" width="150px"></el-table-column>
        <!--账户类型-->
        <el-table-column align="center" prop="accountTypeLabel" :label="$t('paymentaccount.label.accounttype')"></el-table-column>
        <!--银行类型-->
        <el-table-column align="center" prop="bankTypeLabel" :label="$t('paymentaccount.label.banktype')"></el-table-column>
        <!--付款类型-->
        <el-table-column align="center" prop="paymentType" :label="$t('paymentaccount.label.paymenttype')" width="80">
          <template slot-scope="scope">
            <span style="font-weight: bold;">{{scope.row.paymentTypeLabel}}</span>
          </template>
        </el-table-column>
        <!--启用状态-->
        <el-table-column align="center" prop="useable" :label="$t('paymentaccount.label.useablestatus')" width="80">
          <template slot-scope="scope" :center="true">
            <span v-if="scope.row.useable==='N'" style="color: #fd5757;font-weight: bold;">{{scope.row.useableLabel}}</span>
            <span v-if="scope.row.useable==='Y'" style="color: #3e8f3e;font-weight: bold;">{{scope.row.useableLabel}}</span>
          </template>
        </el-table-column>
        <!--成功笔数-->
        <el-table-column align="center" prop="transactionNumber" :label="$t('paymentaccount.label.transactionnumber')" width="110"></el-table-column>
        <!--本地额度-->
        <el-table-column align="center" prop="localQuota" :label="$t('paymentaccount.label.localquota')"></el-table-column>
        <!--实际额度-->
        <el-table-column align="center" prop="actualQuota" :label="$t('paymentaccount.label.actualquota')"></el-table-column>
        <!--备注-->
        <el-table-column :showOverflowTooltip="true" align="center" prop="remark" :label="$t('paymentaccount.label.remark')" width="120"></el-table-column>
        <el-table-column align="center" prop="updateTime" :label="$t('paymentaccount.label.updatetime')" :formatter="dateFormat" width="180"></el-table-column>
        <el-table-column align="center" prop="updateUser" :label="$t('paymentaccount.label.updateuser')"></el-table-column>
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
      <el-dialog :center="true" :title="$t('paymentaccount.label.edittitle')" :visible.sync="addFormVisible" :close-on-click-modal="false">
        <el-form :model="addForm" ref="addForm" id="addForm" :rules="formRules">
          <!--产品下拉-->
          <el-form-item prop="productCode" :label="$t('paymentaccount.label.productcode')" :label-width="formLabelWidth">
            <el-select v-model="addForm.productCode" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in productList" :label="item.name" :value="item.code" :key="item.code"></el-option>
            </el-select>
          </el-form-item>
          <!--银行下拉-->
          <el-form-item prop="bankCode" :label="$t('paymentaccount.label.bankname')" :label-width="formLabelWidth">
            <el-select v-model="addForm.bankCode" clearable :placeholder="$t('common.label.choose')" @change="changeBankInfo">
              <el-option v-for="item in bankInfoList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <!--银行主卡号-->
          <el-form-item prop="bankPrimaryNo" :label="$t('paymentaccount.label.bankprimaryno')" :label-width="formLabelWidth">
            <el-input v-model="addForm.bankPrimaryNo"></el-input>
          </el-form-item>
          <!--银行副卡号-->
          <el-form-item prop="bankSecondaryNo" :label="$t('paymentaccount.label.banksecondaryno')" :label-width="formLabelWidth">
            <el-input v-model="addForm.bankSecondaryNo"></el-input>
          </el-form-item>
          <!--用户名-->
          <el-form-item prop="accountName" :label="$t('paymentaccount.label.accountname')" :label-width="formLabelWidth">
            <el-input v-model="addForm.accountName"></el-input>
          </el-form-item>
          <!--付款类型-->
          <el-form-item prop="paymentType" :label="$t('paymentaccount.label.paymenttype')" :label-width="formLabelWidth">
            <el-select v-model="addForm.paymentType" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in paymentTypeList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <!--账户类型-->
          <el-form-item prop="accountType" :label="$t('paymentaccount.label.accounttype')" :label-width="formLabelWidth">
            <el-select v-model="addForm.accountType" clearable :placeholder="$t('common.label.choose')" @change="changeAccountType">
              <el-option v-for="item in accountTypeList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <!--银行类型 根据账户类型变更-->
          <el-form-item prop="bankType" :label="$t('paymentaccount.label.banktype')" :label-width="formLabelWidth">
            <el-select v-model="addForm.bankType" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in bankTypeList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <!--是否可用-->
          <el-form-item prop="useable" :label="$t('paymentaccount.label.useablestatus')" :label-width="formLabelWidth">
            <el-radio v-model="addForm.useable" v-for="item in useableList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-radio>
          </el-form-item>
          <!--备注-->
          <el-form-item prop="remark" :label="$t('paymentaccount.label.remark')" :label-width="formLabelWidth">
            <el-input v-model="addForm.remark"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible=false">{{$t('common.button.cancel')}}</el-button>
          <el-button type="primary" @click.native="insertOrUpdatePaymentAccount" :loading="submitLoading">{{$t('common.button.submit')}}</el-button>
        </div>
      </el-dialog>
      <el-col class="toolbar">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="filters.pageNum" :page-size="filters.pageSize" :page-sizes="[10,20,30,40,50,100,200,300,400,500]" :total="total" layout="total,sizes,prev,pager,next,jumper" style="float: right;"></el-pagination>
      </el-col>
    </section>
  </div>
</template>

<script>
  import PaymentAccountManagementJS from './PaymentAccountManagement.js';
  export default PaymentAccountManagementJS
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  /*.paymentAmount{*/
    /*width:50%;*/
  /*}*/
  /*.add_input{*/
    /*width:100%*/
  /*}*/
  /*#addForm .el-form-item{*/
    /*width:100%*/
  /*}*/
</style>
