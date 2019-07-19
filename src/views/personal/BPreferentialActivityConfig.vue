<template>
  <div class="app-container">
    <section>
      <el-col class="toolbar" style="padding-bottom: 0px;">
        <el-form :model="filters" ref="filters" :inline="true">
          <el-form-item prop="position" :label="$t('bPreferentialActivityConfig.label.preferentialType')">
            <el-select v-model="filters.position" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in preferentialTypeList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="effectiveType" :label="$t('bPreferentialActivityConfig.label.effectivetype')">
            <el-select v-model="filters.effectiveType" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in effectiveTypeList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="displaySide" :label="$t('bPreferentialActivityConfig.label.displayside')">
            <el-select v-model="filters.displaySide" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in displaySideList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="title" :label="$t('bPreferentialActivityConfig.label.title')">
            <el-input v-model="filters.title"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery">{{$t('common.button.query')}}</el-button>
            <el-button @click="handleReset">{{$t('common.button.reset')}}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col class="toolbar" style="padding-bottom: 0px;">
        <el-form>
          <el-form-item>
            <el-button type="primary" @click="handleAdd">{{$t('common.button.add')}}</el-button>
            <el-button type="danger" @click="handleBatchDelete">{{$t('common.button.delete')}}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-table :data="dataList" border stripe fit highlight-current-row v-loading="loading" :element-loading-text="$t('common.label.inthequery')"  @selection-change="handleSelectionChange"  style="width: 100%;">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" class="demo-table-expand">
              <el-form-item :label="$t('bPreferentialActivityConfig.label.effectivestarttime')">
                <span>{{dateFormatItem(props.row, 'effectiveStartTime')}}</span>
              </el-form-item>
              <el-form-item :label="$t('bPreferentialActivityConfig.label.effectiveendtime')">
                <span>{{dateFormatItem(props.row, 'effectiveEndTime')}}</span>
              </el-form-item>
              <el-form-item :label="$t('bPreferentialActivityConfig.label.jumplink')">
                <span>{{props.row.jumpLink}}</span>
              </el-form-item>
              <el-form-item :label="$t('bPreferentialActivityConfig.label.imageurl')">
                <div class="my-upload" style="width: 178px; height: 178px;">
                  <img :src="props.row.imageUrl" alt="">
                </div>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="title" :label="$t('bPreferentialActivityConfig.label.title')"></el-table-column>
        <el-table-column prop="effectiveTypeLabel" :label="$t('bPreferentialActivityConfig.label.effectivetype')"></el-table-column>
        <el-table-column prop="categoryLabel" :label="$t('bPreferentialActivityConfig.label.preferentialType')"></el-table-column>
        <el-table-column prop="displaySide" :label="$t('bPreferentialActivityConfig.label.displayside')">
          <template slot-scope="scope">
            <span >{{ displaySideFormat(scope.row.displaySide) }}</span>
          </template>

        </el-table-column>


        <el-table-column prop="sort" :label="$t('bPreferentialActivityConfig.label.sort')"></el-table-column>
        <el-table-column prop="createTime" :label="$t('common.label.createtime')" :formatter="dateFormat" width="180"></el-table-column>
        <el-table-column prop="createUser" :label="$t('common.label.createuser')"></el-table-column>
        <el-table-column :label="$t('common.label.operate')" width="80">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index,scope.row)">{{$t('common.button.edit')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col class="toolbar">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="filters.pageNum" :page-size="filters.pageSize" :page-sizes="[10,20,30,40,50,100,200,300,400,500]" :total="total" layout="total,sizes,prev,pager,next,jumper" style="float: right;"></el-pagination>
      </el-col>
      <el-dialog :title="$t('bPreferentialActivityConfig.label.addtitle')" :visible.sync="addFormVisible" :close-on-click-modal="false" size="tiny">
        <el-form :model="addForm" ref="addForm" :rules="formRules">
          <el-form-item prop="category" :label="$t('bPreferentialActivityConfig.label.preferentialType')" :label-width="formLabelWidth">
            <el-radio-group v-model="addForm.category" @change="handleAddPositionChange">
              <el-radio-button v-for="item in preferentialTypeList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="title" :label="$t('bPreferentialActivityConfig.label.title')" :label-width="formLabelWidth">
            <el-input v-model="addForm.title"></el-input>
          </el-form-item>
          <el-form-item prop="effectiveType" :label="$t('bPreferentialActivityConfig.label.effectivetype')" :label-width="formLabelWidth">
            <el-radio-group v-model="addForm.effectiveType" @change="handleAddEffectiveTypeChange">
              <el-radio border v-for="item in effectiveTypeList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('bPreferentialActivityConfig.label.effectivetime')" :label-width="formLabelWidth" v-show="addTypeVisible">
            <el-date-picker v-model="addForm.maintenanceTime" type="datetimerange" :range-separator="$t('common.label.to')" :start-placeholder="$t('bPreferentialActivityConfig.label.starttime')" :end-placeholder="$t('bPreferentialActivityConfig.label.endtime')"></el-date-picker>
          </el-form-item>
         <el-form-item prop="imageUrl" :label="$t('bPreferentialActivityConfig.label.imageurl')" :label-width="formLabelWidth">
            <upload ref="addUpload" :item="addForm" size="178px" @change="handleAddSuccess"></upload>
          </el-form-item>
          <el-form-item prop="jumpLink" :label="$t('bPreferentialActivityConfig.label.jumplink')" :label-width="formLabelWidth">
            <el-input v-model="addForm.jumpLink"></el-input>
          </el-form-item>
          <el-form-item prop="associateId" :label="$t('bPreferentialActivityConfig.label.activityposition')" :label-width="formLabelWidth">
            <el-select v-model="addForm.associateId" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in associateIdList" :label="item.title" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="displaySide" :label="$t('bPreferentialActivityConfig.label.displayside')" :label-width="formLabelWidth">
            <el-checkbox-group  v-model="addForm.displaySide" @change="handleAddDisplaySideChange">
              <el-checkbox v-for="item in displaySideList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible=false">{{$t('common.button.cancel')}}</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">{{$t('common.button.submit')}}</el-button>
        </div>
      </el-dialog>

      <el-dialog :title="$t('bPreferentialActivityConfig.label.edittitle')" :visible.sync="editFormVisible" :close-on-click-modal="false" size="tiny">
        <el-form :model="editForm" ref="editForm" :rules="formRules">
          <el-form-item prop="category" :label="$t('bPreferentialActivityConfig.label.preferentialType')" :label-width="formLabelWidth">
            <el-radio-group v-model="editForm.category" @change="handleEditCateoryChange">
              <el-radio-button v-for="item in preferentialTypeList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="title" :label="$t('bPreferentialActivityConfig.label.title')" :label-width="formLabelWidth">
            <el-input v-model="editForm.title"></el-input>
          </el-form-item>
          <el-form-item prop="effectiveType" :label="$t('bPreferentialActivityConfig.label.effectivetype')" :label-width="formLabelWidth">
            <el-radio-group v-model="editForm.effectiveType" @change="handleEditEffectiveTypeChange">
              <el-radio border v-for="item in effectiveTypeList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('bPreferentialActivityConfig.label.effectivetime')" :label-width="formLabelWidth" v-show="editTypeVisible">
            <el-date-picker v-model="editForm.maintenanceTime" type="datetimerange" :range-separator="$t('common.label.to')" :start-placeholder="$t('bPreferentialActivityConfig.label.starttime')" :end-placeholder="$t('bPreferentialActivityConfig.label.endtime')"></el-date-picker>
          </el-form-item>
          <el-form-item prop="imageUrl" :label="$t('bPreferentialActivityConfig.label.imageurl')" :label-width="formLabelWidth">
            <upload ref="editUpload" :item="editForm" size="178px" @change="handleEditSuccess"></upload>
          </el-form-item>
          <el-form-item prop="jumpLink" :label="$t('bPreferentialActivityConfig.label.jumplink')" :label-width="formLabelWidth">
            <el-input v-model="editForm.jumpLink"></el-input>
          </el-form-item>
          <el-form-item prop="associateId" :label="$t('bPreferentialActivityConfig.label.activityposition')" :label-width="formLabelWidth">
            <el-select v-model="editForm.associateId" clearable>
              <el-option v-for="item in associateIdList" :label="item.title" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="displaySide" :label="$t('bPreferentialActivityConfig.label.displayside')" :label-width="formLabelWidth">
            <el-checkbox-group  v-model="editForm.displaySide" @change="handleEditDisplaySideChange">
              <el-checkbox v-for="item in displaySideList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-checkbox>
            </el-checkbox-group>
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

  import BPreferentialActivityConfigJS from './BPreferentialActivityConfig.js'

  export default BPreferentialActivityConfigJS
</script>
<style rel="stylesheet/scss" lang="scss">
  #editForm .el-checkbox, #editForm .el-checkbox {
    margin-right: 30px;
    margin-left: 0!important;
  }

</style>
