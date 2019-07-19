<!--银行额度记录-->
<template>
  <div class="app-container">
    <section>
      <!--条件搜索区-->
      <el-col class="toolbar" style="padding-bottom: 0px;">
        <el-form :model="filters" ref="filters" :inline="true">
          <!--额度记录类型-->
          <el-form-item prop="type" :label="$t('bankquotarecord.label.quotaRecordType')">
            <el-select v-model="filters.quotaRecordType" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in quotaRecordTypeList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <!--银行卡名称-->
          <el-form-item prop="accountName" :label="$t('bankquotarecord.label.accountName')">
            <el-input v-model="filters.accountName"></el-input>
          </el-form-item>
          <!--创建时间-->
          <el-form-item :label="$t('bankquotarecord.label.createTime')">
            <el-date-picker v-model="filters.startTime" type="datetime" placeholder="开始时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
            <el-date-picker v-model="filters.endTime" type="datetime" placeholder="结束时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
          <!--搜索和重置按钮-->
          <el-form-item>
            <el-button type="primary" @click="handleQuery">{{$t('common.button.query')}}</el-button>
            <el-button @click="handleReset">{{$t('common.button.reset')}}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <!--Grid-->
      <el-table show-summary :summary-method="getSummaries" :data="dataList" border stripe fit highlight-current-row v-loading="gridLoading" :element-loading-text="$t('common.label.inthequery')">
        <!--银行用户名-->
        <el-table-column align="center" prop="accountName" :label="$t('bankquotarecord.label.accountName')" width="150px"></el-table-column>
        <!--额度记录类型-->
        <el-table-column align="center" prop="quotaRecordType" :label="$t('bankquotarecord.label.quotaRecordType')" width="150px">
          <template slot-scope="scope">
            <span style="font-weight: bold;">{{scope.row.quotaRecordTypeLabel}}</span>
          </template>
        </el-table-column>
        <!--额度变量-->
        <el-table-column align="center" prop="amount" :label="$t('bankquotarecord.label.amount')" width="140px"></el-table-column>
        <!--手续费-->
        <el-table-column align="center" prop="fee" :label="$t('bankquotarecord.label.fee')" width="140px"></el-table-column>
        <!--改变前额度-->
        <el-table-column align="center" prop="oldAmount" :label="$t('bankquotarecord.label.oldAmount')" width="140px"></el-table-column>
        <!--改变后额度-->
        <el-table-column align="center" prop="newAmount" :label="$t('bankquotarecord.label.newAmount')" width="140px"></el-table-column>
        <!--记录更新人-->
        <el-table-column align="center" prop="createUser" :label="$t('bankquotarecord.label.createUser')" width="200px"></el-table-column>
        <el-table-column align="center" prop="createTime" :label="$t('bankquotarecord.label.createTime')" width="200px" :formatter="dateFormat"></el-table-column>
        <el-table-column align="center" prop="remark" :label="$t('bankquotarecord.label.remark')"></el-table-column>
      </el-table>
      <el-col class="toolbar">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="filters.pageNum" :page-size="filters.pageSize" :page-sizes="[10,20,30,40,50,100,200,300,400,500]" :total="total" layout="total,sizes,prev,pager,next,jumper" style="float: right;"></el-pagination>
      </el-col>
    </section>
  </div>
</template>

<script>
  import BankQuotaRecordJS from './BankQuotaRecord.js';
    export default BankQuotaRecordJS;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>
