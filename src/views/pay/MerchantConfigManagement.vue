<template>
  <div class="app-container">
    <section>
      <el-col class="toolbar parent" style="padding-bottom: 0px;">
        <el-form :model="filters" ref="filters" :inline="true">
          <el-form-item prop="merchantCode" :label="$t('merchantconfig.label.merchantcode')">
            <el-input v-model="filters.merchantCode"></el-input>
          </el-form-item>
          <el-form-item prop="merchantName" :label="$t('merchantconfig.label.merchantname')">
            <el-input v-model="filters.merchantName"></el-input>
          </el-form-item>
          <el-form-item prop="payWay" :label="$t('merchantconfig.label.payway')">
            <el-select v-model="filters.payWay" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in payWayList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="useType" :label="$t('merchantconfig.label.usetype')">
            <el-select v-model="filters.useType" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in useTypeList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="paySwitch" :label="$t('merchantconfig.label.payswitch')">
            <el-select v-model="filters.paySwitch" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in paySwitchList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="useable" :label="$t('merchantconfig.label.useable')">
            <el-select v-model="filters.useable" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in useableList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="lockFlag" :label="$t('merchantconfig.label.lockflag')">
            <el-select v-model="filters.lockFlag" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in lockFlagList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="productCode" :label="$t('common.label.product')">
            <product-select :item="filters"></product-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery" v-permission="permission.query">{{$t('common.button.query')}}</el-button>
            <el-button @click="handleReset" v-permission="permission.reset">{{$t('common.button.reset')}}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col class="toolbar" style="padding-bottom: 0px;">
        <el-form>
          <el-form-item>
            <el-button type="primary" @click="handleOpen" v-permission="permission.open">{{$t('common.button.open')}}</el-button>
            <el-button type="danger" @click="handleClose" v-permission="permission.close">{{$t('common.button.close')}}</el-button>
            <el-button type="primary" @click="handleEnabled" v-permission="permission.enabled">{{$t('common.button.enabled')}}</el-button>
            <el-button type="danger" @click="handleDisabled" v-permission="permission.disabled">{{$t('common.button.disabled')}}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-table @sort-change="sortChange" :data="dataList" border stripe fit highlight-current-row v-loading="loading" :element-loading-text="$t('common.label.inthequery')" @selection-change="handleSelectionChange" style="width: 100%;">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item :label="$t('merchantconfig.label.fixedamount')">
                <span>{{props.row.fixedAmount}}</span>
              </el-form-item>
              <el-form-item :label="$t('merchantconfig.label.recommendamount')">
                <span>{{props.row.recommendAmount}}</span>
              </el-form-item>
              <el-form-item :label="$t('merchantconfig.label.showname')">
                <span>{{props.row.showName}}</span>
              </el-form-item>
              <el-form-item :label="$t('merchantconfig.label.remark')">
                <span>{{props.row.remark}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column fixed="right" :label="$t('merchantconfig.label.merchantname')" min-width="170">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>{{$t('merchantconfig.label.merchantcode')}}：{{scope.row.merchantCode}}</p>
              <p>{{$t('merchantconfig.label.payplatform')}}：{{scope.row.payPlatform}}</p>
              <p>{{$t('merchantconfig.label.levels')}}：{{levelsFormat(scope.row)}}</p>
              <p>{{$t('merchantconfig.label.creditgrade')}}：{{creditGradeFormat(scope.row)}}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{scope.row.merchantName}}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column sortable="custom" prop="fee" :label="$t('merchantconfig.label.fee')" min-width="130">
          <template slot-scope="scope">
            <span>{{scope.row.fee}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable="custom" prop="pc_fee" :label="$t('merchantconfig.label.pcfee')" min-width="140">
          <template slot-scope="scope">
            <span>{{scope.row.pcFee}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable="custom" prop="phone_fee" :label="$t('merchantconfig.label.phonefee')" min-width="140">
          <template slot-scope="scope">
            <span>{{scope.row.phoneFee}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable="custom" prop="min_pay" :label="$t('merchantconfig.label.minpay')" min-width="130">
          <template slot-scope="scope">
            <span>{{scope.row.minPay}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable="custom" prop="max_pay" :label="$t('merchantconfig.label.maxpay')" min-width="130">
          <template slot-scope="scope">
            <span>{{scope.row.maxPay}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="registerTime" :label="$t('merchantconfig.label.registertime')" :formatter="dateFormat" width="180"></el-table-column>
        <el-table-column prop="registerMonth" :label="$t('merchantconfig.label.registermonth')"></el-table-column>
        <el-table-column sortable="custom" prop="cut_amount" :label="$t('merchantconfig.label.cutamount')" min-width="115">
          <template slot-scope="scope">
            <span>{{scope.row.cutAmount}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable="custom" prop="issued_amount" :label="$t('merchantconfig.label.issuedamount')" min-width="115">
          <template slot-scope="scope">
            <span>{{scope.row.issuedAmount}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable="custom" prop="total_amount" :label="$t('merchantconfig.label.totalamount')" min-width="130">
          <template slot-scope="scope">
            <span>{{scope.row.totalAmount}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable="custom" prop="surplus_amount" :label="$t('merchantconfig.label.surplusamount')" min-width="130">
          <template slot-scope="scope">
            <span>{{scope.row.surplusAmount}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="payWayLabel" :label="$t('merchantconfig.label.payway')" min-width="90"></el-table-column>
        <el-table-column prop="useTypeLabel" :label="$t('merchantconfig.label.usetype')" min-width="90"></el-table-column>
        <el-table-column sortable="custom" prop="pay_sort" :label="$t('merchantconfig.label.paysort')" min-width="105">
          <template slot-scope="scope">
            <span>{{scope.row.paySort}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" :label="$t('merchantconfig.label.lockflag')" min-width="90">
          <template slot-scope="scope">
            <span v-if="scope.row.lockFlag==='N'" style="color: red;">{{scope.row.lockFlagLabel}}</span>
            <span v-if="scope.row.lockFlag==='Y'" style="color: blue;">{{scope.row.lockFlagLabel}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" :label="$t('merchantconfig.label.payswitch')" min-width="90">
          <template slot-scope="scope">
            <span v-if="scope.row.paySwitch==='N'" style="color: red;">{{scope.row.paySwitchLabel}}</span>
            <span v-if="scope.row.paySwitch==='Y'" style="color: blue;">{{scope.row.paySwitchLabel}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" :label="$t('merchantconfig.label.useable')" min-width="90">
          <template slot-scope="scope">
            <span v-if="scope.row.useable==='N'" style="color: red;">{{scope.row.useableLabel}}</span>
            <span v-if="scope.row.useable==='Y'" style="color: blue;">{{scope.row.useableLabel}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="productName" fixed="right" :label="$t('common.label.product')" min-width="90"></el-table-column>
        <el-table-column fixed="right" :label="$t('common.label.operate')" width="80">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index,scope.row)" v-permission="permission.edit">{{$t('common.button.edit')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col class="toolbar">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="filters.pageNum" :page-size="filters.pageSize" :page-sizes="[10,20,30,40,50,100,200,300,400,500]" :total="total" layout="total,sizes,prev,pager,next,jumper" style="float: right;"></el-pagination>
      </el-col>
      <el-dialog :title="$t('merchantconfig.label.edittitle')" :visible.sync="editFormVisible" :close-on-click-modal="false" size="tiny">
        <el-form :model="editForm" ref="editForm" id="editForm" :rules="formRules">
          <el-form-item prop="merchantCode" :label="$t('merchantconfig.label.merchantcode')" :label-width="formLabelWidth">
            <el-input v-model="editForm.merchantCode" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item prop="merchantName" :label="$t('merchantconfig.label.merchantname')" :label-width="formLabelWidth">
            <el-input v-model="editForm.merchantName" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item prop="payPlatform" :label="$t('merchantconfig.label.payplatform')" :label-width="formLabelWidth">
            <el-input v-model="editForm.payPlatform" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item prop="fee" :label="$t('merchantconfig.label.fee')" :label-width="formLabelWidth">
            <el-input v-model="editForm.fee"></el-input>
          </el-form-item>
          <el-form-item prop="pcFee" :label="$t('merchantconfig.label.pcfee')" :label-width="formLabelWidth">
            <el-input v-model="editForm.pcFee"></el-input>
          </el-form-item>
          <el-form-item prop="phoneFee" :label="$t('merchantconfig.label.phonefee')" :label-width="formLabelWidth">
            <el-input v-model="editForm.phoneFee"></el-input>
          </el-form-item>
          <el-form-item prop="minPay" :label="$t('merchantconfig.label.minpay')" :label-width="formLabelWidth">
            <el-input v-model="editForm.minPay"></el-input>
          </el-form-item>
          <el-form-item prop="maxPay" :label="$t('merchantconfig.label.maxpay')" :label-width="formLabelWidth">
            <el-input v-model="editForm.maxPay"></el-input>
          </el-form-item>
          <el-form-item prop="registerTime" :label="$t('merchantconfig.label.registertime')" :label-width="formLabelWidth">
            <el-date-picker v-model="editForm.registerTime" type="datetime"></el-date-picker>
          </el-form-item>
          <el-form-item prop="registerMonth" :label="$t('merchantconfig.label.registermonth')" :label-width="formLabelWidth">
            <el-input v-model="editForm.registerMonth"></el-input>
          </el-form-item>
          <el-form-item prop="cutAmount" :label="$t('merchantconfig.label.cutamount')" :label-width="formLabelWidth">
            <el-input v-model="editForm.cutAmount"></el-input>
          </el-form-item>
          <el-form-item prop="fixedAmount" :label="$t('merchantconfig.label.fixedamount')" :label-width="formLabelWidth">
            <el-input v-model="editForm.fixedAmount"></el-input>
          </el-form-item>
          <el-form-item prop="recommendAmount" :label="$t('merchantconfig.label.recommendamount')" :label-width="formLabelWidth">
            <el-input v-model="editForm.recommendAmount"></el-input>
          </el-form-item>
          <el-form-item prop="paySort" :label="$t('merchantconfig.label.paysort')" :label-width="formLabelWidth">
            <el-input v-model="editForm.paySort"></el-input>
          </el-form-item>
          <el-form-item prop="payWay" :label="$t('merchantconfig.label.payway')" :label-width="formLabelWidth">
            <el-select v-model="editForm.payWay" disabled>
              <el-option v-for="item in payWayList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="useType" :label="$t('merchantconfig.label.usetype')" :label-width="formLabelWidth">
            <el-radio-group v-model="editForm.useType">
              <el-radio border v-for="item in useTypeList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="paySwitch" :label="$t('merchantconfig.label.payswitch')" :label-width="formLabelWidth">
            <el-radio-group v-model="editForm.paySwitch">
              <el-radio-button border v-for="item in paySwitchList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="useable" :label="$t('merchantconfig.label.useable')" :label-width="formLabelWidth">
            <el-radio-group v-model="editForm.useable">
              <el-radio-button border v-for="item in useableList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="lockFlag" :label="$t('merchantconfig.label.lockflag')" :label-width="formLabelWidth">
            <el-radio-group v-model="editForm.lockFlag">
              <el-radio-button border v-for="item in lockFlagList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="levels" :label="$t('merchantconfig.label.levels')" :label-width="formLabelWidth">
            <el-checkbox-group v-model="editForm.levels">
              <el-checkbox v-for="item in levelsList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item prop="creditGrade" :label="$t('merchantconfig.label.creditgrade')" :label-width="formLabelWidth">
            <template>
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">{{$t('common.label.checkall')}}</el-checkbox>
              <div style="margin: 15px 0;"></div>
              <el-checkbox-group v-model="editForm.creditGrade" @change="handleCheckedChange">
                <el-checkbox v-for="item in creditGradeList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-checkbox>
              </el-checkbox-group>
            </template>
          </el-form-item>
          <el-form-item prop="showName" :label="$t('merchantconfig.label.showname')" :label-width="formLabelWidth">
            <el-input v-model="editForm.showName" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item prop="remark" :label="$t('merchantconfig.label.remark')" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="editForm.remark"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editFormVisible=false" v-permission="permission.edit">{{$t('common.button.cancel')}}</el-button>
          <el-button type="primary" @click.native="editSubmit" :loading="editLoading" v-permission="permission.edit">{{$t('common.button.submit')}}</el-button>
        </div>
      </el-dialog>
    </section>
  </div>
</template>

<script>

  import MerchantConfigManagementJS from './MerchantConfigManagement.js'

  export default MerchantConfigManagementJS
</script>

<style rel="stylesheet/scss" lang="scss">

  .parent .el-form--inline .el-form-item__label {
    width: 90px;
  }

  .parent .el-select {
    width: 202px;
  }

  .el-form--label-left .el-form-item__label {
    text-align: right;
  }

  .demo-table-expand label {
    width: 100px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  #editForm .el-checkbox {
    margin-right: 30px;
    margin-left: 0 !important;
  }
</style>
