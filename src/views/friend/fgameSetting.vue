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

          <el-form-item prop="platform" :label="$t('fgameSetting.label.platform')">
            <el-select v-model="filters.platform" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in gameCategoryList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="cnGame" :label="$t('fgameSetting.label.cngame')">
            <el-input v-model="filters.cnGame"></el-input>
          </el-form-item>
          <el-form-item prop="enGame" :label="$t('fgameSetting.label.engame')">
            <el-input v-model="filters.enGame"></el-input>
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
        <el-table-column prop="id" :label="$t('fgameSetting.label.id')" min-width="50"></el-table-column>
        <el-table-column prop="cnGame" :label="$t('fgameSetting.label.cngame')" min-width="100"></el-table-column>
        <el-table-column prop="enGame" :label="$t('fgameSetting.label.engame')" min-width="100"></el-table-column>
        <el-table-column prop="platform" :label="$t('fgameSetting.label.platform')" min-width="100"></el-table-column>
        <el-table-column prop="gameSort" :label="$t('fgameSetting.label.gamesort')" min-width="100"></el-table-column>
        <el-table-column prop="beginTime":label="$t('fgameSetting.label.begintime')"  :formatter="dateFormat" min-width="100"></el-table-column>
        <el-table-column prop="endTime":label="$t('fgameSetting.label.endtime')"  :formatter="dateFormat" min-width="100"></el-table-column>
        <el-table-column :label="$t('common.label.operate')" width="80">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index,scope.row)">{{$t('common.button.edit')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col class="toolbar">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="filters.pageNum" :page-size="filters.pageSize" :page-sizes="[10,20,30,40,50,100,200,300,400,500]" :total="total" layout="total,sizes,prev,pager,next,jumper" style="float: right;"></el-pagination>
      </el-col>

      <el-dialog :title="$t('fgameSetting.label.addtitle')" :visible.sync="addFormVisible" :close-on-click-modal="false" size="tiny">

        <el-form :model="addForm" ref="addForm" :rules="formRules">
          <el-form-item prop="platform" :label="$t('fgameSetting.label.platform')" :label-width="formLabelWidth" >
            <el-select v-model="addForm.platform" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in gameCategoryList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="gameId" :label="$t('fgameSetting.label.gameid')" :label-width="formLabelWidth">
            <el-input v-model="addForm.gameId"></el-input>
          </el-form-item>
          <el-form-item prop="cnGame" :label="$t('fgameSetting.label.cngame')" :label-width="formLabelWidth">
            <el-input v-model="addForm.cnGame"></el-input>
          </el-form-item>
          <el-form-item prop="enGame" :label="$t('fgameSetting.label.engame')" :label-width="formLabelWidth">
            <el-input v-model="addForm.enGame"></el-input>
          </el-form-item>
          <el-form-item prop="content" :label="$t('fgameSetting.label.content')" :label-width="formLabelWidth">
            <el-input v-model="addForm.content"></el-input>
          </el-form-item>
          <el-form-item prop="gameSort" :label="$t('fgameSetting.label.gamesort')" :label-width="formLabelWidth">
            <el-input v-model="addForm.gameSort"></el-input>
          </el-form-item>
          <el-form-item prop="beginTime" :label="$t('fgameSetting.label.begintime')" :label-width="formLabelWidth">
            <template >
              <div class="block">
                <el-date-picker v-model="addForm.beginTime"  type="datetime"  placeholder="选择日期时间">  </el-date-picker>
              </div>
            </template>
          </el-form-item>
          <el-form-item prop="endTime" :label="$t('fgameSetting.label.endtime')" :label-width="formLabelWidth">
            <template >
              <div class="block">
                <el-date-picker v-model="addForm.endTime" type="datetime"  placeholder="选择日期时间">  </el-date-picker>
              </div>
            </template>
          </el-form-item>
          <el-form-item prop="path" :label="$t('fgameSetting.label.path')" :label-width="formLabelWidth">
            <upload ref="addUpload" :item="addForm" size="178px" @change="handleAddSuccess"></upload>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible=false">{{$t('common.button.cancel')}}</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">{{$t('common.button.submit')}}</el-button>
        </div>
      </el-dialog>
      <!--修改 -->
      <el-dialog :title="$t('fgameSetting.label.edittitle')" :visible.sync="editFormVisible" :close-on-click-modal="false" size="tiny">
        <el-form :model="editForm" ref="editForm" :rules="formRules">

          <el-form-item prop="platform" :label="$t('fgameSetting.label.platform')" :label-width="formLabelWidth" >
            <el-select v-model="editForm.platform" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in gameCategoryList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="gameId" :label="$t('fgameSetting.label.gameid')" :label-width="formLabelWidth">
            <el-input v-model="editForm.gameId"></el-input>
          </el-form-item>
          <el-form-item prop="cnGame" :label="$t('fgameSetting.label.cngame')" :label-width="formLabelWidth">
            <el-input v-model="editForm.cnGame"></el-input>
          </el-form-item>
          <el-form-item prop="enGame" :label="$t('fgameSetting.label.engame')" :label-width="formLabelWidth">
            <el-input v-model="editForm.enGame"></el-input>
          </el-form-item>
          <el-form-item prop="content" :label="$t('fgameSetting.label.content')" :label-width="formLabelWidth">
            <el-input v-model="editForm.content"></el-input>
          </el-form-item>
          <el-form-item prop="gameSort" :label="$t('fgameSetting.label.gamesort')" :label-width="formLabelWidth">
            <el-input v-model="editForm.gameSort"></el-input>
          </el-form-item>
          <el-form-item prop="beginTime" :label="$t('fgameSetting.label.begintime')" :label-width="formLabelWidth">
            <template >
              <div class="block">
                <el-date-picker v-model="editForm.beginTime" type="datetime"  placeholder="选择日期时间">  </el-date-picker>
              </div>
            </template>
          </el-form-item>
          <el-form-item prop="endTime" :label="$t('fgameSetting.label.endtime')" :label-width="formLabelWidth">
            <template >
              <div class="block">
                <el-date-picker v-model="editForm.endTime" type="datetime"  placeholder="选择日期时间">  </el-date-picker>
              </div>
            </template>
          </el-form-item>
          <el-form-item prop="path" :label="$t('fgameSetting.label.path')" :label-width="formLabelWidth">
            <upload ref="editUpload" :item="editForm" size="178px" @change="handleEditSuccess"></upload>
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
  import fgameSettingJS from "./fgameSetting.js"
  export default fgameSettingJS
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
