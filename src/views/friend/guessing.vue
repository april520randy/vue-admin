<template>
  <div class="app-container">
    <section>
      <el-col class="toolbar parent" style="padding-bottom: 0px;">
        <el-form :model="filters" ref="filters" :inline="true">
          <el-form-item prop="beginTime" :label="$t('guessing.label.begintime')">
            <template >
              <div class="block">
                <el-date-picker v-model="filters.theTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime"  placeholder="选择日期时间">  </el-date-picker>至
                <el-date-picker v-model="filters.endTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime"  placeholder="选择日期时间">  </el-date-picker>
              </div>
            </template>
          </el-form-item>

          <el-form-item prop="status" :label="$t('guessing.label.status')">
            <el-select v-model="filters.status" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in edList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="id" :label="$t('guessing.label.id')">
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
            <el-button type="primary" @click="handleAdd">{{$t('common.button.add')}}</el-button>
            <el-button type="danger" @click="handleBatchDelete">{{$t('common.button.delete')}}</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <el-table :data="dataList" border stripe fit highlight-current-row v-loading="loading" :element-loading-text="$t('common.label.inthequery')" @selection-change="handleSelectionChange" style="width: 100%;">

        <el-table-column type="selection" min-width="5%"></el-table-column>
        <el-table-column prop="id" :label="$t('guessing.label.id')" min-width="5%"></el-table-column>
        <el-table-column prop="theme" :label="$t('guessing.label.theme')" min-width="18%"></el-table-column>
        <el-table-column prop="optiona" :label="$t('guessing.label.optiona')" min-width="8%"></el-table-column>
        <el-table-column prop="optionb" :label="$t('guessing.label.optionb')" min-width="8%"></el-table-column>
        <el-table-column prop="result" :label="$t('guessing.label.result')" min-width="8%"></el-table-column>
        <el-table-column prop="oddsa" :label="$t('guessing.label.odds')" min-width="6%">

        </el-table-column>
        <el-table-column prop="type" :label="$t('guessing.label.type')" min-width="6%"></el-table-column>
        <el-table-column prop="totalBet" :label="$t('guessing.label.totalbet')" min-width="6%"></el-table-column>
        <el-table-column prop="profitLoss" :label="$t('guessing.label.profitloss')" min-width="4%"></el-table-column>

        <el-table-column  :label="$t('guessing.label.status')" min-width="8%">
          <template slot-scope="scope">
            <span v-if="scope.row.status=='0'" style="color: blue;">{{$t('guessing.label.sealed0')}}</span>
            <span v-if="scope.row.status=='1'" style="color: blue;">{{$t('guessing.label.sealed1')}}</span>
            <span v-if="scope.row.status=='2'" style="color: red;">{{$t('guessing.label.sealed2')}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="beginTime":label="$t('guessing.label.begintime')"  :formatter="dateFormat" min-width="7%"></el-table-column>
        <el-table-column prop="endTime":label="$t('guessing.label.endtime')"  :formatter="dateFormat" min-width="7%"></el-table-column>
        <el-table-column :label="$t('guessing.label.list')" min-width="6%">

        </el-table-column>
        <el-table-column :label="$t('common.label.operate')" min-width="8%">
          <template slot-scope="scope">
            <el-button v-if="scope.row.onOff=='0'" size="mini"type="danger" @click="handleStatus(scope.$index,scope.row,'1')">{{$t('common.button.disabled')}}</el-button>
            <el-button v-if="scope.row.onOff=='1'" size="mini"  @click="handleStatus(scope.$index,scope.row,'0')">{{$t('common.button.enabled')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col class="toolbar">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="filters.pageNum" :page-size="filters.pageSize" :page-sizes="[10,20,30,40,50,100,200,300,400,500]" :total="total" layout="total,sizes,prev,pager,next,jumper" style="float: right;"></el-pagination>
      </el-col>

      <el-dialog :title="$t('guessing.label.addtitle')" :visible.sync="addFormVisible" :close-on-click-modal="false" size="tiny">
        <el-form :model="addForm" ref="addForm" :rules="formRules">
          <el-form-item prop="theme" :label="$t('guessing.label.theme')" :label-width="formLabelWidth">
            <el-input v-model="addForm.theme"></el-input>
          </el-form-item>
          <el-form-item prop="content" :label="$t('guessing.label.content')" :label-width="formLabelWidth">
            <el-input v-model="addForm.content"></el-input>
          </el-form-item>

         <el-form-item prop="url" :label="$t('guessing.label.image')" :label-width="formLabelWidth">
            <el-upload class="avatar-uploader"
                       action="https://jsonplaceholder.typicode.com/posts/"
                       :show-file-list="false"
                       :on-success="handleAvatarSuccess"
                       :before-upload="(value)=> beforeAvatarUpload('0',value)">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <el-form-item prop="optionA" :label="$t('guessing.label.optiona')" :label-width="formLabelWidth">
            <el-input v-model="addForm.optiona"></el-input>
          </el-form-item>
          <el-form-item prop="oddsa" :label="$t('guessing.label.oddsa')" :label-width="formLabelWidth">
            <el-input v-model="addForm.oddsa"></el-input>
          </el-form-item>
          <el-form-item prop="optionb" :label="$t('guessing.label.optionb')" :label-width="formLabelWidth">
            <el-input v-model="addForm.optionb"></el-input>
          </el-form-item>
          <el-form-item prop="oddsb" :label="$t('guessing.label.oddsb')" :label-width="formLabelWidth">
            <el-input v-model="addForm.oddsb"></el-input>
          </el-form-item>

           <el-form-item prop="urla" :label="$t('guessing.label.urla')" :label-width="formLabelWidth">
              <el-upload class="avatar-uploader"
                         action="https://jsonplaceholder.typicode.com/posts/"
                         :show-file-list="false"
                         :on-success="handleAvatarSuccess"
                         :before-upload="(value)=> beforeAvatarUpload('1',value)">
                <img v-if="imageUrla" :src="imageUrla" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
           <el-form-item prop="urlb" :label="$t('guessing.label.urlb')" :label-width="formLabelWidth">
             <el-upload class="avatar-uploader"
               action="https://jsonplaceholder.typicode.com/posts/"
               :show-file-list="false"
               :on-success="handleAvatarSuccess"
               :before-upload="(value)=> beforeAvatarUpload('2',value)">
               <img v-if="imageUrlb" :src="imageUrlb" class="avatar">
               <i v-else class="el-icon-plus avatar-uploader-icon"></i>
             </el-upload>
           </el-form-item>

          <el-form-item prop="beginTime" :label="$t('guessing.label.begintime')" :label-width="formLabelWidth">
            <template >
              <div class="block">
                <el-date-picker v-model="addForm.beginTime"  type="datetime"  placeholder="选择日期时间">  </el-date-picker>
              </div>
            </template>
          </el-form-item>
          <el-form-item prop="endTime" :label="$t('guessing.label.endtime')" :label-width="formLabelWidth">
            <template >
              <div class="block">
                <el-date-picker v-model="addForm.endTime" type="datetime"  placeholder="选择日期时间">  </el-date-picker>
              </div>
            </template>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible=false">{{$t('common.button.cancel')}}</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">{{$t('common.button.submit')}}</el-button>
        </div>
      </el-dialog>

        <!-- 列表 -->
      <el-dialog :title="$t('guessing.label.listtitle')" :visible.sync="listFormVisible" :close-on-click-modal="false" size="tiny">
        <el-form :model="listForm" ref="listForm" :rules="formRules">
          <el-table :data="guessingList" border stripe fit highlight-current-row v-loading="loading" :element-loading-text="$t('common.label.inthequery')" @selection-change="handleSelectionChange1" style="width: 100%;">
            <el-table-column prop="theme" :label="$t('guessing.label.theme')" width="200px"></el-table-column>
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

  import guessingJS from './guessing.js'

  export default guessingJS
</script>

<style rel="stylesheet/scss" lang="scss">

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

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
