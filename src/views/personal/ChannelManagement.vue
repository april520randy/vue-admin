<template>
  <div class="app-container">
    <section>
      <el-col class="toolbar parent" style="padding-bottom: 0px;">
        <el-form :model="filters" ref="filters" :inline="true">
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
          <el-form-item prop="lockFlag" :label="$t('merchantconfig.label.lockflag')">
            <el-select v-model="filters.lockFlag" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in lockFlagList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
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
          </el-form-item>
        </el-form>
      </el-col>
      <el-table @sort-change="sortChange" :data="dataList" border stripe fit highlight-current-row v-loading="loading" :element-loading-text="$t('common.label.inthequery')" style="width: 100%;">
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
            </el-form>
          </template>
        </el-table-column>
        <el-table-column fixed="right" :label="$t('merchantconfig.label.merchantname')" min-width="170">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
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
          <el-form-item prop="merchantName" :label="$t('merchantconfig.label.merchantname')" :label-width="formLabelWidth">
            <el-input v-model="editForm.merchantName" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item prop="payPlatform" :label="$t('merchantconfig.label.payplatform')" :label-width="formLabelWidth">
            <el-input v-model="editForm.payPlatform" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item prop="fixedAmount" :label="$t('merchantconfig.label.fixedamount')" :label-width="formLabelWidth">
            <el-input v-model="editForm.fixedAmount" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item prop="recommendAmount" :label="$t('merchantconfig.label.recommendamount')" :label-width="formLabelWidth">
            <el-input v-model="editForm.recommendAmount"></el-input>
          </el-form-item>
          <el-form-item prop="paySort" :label="$t('merchantconfig.label.paysort')" :label-width="formLabelWidth">
            <el-input v-model="editForm.paySort"></el-input>
          </el-form-item>
          <el-form-item prop="lockFlag" :label="$t('merchantconfig.label.lockflag')" :label-width="formLabelWidth">
            <el-radio-group v-model="editForm.lockFlag">
              <el-radio-button border v-for="item in lockFlagList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="showName" :label="$t('merchantconfig.label.showname')" :label-width="formLabelWidth">
            <el-input v-model="editForm.showName" :disabled="true"></el-input>
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

  import ChannelManagementJS from './ChannelManagement.js'

  export default ChannelManagementJS
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
