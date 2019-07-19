<template>
  <div class="app-container">
    <section>
      <el-col class="toolbar parent" style="padding-bottom: 0px;">
        <el-form :model="filters" ref="filters" :inline="true">
          <el-form-item prop="hrefUrl" :label="$t('advertisement.label.hrefurl')">
            <el-input v-model="filters.hrefUrl"></el-input>
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
            <el-button type="primary" @click="handleAdd">{{$t('common.button.add')}}</el-button>
            <el-button type="danger" @click="handleBatchDelete">{{$t('common.button.delete')}}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-table :data="dataList" border stripe fit highlight-current-row v-loading="loading" :element-loading-text="$t('common.label.inthequery')" @selection-change="handleSelectionChange" style="width: 100%;">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" :label="$t('advertisement.label.id')" min-width="50"></el-table-column>
        <el-table-column prop="sorta" :label="$t('advertisement.label.sorta')" min-width="100"></el-table-column>
        <el-table-column  :label="$t('advertisement.label.image')" sortable width="180px">
          <template slot-scope="scope">
            <img :src="scope.row.image" alt="" style="width: 50px">
          </template>
        </el-table-column>
        <el-table-column prop="hrefUrl" :label="$t('advertisement.label.hrefurl')" min-width="50"></el-table-column>
        <el-table-column prop="createTime":label="$t('common.label.createtime')"  :formatter="dateFormat" min-width="100"></el-table-column>
        <el-table-column :label="$t('common.label.operate')" width="80">
          <template slot-scope="scope">

          </template>
        </el-table-column>
      </el-table>
      <el-col class="toolbar">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="filters.pageNum" :page-size="filters.pageSize" :page-sizes="[10,20,30,40,50,100,200,300,400,500]" :total="total" layout="total,sizes,prev,pager,next,jumper" style="float: right;"></el-pagination>
      </el-col>
      <el-dialog :title="$t('advertisement.label.addtitle')" :visible.sync="addFormVisible" :close-on-click-modal="false" size="tiny">
        <el-form :model="addForm" ref="addForm" :rules="formRules">

          <el-form-item prop="sorta" :label="$t('advertisement.label.sorta')" :label-width="formLabelWidth">
            <el-input v-model="addForm.sorta"></el-input>
          </el-form-item>
          <el-form-item prop="hrefUrl" :label="$t('advertisement.label.hrefurl')" :label-width="formLabelWidth">
            <el-input v-model="addForm.hrefUrl"></el-input>
          </el-form-item>
          <el-form-item prop="image" :label="$t('advertisement.label.image')" :label-width="formLabelWidth">
            <upload ref="addUpload" :item="addForm" size="178px" @change="handleAddSuccess"></upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible=false">{{$t('common.button.cancel')}}</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">{{$t('common.button.submit')}}</el-button>
        </div>
      </el-dialog>

      <el-dialog :title="$t('advertisement.label.addtitle')" :visible.sync="editFormVisible" :close-on-click-modal="false" size="tiny">
        <el-form :model="editForm" ref="editForm" :rules="formRules">

          <el-form-item prop="sorta" :label="$t('advertisement.label.sorta')" :label-width="formLabelWidth">
            <el-input v-model="editForm.sorta"></el-input>
          </el-form-item>
          <el-form-item prop="image" :label="$t('advertisement.label.image')" :label-width="formLabelWidth">
            <upload ref="addUpload" :item="editForm" size="178px" @change="handleAddSuccess"></upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible=false">{{$t('common.button.cancel')}}</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">{{$t('common.button.submit')}}</el-button>
        </div>
      </el-dialog>
    </section>
  </div>
</template>

<script>
  import advertisementJS from "./advertisement.js"
  export default advertisementJS
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
