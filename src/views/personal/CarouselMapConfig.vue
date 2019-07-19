<template>
  <div class="app-container">
    <section>
      <el-col class="toolbar" style="padding-bottom: 0px;">
        <el-form :model="filters" ref="filters" :inline="true">
          <el-form-item prop="position" :label="$t('carouselmapconfig.label.position')">
            <el-select v-model="filters.position" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in positionList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="effectiveType" :label="$t('carouselmapconfig.label.effectivetype')">
            <el-select v-model="filters.effectiveType" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in effectiveTypeList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="displaySide" :label="$t('carouselmapconfig.label.displayside')">
            <el-select v-model="filters.displaySide" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in displaySideList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="title" :label="$t('carouselmapconfig.label.title')">
            <el-input v-model="filters.title"></el-input>
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
            <el-button type="primary" @click="handleAdd" v-permission="permission.add">{{$t('common.button.add')}}</el-button>
            <el-button type="danger" @click="handleBatchDelete" v-permission="permission.delete">{{$t('common.button.delete')}}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-table :data="dataList" border stripe fit highlight-current-row v-loading="loading" :element-loading-text="$t('common.label.inthequery')" @selection-change="handleSelectionChange" style="width: 100%;">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" class="demo-table-expand">
              <el-form-item :label="$t('common.label.createuser')">
                <span>{{props.row.createUser}}</span>
              </el-form-item>
              <el-form-item :label="$t('carouselmapconfig.label.jumplink')">
                <span>{{props.row.jumpLink}}</span>
              </el-form-item>
              <el-form-item :label="$t('carouselmapconfig.label.imageurl')">
                <div class="my-upload" style="width: 178px; height: 178px;">
                  <img :src="props.row.imageUrl" alt="">
                </div>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="title" :label="$t('carouselmapconfig.label.title')" min-width="110"></el-table-column>
        <el-table-column prop="positionLabel" :label="$t('carouselmapconfig.label.position')"></el-table-column>
        <el-table-column prop="displaySideLabel" :label="$t('carouselmapconfig.label.displayside')"></el-table-column>
        <el-table-column prop="effectiveTypeLabel" :label="$t('carouselmapconfig.label.effectivetype')"></el-table-column>
        <el-table-column prop="effectiveStartTime" :label="$t('carouselmapconfig.label.effectivestarttime')" :formatter="dateFormat" width="180"></el-table-column>
        <el-table-column prop="effectiveEndTime" :label="$t('carouselmapconfig.label.effectiveendtime')" :formatter="dateFormat" width="180"></el-table-column>
        <el-table-column prop="createTime" :label="$t('common.label.createtime')" :formatter="dateFormat" width="180"></el-table-column>
        <el-table-column :label="$t('common.label.operate')" width="80">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index,scope.row)" v-permission="permission.edit">{{$t('common.button.edit')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col class="toolbar">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="filters.pageNum" :page-size="filters.pageSize" :page-sizes="[10,20,30,40,50,100,200,300,400,500]" :total="total" layout="total,sizes,prev,pager,next,jumper" style="float: right;"></el-pagination>
      </el-col>
      <el-dialog :title="$t('carouselmapconfig.label.addtitle')" :visible.sync="addFormVisible" :close-on-click-modal="false" size="tiny">
        <el-form :model="addForm" ref="addForm" :rules="formRules">
          <el-form-item prop="position" :label="$t('carouselmapconfig.label.position')" :label-width="formLabelWidth">
            <el-radio-group v-model="addForm.position" @change="handleAddPositionChange">
              <el-radio-button v-for="item in positionList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="title" :label="$t('carouselmapconfig.label.title')" :label-width="formLabelWidth">
            <el-input v-model="addForm.title"></el-input>
          </el-form-item>
          <el-form-item prop="effectiveType" :label="$t('carouselmapconfig.label.effectivetype')" :label-width="formLabelWidth">
            <el-radio-group v-model="addForm.effectiveType" @change="handleAddEffectiveTypeChange">
              <el-radio border v-for="item in effectiveTypeList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('carouselmapconfig.label.effectivetime')" :label-width="formLabelWidth" v-show="addTypeVisible">
            <el-date-picker v-model="addForm.maintenanceTime" type="datetimerange" :range-separator="$t('common.label.to')" :start-placeholder="$t('carouselmapconfig.label.starttime')" :end-placeholder="$t('carouselmapconfig.label.endtime')"></el-date-picker>
          </el-form-item>
          <el-form-item prop="imageUrl" :label="$t('carouselmapconfig.label.imageurl')" :label-width="formLabelWidth">
            <upload ref="addUpload" :item="addForm" size="178px" @change="handleAddSuccess"></upload>
          </el-form-item>
          <el-form-item prop="jumpLink" :label="$t('carouselmapconfig.label.jumplink')" :label-width="formLabelWidth">
            <el-input v-model="addForm.jumpLink"></el-input>
          </el-form-item>
          <el-form-item prop="displaySide" :label="$t('carouselmapconfig.label.displayside')" :label-width="formLabelWidth">
            <el-radio-group v-model="addForm.displaySide" @change="handleAddDisplaySideChange">
              <el-radio-button v-for="item in displaySideList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="associateId" :label="$t('carouselmapconfig.label.activityposition')" :label-width="formLabelWidth">
            <el-select v-model="addForm.associateId" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in associateIdList" :label="item.title" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible=false" v-permission="permission.add">{{$t('common.button.cancel')}}</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading" v-permission="permission.add">{{$t('common.button.submit')}}</el-button>
        </div>
      </el-dialog>
      <el-dialog :title="$t('carouselmapconfig.label.edittitle')" :visible.sync="editFormVisible" :close-on-click-modal="false" size="tiny">
        <el-form :model="editForm" ref="editForm" :rules="formRules">
          <el-form-item prop="position" :label="$t('carouselmapconfig.label.position')" :label-width="formLabelWidth">
            <el-radio-group v-model="editForm.position" @change="handleEditPositionChange">
              <el-radio-button v-for="item in positionList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="title" :label="$t('carouselmapconfig.label.title')" :label-width="formLabelWidth">
            <el-input v-model="editForm.title"></el-input>
          </el-form-item>
          <el-form-item prop="effectiveType" :label="$t('carouselmapconfig.label.effectivetype')" :label-width="formLabelWidth">
            <el-radio-group v-model="editForm.effectiveType" @change="handleEditEffectiveTypeChange">
              <el-radio border v-for="item in effectiveTypeList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('carouselmapconfig.label.effectivetime')" :label-width="formLabelWidth" v-show="editTypeVisible">
            <el-date-picker v-model="editForm.maintenanceTime" type="datetimerange" :range-separator="$t('common.label.to')" :start-placeholder="$t('carouselmapconfig.label.starttime')" :end-placeholder="$t('carouselmapconfig.label.endtime')"></el-date-picker>
          </el-form-item>
          <el-form-item prop="imageUrl" :label="$t('carouselmapconfig.label.imageurl')" :label-width="formLabelWidth">
            <upload ref="editUpload" :item="editForm" size="178px" @change="handleEditSuccess"></upload>
          </el-form-item>
          <el-form-item prop="jumpLink" :label="$t('carouselmapconfig.label.jumplink')" :label-width="formLabelWidth">
            <el-input v-model="editForm.jumpLink"></el-input>
          </el-form-item>
          <el-form-item prop="displaySide" :label="$t('carouselmapconfig.label.displayside')" :label-width="formLabelWidth">
            <el-radio-group v-model="editForm.displaySide" @change="handleEditDisplaySideChange">
              <el-radio-button v-for="item in displaySideList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="associateId" :label="$t('carouselmapconfig.label.activityposition')" :label-width="formLabelWidth">
            <el-select v-model="editForm.associateId" clearable>
              <el-option v-for="item in associateIdList" :label="item.title" :value="item.id" :key="item.id"></el-option>
            </el-select>
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

  import CarouselMapConfigJS from './CarouselMapConfig.js'

  export default CarouselMapConfigJS
</script>
