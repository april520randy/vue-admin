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
          <el-form-item prop="status" :label="$t('circle.label.status')">
            <el-select v-model="filters.status" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in statusList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="circleSort" :label="$t('circle.label.circlesort')">
            <el-select v-model="filters.circleSort" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in ynList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="bright" :label="$t('circle.label.bright')">
            <el-select v-model="filters.bright" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in ynList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="hot" :label="$t('circle.label.hot')">
            <el-select v-model="filters.hot" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in ynList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="userName" :label="$t('circle.label.username')">
            <el-input v-model="filters.userName"></el-input>
          </el-form-item>
          <el-form-item prop="nickName" :label="$t('circle.label.nickname')">
            <el-input v-model="filters.nickName"></el-input>
          </el-form-item>
          <el-form-item prop="id" :label="$t('circle.label.id')">
            <el-input v-model="filters.id"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery">{{$t('common.button.query')}}</el-button>
            <el-button @click="handleReset">{{$t('common.button.reset')}}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col class="toolbar" style="padding-bottom: 0px;">
      </el-col>
      <el-table :data="dataList" border stripe fit highlight-current-row v-loading="loading" :element-loading-text="$t('common.label.inthequery')"
                @on-current-change="handleEdit" @selection-change="handleSelectionChange" style="width: 100%;" id="table"  @expand-change="getByCircleDetailed">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" class="demo-table-expand">
              <el-form-item :label="$t('circle.label.username')">
                <span>{{props.row.userName}}</span>
              </el-form-item>
              <el-form-item :label="$t('circle.label.nickname')">
                <span>{{props.row.nickName}}</span>
              </el-form-item>
              <el-form-item :label="$t('circle.label.content')">
                <span>{{props.row.content}}</span>
              </el-form-item>
              <el-form-item :label="$t('fuser.label.headurl')">
                <span><img :src="headUrl" alt=""></span>
              </el-form-item>
              <el-form-item :label="$t('circle.label.image')">
                <span v-for="imgurl in imageList"> <img :src="imgurl.imagePath" alt=""></span>
              </el-form-item>
              <el-form-item :label="$t('circle.label.video')">
                <span v-for="videourl in videoList"> <img :src="videourl.imagePath" alt=""></span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="selection"  min-width="3%"></el-table-column>
        <el-table-column prop="id" :label="$t('circle.label.id')"min-width="6%"></el-table-column>
        <el-table-column prop="userName" :label="$t('circle.label.username')" min-width="10%"></el-table-column>
        <el-table-column prop="nickName" :label="$t('circle.label.nickname')"  min-width="10%"></el-table-column>
        <el-table-column prop="content" :label="$t('circle.label.content')"  min-width="20%"></el-table-column>
        <el-table-column prop="createTime" :label="$t('circle.label.createtime')"  :formatter="dateFormat" min-width="10%"></el-table-column>
        <el-table-column  :label="$t('circle.label.status')"  min-width="5%">
          <template slot-scope="scope">
            <span v-if="scope.row.status==0" style="color: blue;">{{$t('circle.label.pass')}}</span>
            <span v-if="scope.row.status==1" style="color: red;">{{$t('circle.label.nopass')}}</span>
          </template>
        </el-table-column>
        <el-table-column  :label="$t('circle.label.circlesort')"  min-width="5%">
          <template slot-scope="scope">
            <span v-if="scope.row.circleSort==0" style="color: blue;">{{$t('common.label.no')}}</span>
            <span v-if="scope.row.circleSort==1" style="color: red;">{{$t('common.label.yes')}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('circle.label.bright')" min-width="5%">
         <template slot-scope="scope">
           <span v-if="scope.row.bright==0" style="color: blue;">{{$t('common.label.no')}}</span>
           <span v-if="scope.row.bright==1" style="color: red;">{{$t('common.label.yes')}}</span>
         </template>
       </el-table-column>
        <el-table-column  :label="$t('circle.label.hot')" min-width="5%">
          <template slot-scope="scope">
            <span v-if="scope.row.hot==0" style="color: blue;">{{$t('common.label.no')}}</span>
            <span v-if="scope.row.hot==1" style="color: red;">{{$t('common.label.yes')}}
             <el-badge value="hot" class="item"></el-badge>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="commentCount":label="$t('circle.label.commentcount')" min-width="5%">
          <template slot-scope="scope">
            <el-badge :value="scope.row.commentCount" :max="99" class="item">
              <el-button  size="mini" @click="commentList(scope.row.id,1)">{{$t('circle.button.comment')}}</el-button>
            </el-badge>
          </template>
        </el-table-column>
        <el-table-column prop="praiseCount":label="$t('circle.label.praisecount')"  min-width="6%">
          <template slot-scope="scope">
            <el-badge :value="scope.row.praiseCount" :max="99" class="item"></el-badge>
          </template>
        </el-table-column>
       <!-- <el-table-column prop="readCount" :label="$t('circle.label.readcount')"  width="180"></el-table-column>-->
        <el-table-column :label="$t('common.label.operate')" min-width="8%">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status==0" size="mini"type="danger" @click="handleStatus(1,scope.row,'1')">{{$t('circle.button.cancelstatus')}}</el-button>
            <el-button v-if="scope.row.status==1" size="mini"  @click="handleStatus(1,scope.row,'0')">{{$t('circle.button.auditstatus')}}</el-button>

            <el-button v-if="scope.row.circleSort==0" size="mini" style="margin-left: 0px;" type="danger" @click="handleStatus(2,scope.row,'1')">{{$t('circle.button.auditsort')}}</el-button>
            <el-button v-if="scope.row.circleSort==1" size="mini" style="margin-left: 0px;" @click="handleStatus(2,scope.row,'0')">{{$t('circle.button.cancelsort')}}</el-button>

            <el-button v-if="scope.row.bright==0" size="mini" style="margin-left: 0px;" type="danger" @click="handleStatus(3,scope.row,'1')">{{$t('circle.button.auditbright')}}</el-button>
            <el-button v-if="scope.row.bright==1" size="mini" style="margin-left: 0px;"  @click="handleStatus(3,scope.row,'0')">{{$t('circle.button.cancelbright')}}</el-button>

            <el-button v-if="scope.row.hot==0" size="mini" style="margin-left: 0px;" type="danger" @click="handleStatus(4,scope.row,'1')">{{$t('circle.button.audithot')}}</el-button>
            <el-button v-if="scope.row.hot==1" size="mini" style="margin-left: 0px;"  @click="handleStatus(4,scope.row,'0')">{{$t('circle.button.cancelhot')}}</el-button>
            <el-button size="mini" style="margin-left: 0px;" @click="commentOpen1(scope.row,'1')">{{$t('circle.button.comment')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col class="toolbar">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="filters.pageNum" :page-size="filters.pageSize" :page-sizes="[10,20,30,40,50,100,200,300,400,500]" :total="total" layout="total,sizes,prev,pager,next,jumper" style="float: right;"></el-pagination>
      </el-col>

      <!-- 评论列表 -->
      <el-dialog :title="$t('circle.label.commentslisttitle')" :visible.sync="listForm1Visible" :close-on-click-modal="false" size="tiny">
        <el-form :model="listForm1" ref="listForm1" :rules="formRules">
          <el-table :data="commentsList" border stripe fit highlight-current-row v-loading="list1Loading" :element-loading-text="$t('common.label.inthequery')" @selection-change="handleSelectionChange1" style="width: 100%;">
            <el-table-column type="selection" width="35"></el-table-column>
            <el-table-column prop="userName" :label="$t('fcircleComments.label.username')" min-width="60"></el-table-column>
            <el-table-column prop="nickName" :label="$t('fcircleComments.label.nickname')" min-width="80"></el-table-column>
            <el-table-column prop="content" :label="$t('fcircleComments.label.content')" min-width="150"></el-table-column>
            <el-table-column prop="comments" :label="$t('fcircleComments.label.comments')" min-width="150"></el-table-column>
            <el-table-column prop="createTime" :label="$t('fcircleComments.label.createtime')"  :formatter="dateFormat" min-width="120"></el-table-column>
            <el-table-column  :label="$t('fcircleComments.label.status')" width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.status==0" style="color: blue;">{{$t('fcircleComments.label.pass')}}</span>
                <span v-if="scope.row.status==1" style="color: red;">{{$t('fcircleComments.label.nopass')}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('common.label.operate')" width="80" style="white-space : nowrap">
              <template slot-scope="scope" style="white-space:nowrap">
                <el-button v-if="scope.row.status==0" size="mini" type="danger" @click="commenthandleStatus(scope.row,'N')">{{$t('fcircleComments.button.nopass')}}</el-button>
                <el-button v-if="scope.row.status==1" size="mini"  @click="commenthandleStatus(scope.row,'Y')">{{$t('fcircleComments.button.pass')}}</el-button>

                <el-button size="mini" style="margin-left: 0px;" @click="commentOpen1(scope.row),'2'">{{$t('circle.button.comment')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>

        <el-col class="toolbar">
          <el-pagination background @size-change="handleSizeChange1" @current-change="handleCurrentChange1" :current-page.sync="filters.pageNum" :page-size="filters.pageSize" :page-sizes="[10,20,30,40,50,100,200,300,400,500]" :total="total1" layout="total,sizes,prev,pager,next,jumper" style="float: right;"></el-pagination>
        </el-col>
      </el-dialog>
      <el-dialog :title="$t('circle.label.edittitle')" :visible.sync="editFormVisible" :close-on-click-modal="false" size="tiny">
        <el-form :model="editForm" ref="editForm" :rules="formRules">
          <el-form-item prop="nickName" :label="$t('circle.label.nickname')" :label-width="formLabelWidth">
          <el-input v-model="editForm.nickName"></el-input>
        </el-form-item>
          <el-form-item prop="content" :label="$t('circle.label.content')" :label-width="formLabelWidth">
            <el-input v-model="editForm.content"></el-input>
          </el-form-item>
          <el-form-item  :label="$t('circle.label.headUrl')">
            <img :src="headUrl" alt=""  style="width: 108px; height: 108px;">
          </el-form-item>
          <el-form-item  :label="$t('circle.label.image')">
            <div v-for="item in imageList" style="display:inline">
              <img :src="item.imagePath" alt="" style="width: 108px; height: 108px;">
            </div>
          </el-form-item>
          <el-form-item  :label="$t('circle.label.video')">
            <div v-for="item in videoList" style="display:inline">
              <video id="myvideo" :src="item.videoPath" :muted="muteStatus" :autoplay="playStatus" height="400" width="320">
              </video>
              <span class="ico ico-sound" :class="{ active: isMute }" v-on:click="closeSoundClick()"></span>
              <span class="ico ico-skip"></span>
              <span class="ico ico-video" :class="{ hide: isPlay }" v-on:click="playClick()"></span>
            </div>
          </el-form-item>
        </el-form>
      </el-dialog>
    </section>
  </div>
</template>

<script>

  import circleJS from './circle.js'
  export default circleJS
</script>

<style rel="stylesheet/scss" lang="scss">

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
