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
          <el-form-item prop="flag" :label="$t('findexSetting.label.flag')">
            <el-select v-model="filters.flag" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in edList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="type" :label="$t('findexSetting.label.type')">
            <el-select v-model="filters.type" clearable :placeholder="$t('findexSetting.label.type')">
              <el-option v-for="item in typeList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="id" :label="$t('findexSetting.label.id')">
            <el-input v-model="filters.id"></el-input>
          </el-form-item>
          <el-form-item prop="indexSort" :label="$t('findexSetting.label.indexsort')">
            <el-input v-model="filters.indexSort"></el-input>
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
          </el-form-item>
        </el-form>
      </el-col>
      <el-table :data="dataList" border stripe fit highlight-current-row v-loading="loading" :element-loading-text="$t('common.label.inthequery')" @selection-change="handleSelectionChange" style="width: 100%;">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" :label="$t('findexSetting.label.id')" min-width="50"></el-table-column>
        <el-table-column  :label="$t('findexSetting.label.type')" min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.type==1" style="color: red;">发哥播报</span>
            <span v-if="scope.row.type==2" style="color: red;">今日热点</span>
          </template>
        </el-table-column>
        <el-table-column prop="title" :label="$t('findexSetting.label.title')" min-width="100"></el-table-column>
        <el-table-column prop="createUser" :label="$t('findexSetting.label.publish')" min-width="100"></el-table-column>
        <el-table-column  :label="$t('findexSetting.label.imgurl')" sortable width="180px">
          <template slot-scope="scope">
            <span  v-for="img in scope.row.imgUrlList"> <img :src="img" alt="" style="width: 50px"></span>
          </template>
        </el-table-column>

        <el-table-column  :label="$t('findexSetting.label.flag')" min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.flag==='Y'" style="color: blue;">{{$t('findexSetting.label.on')}}</span>
            <span v-if="scope.row.flag==='N'" style="color: red;">{{$t('findexSetting.label.off')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="indexSort" :label="$t('findexSetting.label.indexsort')" min-width="100"></el-table-column>
        <el-table-column prop="publishTime":label="$t('findexSetting.label.publishtime')"  :formatter="dateFormat" min-width="100"></el-table-column>
        <el-table-column prop="failureTime":label="$t('findexSetting.label.failuretime')"  :formatter="dateFormat" min-width="100"></el-table-column>
        <el-table-column :label="$t('common.label.operate')" width="80">
          <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index,scope.row)">{{$t('common.button.edit')}}</el-button>
        </template>
        </el-table-column>
      </el-table>
      <el-col class="toolbar">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="filters.pageNum" :page-size="filters.pageSize" :page-sizes="[10,20,30,40,50,100,200,300,400,500]" :total="total" layout="total,sizes,prev,pager,next,jumper" style="float: right;"></el-pagination>
      </el-col>

      <el-dialog :title="$t('findexSetting.label.addtitle')" :visible.sync="addFormVisible" :close-on-click-modal="false" size="tiny">

        <el-form :model="addForm" ref="addForm" :rules="formRules">
          <el-form-item prop="type" :label="$t('findexSetting.label.type')" :label-width="formLabelWidth" >
            <el-select v-model="addForm.type" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in typeList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="title" :label="$t('findexSetting.label.title')" :label-width="formLabelWidth">
            <el-input v-model="addForm.title"></el-input>
          </el-form-item>

          <el-form-item prop="flag" :label="$t('findexSetting.label.flag')" :label-width="formLabelWidth" >
            <el-select v-model="addForm.flag" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in edList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="indexType" :label="$t('findexSetting.label.indextype')" :label-width="formLabelWidth" >
            <el-select v-model="addForm.indexType" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in indexTypeList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="indexSort" :label="$t('findexSetting.label.indexsort')" :label-width="formLabelWidth">
            <el-input v-model="addForm.indexSort"></el-input>
          </el-form-item>

          <el-form-item prop="imgUrl" :label="$t('findexSetting.label.imgurl')" :label-width="formLabelWidth">
            <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handleAvatarSuccess"
              :on-remove="handleRemove"
              :limit="3"
              name="file"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传图片格式gif,jpg,png,jpeg,bmp，先选择图片，然后点击图片名字进行上传，上传是否成功有提示</div>
            </el-upload>

          </el-form-item>
          <el-form-item prop="content" :label="$t('findexSetting.label.content')" :label-width="formLabelWidth" >
            <vue-ueditor-wrap v-model="msg" @ready="ready" :config="myConfig"></vue-ueditor-wrap>
          </el-form-item>
          <el-form-item prop="publishTime" :label="$t('findexSetting.label.publishtime')" :label-width="formLabelWidth">
            <template >
              <div class="block">
                <el-date-picker v-model="addForm.publishTime"  type="datetime"  placeholder="选择日期时间">  </el-date-picker>
              </div>
            </template>
          </el-form-item>
          <el-form-item prop="failureTime" :label="$t('findexSetting.label.failuretime')" :label-width="formLabelWidth">
            <template >
              <div class="block">
                <el-date-picker v-model="addForm.failureTime" type="datetime"  placeholder="选择日期时间">  </el-date-picker>
              </div>
            </template>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible=false">{{$t('common.button.cancel')}}</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">{{$t('common.button.submit')}}</el-button>
        </div>
      </el-dialog>

      <el-dialog :title="$t('findexSetting.label.edittitle')" :visible.sync="editFormVisible" :close-on-click-modal="false" size="tiny">
        <el-form :model="editForm" ref="editForm" :rules="formRules">
          <el-form-item prop="type" :label="$t('findexSetting.label.type')" :label-width="formLabelWidth" >
            <el-select v-model="editForm.type" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in typeList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="title" :label="$t('findexSetting.label.title')" :label-width="formLabelWidth">
            <el-input v-model="editForm.title"></el-input>
          </el-form-item>
          <el-form-item prop="flag" :label="$t('findexSetting.label.flag')" :label-width="formLabelWidth" >
            <el-select v-model="editForm.flag" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in edList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="indexType" :label="$t('findexSetting.label.indextype')" :label-width="formLabelWidth" >
            <el-select v-model="editForm.indexType" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in indexTypeList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="indexSort" :label="$t('findexSetting.label.indexsort')" :label-width="formLabelWidth">
            <el-input v-model="editForm.indexSort"></el-input>
          </el-form-item>
          <el-form-item prop="imgUrl" :label="$t('findexSetting.label.imgurl')" :label-width="formLabelWidth">
              <span  v-for="img in imgUrlList"> <img :src="img" alt="" style="width: 100px"></span>
            <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handleEditSuccess"
              :on-remove="handleRemove"
              :limit="3"
              name="file"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传图片格式gif,jpg,png,jpeg,bmp，先选择图片，然后点击图片名字进行上传，上传是否成功有提示</div>
            </el-upload>

          </el-form-item>

          <el-form-item prop="content" :label="$t('findexSetting.label.content')" :label-width="formLabelWidth" >
            <vue-ueditor-wrap v-model="msg" @ready="ready" :config="myConfig"></vue-ueditor-wrap>
          </el-form-item>

          <el-form-item prop="publishTime" :label="$t('findexSetting.label.publishtime')" :label-width="formLabelWidth">
            <template >
              <div class="block">
                <el-date-picker v-model="editForm.publishTime"  type="datetime"  placeholder="选择日期时间">  </el-date-picker>
              </div>
            </template>
          </el-form-item>
          <el-form-item prop="failureTime" :label="$t('findexSetting.label.failuretime')" :label-width="formLabelWidth">
            <template >
              <div class="block">
                <el-date-picker v-model="editForm.failureTime" type="datetime"  placeholder="选择日期时间">  </el-date-picker>
              </div>
            </template>
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

<script >
  import findexSettingJS from "./findexSetting.js"
  export default findexSettingJS
</script>


<style rel="stylesheet/scss" lang="scss">
  .quill-editor{ min-height: 500px;}
  .ql-container{ min-height: 500px;}
  .ql-snow .ql-editor img{max-width: 480px;}
  .ql-editor .ql-video{max-width: 480px;}

  .editor {
    line-height: normal !important;
    height: 800px;
  }
  .ql-snow .ql-tooltip[data-mode=link]::before {
    content: "请输入链接地址:";
  }
  .ql-snow .ql-tooltip.ql-editing a.ql-action::after {
    border-right: 0px;
    content: '保存';
    padding-right: 0px;
  }

  .ql-snow .ql-tooltip[data-mode=video]::before {
    content: "请输入视频地址:";
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item::before {
    content: '14px';
  }
  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=small]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
    content: '10px';
  }
  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=large]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
    content: '18px';
  }
  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=huge]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {
    content: '32px';
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item::before {
    content: '文本';
  }
  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
    content: '标题1';
  }
  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
    content: '标题2';
  }
  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
    content: '标题3';
  }
  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
    content: '标题4';
  }
  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
    content: '标题5';
  }
  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
    content: '标题6';
  }

  .ql-snow .ql-picker.ql-font .ql-picker-label::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item::before {
    content: '标准字体';
  }
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=serif]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {
    content: '衬线字体';
  }
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=monospace]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {
    content: '等宽字体';
  }

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
