<template>
  <div class="app-container">
    <div id="mount-point"></div>
    <section>
      <!--条件搜索区-->
      <el-col class="toolbar" style="padding-bottom: 0px;">
        <el-form :model="filters" ref="filters" :inline="true" id="filtersForm">
          <!--提案号-->
          <el-form-item prop="pno" :label="$t('bankTransferProposal.label.pno')">
            <el-input v-model="filters.pno" style="width: 200px;"></el-input>
          </el-form-item>
          <!--提案状态-->
          <el-form-item prop="status" :label="$t('bankTransferProposal.label.type')">
            <el-select v-model="filters.status" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in statusList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"/>
            </el-select>
          </el-form-item>
          <!--提案人-->
          <el-form-item prop="proposer" :label="$t('bankTransferProposal.label.proposer')">
            <el-input v-model="filters.proposer"></el-input>
          </el-form-item>
          <!--开始和结束时间-->
          <el-form-item :label="$t('bankTransferProposal.label.createTime')">
            <el-date-picker v-model="filters.startTime" type="datetime" placeholder="开始时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
            <el-date-picker v-model="filters.endTime" type="datetime" placeholder="结束时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
          <!--转出人-->
          <el-form-item prop="transferOut" :label="$t('bankTransferProposal.label.transferOut')">
            <el-input v-model="filters.transferOut"></el-input>
          </el-form-item>
          <!--转入人-->
          <el-form-item prop="transferIn" :label="$t('bankTransferProposal.label.transferIn')">
            <el-input v-model="filters.transferIn"></el-input>
          </el-form-item>

          <!--搜索和重置按钮-->
          <el-form-item>
            <el-button type="primary" @click="handleQuery">{{$t('common.button.query')}}</el-button>
            <el-button @click="handleReset">{{$t('common.button.reset')}}</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <!--Grid-->
      <el-table :data="dataList" border stripe fit highlight-current-row v-loading="gridLoading" :element-loading-text="$t('common.label.inthequery')">
        <!--提案号-->
        <el-table-column align="center" prop="pno" :label="$t('bankTransferProposal.label.pno')" width="200px">
          <template slot-scope="scope">
            <a href="#" @click="getPnoOperationList(scope.row)">{{scope.row.pno}}</a>
          </template>
        </el-table-column>
        <!--提案人-->
        <el-table-column align="center" prop="proposer" :label="$t('bankTransferProposal.label.proposer')" width="120px"></el-table-column>
        <!--提案类型-->
        <el-table-column align="center" prop="type" :label="$t('bankTransferProposal.label.type')" width="100px">
          <template slot-scope="scope">
            <span>{{scope.row.typeLabel}}</span>
          </template>
        </el-table-column>
        <!--转账方向-->
        <el-table-column align="center" prop="transferDirection" :label="$t('bankTransferProposal.label.transferDirection')" width="200px">
          <template slot-scope="scope" :center="true">
            <span v-if="scope.row.transferOut === ''"> </span>
            <span v-else>{{scope.row.transferDirection}}</span>
          </template>
        </el-table-column>
        <!--转出-->
        <el-table-column align="center" prop="transferOut" :label="$t('bankTransferProposal.label.transferOut')" width="120px"></el-table-column>
        <!--转入-->
        <el-table-column align="center" prop="transferIn" :label="$t('bankTransferProposal.label.transferIn')" width="120px"></el-table-column>
        <!--额度-->
        <el-table-column align="center" prop="amount" :label="$t('bankTransferProposal.label.amount')"></el-table-column>
        <!--加入时间-->
        <el-table-column align="center" prop="createTime" :label="$t('bankTransferProposal.label.createTime')" :formatter="dateFormat"></el-table-column>
        <!--手续费-->
        <el-table-column align="center" prop="fee" :label="$t('bankTransferProposal.label.fee')" width="100px"></el-table-column>
        <!--备注-->
        <el-table-column align="center" prop="remark" :label="$t('bankTransferProposal.label.remark')" :showOverflowTooltip="true"></el-table-column>
        <!--操作-->
        <el-table-column :label="$t('common.label.operate')" width="150">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status === 1" size="mini" @click="showOperatingRemark(scope.row,'review')">{{$t('common.button.review')}}</el-button>
            <el-button v-if="scope.row.status === 2" size="mini" type="danger" @click="showOperatingRemark(scope.row,'execute')">{{$t('common.button.carriedout')}}</el-button>
            <el-button v-if="scope.row.status === 1 || scope.row.status === 2 || scope.row.status === 4" size="mini" type="danger" @click="showOperatingRemark(scope.row,'cancel')">{{$t('common.button.cancel')}}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--点击提案订单号弹出，展示当前订单号的操作记录列表-->
      <el-dialog :title="bankTransferOperationRecordTitle" :visible.sync="bankTransferOperationRecordVisible" :close-on-click-modal="false" style="width: 100%;">
        <el-table ref="bankTransferOperationRecordGrid" :data="bankTransferOperationRecordDataList" border stripe fit highlight-current-row v-loading="bankTransferOperationRecordGridLoading" :element-loading-text="$t('common.label.inthequery')" style="width: 100%;">
          <!--操作类型-->
          <el-table-column align="center" prop="operationType" :label="$t('paymentoperationrecord.label.operationtype')">
            <template slot-scope="scope">
              {{scope.row.operationTypeLabel}}
            </template>
          </el-table-column>
          <!--操作详情-->
          <el-table-column align="center" prop="remark" :label="$t('paymentoperationrecord.label.operationremark')"></el-table-column>
          <!--操作人-->
          <el-table-column align="center" prop="createUser" :label="$t('paymentoperationrecord.label.operationuser')"></el-table-column>
          <!--操作时间-->
          <el-table-column align="center" prop="createTime" :label="$t('paymentoperationrecord.label.operationtime')" :formatter="dateFormat"></el-table-column>
        </el-table>
        <div slot="footer" align="center">
          <el-button @click.native="bankTransferOperationRecordVisible=false">{{$t('common.button.close')}}</el-button>
        </div>
      </el-dialog>

      <!--点击执行按钮弹出 选择转出卡-->
      <el-dialog :center="true" :visible.sync="executeDialogVisible" :close-on-click-modal="false">
        <el-form :model="executeForm" ref="executeForm" id="executeForm" :rules="executeFormRules">
          <!--提案号-->
          <el-form-item :label="$t('bankTransferProposal.label.pno')" :label-width="executeFormLabelWidth">
            <el-input v-model="executeForm.pno" disabled="disabled"></el-input>
          </el-form-item>
          <!--提案类别-->
          <el-form-item :label="$t('bankTransferProposal.label.type')" :label-width="executeFormLabelWidth">
            <el-input v-model="executeForm.typeLabel" disabled="disabled"></el-input>
          </el-form-item>
          <!--收款人姓名-->
          <el-form-item :label="$t('bankTransferProposal.label.transferInName')" :label-width="executeFormLabelWidth">
            <el-input v-model="executeForm.transferIn" disabled="disabled"></el-input>
          </el-form-item>
          <!--收款人银行-->
          <el-form-item :label="$t('bankTransferProposal.label.transferInBank')" :label-width="executeFormLabelWidth">
            <el-input v-model="executeForm.transferInBankName" disabled="disabled"></el-input>
          </el-form-item>
          <!--额度-->
          <el-form-item :label="$t('bankTransferProposal.label.amount')" :label-width="executeFormLabelWidth">
            <el-input v-model="executeForm.amount" disabled="disabled"></el-input>
          </el-form-item>
          <!--备注-->
          <el-form-item :label="$t('bankTransferProposal.label.remark')" :label-width="executeFormLabelWidth">
            <el-input v-model="executeForm.remark" disabled="disabled"></el-input>
          </el-form-item>
          <!--账户性质-->
          <el-form-item prop="transferOutAccountNatureId" :label="$t('bankTransferProposal.label.accountNature')" :label-width="executeFormLabelWidth">
            <el-select v-model="executeForm.transferOutAccountNatureId" clearable :placeholder="$t('common.label.choose')" @change="changeTransferOutAccountNature">
              <el-option v-for="item in transferOutAccountNatureList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <!--转出账户-->
          <el-form-item prop="transferOutAccountId" :label="$t('bankTransferProposal.label.transferOutAccount')" :label-width="executeFormLabelWidth">
            <el-select v-model="executeForm.transferOutAccountId" clearable :placeholder="$t('common.label.choose')" @change="changeTransferOutAccount">
              <el-option v-for="item in transferOutAccountList" :label="item.accountName" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <!--手续费-->
          <el-form-item prop="fee" :label="$t('bankTransferProposal.label.fee')" :label-width="executeFormLabelWidth">
            <el-input v-model="executeForm.fee"></el-input>
          </el-form-item>
          <!--备注-->
          <el-form-item prop="executeRemark" :label="$t('bankTransferProposal.label.remark')" :label-width="executeFormLabelWidth">
            <el-input type="textarea" :rows="3" v-model="executeForm.executeRemark"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="executeDialogVisible=false">{{$t('common.button.cancel')}}</el-button>
          <el-button type="primary" @click.native="submitExecute" :loading="submitExecuteLoading">{{$t('common.button.submit')}}</el-button>
        </div>
      </el-dialog>

      <!--取消审核执行取消按钮弹出 -->
      <el-dialog :visible.sync="operatingVisible" :close-on-click-modal="false" style="width: 100%;">
        <el-form :inline="true" :model="operatingForm" ref="cancelForm">
          <!--取消原因-->
          <el-form-item prop="cancelRemark" :label="operatingDialogLabel">
            <el-input v-model="operatingForm.remark"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="operatingVisible = false">取 消</el-button>
            <el-button type="primary" @click="operatingProposal()">确 定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-col class="toolbar">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="filters.pageNum" :page-size="filters.pageSize" :page-sizes="[10,20,30,40,50,100,200,300,400,500]" :total="total" layout="total,sizes,prev,pager,next,jumper" style="float: right;"></el-pagination>
      </el-col>
    </section>
  </div>
</template>

<script>
    import BankTransferProposalJS from "./BankTransferProposal.js";

    export default BankTransferProposalJS;
</script>

<style lang="scss" rel="stylesheet/scss">
  #executeForm .el-input.is-disabled .el-input__inner{
    background-color : #ffffff;
    border-color : #ffffff;;
    color : #000000;;
    cursor : default;;
  }

  #filtersForm label{
    width:80px;
  }
</style>
