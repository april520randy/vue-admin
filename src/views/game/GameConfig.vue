<template>
  <div class="app-container">
    <section>
      <el-col class="toolbar parent" style="padding-bottom: 0px;">
        <el-form :model="filters" ref="filters" :inline="true">
          <el-form-item prop="gameCName" :label="$t('gameconfig.label.gamecname')">
            <el-input v-model="filters.gameCName"></el-input>
          </el-form-item>
          <el-form-item prop="gameEName" :label="$t('gameconfig.label.gameename')">
            <el-input v-model="filters.gameEName"></el-input>
          </el-form-item>
          <el-form-item prop="gameStatus" :label="$t('gameconfig.label.gamestatus')">
            <el-select v-model="filters.gameStatus" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in gameStatusList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="gameCategory" :label="$t('gameconfig.label.gamecategory')">
            <el-select v-model="filters.gameCategory" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in gameCategoryList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="gameTerminal" :label="$t('gameconfig.label.gameterminal')">
            <el-select v-model="filters.gameTerminal" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in gameTerminalList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="jackpotFlag" :label="$t('gameconfig.label.jackpotflag')">
            <el-select v-model="filters.jackpotFlag" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in jackpotFlagList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="recommendFlag" :label="$t('gameconfig.label.recommendflag')">
            <el-select v-model="filters.recommendFlag" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in recommendFlagList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="popularFlag" :label="$t('gameconfig.label.popularflag')">
            <el-select v-model="filters.popularFlag" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in popularFlagList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="openMode" :label="$t('gameconfig.label.openmode')">
            <el-select v-model="filters.openMode" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in openModeList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="deleteFlag" :label="$t('gameconfig.label.deleteflag')">
            <el-select v-model="filters.deleteFlag" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in deleteFlagList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery" v-permission="permission.query">{{$t('common.button.query')}}</el-button>
            <el-button @click="handleReset" v-permission="permission.reset">{{$t('common.button.reset')}}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col class="toolbar" style="padding-bottom: 0px;">
        <el-form v-loading.fullscreen.lock="btnloading" :element-loading-text="$t('common.label.intheimport')">
          <el-form-item>
            <el-button type="primary" @click="handleAdd" v-permission="permission.add">{{$t('common.button.add')}}</el-button>
            <el-button type="danger" @click="handleBatchDelete" v-permission="permission.delete">{{$t('common.button.delete')}}</el-button>
            <el-button type="primary" @click="handleShelve" v-permission="permission.shelve">{{$t('common.button.shelve')}}</el-button>
            <el-button type="danger" @click="handleUnshelve" v-permission="permission.unshelve">{{$t('common.button.unshelve')}}</el-button>
            <import class="import-component" ref="import" @change="importExcel" v-permission="permission.import"></import>
          </el-form-item>
        </el-form>
      </el-col>
      <el-table :data="dataList" border stripe fit highlight-current-row v-loading="loading" :element-loading-text="$t('common.label.inthequery')" @selection-change="handleSelectionChange" style="width: 100%;">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" class="demo-table-expand">
              <el-form-item :label="$t('gameconfig.label.gameid')">
                <span>{{props.row.gameId}}</span>
              </el-form-item>
              <el-form-item :label="$t('gameconfig.label.gamecode')">
                <span>{{props.row.gameCode}}</span>
              </el-form-item>
              <el-form-item :label="$t('gameconfig.label.gameline')">
                <span>{{props.row.gameLineLabel}}</span>
              </el-form-item>
              <el-form-item :label="$t('gameconfig.label.gamestatus')">
                <span>{{props.row.gameStatusLabel}}</span>
              </el-form-item>
              <el-form-item :label="$t('gameconfig.label.gametype')">
                <span>{{gameTypeFormat(props.row.gameType)}}</span>
              </el-form-item>
              <el-form-item :label="$t('gameconfig.label.gamestyle')">
                <span>{{props.row.gameStyleLabel}}</span>
              </el-form-item>
              <el-form-item :label="$t('gameconfig.label.gametag')">
                <span>{{gameTagFormat(props.row.gameTag)}}</span>
              </el-form-item>
              <el-form-item :label="$t('gameconfig.label.gamelanguage')">
                <span>{{props.row.gameLanguage}}</span>
              </el-form-item>
              <el-form-item :label="$t('gameconfig.label.recommendindex')">
                <span>{{props.row.recommendIndexLabel}}</span>
              </el-form-item>
              <el-form-item :label="$t('gameconfig.label.popularityindex')">
                <span>{{props.row.popularityIndex}}</span>
              </el-form-item>
              <el-form-item :label="$t('gameconfig.label.openmode')">
                <span>{{props.row.openModeLabel}}</span>
              </el-form-item>
              <el-form-item :label="$t('gameconfig.label.trdflag')">
                <span>{{props.row.trdFlagLabel}}</span>
              </el-form-item>
              <el-form-item :label="$t('gameconfig.label.description')">
                <span>{{props.row.description}}</span>
              </el-form-item>
              <el-form-item :label="$t('gameconfig.label.imageurl')">
                <div class="my-upload" style="width: 178px; height: 178px;">
                  <img :src="props.row.imageUrl" alt="">
                </div>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="gameCName" :label="$t('gameconfig.label.gamecname')" min-width="110"></el-table-column>
        <el-table-column prop="gameEName" :label="$t('gameconfig.label.gameename')" min-width="150"></el-table-column>
        <el-table-column prop="gameCategoryLabel" :label="$t('gameconfig.label.gamecategory')" width="100"></el-table-column>
        <el-table-column prop="gameTerminalLabel" :label="$t('gameconfig.label.gameterminal')" width="100"></el-table-column>
        <el-table-column prop="jackpotFlagLabel" :label="$t('gameconfig.label.jackpotflag')" width="100"></el-table-column>
        <el-table-column prop="recommendFlagLabel" :label="$t('gameconfig.label.recommendflag')" width="100"></el-table-column>
        <el-table-column prop="popularFlagLabel" :label="$t('gameconfig.label.popularflag')" width="100"></el-table-column>
        <el-table-column prop="gameSort" :label="$t('gameconfig.label.gamesort')" width="100"></el-table-column>
        <el-table-column :label="$t('gameconfig.label.deleteflag')" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.deleteFlag==='N'" style="color: blue;">{{scope.row.deleteFlagLabel}}</span>
            <span v-if="scope.row.deleteFlag==='Y'" style="color: red;">{{scope.row.deleteFlagLabel}}</span>
          </template>
        </el-table-column>
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
      <el-dialog :title="$t('gameconfig.label.addtitle')" :visible.sync="addFormVisible" :close-on-click-modal="false" size="tiny">
        <el-form :model="addForm" ref="addForm" id="addForm" :rules="formRules">
          <el-form-item prop="gameId" :label="$t('gameconfig.label.gameid')" :label-width="formLabelWidth">
            <el-input v-model="addForm.gameId"></el-input>
          </el-form-item>
          <el-form-item prop="gameCode" :label="$t('gameconfig.label.gamecode')" :label-width="formLabelWidth">
            <el-input v-model="addForm.gameCode"></el-input>
          </el-form-item>
          <el-form-item prop="gameCName" :label="$t('gameconfig.label.gamecname')" :label-width="formLabelWidth">
            <el-input v-model="addForm.gameCName"></el-input>
          </el-form-item>
          <el-form-item prop="gameEName" :label="$t('gameconfig.label.gameename')" :label-width="formLabelWidth">
            <el-input v-model="addForm.gameEName"></el-input>
          </el-form-item>
          <el-form-item prop="gameLine" :label="$t('gameconfig.label.gameline')" :label-width="formLabelWidth">
            <el-radio-group v-model="addForm.gameLine">
              <el-radio-button border v-for="item in gameLineList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="gameStatus" :label="$t('gameconfig.label.gamestatus')" :label-width="formLabelWidth">
            <el-radio-group v-model="addForm.gameStatus">
              <el-radio-button border v-for="item in gameStatusList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="gameCategory" :label="$t('gameconfig.label.gamecategory')" :label-width="formLabelWidth">
            <el-select v-model="addForm.gameCategory" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in gameCategoryList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="gameTerminal" :label="$t('gameconfig.label.gameterminal')" :label-width="formLabelWidth">
            <el-radio-group v-model="addForm.gameTerminal">
              <el-radio-button border v-for="item in gameTerminalList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="openMode" :label="$t('gameconfig.label.openmode')" :label-width="formLabelWidth">
            <el-radio-group v-model="addForm.openMode">
              <el-radio-button border v-for="item in openModeList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="gameStyle" :label="$t('gameconfig.label.gamestyle')" :label-width="formLabelWidth">
            <el-radio-group v-model="addForm.gameStyle">
              <el-radio-button border v-for="item in gameStyleList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="gameType" :label="$t('gameconfig.label.gametype')" :label-width="formLabelWidth">
            <el-checkbox-group v-model="addForm.gameType">
              <el-checkbox v-for="item in gameTypeList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item prop="gameTag" :label="$t('gameconfig.label.gametag')" :label-width="formLabelWidth">
            <el-checkbox-group v-model="addForm.gameTag">
              <el-checkbox v-for="item in gameTagList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item prop="gameLanguage" :label="$t('gameconfig.label.gamelanguage')" :label-width="formLabelWidth">
            <el-input v-model="addForm.gameLanguage"></el-input>
          </el-form-item>
          <el-form-item prop="gameSort" :label="$t('gameconfig.label.gamesort')" :label-width="formLabelWidth">
            <el-input v-model="addForm.gameSort"></el-input>
          </el-form-item>
          <el-form-item prop="recommendIndex" :label="$t('gameconfig.label.recommendindex')" :label-width="formLabelWidth">
            <el-rate v-model="addForm.recommendIndex" show-text :texts='recommendIndexList'></el-rate>
          </el-form-item>
          <el-form-item prop="popularityIndex" :label="$t('gameconfig.label.popularityindex')" :label-width="formLabelWidth">
            <el-input v-model="addForm.popularityIndex"></el-input>
          </el-form-item>
          <el-form-item prop="jackpotFlag" :label="$t('gameconfig.label.jackpotflag')" :label-width="formLabelWidth">
            <el-radio-group v-model="addForm.jackpotFlag">
              <el-radio border v-for="item in ynList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="recommendFlag" :label="$t('gameconfig.label.recommendflag')" :label-width="formLabelWidth">
            <el-radio-group v-model="addForm.recommendFlag">
              <el-radio border v-for="item in ynList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="popularFlag" :label="$t('gameconfig.label.popularflag')" :label-width="formLabelWidth">
            <el-radio-group v-model="addForm.popularFlag">
              <el-radio border v-for="item in ynList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="trdFlag" :label="$t('gameconfig.label.trdflag')" :label-width="formLabelWidth">
            <el-radio-group v-model="addForm.trdFlag">
              <el-radio border v-for="item in ynList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="description" :label="$t('gameconfig.label.description')" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="addForm.description"></el-input>
          </el-form-item>
          <el-form-item prop="imageUrl" :label="$t('gameconfig.label.imageurl')" :label-width="formLabelWidth">
            <upload ref="addUpload" :item="addForm" size="178px" @change="handleAddSuccess"></upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible=false" v-permission="permission.add">{{$t('common.button.cancel')}}</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading" v-permission="permission.add">{{$t('common.button.submit')}}</el-button>
        </div>
      </el-dialog>
      <el-dialog :title="$t('gameconfig.label.edittitle')" :visible.sync="editFormVisible" :close-on-click-modal="false" size="tiny">
        <el-form :model="editForm" ref="editForm" id="editForm" :rules="formRules">
          <el-form-item prop="gameId" :label="$t('gameconfig.label.gameid')" :label-width="formLabelWidth">
            <el-input v-model="editForm.gameId"></el-input>
          </el-form-item>
          <el-form-item prop="gameCode" :label="$t('gameconfig.label.gamecode')" :label-width="formLabelWidth">
            <el-input v-model="editForm.gameCode"></el-input>
          </el-form-item>
          <el-form-item prop="gameCName" :label="$t('gameconfig.label.gamecname')" :label-width="formLabelWidth">
            <el-input v-model="editForm.gameCName"></el-input>
          </el-form-item>
          <el-form-item prop="gameEName" :label="$t('gameconfig.label.gameename')" :label-width="formLabelWidth">
            <el-input v-model="editForm.gameEName"></el-input>
          </el-form-item>
          <el-form-item prop="gameLine" :label="$t('gameconfig.label.gameline')" :label-width="formLabelWidth">
            <el-radio-group v-model="editForm.gameLine">
              <el-radio-button border v-for="item in gameLineList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="gameStatus" :label="$t('gameconfig.label.gamestatus')" :label-width="formLabelWidth">
            <el-radio-group v-model="editForm.gameStatus">
              <el-radio-button border v-for="item in gameStatusList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="gameCategory" :label="$t('gameconfig.label.gamecategory')" :label-width="formLabelWidth">
            <el-select v-model="editForm.gameCategory" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in gameCategoryList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="gameTerminal" :label="$t('gameconfig.label.gameterminal')" :label-width="formLabelWidth">
            <el-radio-group v-model="editForm.gameTerminal">
              <el-radio-button border v-for="item in gameTerminalList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="openMode" :label="$t('gameconfig.label.openmode')" :label-width="formLabelWidth">
            <el-radio-group v-model="editForm.openMode">
              <el-radio-button border v-for="item in openModeList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="gameStyle" :label="$t('gameconfig.label.gamestyle')" :label-width="formLabelWidth">
            <el-radio-group v-model="editForm.gameStyle">
              <el-radio-button border v-for="item in gameStyleList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="gameType" :label="$t('gameconfig.label.gametype')" :label-width="formLabelWidth">
            <el-checkbox-group v-model="editForm.gameType">
              <el-checkbox v-for="item in gameTypeList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item prop="gameTag" :label="$t('gameconfig.label.gametag')" :label-width="formLabelWidth">
            <el-checkbox-group v-model="editForm.gameTag">
              <el-checkbox v-for="item in gameTagList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item prop="gameLanguage" :label="$t('gameconfig.label.gamelanguage')" :label-width="formLabelWidth">
            <el-input v-model="editForm.gameLanguage"></el-input>
          </el-form-item>
          <el-form-item prop="gameSort" :label="$t('gameconfig.label.gamesort')" :label-width="formLabelWidth">
            <el-input v-model="editForm.gameSort"></el-input>
          </el-form-item>
          <el-form-item prop="recommendIndex" :label="$t('gameconfig.label.recommendindex')" :label-width="formLabelWidth">
            <el-rate v-model="editForm.recommendIndex" show-text :texts='recommendIndexList'></el-rate>
          </el-form-item>
          <el-form-item prop="popularityIndex" :label="$t('gameconfig.label.popularityindex')" :label-width="formLabelWidth">
            <el-input v-model="editForm.popularityIndex"></el-input>
          </el-form-item>
          <el-form-item prop="jackpotFlag" :label="$t('gameconfig.label.jackpotflag')" :label-width="formLabelWidth">
            <el-radio-group v-model="editForm.jackpotFlag">
              <el-radio border v-for="item in ynList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="recommendFlag" :label="$t('gameconfig.label.recommendflag')" :label-width="formLabelWidth">
            <el-radio-group v-model="editForm.recommendFlag">
              <el-radio border v-for="item in ynList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="popularFlag" :label="$t('gameconfig.label.popularflag')" :label-width="formLabelWidth">
            <el-radio-group v-model="editForm.popularFlag">
              <el-radio border v-for="item in ynList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="trdFlag" :label="$t('gameconfig.label.trdflag')" :label-width="formLabelWidth">
            <el-radio-group v-model="editForm.trdFlag">
              <el-radio border v-for="item in ynList" :label="item.itemCode" :key="item.itemCode">{{item.itemValue}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="description" :label="$t('gameconfig.label.description')" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="editForm.description"></el-input>
          </el-form-item>
          <el-form-item prop="imageUrl" :label="$t('gameconfig.label.imageurl')" :label-width="formLabelWidth">
            <upload ref="editUpload" :item="editForm" size="178px" @change="handleEditSuccess"></upload>
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

  import GameConfigJS from './GameConfig.js'

  export default GameConfigJS
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
