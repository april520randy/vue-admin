<template>
  <div class="app-container">
    <section>
      <el-col class="toolbar parent" style="padding-bottom: 0px;">
        <el-form :model="filters" ref="filters" :inline="true">
          <el-form-item prop="createTime" :label="$t('common.label.createtime')">
            <template >
              <div class="block">
                <el-date-picker v-model="filters.theTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime"  placeholder="选择日期时间">  </el-date-picker>至
                <el-date-picker v-model="filters.endTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime"  placeholder="选择日期时间">  </el-date-picker>
              </div>
            </template>
          </el-form-item>
          <el-form-item prop="status" :label="$t('fcircleComments.label.status')">
            <el-select v-model="filters.status" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in statusList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="userName" :label="$t('fcircleComments.label.username')">
            <el-input v-model="filters.userName"></el-input>
          </el-form-item>
          <el-form-item prop="nickName" :label="$t('fcircleComments.label.nickname')">
            <el-input v-model="filters.nickName"></el-input>
          </el-form-item>
          <el-form-item prop="fCircleId" :label="$t('fcircleComments.label.fcircleid')">
            <el-input v-model="filters.fCircleId"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery">{{$t('common.button.query')}}</el-button>
            <el-button @click="handleReset">{{$t('common.button.reset')}}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col class="toolbar" style="padding-bottom: 0px;">
        <el-form v-loading.fullscreen.lock="btnloading" :element-loading-text="$t('common.label.intheimport')">
          <el-form-item>
          </el-form-item>
        </el-form>
      </el-col>
      <el-table :data="dataList" border stripe fit highlight-current-row v-loading="loading" :element-loading-text="$t('common.label.inthequery')" @selection-change="handleSelectionChange" style="width: 100%;">

        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" :label="$t('fcircleComments.label.id')" min-width="60"></el-table-column>
        <el-table-column prop="fCircleId" :label="$t('fcircleComments.label.fcircleid')" min-width="60"></el-table-column>
        <el-table-column prop="userName" :label="$t('fcircleComments.label.username')" min-width="100"></el-table-column>
        <el-table-column prop="nickName" :label="$t('fcircleComments.label.nickname')" min-width="100"></el-table-column>
        <el-table-column prop="content" :label="$t('fcircleComments.label.content')" min-width="200"></el-table-column>
        <el-table-column prop="comments" :label="$t('fcircleComments.label.comments')" min-width="200"></el-table-column>
        <el-table-column prop="createTime" :label="$t('fcircleComments.label.createtime')"  :formatter="dateFormat" min-width="100"></el-table-column>
        <el-table-column  :label="$t('fcircleComments.label.status')" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.status==0" style="color: blue;">{{$t('fcircleComments.label.pass')}}</span>
            <span v-if="scope.row.status==1" style="color: red;">{{$t('fcircleComments.label.nopass')}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.label.operate')" width="80">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status==0" size="mini" type="danger" @click="handleStatus(scope.row,1)">{{$t('fcircleComments.button.nopass')}}</el-button>
            <el-button v-if="scope.row.status==1" size="mini"  @click="handleStatus(scope.row,0)">{{$t('fcircleComments.button.pass')}}</el-button>
            <el-button size="mini" style="margin-left: 0px;" @click="commentOpen(scope.row)">评论</el-button>
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

  import fcircleCommentsJS from './circleComments.js'

  export default fcircleCommentsJS
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
