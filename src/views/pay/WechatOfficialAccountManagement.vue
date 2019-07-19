<template>
  <div class="app-container">
    <section>
      <el-col class="toolbar" style="padding-bottom: 0px;">
        <el-form :model="filters" ref="filters" :inline="true">
          <el-form-item prop="merchantCode" :label="$t('wechatofficialaccount.label.merchantcode')">
            <el-input v-model="filters.merchantCode"></el-input>
          </el-form-item>
          <el-form-item prop="useable" :label="$t('wechatofficialaccount.label.useable')">
            <el-select v-model="filters.useable" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in edList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="channelType" :label="$t('wechatofficialaccount.label.channeltype')">
            <el-select v-model="filters.channelType" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in channelTypeList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="productCode" :label="$t('common.label.product')">
            <product-select :item="filters"></product-select>
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
          </el-form-item>
        </el-form>
      </el-col>
      <el-table :data="dataList" border stripe fit highlight-current-row v-loading="loading" :element-loading-text="$t('common.label.inthequery')" style="width: 100%;">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" class="demo-table-expand">
              <el-form-item :label="$t('wechatofficialaccount.label.notifyurl')">
                <span>{{props.row.notifyUrl}}</span>
              </el-form-item>
              <el-form-item :label="$t('wechatofficialaccount.label.mallurl')">
                <span>{{props.row.mallUrl}}</span>
              </el-form-item>
              <el-form-item :label="$t('wechatofficialaccount.label.middurl')">
                <span>{{props.row.middUrl}}</span>
              </el-form-item>
              <el-form-item :label="$t('wechatofficialaccount.label.apiurl')">
                <span>{{props.row.apiUrl}}</span>
              </el-form-item>
              <el-form-item :label="$t('common.label.createtime')">
                <span>{{dateFormatItem(props.row)}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="index" :label="$t('common.label.index')" width="70"></el-table-column>
        <el-table-column prop="payName" :label="$t('wechatofficialaccount.label.payname')"></el-table-column>
        <el-table-column prop="merchantCode" :label="$t('wechatofficialaccount.label.merchantcode')" width="120"></el-table-column>
        <el-table-column prop="maximumAmount" :label="$t('wechatofficialaccount.label.maximumamount')" width="150"></el-table-column>
        <el-table-column prop="accumulatedAmount" :label="$t('wechatofficialaccount.label.accumulatedamount')" width="150"></el-table-column>
        <el-table-column prop="channelTypeLabel" :label="$t('wechatofficialaccount.label.channeltype')" width="130"></el-table-column>
        <el-table-column :label="$t('wechatofficialaccount.label.useable')" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.useable==='N'" style="color: red;">{{scope.row.useableLabel}}</span>
            <span v-if="scope.row.useable==='Y'" style="color: blue;">{{scope.row.useableLabel}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="productName" :label="$t('common.label.product')" width="100"></el-table-column>
        <el-table-column :label="$t('common.label.operate')" width="150">
          <template slot-scope="scope">
            <el-button v-if="scope.row.useable==='N'" size="mini" @click="handleStatus(scope.$index,scope.row,'Y')">{{$t('common.button.enabled')}}</el-button>
            <el-button v-if="scope.row.useable==='Y'" size="mini" type="danger" @click="handleStatus(scope.$index,scope.row,'N')">{{$t('common.button.disabled')}}</el-button>
            <el-button size="mini" @click="handleEdit(scope.$index,scope.row)">{{$t('common.button.edit')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col class="toolbar">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="filters.pageNum" :page-size="filters.pageSize" :page-sizes="[10,20,30,40,50,100,200,300,400,500]" :total="total" layout="total,sizes,prev,pager,next,jumper" style="float: right;"></el-pagination>
      </el-col>
      <el-dialog :title="$t('wechatofficialaccount.label.addtitle')" :visible.sync="addFormVisible" :close-on-click-modal="false" size="tiny">
        <el-form :model="addForm" ref="addForm" :rules="formRules">
          <el-form-item prop="payName" :label="$t('wechatofficialaccount.label.payname')" :label-width="formLabelWidth">
            <el-input v-model="addForm.payName"></el-input>
          </el-form-item>
          <el-form-item prop="merchantCode" :label="$t('wechatofficialaccount.label.merchantcode')" :label-width="formLabelWidth">
            <el-input v-model="addForm.merchantCode"></el-input>
          </el-form-item>
          <el-form-item prop="merchantSecret" :label="$t('wechatofficialaccount.label.merchantsecret')" :label-width="formLabelWidth">
            <el-input v-model="addForm.merchantSecret"></el-input>
          </el-form-item>
          <el-form-item prop="notifyUrl" :label="$t('wechatofficialaccount.label.notifyurl')" :label-width="formLabelWidth">
            <el-input v-model="addForm.notifyUrl"></el-input>
          </el-form-item>
          <el-form-item prop="mallUrl" :label="$t('wechatofficialaccount.label.mallurl')" :label-width="formLabelWidth">
            <el-input v-model="addForm.mallUrl"></el-input>
          </el-form-item>
          <el-form-item prop="middUrl" :label="$t('wechatofficialaccount.label.middurl')" :label-width="formLabelWidth">
            <el-input v-model="addForm.middUrl"></el-input>
          </el-form-item>
          <el-form-item prop="apiUrl" :label="$t('wechatofficialaccount.label.apiurl')" :label-width="formLabelWidth">
            <el-input v-model="addForm.apiUrl"></el-input>
          </el-form-item>
          <el-form-item prop="maximumAmount" :label="$t('wechatofficialaccount.label.maximumamount')" :label-width="formLabelWidth">
            <el-input v-model="addForm.maximumAmount"></el-input>
          </el-form-item>
          <el-form-item prop="channelType" :label="$t('wechatofficialaccount.label.channeltype')" :label-width="formLabelWidth">
            <el-select v-model="addForm.channelType" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in channelTypeList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="remain" :label="$t('wechatofficialaccount.label.remain')" :label-width="formLabelWidth">
            <el-input v-model="addForm.remain"></el-input>
          </el-form-item>
          <el-form-item prop="remark" :label="$t('wechatofficialaccount.label.remark')" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="addForm.remark"></el-input>
          </el-form-item>
          <el-form-item prop="productCode" :label="$t('common.label.product')" :label-width="formLabelWidth">
            <product-select :item="addForm"></product-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible=false">{{$t('common.button.cancel')}}</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">{{$t('common.button.submit')}}</el-button>
        </div>
      </el-dialog>
      <el-dialog :title="$t('wechatofficialaccount.label.edittitle')" :visible.sync="editFormVisible" :close-on-click-modal="false" size="tiny">
        <el-form :model="editForm" ref="editForm" :rules="formRules">
          <el-form-item prop="payName" :label="$t('wechatofficialaccount.label.payname')" :label-width="formLabelWidth">
            <el-input v-model="editForm.payName"></el-input>
          </el-form-item>
          <el-form-item prop="merchantCode" :label="$t('wechatofficialaccount.label.merchantcode')" :label-width="formLabelWidth">
            <label>{{editForm.merchantCode}}</label>
          </el-form-item>
          <el-form-item prop="notifyUrl" :label="$t('wechatofficialaccount.label.notifyurl')" :label-width="formLabelWidth">
            <label>{{editForm.notifyUrl}}</label>
          </el-form-item>
          <el-form-item prop="mallUrl" :label="$t('wechatofficialaccount.label.mallurl')" :label-width="formLabelWidth">
            <label>{{editForm.mallUrl}}</label>
          </el-form-item>
          <el-form-item prop="middUrl" :label="$t('wechatofficialaccount.label.middurl')" :label-width="formLabelWidth">
            <label>{{editForm.middUrl}}</label>
          </el-form-item>
          <el-form-item prop="apiUrl" :label="$t('wechatofficialaccount.label.apiurl')" :label-width="formLabelWidth">
            <label>{{editForm.apiUrl}}</label>
          </el-form-item>
          <el-form-item prop="maximumAmount" :label="$t('wechatofficialaccount.label.maximumamount')" :label-width="formLabelWidth">
            <el-input v-model="editForm.maximumAmount"></el-input>
          </el-form-item>
          <el-form-item prop="channelType" :label="$t('wechatofficialaccount.label.channeltype')" :label-width="formLabelWidth">
            <el-select v-model="editForm.channelType" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in channelTypeList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="remark" :label="$t('wechatofficialaccount.label.remark')" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="editForm.remark"></el-input>
          </el-form-item>
          <el-form-item prop="productCode" :label="$t('common.label.product')" :label-width="formLabelWidth">
            <product-select :item="editForm"></product-select>
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

  import WechatOfficialAccountManagementJS from './WechatOfficialAccountManagement.js'

  export default WechatOfficialAccountManagementJS
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

  .el-form--inline .el-form-item {
    display: inline-block;
    margin-right: 5px;
    vertical-align: top;
  }
</style>
