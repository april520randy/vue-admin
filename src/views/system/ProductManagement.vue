<template>
  <div class="app-container">
    <section>
      <el-col class="toolbar" style="padding-bottom: 0px;">
        <el-form :model="filters" ref="filters" :inline="true">
          <el-form-item prop="code" :label="$t('product.label.code')">
            <el-input v-model="filters.code"></el-input>
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
        <el-table-column type="index" :label="$t('common.label.index')" width="70"></el-table-column>
        <el-table-column prop="code" :label="$t('product.label.code')"></el-table-column>
        <el-table-column prop="name" :label="$t('product.label.name')"></el-table-column>
        <el-table-column :label="$t('product.label.description')" min-width="150">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>{{$t('product.label.description')}}:{{scope.row.description}}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{scope.row.description}}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" :label="$t('common.label.createtime')" :formatter="dateFormat" width="180"></el-table-column>
        <el-table-column prop="createUser" :label="$t('common.label.createuser')"></el-table-column>
        <el-table-column :label="$t('common.label.operate')" width="80">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index,scope.row)" v-permission="permission.edit">{{$t('common.button.edit')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col class="toolbar">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="filters.pageNum" :page-size="filters.pageSize" :page-sizes="[10,20,30,40,50,100,200,300,400,500]" :total="total" layout="total,sizes,prev,pager,next,jumper" style="float: right;"></el-pagination>
      </el-col>
      <el-dialog :title="$t('product.label.addtitle')" :visible.sync="addFormVisible" :close-on-click-modal="false" size="tiny">
        <el-form :model="addForm" ref="addForm" :rules="formRules">
          <el-form-item prop="code" :label="$t('product.label.code')" :label-width="formLabelWidth">
            <el-input v-model="addForm.code"></el-input>
          </el-form-item>
          <el-form-item prop="name" :label="$t('product.label.name')" :label-width="formLabelWidth">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>
          <el-form-item prop="description" :label="$t('product.label.description')" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="addForm.description"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible=false" v-permission="permission.add">{{$t('common.button.cancel')}}</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading" v-permission="permission.add">{{$t('common.button.submit')}}</el-button>
        </div>
      </el-dialog>
      <el-dialog :title="$t('product.label.edittitle')" :visible.sync="editFormVisible" :close-on-click-modal="false" size="tiny">
        <el-form :model="editForm" ref="editForm" :rules="formRules">
          <el-form-item prop="code" :label="$t('product.label.code')" :label-width="formLabelWidth">
            <el-input v-model="editForm.code" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item prop="name" :label="$t('product.label.name')" :label-width="formLabelWidth">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>
          <el-form-item prop="description" :label="$t('product.label.description')" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="editForm.description"></el-input>
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

  import ProductManagementJS from './ProductManagement.js'

  export default ProductManagementJS
</script>
