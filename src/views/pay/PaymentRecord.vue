<template>
  <div class="app-container">
    <section>
      <!--条件搜索区-->
      <el-col class="toolbar" style="padding-bottom: 0px;">
        <el-form :model="filters" ref="filters" :inline="true">
          <!--产品下拉-->
          <el-form-item prop="productCode" :label="$t('paymentrecord.label.productname')">
            <el-select v-model="filters.productCode" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in productList" :label="item.name" :value="item.code" :key="item.code"></el-option>
            </el-select>
          </el-form-item>
          <!--提案号-->
          <el-form-item prop="proOrderNo" :label="$t('paymentrecord.label.proorderno')">
            <el-input v-model="filters.proOrderNo"></el-input>
          </el-form-item>
          <!--玩家账号-->
          <el-form-item prop="loginName" :label="$t('paymentrecord.label.loginname')">
            <el-input v-model="filters.loginName"></el-input>
          </el-form-item>
          <!--付款类型-->
          <el-form-item prop="noticeStatus" :label="$t('paymentrecord.label.paymenttype')">
            <el-select v-model="filters.paymentType" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in paymentTypeList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <!--付款结果-->
          <el-form-item prop="paymentResult" :label="$t('paymentrecord.label.paymentresult')">
            <el-select v-model="filters.paymentResult" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in paymentResultList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <!--通知状态-->
          <el-form-item prop="noticeStatus" :label="$t('paymentrecord.label.noticestatus')">
            <el-select v-model="filters.noticeStatus" clearable :placeholder="$t('common.label.choose')">
              <el-option v-for="item in noticeStatusList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <!--创建时间-->
          <el-form-item :label="$t('paymentrecord.label.createtime')">
            <el-date-picker v-model="filters.createStartTime" type="datetime" placeholder="开始时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
            <el-date-picker v-model="filters.createEndTime" type="datetime" placeholder="结束时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
          <!--付款时间-->
          <el-form-item prop="noticeStatus" :label="$t('paymentrecord.label.paymenttime')">
            <el-date-picker v-model="filters.paymentStartTime" type="datetime" placeholder="开始时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
            <el-date-picker v-model="filters.paymentEndTime" type="datetime" placeholder="结束时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
          <!--搜索和重置按钮-->
          <el-form-item>
            <el-button type="primary" @click="handleQuery">{{$t('common.button.query')}}</el-button>
            <el-button @click="handleReset">{{$t('common.button.reset')}}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <!--Grid-->
      <el-table :data="dataList" ref="grid" border stripe fit highlight-current-row v-loading="gridLoading"   :element-loading-text="$t('common.label.inthequery')" style="width: 100%;">
        <!--所属产品-->
        <el-table-column align="center" prop="productName" :label="$t('paymentrecord.label.productname')" width="100"></el-table-column>
        <!--提案号-->
        <el-table-column align="center" prop="proOrderNo" :label="$t('paymentrecord.label.proorderno')" width="260">
          <template slot-scope="scope">
            <a href="#" @click="orderInformation(scope.row)">{{scope.row.proOrderNo}}</a>
          </template>
        </el-table-column>
        <!--付款银行-->
        <el-table-column align="center" prop="bankName" :label="$t('paymentrecord.label.bankname')" width="120"></el-table-column>
        <!--付款姓名-->
        <el-table-column align="center" prop="accountName" :label="$t('paymentrecord.label.accountname')" width="120"></el-table-column>
        <!--付款卡号-->
        <el-table-column align="center" prop="bankPrimaryNo" :label="$t('paymentrecord.label.bankprimaryno')" width="200" :formatter="formatBankCar"></el-table-column>
        <!--付款金额-->
        <el-table-column align="center" prop="paymentAmount" :label="$t('paymentrecord.label.paymentamount')" width="120"></el-table-column>
        <!--付款手续费-->
        <el-table-column align="center" prop="paymentFee" :label="$t('paymentrecord.label.paymentfee')" width="120"></el-table-column>
        <!--创建时间-->
        <el-table-column align="center" prop="createTime" :label="$t('paymentrecord.label.createtime')" width="170" :formatter="dateFormat"></el-table-column>
        <!--付款结果-->
        <el-table-column align="center" prop="paymentResult" :label="$t('paymentrecord.label.paymentresult')" width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.paymentResult === '4' || scope.row.paymentResult === '5'" style="color: #fd5757;font-weight: bold;">{{scope.row.paymentResultLabel}}</span>
            <span v-else-if="scope.row.paymentResult === '3'" style="color: #3e8f3e;font-weight: bold;">{{scope.row.paymentResultLabel}}</span>
            <span v-else>{{scope.row.paymentResultLabel}}</span>
            <el-button v-if="scope.row.paymentResult =='1' || scope.row.paymentResult === '2'" size="mini" @click="showPaymentResultDialog(scope.$index,scope.row)">{{$t('paymentrecord.label.assignmentchannel')}}</el-button>
          </template>
        </el-table-column>
        <!--付款失败原因-->
        <el-table-column align="center" prop="paymentRemark" :label="$t('paymentrecord.label.paymentremark')"width="200" :showOverflowTooltip="true"></el-table-column>
        <!--客户账号-->
        <el-table-column align="center" prop="loginName" :label="$t('paymentrecord.label.loginname')" width="120"></el-table-column>
        <!--客户姓名-->
        <el-table-column align="center" prop="customerName" :label="$t('paymentrecord.label.customername')" width="120"></el-table-column>
        <!--客户银行-->
        <el-table-column align="center" prop="customerBank" :label="$t('paymentrecord.label.customerbank')" width="120"></el-table-column>
        <!--客户卡号-->
        <el-table-column align="center" prop="customerCardNumber" :label="$t('paymentrecord.label.customercardnumber')" width="200" :formatter="formatBankCar"></el-table-column>
        <!--付款时间-->
        <el-table-column align="center" prop="paymentTime" :label="$t('paymentrecord.label.paymenttime')" width="170" :formatter="dateFormat"></el-table-column>
        <!--付款等级-->
        <el-table-column align="center" prop="paymentLevel" :label="$t('paymentrecord.label.paymentlevel')"></el-table-column>
        <!--通知状态-->
        <el-table-column align="center" prop="noticeStatus" :label="$t('paymentrecord.label.noticestatus')">
          <template slot-scope="scope" :center="true">
            <span v-if="scope.row.noticeStatus === '4'" style="color: #fd5757;font-weight: bold;">{{scope.row.noticeStatusLabel}}</span>
            <span v-else-if="scope.row.noticeStatus === '3'" style="color: #3e8f3e;font-weight: bold;">{{scope.row.noticeStatusLabel}}</span>
            <span v-else>{{scope.row.noticeStatusLabel}}</span>
          </template>
        </el-table-column>
        <!--通知失败原因-->
        <el-table-column align="center" prop="noticeRemark" :label="$t('paymentrecord.label.noticeremark')" :showOverflowTooltip="true" width="200"></el-table-column>
        <!--通知时间-->
        <el-table-column align="center" prop="noticeTime" :label="$t('paymentrecord.label.noticetime')" width="170" :formatter="dateFormat"></el-table-column>
        <!--付款类型-->
        <el-table-column align="center" prop="paymentType" :label="$t('paymentrecord.label.paymenttype')">
          <template slot-scope="scope">
            {{scope.row.paymentTypeLabel}}
          </template>
        </el-table-column>
        <!--操作-->
        <el-table-column align="center" :label="$t('common.label.operate')" width="180" fixed="right">
          <template slot-scope="scope">
            <!--转成功按钮 付款类型为人工支付 并且 付款结果为付款中-->
            <el-button v-if="scope.row.paymentType === '3' && scope.row.paymentResult === '2'" size="mini" type="danger" @click="transferSuccess(scope.row)">{{$t('paymentrecord.label.transferSuccess')}}</el-button>
            <el-button v-if="scope.row.paymentResult === '4' || (scope.row.paymentType === '3' && scope.row.paymentResult === '2')" size="mini" type="danger" @click="showCancelDialog(scope.$index , scope.row)">{{$t('common.button.cancel')}}</el-button>
            <el-button v-if="scope.row.noticeStatus === '4'" size="mini" type="danger" @click="orderNotice(scope.$index , scope.row)">{{$t('common.button.notice')}}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--点击提案订单号弹出，展示当前订单号的操作记录列表-->
      <el-dialog id="paymentOperationRecordDialog" :title="paymentOperationRecordTitle" :visible.sync="paymentOperationRecordVisible" :close-on-click-modal="false" style="width: 100%;">
        <el-table ref="paymentOperationRecordGrid" :data="paymentOperationRecordList" border stripe fit highlight-current-row v-loading="paymentOperationRecordGridLoading" :element-loading-text="$t('common.label.inthequery')" style="width: 100%;">
          <!--操作类型-->
          <el-table-column align="center" prop="operationType" :label="$t('paymentoperationrecord.label.operationtype')">
            <template slot-scope="scope">
              {{scope.row.operationTypeLabel}}
            </template>
          </el-table-column>
          <!--操作详情-->
          <el-table-column align="center" prop="operationRemark" :label="$t('paymentoperationrecord.label.operationremark')"></el-table-column>
          <!--操作人-->
          <el-table-column align="center" prop="operationUser" :label="$t('paymentoperationrecord.label.operationuser')"></el-table-column>
          <!--操作时间-->
          <el-table-column align="center" prop="operationTime" :label="$t('paymentoperationrecord.label.operationtime')" :formatter="dateFormat"></el-table-column>
        </el-table>
        <div slot="footer" align="center">
          <el-button @click.native="paymentOperationRecordVisible=false">{{$t('common.button.close')}}</el-button>
        </div>
      </el-dialog>

      <!--点击付款结果列上的分配渠道按钮弹出，查询当前可用渠道列表-->
      <el-dialog id="paymentResultDialog":title="paymentResultDialogTitle" :visible.sync="paymentResultVisible" :close-on-click-modal="false" style="width: 100%;">
        <el-table ref="paymentChannelGrid" :data="paymentChannelList" @row-click="paymentChannelClickRow" border stripe fit highlight-current-row v-loading="paymentChanneGridLoading" :element-loading-text="$t('common.label.inthequery')" style="width: 100%;">
          <el-table-column  align="center" width="65">
            <template slot-scope="scope">
              <el-radio :label="scope.row.id" v-model="paymentChannelRadio">&nbsp</el-radio>
            </template>
          </el-table-column>
          <!--所属产品-->
          <el-table-column align="center" prop="productName" :label="$t('paymentrecord.label.productname')"></el-table-column>
          <!--付款类型-->
          <el-table-column align="center" prop="paymentType" :label="$t('paymentrecord.label.paymenttype')">
            <template slot-scope="scope">
              {{scope.row.paymentTypeLabel}}
            </template>
          </el-table-column>
          <!--渠道区间-->
          <el-table-column align="center" prop="paymentInterval" :label="$t('paymentrecord.label.paymentinterval')"></el-table-column>
          <!--付款成功总笔数-->
          <el-table-column align="center" prop="paymentTotalCount" :label="$t('paymentrecord.label.paymentTotalCount')"></el-table-column>
          <!--付款成功总金额-->
          <el-table-column align="center" prop="paymentTotalAmount" :label="$t('paymentrecord.label.paymentTotalAmount')"></el-table-column>
        </el-table>
        <el-form align="center" style="padding: 5px;">
          <!--确定-->
          <el-form-item>
            <el-button @click.native="paymentResultVisible=false">{{$t('common.button.cancel')}}</el-button>
            <el-button type="primary" @click="assignmentChannel">{{$t('common.button.confirm')}}</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <!--分配渠道选择人工时展示-->
      <el-dialog :center="true" :visible.sync="manualPaymentVisible" :close-on-click-modal="false" style="width: 100%;">
        <el-form :model="manualPaymentForm" ref="manualPaymentForm" :rules="manualPaymentRule">
          <!--客户账号-->
          <el-form-item prop="loginName" :label="$t('paymentrecord.label.loginname_mp')" :label-width="formLabelWidth">
            <el-input v-model="manualPaymentForm.loginName" disabled="disabled" class="disabled_input"></el-input>
          </el-form-item>
          <!--客户名称-->
          <el-form-item prop="customerName" :label="$t('paymentrecord.label.customername_mp')" :label-width="formLabelWidth">
            <el-input v-model="manualPaymentForm.customerName" disabled="disabled" class="disabled_input"></el-input>
          </el-form-item>
          <!--客户银行卡号-->
          <el-form-item prop="customerCardNumber" :label="$t('paymentrecord.label.customercardnumber_mp')" :label-width="formLabelWidth">
            <el-input v-model="manualPaymentForm.customerCardNumber" disabled="disabled" class="disabled_input"></el-input>
          </el-form-item>
          <!--客户银行名-->
          <el-form-item prop="customerBank" :label="$t('paymentrecord.label.customerbank_mp')" :label-width="formLabelWidth">
            <el-input v-model="manualPaymentForm.customerBank" disabled="disabled" class="disabled_input"></el-input>
          </el-form-item>
          <!--付款金额-->
          <el-form-item prop="paymentAmount" :label="$t('paymentrecord.label.paymentamount_mp')" :label-width="formLabelWidth">
            <el-input v-model="manualPaymentForm.paymentAmount" disabled="disabled" class="disabled_input"></el-input>
          </el-form-item>
          <!--支付账号-->
          <el-form-item prop="bankPrimaryId" :label="$t('paymentrecord.label.bankname_mp')" :label-width="formLabelWidth">
            <el-select v-model="manualPaymentForm.bankPrimaryId":placeholder="$t('common.label.choose')">
              <el-option v-for="item in manualPaymentBankList" :label="item.bankName" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <!--手续费-->
          <el-form-item prop="paymentFee" :label="$t('paymentrecord.label.paymentfee_mp')" :label-width="formLabelWidth">
            <el-input v-model="manualPaymentForm.paymentFee" style="width:150px"></el-input>
          </el-form-item>
          <!--备注-->
          <el-form-item prop="remark" :label="$t('paymentrecord.label.remark_mp')" :label-width="formLabelWidth">
            <el-input v-model="manualPaymentForm.remark"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="manualPaymentVisible=false">{{$t('common.button.cancel')}}</el-button>
          <el-button type="primary" @click.native="manualPaymentSubmit">{{$t('common.button.submit')}}</el-button>
        </div>
      </el-dialog>

      <!--取消按钮弹出 -->
      <el-dialog :visible.sync="cancelVisible" :close-on-click-modal="false" style="width: 100%;">
        <el-form :inline="true" :model="cancelForm" ref="cancelForm" :rules="cancelRule">
          <!--取消原因-->
          <el-form-item prop="cancelRemark" :label="$t('paymentrecord.label.cancelremark')">
            <el-input v-model="cancelForm.cancelRemark" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="cancelVisible = false">取 消</el-button>
            <el-button type="primary" @click="cancelProposal()">确 定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-col class="toolbar" id="sumDiv">
        <label class="totalLabel" style="width:100px;">当页总计：</label>
        <el-input disabled="disabled" v-model="totalPageAmount" class="totalStyle disabled_input"></el-input>
        <label class="totalLabel">当页手续费总计：</label>
        <el-input disabled="disabled" v-model="totalPageFee" class="totalStyle disabled_input"></el-input>
        <label class="totalLabel">总计：</label>
        <el-input disabled="disabled" v-model="totalAmount" class="totalStyle disabled_input"></el-input>
        <label class="totalLabel">手续费总计：</label>
        <el-input disabled="disabled" v-model="totalFee" class="totalStyle disabled_input"></el-input>
      </el-col>
      <el-col class="toolbar">

        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="filters.pageNum" :page-size="filters.pageSize" :page-sizes="[10,20,30,40,50,100,200,300,400,500]" :total="total" layout="total,sizes,prev,pager,next,jumper" style="float: right;"></el-pagination>
      </el-col>
    </section>
  </div>
</template>

<script>
  import PaymentRecordJS from './PaymentRecord';
  export default PaymentRecordJS
</script>

<style lang="scss" rel="stylesheet/scss">
  #paymentResultDialog .el-dialog__body{
    padding : 32px 20px !important;
  }

  #paymentResultDialog .el-radio__label{
    display: none;
  }

  #sumDiv{
    background-color : #f5f7fa;
  }
  .disabled_input input{
    background-color: #f5f7fa !important;
    border-color: #f5f7fa !important;
    color: #606266 !important;
    cursor : default !important;
  }
  .totalLabel{
    //color: #f51414;font-family: cursive;font-size: 20px;font-weight: 600;background-color: white;
  }
  .totalStyle {
    width:10% !important;
    //color: #f51414;font-family: cursive;font-size: 20px;font-weight: 600;background-color: white;
  }
</style>
