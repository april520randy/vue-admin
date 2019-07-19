<template>
  <div class="app-container">
    <section>
      <el-col class="toolbar" style="padding-bottom: 0px;">
        <el-form :model="filters" ref="filters" :inline="true">
          <el-form-item prop="cardZHName" :label="$t('thirdpointcard.label.cardzhname')">
            <el-input v-model="filters.cardZHName"></el-input>
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
              <el-form-item :label="$t('thirdpointcard.label.cardenname')">
                <span>{{props.row.cardENName}}</span>
              </el-form-item>
              <el-form-item :label="$t('thirdpointcard.label.carddenomination')">
                <span>{{props.row.cardDenomination}}</span>
              </el-form-item>
              <el-form-item :label="$t('thirdpointcard.label.recommend')">
                <span>{{props.row.recommendLabel}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="cardCode" :label="$t('thirdpointcard.label.cardcode')"></el-table-column>
        <el-table-column prop="cardZHName" :label="$t('thirdpointcard.label.cardzhname')"></el-table-column>
        <el-table-column prop="cardRate" :label="$t('thirdpointcard.label.cardrate')"></el-table-column>
        <el-table-column prop="itemSort" :label="$t('thirdpointcard.label.itemsort')"></el-table-column>
        <el-table-column :label="$t('thirdpointcard.label.useable')">
          <template slot-scope="scope">
            <span v-if="scope.row.useable==='N'" style="color: red;">{{scope.row.useableLabel}}</span>
            <span v-if="scope.row.useable==='Y'" style="color: blue;">{{scope.row.useableLabel}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" :label="$t('common.label.createtime')" :formatter="dateFormat" width="180"></el-table-column>
        <el-table-column prop="createUser" :label="$t('common.label.createuser')"></el-table-column>
        <el-table-column :label="$t('common.label.operate')" width="150">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index,scope.row)" v-permission="permission.edit">{{$t('common.button.edit')}}</el-button>
            <el-button v-if="scope.row.useable==='N'" size="mini" @click="handleStatus(scope.$index,scope.row,'Y')" v-permission="permission.enabled">{{$t('common.button.enabled')}}</el-button>
            <el-button v-if="scope.row.useable==='Y'" size="mini" type="danger" @click="handleStatus(scope.$index,scope.row,'N')" v-permission="permission.disabled">{{$t('common.button.disabled')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col class="toolbar">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="filters.pageNum" :page-size="filters.pageSize" :page-sizes="[10,20,30,40,50,100,200,300,400,500]" :total="total" layout="total,sizes,prev,pager,next,jumper" style="float: right;"></el-pagination>
      </el-col>
      <el-dialog :title="$t('thirdpointcard.label.addtitle')" :visible.sync="addFormVisible" :close-on-click-modal="false" size="tiny">
        <el-form :model="addForm" ref="addForm" :rules="formRules">
          <el-form-item prop="cardCode" :label="$t('thirdpointcard.label.cardcode')" :label-width="formLabelWidth">
            <el-input v-model="addForm.cardCode"></el-input>
          </el-form-item>
          <el-form-item prop="cardZHName" :label="$t('thirdpointcard.label.cardzhname')" :label-width="formLabelWidth">
            <el-input v-model="addForm.cardZHName"></el-input>
          </el-form-item>
          <el-form-item prop="cardENName" :label="$t('thirdpointcard.label.cardenname')" :label-width="formLabelWidth">
            <el-input v-model="addForm.cardENName"></el-input>
          </el-form-item>
          <el-form-item prop="cardRate" :label="$t('thirdpointcard.label.cardrate')" :label-width="formLabelWidth">
            <el-input v-model="addForm.cardRate"></el-input>
          </el-form-item>
          <el-form-item prop="cardDenomination" :label="$t('thirdpointcard.label.carddenomination')" :label-width="formLabelWidth">
            <el-input v-model="addForm.cardDenomination"></el-input>
          </el-form-item>
          <el-form-item prop="itemSort" :label="$t('thirdpointcard.label.itemsort')" :label-width="formLabelWidth">
            <el-input v-model="addForm.itemSort"></el-input>
          </el-form-item>
          <el-form-item prop="recommend" :label="$t('thirdpointcard.label.recommend')" :label-width="formLabelWidth">
            <el-radio-group v-model="addForm.recommend">
              <el-radio border v-for="item in ynList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible=false" v-permission="permission.add">{{$t('common.button.cancel')}}</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading" v-permission="permission.add">{{$t('common.button.submit')}}</el-button>
        </div>
      </el-dialog>
      <el-dialog :title="$t('thirdpointcard.label.edittitle')" :visible.sync="editFormVisible" :close-on-click-modal="false" size="tiny">
        <el-form :model="editForm" ref="editForm" :rules="formRules">
          <el-form-item prop="cardCode" :label="$t('thirdpointcard.label.cardcode')" :label-width="formLabelWidth">
            <el-input v-model="editForm.cardCode"></el-input>
          </el-form-item>
          <el-form-item prop="cardZHName" :label="$t('thirdpointcard.label.cardzhname')" :label-width="formLabelWidth">
            <el-input v-model="editForm.cardZHName"></el-input>
          </el-form-item>
          <el-form-item prop="cardENName" :label="$t('thirdpointcard.label.cardenname')" :label-width="formLabelWidth">
            <el-input v-model="editForm.cardENName"></el-input>
          </el-form-item>
          <el-form-item prop="cardRate" :label="$t('thirdpointcard.label.cardrate')" :label-width="formLabelWidth">
            <el-input v-model="editForm.cardRate"></el-input>
          </el-form-item>
          <el-form-item prop="cardDenomination" :label="$t('thirdpointcard.label.carddenomination')" :label-width="formLabelWidth">
            <el-input v-model="editForm.cardDenomination"></el-input>
          </el-form-item>
          <el-form-item prop="itemSort" :label="$t('thirdpointcard.label.itemsort')" :label-width="formLabelWidth">
            <el-input v-model="editForm.itemSort"></el-input>
          </el-form-item>
          <el-form-item prop="useable" :label="$t('thirdpointcard.label.useable')" :label-width="formLabelWidth">
            <el-radio-group v-model="editForm.useable">
              <el-radio border v-for="item in edList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="recommend" :label="$t('thirdpointcard.label.recommend')" :label-width="formLabelWidth">
            <el-radio-group v-model="editForm.recommend">
              <el-radio border v-for="item in ynList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-radio>
            </el-radio-group>
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

  import ThirdPointCardManagementJS from './ThirdPointCardManagement.js'

  export default ThirdPointCardManagementJS
</script>
