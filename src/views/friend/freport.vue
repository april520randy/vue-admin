<template>
  <div class="app-container">
    <section>
      <el-col class="toolbar parent" style="padding-bottom: 0px;">
        <el-form :model="filters" ref="filters" :inline="true">
          <el-form-item prop="beReportStatus" :label="$t('freport.label.bereportstatus')" >
            <el-select v-model="filters.beReportStatus" clearable :placeholder="$t('common.label.choose')" style="display: inline">
              <el-option v-for="item in edList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="reportName" :label="$t('freport.label.reportname')">
            <el-input v-model="filters.reportName"></el-input>
          </el-form-item>
          <el-form-item prop="beReportName" :label="$t('freport.label.bereportname')"  style="min-width: 100px;">
            <el-input v-model="filters.beReportName"></el-input>
          </el-form-item>
          <el-form-item prop="fCircleId" :label="$t('freport.label.fcircleid')">
            <el-input v-model="filters.fCircleId"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery">{{$t('common.button.query')}}</el-button>
            <el-button @click="handleReset">{{$t('common.button.reset')}}</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <el-table :data="dataList" border stripe fit highlight-current-row v-loading="loading" :element-loading-text="$t('common.label.inthequery')" @selection-change="handleSelectionChange" style="width: 100%;">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" :label="$t('freport.label.id')" min-width="50"></el-table-column>
        <el-table-column prop="reportName" :label="$t('freport.label.reportname')" min-width="100"></el-table-column>
        <el-table-column prop="beReportName" :label="$t('freport.label.bereportname')" min-width="100"></el-table-column>
        <el-table-column  :label="$t('freport.label.bereportstatus')" min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.beReportStatus==='Y'" style="color: blue;">{{$t('freport.label.on')}}</span>
            <span v-if="scope.row.beReportStatus==='N'" style="color: red;">{{$t('freport.label.off')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="fCircleId" :label="$t('freport.label.fcircleid')" min-width="100"></el-table-column>
        <el-table-column prop="content" :label="$t('freport.label.content')" min-width="100"></el-table-column>

        <el-table-column prop="reportReason" :label="$t('freport.label.reportreason')" min-width="100"></el-table-column>

        <el-table-column prop="createTime":label="$t('freport.label.createtime')"  :formatter="dateFormat" min-width="100"></el-table-column>
        <el-table-column :label="$t('common.label.operate')" width="80">
          <template slot-scope="scope">
            <el-button v-if="scope.row.beReportStatus==='Y'" size="mini" type="danger"@click="handleStatus(scope.$index,scope.row,'N')">{{$t('common.button.disabled')}}</el-button>
            <el-button v-if="scope.row.beReportStatus==='N'" size="mini"  @click="handleStatus(scope.$index,scope.row,'Y')">{{$t('common.button.enabled')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col class="toolbar">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="filters.pageNum" :page-size="filters.pageSize" :page-sizes="[10,20,30,40,50,100,200,300,400,500]" :total="total" layout="total,sizes,prev,pager,next,jumper" style="float: right;"></el-pagination>
      </el-col>
    </section>
  </div>
</template>

<script>
  import freportJS from "./freport.js"
  export default freportJS
</script>

<style rel="stylesheet/scss" lang="scss">

  .parent .el-form--inline .el-form-item__label {
    width: 90px;
  }

  .parent .el-select {
    width: 202px;
  }

  .my-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    &:hover {
      border-color: dodgerblue;
    }
    img {
      width: 100%;
      height: 100%;
    }
  }

  .el-rate__icon {
    font-size: 18px;
    margin-right: 6px;
    color: #c0c4cc;
    -webkit-transition: .3s;
    transition: .3s;
    margin-top: 10px;
  }

  .import-component {
    display: inline-block;
    vertical-align: middle;
    margin-left: 10px;
    margin-top: 3px;
  }

  #addForm .el-checkbox, #editForm .el-checkbox {
    margin-right: 30px;
    margin-left: 0!important;
  }
</style>
