<template>
  <div class="app-container">
    <section>
      <el-col class="toolbar" style="padding-bottom: 0px;">
        <el-form :model="filters" ref="filters" :inline="true">
          <el-form-item prop="code" :label="$t('switch.label.code')">
            <el-input v-model="filters.code"></el-input>
          </el-form-item>
          <el-form-item prop="type" :label="$t('switch.label.type')">
            <el-select v-model="filters.type" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in typeList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="status" :label="$t('switch.label.status')">
            <el-select v-model="filters.status" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in statusList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="productCode" :label="$t('common.label.product')" v-show="showProduct()">
            <product-select :item="filters"></product-select>
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
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="code" :label="$t('switch.label.code')"></el-table-column>
        <el-table-column prop="name" :label="$t('switch.label.name')"></el-table-column>
        <el-table-column prop="typeLabel" :label="$t('switch.label.type')" width="100"></el-table-column>
        <el-table-column :label="$t('switch.label.status')" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.status==='N'" style="color: red;">{{scope.row.statusLabel}}</span>
            <span v-if="scope.row.status==='Y'" style="color: blue;">{{scope.row.statusLabel}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="startTime" :label="$t('switch.label.starttime')" :formatter="dateFormat" width="180"></el-table-column>
        <el-table-column prop="endTime" :label="$t('switch.label.endtime')" :formatter="dateFormat" width="180"></el-table-column>
        <el-table-column prop="createTime" :label="$t('common.label.createtime')" :formatter="dateFormat" width="180"></el-table-column>
        <el-table-column :label="$t('common.label.operate')" width="155">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index,scope.row)" v-permission="permission.edit">{{$t('common.button.edit')}}</el-button>
            <el-button size="mini" type="success" @click="handleOpen(scope.$index,scope.row)" v-if="scope.row.status==='N'" v-permission="permission.open">{{$t('common.button.open')}}</el-button>
            <el-button size="mini" type="danger" @click="handleClose(scope.$index,scope.row)" v-if="scope.row.status==='Y'" v-permission="permission.close">{{$t('common.button.close')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col class="toolbar">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="filters.pageNum" :page-size="filters.pageSize" :page-sizes="[10,20,30,40,50,100,200,300,400,500]" :total="total" layout="total,sizes,prev,pager,next,jumper" style="float: right;"></el-pagination>
      </el-col>
      <el-dialog :title="$t('switch.label.addtitle')" :visible.sync="addFormVisible" :close-on-click-modal="false" size="tiny">
        <el-form :model="addForm" ref="addForm" :rules="formRules">
          <el-form-item prop="type" :label="$t('switch.label.type')" :label-width="formLabelWidth">
            <el-radio-group v-model="addForm.type">
              <el-radio-button v-for="item in typeList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="code" :label="$t('switch.label.code')" :label-width="formLabelWidth">
            <el-input v-model="addForm.code"></el-input>
          </el-form-item>
          <el-form-item prop="name" :label="$t('switch.label.name')" :label-width="formLabelWidth">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible=false" v-permission="permission.add">{{$t('common.button.cancel')}}</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading" v-permission="permission.add">{{$t('common.button.submit')}}</el-button>
        </div>
      </el-dialog>
      <el-dialog :title="$t('switch.label.edittitle')" :visible.sync="editFormVisible" :close-on-click-modal="false" size="tiny">
        <el-form :model="editForm" ref="editForm" :rules="formRules">
          <el-form-item prop="type" :label="$t('switch.label.type')" :label-width="formLabelWidth">
            <el-radio-group v-model="editForm.type">
              <el-radio-button v-for="item in typeList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="code" :label="$t('switch.label.code')" :label-width="formLabelWidth">
            <el-input v-model="editForm.code" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item prop="name" :label="$t('switch.label.name')" :label-width="formLabelWidth">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editFormVisible=false" v-permission="permission.edit">{{$t('common.button.cancel')}}</el-button>
          <el-button type="primary" @click.native="editSubmit" :loading="editLoading" v-permission="permission.edit">{{$t('common.button.submit')}}</el-button>
        </div>
      </el-dialog>
      <el-dialog :title="$t('switch.label.closetitle')" :visible.sync="closeFormVisible" :close-on-click-modal="false" size="tiny">
        <div class="block">
          <span class="demonstration">{{$t('common.label.choose')}}</span>
          <el-date-picker v-model="closeForm.maintenanceTime" type="datetimerange" :range-separator="$t('common.label.to')" :start-placeholder="$t('switch.label.starttime')" :end-placeholder="$t('switch.label.endtime')"></el-date-picker>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="closeFormVisible=false" v-permission="permission.close">{{$t('common.button.cancel')}}</el-button>
          <el-button type="primary" @click.native="closeSubmit" :loading="closeLoading" v-permission="permission.close">{{$t('common.button.submit')}}</el-button>
        </div>
      </el-dialog>
    </section>
  </div>
</template>

<script>

  import SwitchManagementJS from './SwitchManagement.js'

  export default SwitchManagementJS
</script>
