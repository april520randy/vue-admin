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

          <el-form-item prop="status" :label="$t('fuser.label.status')">
            <el-select v-model="filters.status" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in edList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="userName" :label="$t('fuser.label.username')">
            <el-input v-model="filters.userName"></el-input>
          </el-form-item>
          <el-form-item prop="nickName" :label="$t('fuser.label.nickname')">
            <el-input v-model="filters.nickName"></el-input>
          </el-form-item>
          <el-form-item prop="id" :label="$t('fuser.label.id')">
            <el-input v-model="filters.id"></el-input>
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
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" class="demo-table-expand">
              <el-form-item :label="$t('fuser.label.username')">
                <span>{{props.row.userName}}</span>
              </el-form-item>
              <el-form-item :label="$t('fuser.label.nickname')">
                <span>{{props.row.nickName}}</span>
              </el-form-item>

              <el-form-item :label="$t('fuser.label.headurl')">
                <div class="my-upload" style="width: 178px; height: 178px;">
                  <img :src="props.row.headUrl" alt="">
                </div>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="selection" min-width="5%"></el-table-column>
        <el-table-column prop="id" :label="$t('fuser.label.id')" min-width="10%"></el-table-column>
        <el-table-column prop="userName" :label="$t('fuser.label.username')" min-width="20%"></el-table-column>
        <el-table-column prop="nickName" :label="$t('fuser.label.nickname')" min-width="20%"></el-table-column>

        <el-table-column  :label="$t('fuser.label.status')" min-width="18%">
          <template slot-scope="scope">
            <span v-if="scope.row.status==='Y'" style="color: blue;">{{$t('fuser.label.on')}}</span>
            <span v-if="scope.row.status==='N'" style="color: red;">{{$t('fuser.label.off')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="followNum" :label="$t('fuser.label.follownum')" min-width="10%">
            <template slot-scope="scope">
              <el-badge :value="scope.row.followNum" :max="99" class="item">
                <el-button  size="mini"  @click="show(scope.row.id,'1','1')"></el-button>
              </el-badge>
            </template>
        </el-table-column>
        <el-table-column prop="fassNum":label="$t('fuser.label.fassnum')" min-width="10%">
          <template slot-scope="scope">
            <el-badge :value="scope.row.fassNum" :max="99" class="item">
              <el-button  size="mini"  @click="show(scope.row.id,'2','1')"></el-button>
            </el-badge>

          </template>
        </el-table-column>
        <el-table-column prop="createTime":label="$t('common.label.createtime')"  :formatter="dateFormat" min-width="20%"></el-table-column>
        <el-table-column :label="$t('common.label.operate')" min-width="18%">
          <template slot-scope="scope">

            <el-button v-if="scope.row.status==='Y'" size="mini"type="danger" @click="handleStatus(scope.$index,scope.row,'N')">{{$t('common.button.disabled')}}</el-button>
            <el-button v-if="scope.row.status==='N'" size="mini"  @click="handleStatus(scope.$index,scope.row,'Y')">{{$t('common.button.enabled')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col class="toolbar">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="filters.pageNum" :page-size="filters.pageSize" :page-sizes="[10,20,30,40,50,100,200,300,400,500]" :total="total" layout="total,sizes,prev,pager,next,jumper" style="float: right;"></el-pagination>
      </el-col>

        <!-- 列表 -->
      <el-dialog :title="$t('fuser.label.listtitle')" :visible.sync="listFormVisible" :close-on-click-modal="false" size="tiny" style="width: 100%;">
        <el-form :model="listForm" ref="listForm" :rules="formRules">
          <el-table :data="userFollowList" border stripe fit highlight-current-row v-loading="loading" :element-loading-text="$t('common.label.inthequery')" @selection-change="handleSelectionChange1" style="width: 100%;">
            <el-table-column prop="userName" :label="$t('fuser.label.username')" min-width="50px"></el-table-column>
            <el-table-column prop="nickName" :label="$t('fuser.label.nickname')" min-width="50px"></el-table-column>
          </el-table>
        </el-form>
        <el-col class="toolbar">
          <el-pagination background @size-change="handleSizeChange1" @current-change="handleCurrentChange1" :current-page.sync="filters.pageNum" :page-size="filters.pageSize" :page-sizes="[10,20,30,40,50,100,200,300,400,500]" :total="total1" layout="total,sizes,prev,pager,next,jumper" style="float: right;"></el-pagination>
        </el-col>
      </el-dialog>


    </section>
  </div>
</template>

<script>

  import fuserJS from './fuser.js'

  export default fuserJS
</script>

<style rel="stylesheet/scss" lang="scss">

  .parent .el-form--inline .el-form-item__label {
    width: 90px;
  }

  .parent .el-select {
    width: 202px;
  }
  .item {
    margin-top: 10px;
    margin-right: 40px;
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
