<template>
  <div class="app-container">
    <section>
      <el-col class="toolbar parent" style="padding-bottom: 0px;">
        <el-form :model="filters" ref="filters" :inline="true">
          <el-form-item prop="name" :label="$t('flevelSetting.label.name')">
            <el-input v-model="filters.name"></el-input>
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
        <el-table-column prop="id" :label="$t('flevelSetting.label.id')" min-width="50"></el-table-column>
        <el-table-column prop="itemName" :label="$t('flevelSetting.label.itemname')" min-width="100"></el-table-column>
        <el-table-column  :label="$t('flevelSetting.label.flag')" min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.flag==='Y'" style="color: blue;">{{$t('flevelSetting.label.on')}}</span>
            <span v-if="scope.row.flag==='N'" style="color: red;">{{$t('flevelSetting.label.off')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operateType" :label="$t('flevelSetting.label.operatetype')" min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.operateType==1" style="color: blue;">{{$t('flevelSetting.label.operatevalue1')}}</span>
            <span v-if="scope.row.operateType==2" style="color: red;">{{$t('flevelSetting.label.operatevalue2')}}</span>
            <span v-if="scope.row.operateType==3" style="color: red;">{{$t('flevelSetting.label.operatevalue3')}}</span>
          </template>

        </el-table-column>
        <el-table-column prop="operateValue" :label="$t('flevelSetting.label.operatevalue')" min-width="100">
        </el-table-column>
        <el-table-column  :label="$t('flevelSetting.label.ispublish')" min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.isPublish==='Y'" style="color: blue;">{{$t('flevelSetting.label.on')}}</span>
            <span v-if="scope.row.isPublish==='N'" style="color: red;">{{$t('flevelSetting.label.off')}}</span>
          </template>
        </el-table-column>
        <el-table-column  :label="$t('flevelSetting.label.ispraise')" min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.isPraise==='Y'" style="color: blue;">{{$t('flevelSetting.label.on')}}</span>
            <span v-if="scope.row.isPraise==='N'" style="color: red;">{{$t('flevelSetting.label.off')}}</span>
          </template>
        </el-table-column>
        <el-table-column  :label="$t('flevelSetting.label.iscomment')" min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.isComment==='Y'" style="color: blue;">{{$t('flevelSetting.label.on')}}</span>
            <span v-if="scope.row.isComment==='N'" style="color: red;">{{$t('flevelSetting.label.off')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime":label="$t('flevelSetting.label.updatetime')"  :formatter="dateFormat" min-width="100"></el-table-column>
        <el-table-column :label="$t('common.label.operate')" width="80">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index,scope.row)">{{$t('common.button.edit')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col class="toolbar">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="filters.pageNum" :page-size="filters.pageSize" :page-sizes="[10,20,30,40,50,100,200,300,400,500]" :total="total" layout="total,sizes,prev,pager,next,jumper" style="float: right;"></el-pagination>
      </el-col>
      <el-dialog :title="$t('flevelSetting.label.addtitle')" :visible.sync="addFormVisible" :close-on-click-modal="false" size="tiny">

        <el-form :model="addForm" ref="addForm" :rules="formRules">
          <el-form-item prop="name" :label="$t('flevelSetting.label.name')" :label-width="formLabelWidth" >
            <el-select v-model="addForm.name" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in levelList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="account" :label="$t('flevelSetting.label.account')" :label-width="formLabelWidth">
            <el-input v-model="addForm.account"></el-input>
          </el-form-item>
          <el-form-item prop="operateType" :label="$t('flevelSetting.label.operatetype')" :label-width="formLabelWidth">
            <el-select v-model="addForm.operateType" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in restrictList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="operateValue" :label="$t('flevelSetting.label.operatevalue')" :label-width="formLabelWidth">
            <el-input v-model="addForm.operateValue"></el-input>
          </el-form-item>
          <el-form-item prop="flag" :label="$t('flevelSetting.label.flag')" :label-width="formLabelWidth">
            <el-select v-model="addForm.flag" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in edList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible=false">{{$t('common.button.cancel')}}</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">{{$t('common.button.submit')}}</el-button>
        </div>
      </el-dialog>
      <!--修改 -->
      <el-dialog :title="$t('flevelSetting.label.edittitle')" :visible.sync="editFormVisible" :close-on-click-modal="false" size="tiny">
        <el-form :model="editForm" ref="editForm" :rules="formRules">

          <el-form-item prop="name" :label="$t('flevelSetting.label.name')" :label-width="formLabelWidth">
            <el-select v-model="editForm.name" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in levelList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="account" :label="$t('flevelSetting.label.account')" :label-width="formLabelWidth">
            <el-input v-model="editForm.account"></el-input>
          </el-form-item>
            <el-form-item prop="operateType" :label="$t('flevelSetting.label.operatetype')" :label-width="formLabelWidth">
              <el-select v-model="editForm.operateType" clearable :placeholder="$t('common.label.choose')">
                <el-option v-for="item in restrictList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
              </el-select>
            </el-form-item>

          <el-form-item prop="operateValue" :label="$t('flevelSetting.label.operatevalue')" :label-width="formLabelWidth">
            <el-input v-model="editForm.operateValue"></el-input>
          </el-form-item>
          <el-form-item prop="flag" :label="$t('flevelSetting.label.flag')" :label-width="formLabelWidth">
            <el-select v-model="editForm.flag" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in edList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="isPublish" :label="$t('flevelSetting.label.ispublish')" :label-width="formLabelWidth">
            <el-select v-model="editForm.isPublish" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in edList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="isPraise" :label="$t('flevelSetting.label.ispraise')" :label-width="formLabelWidth">
            <el-select v-model="editForm.isPraise" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in edList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="isComment" :label="$t('flevelSetting.label.iscomment')" :label-width="formLabelWidth">
            <el-select v-model="editForm.isComment" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in edList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editFormVisible=false">{{$t('common.button.cancel')}}</el-button>
          <el-button type="primary" @click.native="editSubmit" :loading="editLoading">{{$t('common.button.submit')}}</el-button>
        </div>
      </el-dialog>
    </section>
  </div>
</template>

<script>
  import flevelSettingJS from "./fLevelSetting.js"
  export default flevelSettingJS
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
