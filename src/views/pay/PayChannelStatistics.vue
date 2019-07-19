<template>
  <div class="app-container">
    <section>
      <el-col class="toolbar parent" style="padding-bottom: 0px;">
        <el-form :model="filters" ref="filters" :inline="true">
          <el-form-item prop="merchantName" :label="$t('merchantconfig.label.merchantname')">
            <el-input v-model="filters.merchantName"></el-input>
          </el-form-item>
          <el-form-item prop="payPlatform" :label="$t('merchantconfig.label.merchantcode')">
            <el-input v-model="filters.payPlatform"></el-input>
          </el-form-item>
          <el-form-item prop="payWay" :label="$t('merchantconfig.label.payway')">
            <el-select v-model="filters.payWay" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in payWayList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery" v-permission="permission.query">{{$t('common.button.query')}}</el-button>
            <el-button @click="handleReset" v-permission="permission.reset">{{$t('common.button.reset')}}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-table :data="dataList" border stripe fit highlight-current-row v-loading="loading" :element-loading-text="$t('common.label.inthequery')" style="width: 100%;">
        <el-table-column prop="registerMonth" :label="$t('merchantconfig.label.registermonth')"></el-table-column>
        <el-table-column prop="payPlatform" :label="$t('merchantconfig.label.registermonth')"></el-table-column>

        <el-table-column :label="$t('merchantconfig.label.fee')" min-width="130">
          <template slot-scope="scope">
            <span>{{scope.row.fee}}</span>
          </template>
        </el-table-column>

      </el-table>
    </section>
  </div>
</template>
